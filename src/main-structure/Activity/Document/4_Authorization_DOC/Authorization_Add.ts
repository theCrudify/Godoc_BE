import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { sendSubmissionEmails } from "../../Email/EmailAuthorization/Email_Create_AuthDoc"
// Define types untuk data yang lebih konsisten
type HeadData = {
    id: number;
    id_authorization: number | null;
    employee_code: string | null;
    employee_name: string | null;
    authorization_status: boolean | null;
    section_id: number | null;
    department_id: number | null;
    department_name: string | null;
    section_name: string | null;
    directorship: string;
    created_by: string | null;
    is_deleted: boolean;
};

// Function untuk fetch head data (section head atau department head)
async function fetchHeadData(
    modelType: 'section' | 'department',
    sectionId: number,
    directorship: string
): Promise<HeadData[]> {
    if (!sectionId) return [];

    const commonInclude = {
        authorization: {
            select: {
                id: true,
                employee_code: true,
                employee_name: true,
                status: true
            }
        },
        section: {
            select: {
                id: true,
                department_id: true,
                section_name: true,
                department: {
                    select: {
                        department_name: true
                    }
                }
            }
        }
    };

    try {
        let results;

        if (modelType === 'section') {
            results = await prismaDB2.mst_section_head.findMany({
                where: {
                    is_deleted: false,
                    section_id: sectionId
                },
                include: commonInclude
            });
        } else {
            results = await prismaDB2.mst_department_head.findMany({
                where: {
                    is_deleted: false,
                    section_id: sectionId
                },
                include: commonInclude
            });
        }

        // Log hasil untuk debugging
        console.log(`fetchHeadData ${directorship} (section_id: ${sectionId}): found ${results.length} records`);

        // Jika tidak ada data ditemukan, log warning
        if (results.length === 0) {
            console.warn(`⚠️ No records found for ${directorship} with section_id ${sectionId}`);
        }

        return results.map(item => ({
            id: item.id,
            id_authorization: item.authorization?.id ?? null,
            employee_code: item.authorization?.employee_code ?? null,
            employee_name: item.authorization?.employee_name ?? null,
            authorization_status: item.authorization?.status ?? null,
            section_id: item.section?.id ?? null,
            department_id: item.section?.department_id ?? null,
            department_name: item.section?.department?.department_name ?? null,
            section_name: item.section?.section_name ?? null,
            directorship,
            created_by: item.created_by ?? null,
            is_deleted: item.is_deleted ?? false
        }));
    } catch (error) {
        console.error(`Error fetching ${directorship}:`, error);
        return [];
    }
}


