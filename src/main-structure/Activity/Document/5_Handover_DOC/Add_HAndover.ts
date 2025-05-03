import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { sendSubmissionEmails } from "../../Email/EmailHandover/EmailSubmitHandover";

/**
 * Creates a handover document and sets up the approval flow with manually selected approvers
 */
export const createHandover = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 Received request to create new handover doc");
    const data = req.body;

    // Validate required fields
    const requiredFields = [
      "doc_number", "auth_id", "proposed_change_id",
      "plant_id", "department_id", "section_department_id",
      "material", "created_by"
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.warn("❌ Validation failed. Missing fields:", missingFields);
      res.status(400).json({
        error: "Validation Error",
        details: `Missing fields: ${missingFields.join(", ")}`
      });
      return;
    }

    // Validate that at least one approver is provided
    if (!data.auth_id) {
      console.warn("❌ No primary approver provided");
      res.status(400).json({
        error: "Validation Error",
        details: "At least primary approver (auth_id) must be provided"
      });
      return;
    }

    // Check if document number contains "GBL"
    console.log("Original doc_number:", data.doc_number);
    const containsGBL = data.doc_number.includes("GBL");
    console.log(`Document ${containsGBL ? "contains" : "does not contain"} GBL`);

    // Store the provided approvers
    let auth_id = data.auth_id;
    let auth_id2 = data.auth_id2 || null;
    let auth_id3 = data.auth_id3 || null;
    let auth_id4 = data.auth_id4 || null;
    let auth_id5 = null; // This will be used if needed

    // If document contains GBL, try to get QA Compliance approver
    if (containsGBL) {
      console.log("🔍 Document contains GBL - looking for QA Compliance approver");
      try {
        // Get QA Compliance auth
        console.log("👉 Executing getQAComplianceAuth()");
        const qaComplianceAuth = await getQAComplianceAuth();
        console.log("👉 QA Compliance lookup result:", qaComplianceAuth);

        if (qaComplianceAuth) {
          console.log(`✅ Found QA Compliance auth: ${qaComplianceAuth.id}, name: ${qaComplianceAuth.employee_name || 'Unknown'}`);
          
          // Insert QA Compliance as auth_id2 and shift other approvers
          if (!auth_id2) {
            // If auth_id2 is not provided, just use QA Compliance as auth_id2
            auth_id2 = qaComplianceAuth.id;
          } else {
            // If auth_id2 is already provided, shift the other auth IDs
            auth_id5 = auth_id4; // Move auth_id4 to auth_id5 if it exists
            auth_id4 = auth_id3; // Move auth_id3 to auth_id4 if it exists
            auth_id3 = auth_id2; // Move auth_id2 to auth_id3
            auth_id2 = qaComplianceAuth.id; // Insert QA Compliance as auth_id2
          }
        } else {
          console.log("⚠️ No QA Compliance authorization found in the database");
        }
      } catch (error) {
        console.error("❌ Error finding QA Compliance auth:", error);
        // Continue without QA Compliance if error occurs
      }
    } else {
      console.log(`⚠️ Document does not contain 'GBL' - skipping QA Compliance lookup`);
    }

    // Create main record
    console.log("✅ Creating main handover record...");

    // Check if schema supports auth_id5
    const schemaHasAuthId5 = doesSchemaHaveAuthId5Field();
    console.log(`Database schema ${schemaHasAuthId5 ? "has" : "does not have"} auth_id5 field`);

    // Prepare handover data
    const handoverData: { [key: string]: any } = {
      doc_number: data.doc_number,
      auth_id: auth_id,
      auth_id2: auth_id2,
      auth_id3: auth_id3,
      auth_id4: auth_id4,
      progress: "0%", // Initial progress
      status: data.status || "submitted",
      proposed_change_id: data.proposed_change_id,
      authdoc_id: data.authdoc_id || null,
      plant_id: data.plant_id,
      department_id: data.department_id,
      section_department_id: data.section_department_id,
      material: data.material,
      remark: data.remark || null,
      created_by: data.created_by,
      created_date: new Date(),
      is_deleted: false
    };

    // Add auth_id5 only if schema supports it and we have a value
    if (schemaHasAuthId5 && auth_id5) {
      handoverData.auth_id5 = auth_id5;
    }

    const newHandover = await prismaDB2.tr_handover.create({
      data: handoverData
    });

    console.log(`✅ Main handover record created with ID: ${newHandover.id}`);

    // Create history entry
    await createHandoverHistory(
      newHandover.id,
      data.auth_id,
      data.created_by,
      data.status || "submitted"
    );

    // Collect all selected approvers into an array (removing null/undefined values)
    const approverIds = [
      auth_id,
      auth_id2,
      auth_id3,
      auth_id4,
      auth_id5  // Include auth_id5 if it exists
    ].filter(id => id !== null && id !== undefined);

    // Create approval records with the correct sequence
    await createHandoverApprovals(newHandover.id, approverIds);

    // INTEGRATION WITH EMAIL SERVICE
    try {
      console.log("📤 Sending submission email notifications...");
      await sendSubmissionEmails(newHandover.id, data.auth_id);
      console.log(`✉️ Submission notification emails sent for handover ${newHandover.id}`);
    } catch (emailError) {
      console.error("⚠️ Error sending email notifications:", emailError);
      // Continue with success response even if emails fail
    }

    // Return success response
    res.status(201).json({
      message: "Handover document created successfully",
      data: newHandover
    });

  } catch (error) {
    console.error("❌ Error creating handover document:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
    console.log("🔌 Database connection closed");
  }
};

/**
 * Helper function to check if your database schema has auth_id5 field
 * You should implement this based on your actual schema
 */
