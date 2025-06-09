import { Request, Response } from "express";
import { prismaDB2 } from "../../../config/database";

// CRUD Functions untuk mengelola template approval

// Get all approval templates with filtering
export const getAllApprovalTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchTerm = (req.query.search as string) || "";
    const line_code = req.query.line_code as string;
    const need_engineering = req.query.need_engineering as string;
    const need_production = req.query.need_production as string;
    const is_active = req.query.is_active as string;

    const offset = (page - 1) * limit;

    const whereCondition: any = {
      is_deleted: false,
      AND: []
    };

    // Search filter
    if (searchTerm) {
      whereCondition.OR = [
        { template_name: { contains: searchTerm } },
        { actor_name: { contains: searchTerm } },
        { description: { contains: searchTerm } }
      ];
    }

    // Filter by line_code
    if (line_code) {
      whereCondition.AND.push({
        OR: [
          { line_code: line_code },
          { line_code: null }
        ]
      });
    }

    // Filter by need_engineering_approval
    if (need_engineering && need_engineering !== 'all') {
      const needEngineering = need_engineering === 'true';
      whereCondition.AND.push({
        OR: [
          { need_engineering_approval: needEngineering },
          { need_engineering_approval: null }
        ]
      });
    }

    // Filter by need_production_approval
    if (need_production && need_production !== 'all') {
      const needProduction = need_production === 'true';
      whereCondition.AND.push({
        OR: [
          { need_production_approval: needProduction },
          { need_production_approval: null }
        ]
      });
    }

    // Filter by is_active
    if (is_active && is_active !== 'all') {
      whereCondition.is_active = is_active === 'true';
    }

    const [templates, totalCount] = await prismaDB2.$transaction([
      prismaDB2.mst_template_approval_proposedchanges.findMany({
        where: whereCondition,
        skip: offset,
        take: limit,
        orderBy: [
          { step_order: 'asc' },
          { priority: 'desc' }
        ]
      }),
      prismaDB2.mst_template_approval_proposedchanges.count({ where: whereCondition })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      data: templates,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPreviousPage
      }
    });

  } catch (error) {
    console.error("Error getting approval templates:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get single approval template by ID
export const getApprovalTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const template = await prismaDB2.mst_template_approval_proposedchanges.findUnique({
      where: {
        id,
        is_deleted: false
      }
    });

    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    res.status(200).json({ data: template });

  } catch (error) {
    console.error("Error getting approval template:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Create new approval template
export const createApprovalTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = [
      "template_name", "step_order", "actor_name", 
      "model_type", "created_by"
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      res.status(400).json({
        error: "Validation Error",
        details: `Missing fields: ${missingFields.join(", ")}`
      });
      return;
    }

    // Validate model_type
    if (!['section', 'department'].includes(data.model_type)) {
      res.status(400).json({
        error: "Validation Error",
        details: "model_type must be either 'section' or 'department'"
      });
      return;
    }

    // Check for duplicate step_order with same criteria
    const existingTemplate = await prismaDB2.mst_template_approval_proposedchanges.findFirst({
      where: {
        step_order: data.step_order,
        line_code: data.line_code || null,
        need_engineering_approval: data.need_engineering_approval ?? null,
        need_production_approval: data.need_production_approval ?? null,
        is_deleted: false,
        is_active: true
      }
    });

    if (existingTemplate) {
      res.status(409).json({
        error: "Duplicate template",
        details: `Template with step_order ${data.step_order} already exists for the same criteria`
      });
      return;
    }

    // Create new template
    const newTemplate = await prismaDB2.mst_template_approval_proposedchanges.create({
      data: {
        template_name: data.template_name,
        line_code: data.line_code || null,
        need_engineering_approval: data.need_engineering_approval ?? null,
        need_production_approval: data.need_production_approval ?? null,
        step_order: data.step_order,
        actor_name: data.actor_name,
        model_type: data.model_type,
        section_id: data.section_id || null,
        use_dynamic_section: data.use_dynamic_section || false,
        use_line_section: data.use_line_section || false,
        is_active: data.is_active !== undefined ? data.is_active : true,
        priority: data.priority || 0,
        description: data.description || null,
        created_by: data.created_by,
        created_date: new Date()
      }
    });

    res.status(201).json({
      message: "Approval template created successfully",
      data: newTemplate
    });

  } catch (error) {
    console.error("Error creating approval template:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Update approval template
export const updateApprovalTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    // Check if template exists
    const existingTemplate = await prismaDB2.mst_template_approval_proposedchanges.findUnique({
      where: { id, is_deleted: false }
    });

    if (!existingTemplate) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    // Validate model_type if provided
    if (data.model_type && !['section', 'department'].includes(data.model_type)) {
      res.status(400).json({
        error: "Validation Error",
        details: "model_type must be either 'section' or 'department'"
      });
      return;
    }

    // Check for duplicate step_order if step_order is being updated
    if (data.step_order && data.step_order !== existingTemplate.step_order) {
      const duplicateTemplate = await prismaDB2.mst_template_approval_proposedchanges.findFirst({
        where: {
          id: { not: id },
          step_order: data.step_order,
          line_code: data.line_code ?? existingTemplate.line_code,
          need_engineering_approval: data.need_engineering_approval ?? existingTemplate.need_engineering_approval,
          need_production_approval: data.need_production_approval ?? existingTemplate.need_production_approval,
          is_deleted: false,
          is_active: true
        }
      });

      if (duplicateTemplate) {
        res.status(409).json({
          error: "Duplicate template",
          details: `Template with step_order ${data.step_order} already exists for the same criteria`
        });
        return;
      }
    }

    // Update template
    const updatedTemplate = await prismaDB2.mst_template_approval_proposedchanges.update({
      where: { id },
      data: {
        template_name: data.template_name ?? existingTemplate.template_name,
        line_code: data.line_code !== undefined ? data.line_code : existingTemplate.line_code,
        need_engineering_approval: data.need_engineering_approval !== undefined ? data.need_engineering_approval : existingTemplate.need_engineering_approval,
        need_production_approval: data.need_production_approval !== undefined ? data.need_production_approval : existingTemplate.need_production_approval,
        step_order: data.step_order ?? existingTemplate.step_order,
        actor_name: data.actor_name ?? existingTemplate.actor_name,
        model_type: data.model_type ?? existingTemplate.model_type,
        section_id: data.section_id !== undefined ? data.section_id : existingTemplate.section_id,
        use_dynamic_section: data.use_dynamic_section !== undefined ? data.use_dynamic_section : existingTemplate.use_dynamic_section,
        use_line_section: data.use_line_section !== undefined ? data.use_line_section : existingTemplate.use_line_section,
        is_active: data.is_active !== undefined ? data.is_active : existingTemplate.is_active,
        priority: data.priority !== undefined ? data.priority : existingTemplate.priority,
        description: data.description !== undefined ? data.description : existingTemplate.description,
        updated_by: data.updated_by,
        updated_date: new Date()
      }
    });

    res.status(200).json({
      message: "Approval template updated successfully",
      data: updatedTemplate
    });

  } catch (error) {
    console.error("Error updating approval template:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Delete (soft delete) approval template
export const deleteApprovalTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { deleted_by } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({ error: "deleted_by is required" });
      return;
    }

    // Check if template exists
    const existingTemplate = await prismaDB2.mst_template_approval_proposedchanges.findUnique({
      where: { id, is_deleted: false }
    });

    if (!existingTemplate) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    // Soft delete
    await prismaDB2.mst_template_approval_proposedchanges.update({
      where: { id },
      data: {
        is_deleted: true,
        updated_by: deleted_by,
        updated_date: new Date()
      }
    });

    res.status(200).json({
      message: "Approval template deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting approval template:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Toggle template status (active/inactive)
export const toggleTemplateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { updated_by } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    if (!updated_by) {
      res.status(400).json({ error: "updated_by is required" });
      return;
    }

    // Check if template exists
    const existingTemplate = await prismaDB2.mst_template_approval_proposedchanges.findUnique({
      where: { id, is_deleted: false }
    });

    if (!existingTemplate) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    // Toggle status
    const updatedTemplate = await prismaDB2.mst_template_approval_proposedchanges.update({
      where: { id },
      data: {
        is_active: !existingTemplate.is_active,
        updated_by,
        updated_date: new Date()
      }
    });

    res.status(200).json({
      message: `Template ${updatedTemplate.is_active ? 'activated' : 'deactivated'} successfully`,
      data: updatedTemplate
    });

  } catch (error) {
    console.error("Error toggling template status:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Preview approval flow for given criteria
export const previewApprovalFlow = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      section_department_id,
      line_code,
      need_engineering_approval,
      need_production_approval
    } = req.query;

    if (!section_department_id || !line_code) {
      res.status(400).json({
        error: "Validation Error",
        details: "section_department_id and line_code are required"
      });
      return;
    }

    // Import the function from the main module
    const { getApprovalTemplates, resolveSectionId } = await import('../../Activity/Document/2_ProposedChanges/CreateActivityProposedChanges');

    // Get templates for preview
    const templates = await getApprovalTemplates(
      line_code as string,
      need_engineering_approval === 'true',
      need_production_approval === 'true'
    );

    // Preview the flow
    const previewFlow = [];
    for (const template of templates) {
      const resolvedSectionId = await resolveSectionId(
        template,
        Number(section_department_id),
        line_code as string
      );

      let actorName = template.actor_name;
      if (template.use_line_section) {
        actorName = `${template.actor_name} (${line_code})`;
      }

      previewFlow.push({
        step: template.step_order,
        actor: actorName,
        template_name: template.template_name,
        model_type: template.model_type,
        section_id: resolvedSectionId,
        description: template.description,
        priority: template.priority
      });
    }

    res.status(200).json({
      message: "Approval flow preview",
      criteria: {
        section_department_id: Number(section_department_id),
        line_code,
        need_engineering_approval: need_engineering_approval === 'true',
        need_production_approval: need_production_approval === 'true'
      },
      flow: previewFlow,
      total_steps: previewFlow.length
    });

  } catch (error) {
    console.error("Error previewing approval flow:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// // Get template statistics
// export const getTemplateStatistics = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const [
//       totalTemplates,
//       activeTemplates,
//       inactiveTemplates,
//       templatesByLineCode,
//       templatesByModelType,
//       templatesByStep
//     ] = await prismaDB2.$transaction([
//       // Total templates
//       prismaDB2.mst_template_approval_proposedchanges.count({
//         where: { is_deleted: false }
//       }),
//       // Active templates
//       prismaDB2.mst_template_approval_proposedchanges.count({
//         where: { is_deleted: false, is_active: true }
//       }),
//       // Inactive templates
//       prismaDB2.mst_template_approval_proposedchanges.count({
//         where: { is_deleted: false, is_active: false }
//       }),
//       // Templates by line code
//       prismaDB2.mst_template_approval_proposedchanges.groupBy({
//         by: ['line_code'],
//         where: { is_deleted: false },
//         _count: { id: true }
//       }),
//       // Templates by model type
//       prismaDB2.mst_template_approval_proposedchanges.groupBy({
//         by: ['model_type'],
//         where: { is_deleted: false },
//         _count: { id: true }
//       }),
//       // Templates by step order
//       prismaDB2.mst_template_approval_proposedchanges.groupBy({
//         by: ['step_order'],
//         where: { is_deleted: false },
//         _count: { id: true },
//         orderBy: { step_order: 'asc' }
//       })
//     ]);

//     res.status(200).json({
//       summary: {
//         total: totalTemplates,
//         active: activeTemplates,
//         inactive: inactiveTemplates
//       },
//       distributions: {
//         by_line_code: templatesByLineCode.map(item => ({
//           line_code: item.line_code || 'General',
//           count: item._count.id
//         })),
//         by_model_type: templatesByModelType.map(item => ({
//           model_type: item.model_type,
//           count: item._count.id
//         })),
//         by_step_order: templatesByStep.map(item => ({
//           step: item.step_order,
//           count: item._count.id
//         }))
//       }
//     });

//   } catch (error) {
//     console.error("Error getting template statistics:", error);
//     res.status(500).json({
//       error: "Internal Server Error",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// };