async function getAllHeadsData(
    section_department_id: number,
    line_code: string,
): Promise<HeadData[]> {
    try {
        // Log parameter untuk debugging
        console.log(`getAllHeadsData called with section_department_id: ${section_department_id}, line_code: "${line_code}"`);

        // Normalize line_code untuk menghindari case sensitivity & whitespace issues
        const normalizedLineCode = line_code.trim().toUpperCase();
        console.log(`Normalized line_code: "${normalizedLineCode}"`);

        type FetchConfig = {
            modelType: 'department' | 'section';
            sectionId: number;
            directorship: string;
            position: number;
        };

        let fetchConfigs: FetchConfig[] = [
            { modelType: 'department', sectionId: section_department_id, directorship: 'Department Head', position: 1 },
            { modelType: 'department', sectionId: 3, directorship: 'Head of Manufacture', position: 3 },
            { modelType: 'department', sectionId: 16, directorship: 'Head of Corporate Quality', position: 4 },
            { modelType: 'department', sectionId: 20, directorship: 'Plant Director', position: 5 }
        ];

        if (normalizedLineCode === 'GBL') {
            const alreadyExists = fetchConfigs.some(config => config.directorship === 'QA Compliance');
            if (!alreadyExists) {
                fetchConfigs.push({
                    modelType: 'section',
                    sectionId: 12,
                    directorship: 'QA Compliance',
                    position: 2
                });
            }
        }


        // Log konfigurasi untuk debugging
        console.log("Fetch configurations:", JSON.stringify(fetchConfigs, null, 2));

        // Urutkan konfigurasi berdasarkan posisi
        fetchConfigs.sort((a, b) => a.position - b.position);
        console.log("Sorted configurations:", fetchConfigs.map(c => `${c.position}. ${c.directorship}`));

        // Fetch all data in parallel
        const allResults = await Promise.all(
            fetchConfigs.map(config =>
                fetchHeadData(config.modelType, config.sectionId, config.directorship)
            )
        );

        // Log setiap hasil per directorship
        allResults.forEach((result, index) => {
            console.log(`Fetched ${result.length} records for ${fetchConfigs[index].directorship}`);
            // Log detail jika ada data
            if (result.length > 0) {
                result.forEach(item => {
                    console.log(`  - ${item.directorship}: ${item.employee_name} (${item.employee_code}), auth_id: ${item.id_authorization}`);
                });
            }
        });

        console.log(`Before filtering: ${allResults.flat().length} total heads`);

        // Remove duplicates based on employee_code
        const uniqueHeads: HeadData[] = [];
        const seenCodes = new Set<string>();

        allResults.flat().forEach((head: HeadData) => {
            if (head.employee_code && !seenCodes.has(head.employee_code)) {
                seenCodes.add(head.employee_code);
                uniqueHeads.push(head);
            } else if (!head.employee_code) {
                console.warn(`⚠️ Head without employee_code found for ${head.directorship}`);
            } else {
                console.log(`👥 Duplicate employee_code found: ${head.employee_code} for ${head.directorship}`);
            }
        });

        console.log(`After filtering: ${uniqueHeads.length} unique heads`);

        // Cek khusus untuk QA Compliance jika line_code adalah GBL
        if (normalizedLineCode === 'GBL') {
            const hasQACompliance = uniqueHeads.some(head => head.directorship === 'QA Compliance');
            if (!hasQACompliance) {
                console.warn("⚠️ QA Compliance not found in final heads data - check section_id 13 data in database");
            }
        }

        // Tambahan: periksa jika ada head dengan id_authorization null
        uniqueHeads.forEach(head => {
            if (head.id_authorization === null) {
                console.warn(`⚠️ Head without valid id_authorization: ${head.directorship}`);
            }
        });

        return uniqueHeads;
    } catch (error) {
        console.error("Error in getAllHeadsData:", error);
        if (error instanceof Error) {
            console.error(`Nama error: ${error.name}, Pesan: ${error.message}`);
            if (error.stack) {
                console.error(`Stack: ${error.stack}`);
            }
        }
        return [];
    }
}

// Create history record
// Create history record for Authorization Document
async function createAuthHistory(
    authdoc_id: number,
    auth_id: number,
    created_by: string,
    status: string = "submitted",
    note: string = ""
): Promise<void> {
    try {
        console.log(`💾 createAuthHistory started with:`, {
            authdoc_id,
            auth_id,
            created_by,
            status,
            note
        });

        // Get employee name
        const auth = await prismaDB2.mst_authorization.findUnique({
            where: { id: auth_id },
            select: { employee_name: true }
        });

        const employeeName = auth?.employee_name || "Unknown";
        console.log(`👤 Found employee name: ${employeeName}`);

        // Descriptions
        let description = "";
        switch (status) {
            case "updated":
                description = `${employeeName} has updated Authorization Document`;
                break;
            case "submitted":
                description = `${employeeName} was upload Authorization Document`;
                break;
            case "not_approved":
                description = `${employeeName} has not approved the Authorization Document`;
                break;
            case "rejected":
                description = `${employeeName} has rejected the Authorization Document`;
                break;
            case "approved":
                description = `${employeeName} has approved the Authorization Document`;
                break;
            default:
                description = `${employeeName} has changed Authorization Document status to ${status}`;
        }
        console.log(`📝 Generated description: ${description}`);

        // Notes
        let defaultNote = "";
        switch (status) {
            case "submitted":
                defaultNote = "This authorization document has been submitted.";
                break;
            case "updated":
                defaultNote = "This authorization document has been updated.";
                break;
            case "not_approved":
                defaultNote = "This authorization document has not been approved.";
                break;
            case "rejected":
                defaultNote = "This authorization document has been rejected.";
                break;
            case "approved":
                defaultNote = "This authorization document has been approved.";
                break;
            default:
                defaultNote = `Status has been changed to "${status}".`;
        }

        const finalNote = note || defaultNote;
        console.log(`📄 Using note: ${finalNote}`);

        // Prepare data object untuk insert
        const historyData = {
            description,
            employee_code: created_by,
            authdoc_id,
            auth_id,
            note: finalNote,
            status,
            created_date: new Date(),
            created_by,
            updated_date: new Date() // Tambahkan field ini jika diperlukan
        };

        console.log(`💾 Inserting history record:`, JSON.stringify(historyData));

        const result = await prismaDB2.tr_authdoc_history.create({
            data: historyData
        });

        console.log(`✅ History record inserted with ID: ${result?.id || 'unknown'}`);
    } catch (error) {
        console.error("❌ Error creating history:", error);
        if (error instanceof Error) {
            console.error(`❌ Error message: ${error.message}`);
            console.error(`❌ Error stack: ${error.stack}`);
        }
        throw error;
    }
}