function doesSchemaHaveAuthId5Field(): boolean {
  // Implement based on your actual database schema
  // For example, check prisma schema or make a test query
  // For now, we'll assume true to support the 5th approver
  return true;
}

/**
 * Get QA Compliance authorization info
 */
async function getQAComplianceAuth() {
  try {
    console.log("🔍 Looking for QA Compliance authorization with section_id: 12");

    // First query to check if any records with section_id: 12 exist
    const sectionCheck = await prismaDB2.mst_authorization.findMany({
      where: {
        section_id: 12 //id dari section department nya si QA COmpliance
      },
      take: 5  // Limit to 5 results for diagnostic purposes
    });

    console.log(`Found ${sectionCheck.length} records with section_id: 12`);
    if (sectionCheck.length > 0) {
      console.log("Sample records:", sectionCheck.map(auth => ({
        id: auth.id,
        employee_code: auth.employee_code,
        employee_name: auth.employee_name,
        is_deleted: auth.is_deleted
      })));
    }

    // Original query
    const qaCompliance = await prismaDB2.mst_authorization.findFirst({
      where: {
        section_id: 12,
        is_deleted: false
      }
    });

    if (qaCompliance) {
      console.log(`✅ Found QA Compliance: ID=${qaCompliance.id}, Code=${qaCompliance.employee_code}, Name=${qaCompliance.employee_name}`);
    } else {
      console.log("❌ No non-deleted QA Compliance authorization found with section_id: 12");
      
      // Try without is_deleted filter as fallback
      const deletedQaCompliance = await prismaDB2.mst_authorization.findFirst({
        where: {
          section_id: 12
          // No is_deleted filter here
        }
      });
      
      if (deletedQaCompliance) {
        console.log(`⚠️ Found QA Compliance but it's marked as deleted: ID=${deletedQaCompliance.id}, is_deleted=${deletedQaCompliance.is_deleted}`);
      }
    }

    return qaCompliance;
  } catch (error) {
    console.error("❌ Error in getQAComplianceAuth:", error);
    console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

/**
 * Create approvals for handover document
 */
async function createHandoverApprovals(
  handoverId: number,
  approverIds: number[]
): Promise<void> {
  try {
    console.log(`Creating approvals for handover_id: ${handoverId}, with ${approverIds.length} approvers`);

    // Get auth details for all approvers
    const authDetails = await prismaDB2.mst_authorization.findMany({
      where: {
        id: { in: approverIds },
        is_deleted: false
      }
    });

    // Map the auth details to IDs for quick lookup
    const authMap = new Map(authDetails.map(auth => [auth.id, auth]));

    // Prepare approval data
    const approvalData = approverIds.map((authId, index) => {
      const auth = authMap.get(authId);
      let status: 'approved' | 'on_going' | 'pending' = 'pending';
    
      if (index === 0) status = 'approved';
      else if (index === 1) status = 'on_going';
    
      return {
        handover_id: handoverId,
        auth_id: authId,
        step: index + 1,
        actor: `Approver ${index + 1}`,
        employee_code: auth?.employee_code || '',
        status,
        created_date: new Date()
      };
    });
    

    if (approvalData.length > 0) {
      // Create all approvals in one operation
      await prismaDB2.tr_handover_approval.createMany({
        data: approvalData
      });

      console.log(`✅ Created ${approvalData.length} approval records with ordered steps`);
      approvalData.forEach(item => {
        console.log(`   Step ${item.step}: ${item.actor} (${item.employee_code})`);
      });
    } else {
      console.log("⚠️ No approval records created - no valid approvers found");
    }
  } catch (error) {
    console.error("Error creating handover approvals:", error);
    throw error;
  }
}

/**
 * Create history record for handover document
 */
async function createHandoverHistory(
  handoverId: number,
  authId: number,
  createdBy: string,
  status: string = "submitted",
  note: string = ""
): Promise<void> {
  try {
    // Get employee name
    const auth = await prismaDB2.mst_authorization.findUnique({
      where: { id: authId },
      select: { employee_name: true }
    });

    const employeeName = auth?.employee_name || "Unknown";

    // Create description based on status
    let description = "";
    switch (status) {
      case "updated":
        description = `${employeeName} has updated Handover Document`;
        break;
      case "submitted":
        description = `${employeeName} has submitted Handover Document`;
        break;
      case "not_approved":
        description = `${employeeName} has not approved the Handover Document`;
        break;
      case "rejected":
        description = `${employeeName} has rejected the Handover Document`;
        break;
      case "approved":
        description = `${employeeName} has approved the Handover Document`;
        break;
      default:
        description = `${employeeName} has changed Handover Document status to ${status}`;
    }

    // Default note if not provided
    let defaultNote = "";
    switch (status) {
      case "submitted":
        defaultNote = "This handover document has been submitted.";
        break;
      case "updated":
        defaultNote = "This handover document has been updated.";
        break;
      case "not_approved":
        defaultNote = "This handover document has not been approved.";
        break;
      case "rejected":
        defaultNote = "This handover document has been rejected.";
        break;
      case "approved":
        defaultNote = "This handover document has been approved.";
        break;
      default:
        defaultNote = `Status has been changed to "${status}".`;
    }

    await prismaDB2.tr_handover_history.create({
      data: {
        description,
        employee_code: createdBy,
        handover_id: handoverId,
        auth_id: authId,
        note: note || defaultNote,
        status,
        created_date: new Date(),
        created_by: createdBy,
        updated_date: new Date()
      }
    });

    console.log(`📜 History inserted for handover_id ${handoverId} with status "${status}"`);
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
}