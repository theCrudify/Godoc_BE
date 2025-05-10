import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";

async function getDocumentStatusMapping(req: Request, res: Response) {
  try {
    // Get total active documents (not deleted)
    const totalDocuments = await prismaDB2.tr_proposed_changes.count({
      where: {
        is_deleted: false,
      },
    });

    // Get documents still in proposed_changes stage (no authorization doc yet)
    const proposedChangesStage = await prismaDB2.tr_proposed_changes.count({
      where: {
        is_deleted: false,
        authorizationDocs: {
          none: {},
        },
      },
    });

    // Get documents in authorization stage (have auth doc but not in handover)
    const authorizationStage = await prismaDB2.tr_proposed_changes.count({
      where: {
        is_deleted: false,
        authorizationDocs: {
          some: {
            tr_handover: {
              none: {},
            },
          },
        },
      },
    });

    // Get documents in handover stage (not finished)
    const handoverStage = await prismaDB2.tr_handover.count({
      where: {
        is_deleted: false,
        is_finished: false,
      },
    });

    // Get completed documents
    const completedDocuments = await prismaDB2.tr_handover.count({
      where: {
        is_deleted: false,
        is_finished: true,
      },
    });

    res.json({
      totalDocuments,
      documentsByStage: {
        proposedChanges: proposedChangesStage,
        authorization: authorizationStage,
        handover: handoverStage,
        completed: completedDocuments,
      },
    });
  } catch (error) {
    console.error("Error fetching document mapping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { getDocumentStatusMapping };