// Fungsi untuk menyiapkan data approval sesuai urutan yang diinginkan
function prepareApprovalData(
    authdoc_id: number,
    heads: HeadData[]
): Array<{
    authdoc_id: number;
    auth_id: number | null;
    step: number;
    actor: string;
    employee_code: string;
    status: string;
    created_date: Date;
}> {
    // Filter head yang memiliki id_authorization dan siapkan data approval
    const validHeads = heads.filter(head => head.id_authorization !== null);

    // Log untuk debugging
    console.log(`Preparing approval data from ${heads.length} heads, ${validHeads.length} valid heads with id_authorization`);

    return validHeads.map((head, index) => ({
        authdoc_id,
        auth_id: head.id_authorization,
        step: index + 1,
        actor: head.directorship,
        employee_code: head.employee_code || '',
        // Urutan pertama menjadi on_going, sisanya pending
        status: index === 0 ? 'on_going' : 'pending',
        created_date: new Date()
    }));
}

// Create approvals dengan parameter need_engineering_approval dan need_production_approval
async function createdAuthApprovals(
    authdoc_id: number,
    section_department_id: number,
    line_code: string,
): Promise<void> {
    try {
        // Log parameter
        console.log(`Creating approvals for authdoc_id: ${authdoc_id}, section_id: ${section_department_id}, line_code: "${line_code}"`);

        // Get heads data
        const heads = await getAllHeadsData(
            section_department_id,
            line_code,
        );

        // Log hasil getAllHeadsData
        console.log(`getAllHeadsData returned ${heads.length} heads`);
        heads.forEach((head, index) => {
            console.log(`  ${index + 1}. ${head.directorship}: ${head.employee_name} (${head.employee_code}), auth_id: ${head.id_authorization}`);
        });

        // Prepare approval records menggunakan fungsi khusus
        const approvalData = prepareApprovalData(authdoc_id, heads);

        // Create records if we have any approvers
        if (approvalData.length > 0) {
            // Using createMany for better performance
            await prismaDB2.tr_authdoc_approval.createMany({
                data: approvalData
            });

            console.log(`✅ Created ${approvalData.length} approval records with ordered steps:`);
            approvalData.forEach(item => {
                console.log(`   Step ${item.step}: ${item.actor} (${item.employee_code})`);
            });
        } else {
            console.log("⚠️ No approval records created - no valid approvers found");
        }
    } catch (error) {
        console.error("Error creating approvals:", error);
        throw error;
    }
}

