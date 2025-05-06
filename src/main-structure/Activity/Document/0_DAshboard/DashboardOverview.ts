// src/main-structure/Dashboard/DashboardOverview.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";

/**
 * Get overview data for dashboard
 * Includes document counts by status, recent activity, and metrics
 */
export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const timeFilter = buildTimeFilterCondition(req.query);
    const authId = Number(req.query.auth_id);
    const departmentId = Number(req.query.department_id);
    const userRole = req.query.role as string;
    
    console.log(`🔍 [Dashboard] Getting overview data with timeFilter:`, timeFilter);
    console.log(`👤 User context: role=${userRole}, authId=${authId}, departmentId=${departmentId}`);
    
    // Build base where condition based on user role
    let baseWhereCondition: any = {
      is_deleted: false,
      created_date: timeFilter
    };
    
    if (userRole === 'user' && authId) {
      baseWhereCondition.auth_id = authId;
    } else if (userRole === 'dept_admin' && departmentId) {
      baseWhereCondition.department_id = departmentId;
    }
    
    console.log(`🔍 Base where condition:`, JSON.stringify(baseWhereCondition));
    
    // Get document counts by status
    console.log(`📊 [Dashboard] Calculating document counts by status`);
    const documentCounts = await getDocumentCountsByStatus(baseWhereCondition);
    
    // Get top pending documents
    console.log(`📊 [Dashboard] Getting top pending documents`);
    const pendingDocuments = await getTopPendingDocuments(baseWhereCondition);
    
    // Get system performance metrics
    console.log(`📊 [Dashboard] Calculating system performance metrics`);
    const performanceMetrics = await getPerformanceMetrics(baseWhereCondition);
    
    // Get document status trends
    console.log(`📊 [Dashboard] Getting document status trends`);
    const statusTrends = await getDocumentStatusTrends(baseWhereCondition);
    
    // Combine all data and return response
    const responseData = {
      documentCounts,
      pendingDocuments,
      performanceMetrics,
      statusTrends,
      timeFilter: {
        startDate: timeFilter.gte,
        endDate: timeFilter.lte
      }
    };
    
    console.log(`✅ [Dashboard] Overview data collected successfully`);
    res.status(200).json({ data: responseData });
    
  } catch (error) {
    console.error("❌ Error getting dashboard overview:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get document counts grouped by status
 */
async function getDocumentCountsByStatus(whereCondition: any) {
  console.log(`🔍 [getDocumentCountsByStatus] Starting count calculation`);
  
  // Count documents by status for all document types
  const [
    handoverCounts,
    authDocCounts,
    proposedChangeCounts
  ] = await Promise.all([
    // Handover document counts
    prismaDB2.$transaction([
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'submitted'
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'onprogress'
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'not_approved'
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'rejected'
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'approved'
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'done'
        }
      })
    ]),
    
    // Authorization document counts
    prismaDB2.$transaction([
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'submitted'
        }
      }),
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'onprogress'
        }
      }),
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'not_approved'
        }
      }),
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'rejected'
        }
      }),
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'approved'
        }
      }),
      prismaDB2.tr_authorization_doc.count({
        where: {
          ...whereCondition,
          status: 'done'
        }
      })
    ]),
    
    // Proposed changes counts
    prismaDB2.$transaction([
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'submitted'
        }
      }),
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'onprogress'
        }
      }),
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'not_approved'
        }
      }),
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'rejected'
        }
      }),
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'approved'
        }
      }),
      prismaDB2.tr_proposed_changes.count({
        where: {
          ...whereCondition,
          status: 'done'
        }
      })
    ])
  ]);
  
  console.log(`✅ [getDocumentCountsByStatus] Counts calculated successfully`);
  
  // Combine and format results
  return {
    handover: {
      submitted: handoverCounts[0],
      onprogress: handoverCounts[1],
      not_approved: handoverCounts[2],
      rejected: handoverCounts[3],
      approved: handoverCounts[4],
      done: handoverCounts[5]
    },
    authDoc: {
      submitted: authDocCounts[0],
      onprogress: authDocCounts[1],
      not_approved: authDocCounts[2],
      rejected: authDocCounts[3],
      approved: authDocCounts[4],
      done: authDocCounts[5]
    },
    proposedChanges: {
      submitted: proposedChangeCounts[0],
      onprogress: proposedChangeCounts[1],
      not_approved: proposedChangeCounts[2],
      rejected: proposedChangeCounts[3],
      approved: proposedChangeCounts[4],
      done: proposedChangeCounts[5]
    },
    // Add total counts across all document types
    total: {
      submitted: handoverCounts[0] + authDocCounts[0] + proposedChangeCounts[0],
      onprogress: handoverCounts[1] + authDocCounts[1] + proposedChangeCounts[1],
      not_approved: handoverCounts[2] + authDocCounts[2] + proposedChangeCounts[2],
      rejected: handoverCounts[3] + authDocCounts[3] + proposedChangeCounts[3],
      approved: handoverCounts[4] + authDocCounts[4] + proposedChangeCounts[4],
      done: handoverCounts[5] + authDocCounts[5] + proposedChangeCounts[5]
    }
  };
}

