import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";

/**
 * Mendapatkan top submitters berdasarkan handover
 * Menampilkan jumlah dokumen dan rating rata-rata
 */
export const getTopHandoverSubmitters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters with defaults
    const limit = Number(req.query.limit) || 10;    // Default: top 10
    const dateFrom = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const dateTo = req.query.date_to ? new Date(req.query.date_to as string) : undefined;
    const minRating = req.query.min_rating ? parseFloat(req.query.min_rating as string) : undefined;
    const minDocuments = req.query.min_documents ? parseInt(req.query.min_documents as string) : 1;
    
    console.log(`Mendapatkan top ${limit} submitters dari handover`);
    
    // Optional date filters
    const dateFilter: any = {};
    if (dateFrom) {
      dateFilter.gte = dateFrom;
      console.log(`Filter dari tanggal: ${dateFrom.toISOString()}`);
    }
    if (dateTo) {
      dateFilter.lte = dateTo;
      console.log(`Filter sampai tanggal: ${dateTo.toISOString()}`);
    }
    
    // Build the where condition
    const whereCondition: any = {
      is_deleted: false,
      is_finished: true,  // Only count completed handovers with ratings
      star: { not: null } // Only count handovers with ratings
    };
    
    // Add date filter if specified
    if (Object.keys(dateFilter).length > 0) {
      whereCondition.created_date = dateFilter;
    }
    
    // If minimum rating specified
    if (minRating !== undefined) {
      whereCondition.star = {
        ...whereCondition.star,
        gte: minRating
      };
      console.log(`Filter rating minimum: ${minRating}`);
    }
    
    // Step 1: Get all submitters (auth_id) with their handover counts and average ratings
    const authIdResults = await prismaDB2.tr_handover.groupBy({
      by: ['auth_id'],
      where: whereCondition,
      _count: {
        id: true // Count handovers
      },
      _avg: {
        star: true // Average rating
      }
    });
    
    console.log(`Ditemukan ${authIdResults.length} submitters dengan handover selesai dan rating`);
    
    // Step 2: Filter out submitters with low document counts
    const filteredAuthIds = authIdResults.filter(item => 
      item._count.id >= minDocuments
    );
    
    console.log(`${filteredAuthIds.length} submitters memenuhi kriteria minimum ${minDocuments} dokumen`);
    
    // Step 3: Get detailed information for each submitter
    const submitterDetails = await Promise.all(
      filteredAuthIds.map(async (item) => {
        // Skip if auth_id is null
        if (!item.auth_id) return null;
        
        // Get user details
        const user = await prismaDB2.mst_authorization.findUnique({
          where: { id: item.auth_id },
          select: {
            id: true,
            employee_code: true,
            employee_name: true,
            email: true,
            department: {
              select: {
                id: true,
                department_name: true,
                department_code: true
              }
            }
          }
        });
        
        if (!user) return null;
        
        // Get details of all their handovers
        const handoverDetails = await prismaDB2.tr_handover.findMany({
          where: {
            auth_id: item.auth_id,
            is_deleted: false,
            is_finished: true,
            star: { not: null }
          },
          select: {
            id: true,
            doc_number: true,
            star: true,
            finished_date: true,
            tr_proposed_changes: {
              select: {
                project_name: true
              }
            }
          },
          orderBy: {
            star: 'desc'
          }
        });
        
        // Get best and worst rated handovers
        const bestHandover = handoverDetails.length > 0 ? handoverDetails[0] : null;
        const worstHandover = handoverDetails.length > 0 ? 
          handoverDetails.reduce((prev, curr) => 
            (curr.star || 0) < (prev.star || 0) ? curr : prev
          , handoverDetails[0]) : null;
        
        // Return formatted data
        return {
          user: {
            id: user.id,
            employee_code: user.employee_code,
            employee_name: user.employee_name,
            email: user.email,
            department: user.department
          },
          stats: {
            total_handovers: item._count.id,
            average_rating: item._avg.star ? parseFloat(item._avg.star.toFixed(2)) : 0,
            best_rating: bestHandover?.star || 0,
            worst_rating: worstHandover?.star || 0
          },
          best_handover: bestHandover ? {
            id: bestHandover.id,
            doc_number: bestHandover.doc_number,
            rating: bestHandover.star,
            project_name: bestHandover.tr_proposed_changes?.project_name || "Unknown",
            finished_date: bestHandover.finished_date
          } : null,
          worst_handover: worstHandover && worstHandover.id !== bestHandover?.id ? {
            id: worstHandover.id,
            doc_number: worstHandover.doc_number,
            rating: worstHandover.star,
            project_name: worstHandover.tr_proposed_changes?.project_name || "Unknown",
            finished_date: worstHandover.finished_date
          } : null
        };
      })
    );
    
    // Step 4: Remove null entries and sort by average rating (desc) and total handovers (desc)
    const sortedSubmitters = submitterDetails
      .filter(item => item !== null)
      .sort((a, b) => {
        // First sort by average rating (descending)
        const ratingDiff = (b?.stats.average_rating || 0) - (a?.stats.average_rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        
        // If ratings are equal, sort by total handovers (descending)
        return (b?.stats.total_handovers || 0) - (a?.stats.total_handovers || 0);
      });
    
    // Step 5: Take the top N results
    const topSubmitters = sortedSubmitters.slice(0, limit);
    
    // Compute ranking position for each submitter
    const submitters = topSubmitters.map((item, index) => ({
      rank: index + 1,
      ...item
    }));
    
    // Step 6: Send response
    res.status(200).json({
      status: "success",
      message: `Top ${limit} handover submitters berhasil diambil`,
      filters: {
        date_from: dateFrom?.toISOString() || null,
        date_to: dateTo?.toISOString() || null,
        min_rating: minRating,
        min_documents: minDocuments,
        limit: limit
      },
      data: submitters
    });
    
  } catch (error) {
    console.error("Error saat mengambil top handover submitters:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data top handover submitters",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};

/**
 * Mendapatkan top approvers berdasarkan handover
 * Menampilkan jumlah dokumen dan rating yang diberikan
 */
export const getTopHandoverApprovers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters with defaults
    const limit = Number(req.query.limit) || 10;    // Default: top 10
    const dateFrom = req.query.date_from ? new Date(req.query.date_from as string) : undefined;
    const dateTo = req.query.date_to ? new Date(req.query.date_to as string) : undefined;
    const minDocuments = req.query.min_documents ? parseInt(req.query.min_documents as string) : 1;
    
    console.log(`Mendapatkan top ${limit} approvers dari handover`);
    
    // Optional date filters
    const dateFilter: any = {};
    if (dateFrom) {
      dateFilter.gte = dateFrom;
      console.log(`Filter dari tanggal: ${dateFrom.toISOString()}`);
    }
    if (dateTo) {
      dateFilter.lte = dateTo;
      console.log(`Filter sampai tanggal: ${dateTo.toISOString()}`);
    }
    
    // Build the where condition for approvals
    const whereCondition: any = {
      status: 'approved',
      rating: { not: null } // Only count approvals with ratings
    };
    
    // Add handover date filter if specified
    if (Object.keys(dateFilter).length > 0) {
      whereCondition.tr_handover = {
        created_date: dateFilter
      };
    }
    
    // Step 1: Get all approvers with their approval counts and average ratings
    // Need to count from tr_handover_approval
    const approverStats = await prismaDB2.tr_handover_approval.groupBy({
      by: ['auth_id'],
      where: whereCondition,
      _count: {
        id: true // Count approvals
      },
      _avg: {
        rating: true // Average rating given
      }
    });
    
    console.log(`Ditemukan ${approverStats.length} approvers dengan rating`);
    
    // Step 2: Filter out approvers with low document counts
    const filteredApprovers = approverStats.filter(item => 
      item._count.id >= minDocuments && item.auth_id !== null
    );
    
    console.log(`${filteredApprovers.length} approvers memenuhi kriteria minimum ${minDocuments} dokumen`);
    
    // Step 3: Get detailed information for each approver
    const approverDetails = await Promise.all(
      filteredApprovers.map(async (item) => {
        // Skip if auth_id is null
        if (!item.auth_id) return null;
        
        // Get user details
        const user = await prismaDB2.mst_authorization.findUnique({
          where: { id: item.auth_id },
          select: {
            id: true,
            employee_code: true,
            employee_name: true,
            email: true,
            department: {
              select: {
                id: true,
                department_name: true,
                department_code: true
              }
            }
          }
        });
        
        if (!user) return null;
        
        // Get details of all their approved handovers with ratings
        const approvalDetails = await prismaDB2.tr_handover_approval.findMany({
          where: {
            auth_id: item.auth_id,
            status: 'approved',
            rating: { not: null }
          },
          select: {
            id: true,
            rating: true,
            review: true,
            updated_date: true,
            tr_handover: {
              select: {
                id: true,
                doc_number: true,
                tr_proposed_changes: {
                  select: {
                    project_name: true
                  }
                }
              }
            }
          },
          orderBy: {
            rating: 'desc'
          }
        });
        
        // Get highest and lowest ratings given
        const highestApproval = approvalDetails.length > 0 ? approvalDetails[0] : null;
        const lowestApproval = approvalDetails.length > 0 ? 
          approvalDetails.reduce((prev, curr) => 
            (curr.rating || 0) < (prev.rating || 0) ? curr : prev
          , approvalDetails[0]) : null;
        
        // Return formatted data
        return {
          user: {
            id: user.id,
            employee_code: user.employee_code,
            employee_name: user.employee_name,
            email: user.email,
            department: user.department
          },
          stats: {
            total_approvals: item._count.id,
            average_rating: item._avg.rating ? parseFloat(item._avg.rating.toFixed(2)) : 0,
            highest_rating: highestApproval?.rating || 0,
            lowest_rating: lowestApproval?.rating || 0
          },
          highest_rated: highestApproval ? {
            id: highestApproval.id,
            handover_id: highestApproval.tr_handover?.id,
            doc_number: highestApproval.tr_handover?.doc_number,
            rating: highestApproval.rating,
            review: highestApproval.review,
            project_name: highestApproval.tr_handover?.tr_proposed_changes?.project_name || "Unknown",
            rated_date: highestApproval.updated_date
          } : null,
          lowest_rated: lowestApproval && lowestApproval.id !== highestApproval?.id ? {
            id: lowestApproval.id,
            handover_id: lowestApproval.tr_handover?.id,
            doc_number: lowestApproval.tr_handover?.doc_number,
            rating: lowestApproval.rating,
            review: lowestApproval.review,
            project_name: lowestApproval.tr_handover?.tr_proposed_changes?.project_name || "Unknown",
            rated_date: lowestApproval.updated_date
          } : null
        };
      })
    );
    
    // Step 4: Remove null entries and sort by average rating (desc) and total approvals (desc)
    const sortedApprovers = approverDetails
      .filter(item => item !== null)
      .sort((a, b) => {
        // First sort by average rating (descending)
        const ratingDiff = (b?.stats.average_rating || 0) - (a?.stats.average_rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        
        // If ratings are equal, sort by total approvals (descending)
        return (b?.stats.total_approvals || 0) - (a?.stats.total_approvals || 0);
      });
    
    // Step 5: Take the top N results
    const topApprovers = sortedApprovers.slice(0, limit);
    
    // Compute ranking position for each approver
    const approvers = topApprovers.map((item, index) => ({
      rank: index + 1,
      ...item
    }));
    
    // Step 6: Send response
    res.status(200).json({
      status: "success",
      message: `Top ${limit} handover approvers berhasil diambil`,
      filters: {
        date_from: dateFrom?.toISOString() || null,
        date_to: dateTo?.toISOString() || null,
        min_documents: minDocuments,
        limit: limit
      },
      data: approvers
    });
    
  } catch (error) {
    console.error("Error saat mengambil top handover approvers:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data top handover approvers",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};