// Main function to create proposed change
export const createAuthDoc = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        console.log("✅ Received request to create new auth doc");

        // Validate required fields
        const requiredFields = [
            "description", "created_by", "auth_id",
            "plant_id", "department_id", "section_department_id",
            "doc_number", "implementation_date", "evaluation", "conclution",
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

        // Log optional fields that are not provided
        const optionalFields = ['concept', 'standart', 'method', 'status'];
        optionalFields.forEach(field => {
            if (!data[field]) {
                console.info(`ℹ️ Optional field "${field}" is not provided`);
            }
        });

        // Validate and extract line_code from doc_number
        console.log("Original doc_number:", data.doc_number);
        const docNumberParts = data.doc_number.split("/");
        if (docNumberParts.length < 2) {
            console.warn("❌ Invalid doc_number format:", data.doc_number);
            res.status(400).json({
                error: "Invalid doc_number format",
                details: "doc_number must follow the format: XX/LINE_CODE/..."
            });
            return;
        }
        const line_code = docNumberParts[1];
        console.log(`Extracted line_code: "${line_code}"`);

        // Create main record
        console.log("✅ Creating main record...");
        const newChange = await prismaDB2.tr_authorization_doc.create({
            data: {
                proposed_change_id: data.proposed_change_id,
                doc_number: data.doc_number,
                implementation_date: data.implementation_date ? new Date(data.implementation_date) : undefined,
                evaluation: data.evaluation,
                description: data.description,
                conclution: data.conclution,
                concept: data.concept,
                standart: data.standart,
                method: data.method,
                status: data.status || "submitted",
                created_by: data.created_by,
                created_date: new Date(),
                auth_id: data.auth_id,
                plant_id: data.plant_id,
                department_id: data.department_id,
                section_department_id: data.section_department_id,
            }
        });
        console.log(`✅ Main record created with ID: ${newChange.id}`);

        // Prepare parallel operations
        const operations = [
            createAuthHistory(
                newChange.id,
                data.auth_id,
                data.created_by,
                data.status || "submitted"
            ),
            createdAuthApprovals(
                newChange.id,
                data.section_department_id,
                line_code
            )
        ];

        if (data.members && Array.isArray(data.members) && data.members.length > 0) {
            console.log(`👥 Creating ${data.members.length} member(s) for this auth doc`);
            const createMembersOperation = createAuthDocMembers(
                newChange.id,
                data.members
            );
            operations.push(createMembersOperation);
        }

        console.log(`🚀 Running ${operations.length} parallel operations...`);
        await Promise.all(operations);
        console.log("✅ All parallel operations completed");

        // Send email notifications
        try {
            await sendSubmissionEmails(newChange.id, data.auth_id);
            console.log(`✉️ Submission notification emails sent for proposed change ${newChange.id}`);
        } catch (emailError) {
            console.error("⚠️ Error sending email notifications:", emailError);
        }

        res.status(201).json({
            message: "Proposed change created successfully",
            data: newChange
        });

    } catch (error) {
        console.error("❌ Error creating proposed change:", error);
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
 * Fungsi untuk membuat entri di tabel tr_authdoc_member
 * @param authdocId ID dokumen otorisasi
 * @param members Array data anggota yang akan ditambahkan
 */
const createAuthDocMembers = async (
    authdocId: number,
    members: Array<{ employee_code: string, employee_name: string, status?: string }>
): Promise<void> => {
    try {
        // Buat array data untuk operasi createMany
        const membersData = members.map(member => ({
            authdoc_id: authdocId,
            employee_code: String(member.employee_code), // Convert employee_code to number
            employee_name: member.employee_name,
            status: member.status || "active",
            created_date: new Date(),
            is_deleted: false
        }));

        // Buat semua anggota dalam satu operasi batch
        const result = await prismaDB2.tr_authdoc_member.createMany({
            data: membersData,
            skipDuplicates: true // Lewati jika ada duplikasi
        });

        console.log(`✅ Created ${result.count} members for auth doc ID ${authdocId}`);
    } catch (error) {
        console.error(`Error creating auth doc members for doc ID ${authdocId}:`, error);
        throw error; // Re-throw untuk ditangani oleh fungsi pemanggil
    }
};

export { getAllHeadsData, createAuthHistory, createdAuthApprovals };