/**
 * Get top pending documents that need attention
 */
async function getTopPendingDocuments(whereCondition: any) {
  console.log(`🔍 [getTopPendingDocuments] Getting pending documents`);
  
  // Get top 5 pending handover documents first
  const pendingHandovers = await prismaDB2.tr_handover.findMany({
    where: {
      ...whereCondition,
      status: {
        in: ['onprogress', 'not_approved']
      }
    },
    include: {
      mst_department: {
        select: {
          department_name: true
        }
      },
      tr_handover_approval: {
        where: {
          status: 'on_going'
        },
        include: {
          mst_authorization: {
            select: {
              employee_name: true
            }
          }
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { created_date: 'asc' }
    ],
    take: 5
  });
  
  // Format the handover documents
  const formattedHandovers = pendingHandovers.map(doc => {
    const currentApprover = doc.tr_handover_approval.find(a => a.status === 'on_going');
    const waitingTime = currentApprover?.created_date ? 
      calculateWaitingTime(new Date(currentApprover.created_date as any)) : 
      null;
    
    return {
      id: doc.id,
      doc_number: doc.doc_number,
      type: 'handover',
      department: doc.mst_department?.department_name || 'Unknown',
      status: doc.status,
      current_approver: currentApprover?.mst_authorization?.employee_name || 'None',
      waiting_time: waitingTime,
      created_date: doc.created_date
    };
  });
  
  // Similarly get pending auth documents
  // (Code would be similar to above but for tr_authorization_doc)
  
  // Similarly get pending proposed changes
  // (Code would be similar to above but for tr_proposed_changes)
  
  // Combine results from all document types, sort by waiting time
  // For simplicity, just returning the handover results for now
  console.log(`✅ [getTopPendingDocuments] Found ${formattedHandovers.length} pending documents`);
  return formattedHandovers;
}

/**
 * Calculate performance metrics like completion rate and average time
 */
async function getPerformanceMetrics(whereCondition: any) {
  console.log(`🔍 [getPerformanceMetrics] Calculating performance metrics`);
  
  // Get 30 days ago date for trends
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Count total and completed documents
  const [totalDocuments, completedDocuments] = await Promise.all([
    // Count total documents
    prismaDB2.tr_handover.count({
      where: whereCondition
    }),
    
    // Count completed documents (status = 'done')
    prismaDB2.tr_handover.count({
      where: {
        ...whereCondition,
        status: 'done'
      }
    })
  ]);
  
  // Calculate completion rate
  const completionRate = totalDocuments > 0 ? 
    Math.round((completedDocuments / totalDocuments) * 100) : 0;
  
  // Get completed documents to calculate average completion time
  const completedHandovers = await prismaDB2.tr_handover.findMany({
    where: {
      ...whereCondition,
      status: 'done'
    },
    select: {
      created_date: true,
      updated_at: true
    },
    take: 100 // Limit for performance
  });
  
  // Calculate average completion time in days
  let totalDays = 0;
  let countForAvg = 0;
  
  completedHandovers.forEach(doc => {
    if (doc.created_date && doc.updated_at) {
      const created = new Date(doc.created_date as any);
      const updated = new Date(doc.updated_at as any);
      const diffDays = (updated.getTime() - created.getTime()) / (1000 * 3600 * 24);
      
      if (diffDays >= 0) { // Avoid negative values due to data issues
        totalDays += diffDays;
        countForAvg++;
      }
    }
  });
  
  const avgCompletionDays = countForAvg > 0 ? 
    Math.round((totalDays / countForAvg) * 10) / 10 : 0; // Round to 1 decimal
  
  console.log(`✅ [getPerformanceMetrics] Metrics calculated: completion rate=${completionRate}%, avg time=${avgCompletionDays} days`);
  
  return {
    completion_rate: completionRate,
    avg_completion_time: avgCompletionDays,
    total_documents: totalDocuments,
    completed_documents: completedDocuments
  };
}

/**
 * Get document status trends over time
 */
async function getDocumentStatusTrends(whereCondition: any) {
  console.log(`🔍 [getDocumentStatusTrends] Calculating status trends`);
  
  // Get 30 days ago date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Create array of last 30 days for the chart
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  
  // For each day, get count of documents by status
  const dailyStats = await Promise.all(days.map(async (day) => {
    const dayStart = new Date(`${day}T00:00:00Z`);
    const dayEnd = new Date(`${day}T23:59:59Z`);
    
    const [submitted, onprogress, not_approved, rejected, approved, done] = await Promise.all([
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'submitted',
          created_date: {
            lte: dayEnd
          }
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'onprogress',
          created_date: {
            lte: dayEnd
          }
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'not_approved',
          created_date: {
            lte: dayEnd
          }
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'rejected',
          created_date: {
            lte: dayEnd
          }
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'approved',
          created_date: {
            lte: dayEnd
          }
        }
      }),
      prismaDB2.tr_handover.count({
        where: {
          ...whereCondition,
          status: 'done',
          created_date: {
            lte: dayEnd
          }
        }
      })
    ]);
    
    return {
      date: day,
      submitted,
      onprogress,
      not_approved,
      rejected,
      approved,
      done
    };
  }));
  
  console.log(`✅ [getDocumentStatusTrends] Trends calculated for ${days.length} days`);
  return dailyStats;
}

/**
 * Calculate waiting time in a human-readable format
 */
function calculateWaitingTime(startDate: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} hari ${diffHours} jam`;
  } else {
    return `${diffHours} jam`;
  }
}



/**
 * Build time filter condition based on request parameters
 */
export function buildTimeFilterCondition(queryParams: any) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    
    const filterType = queryParams.filterType || 'current_month';
    
    switch (filterType) {
      case 'current_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'current_year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'current_quarter':
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
        break;
      case 'last_30_days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'custom':
        if (queryParams.startDate) {
          startDate = new Date(queryParams.startDate);
        } else if (queryParams.specificMonth && queryParams.specificYear) {
          startDate = new Date(
            Number(queryParams.specificYear), 
            Number(queryParams.specificMonth) - 1, 
            1
          );
          // Set end date to last day of selected month
          endDate = new Date(
            Number(queryParams.specificYear), 
            Number(queryParams.specificMonth), 
            0
          );
        } else {
          // Default to current month if custom params are incomplete
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        if (queryParams.endDate) {
          endDate = new Date(queryParams.endDate);
        }
        break;
      default:
        // Default to current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Normalize dates to start/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      gte: startDate,
      lte: endDate
    };
  }