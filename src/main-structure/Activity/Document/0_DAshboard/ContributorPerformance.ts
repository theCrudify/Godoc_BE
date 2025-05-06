// src/main-structure/Dashboard/ContributorPerformance.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { buildTimeFilterCondition } from "./DashboardOverview";

/**
 * Get individual contributor performance data for dashboard
 */
export const getContributorPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const timeFilter = buildTimeFilterCondition(req.query);
    const departmentId = Number(req.query.department_id);
    const userRole = req.query.role as string;
    
    console.log(`🔍 [ContributorPerformance] Getting data with timeFilter:`, timeFilter);
    
    // Build base where condition based on user role
    let baseWhereCondition: any = {
      is_deleted: false,
      created_date: timeFilter
    };
    
    // Apply role-based filtering for department admin
    if (userRole === 'dept_admin' && departmentId) {
      baseWhereCondition.department_id = departmentId;
    }
    
    // Get top document creators data
    console.log(`📊 [ContributorPerformance] Getting top document creators`);
    const topCreators = await getTopDocumentCreators(baseWhereCondition);
    
    // Get fast responders data
    console.log(`📊 [ContributorPerformance] Getting fast responders`);
    const fastResponders = await getFastResponders(baseWhereCondition);
    
    // Get contribution growth data
    console.log(`📊 [ContributorPerformance] Getting contribution growth`);
    const contributionGrowth = await getContributionGrowth(baseWhereCondition, timeFilter);
    
    // Combine all data and return response
    const responseData = {
      topCreators,
      fastResponders,
      contributionGrowth,
      timeFilter: {
        startDate: timeFilter.gte,
        endDate: timeFilter.lte
      }
    };
    
    console.log(`✅ [ContributorPerformance] Data collected successfully`);
    res.status(200).json({ data: responseData });
    
  } catch (error) {
    console.error("❌ Error getting contributor performance data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get top document creators (users who create the most documents)
 */
async function getTopDocumentCreators(whereCondition: any) {
  console.log(`🔍 [getTopDocumentCreators] Finding top creators`);
  
  // Group documents by auth_id and count
  const documentCounts = await prismaDB2.tr_handover.groupBy({
    by: ['auth_id'],
    where: {
      ...whereCondition,
      auth_id: {
        not: null
      }
    },
    _count: {
      id: true
    }
  });
  
  // Get user details for the top creators
  const authIds = documentCounts
    .map(item => item.auth_id)
    .filter(id => id !== null) as number[];
  
  const users = await prismaDB2.mst_authorization.findMany({
    where: {
      id: {
        in: authIds
      }
    },
    include: {
      department: {
        select: {
          department_name: true
        }
      }
    }
  });
  
  // Combine data and sort by count
  const topCreators = documentCounts
    .map(item => {
      const user = users.find(u => u.id === item.auth_id);
      return {
        auth_id: item.auth_id,
        employee_name: user?.employee_name || 'Unknown',
        employee_code: user?.employee_code || 'Unknown',
        department: user?.department?.department_name || 'Unknown',
        document_count: item._count.id
      };
    })
    .sort((a, b) => b.document_count - a.document_count)
    .slice(0, 10); // Limit to top 10
  
  console.log(`✅ [getTopDocumentCreators] Found ${topCreators.length} top creators`);
  return topCreators;
}

/**
 * Get users with fastest response time for approvals
 */
async function getFastResponders(whereCondition: any) {
  console.log(`🔍 [getFastResponders] Finding fastest responders`);
  
  // Get all completed approval records with user and timing data
  const approvals = await prismaDB2.tr_handover_approval.findMany({
    where: {
      tr_handover: whereCondition,
      status: {
        in: ['approved', 'not_approved', 'rejected']
      },
      auth_id: {
        not: null
      },
      created_date: { not: null },
      updated_date: { not: null }
    },
    include: {
      mst_authorization: {
        select: {
          id: true,
          employee_name: true,
          employee_code: true,
          department: {
            select: {
              department_name: true
            }
          }
        }
      }
    }
  });
  
  // Group by user and calculate average response time
  const responderData: Record<number, { 
    count: number, 
    totalHours: number,
    user: any
  }> = {};
  
  approvals.forEach(approval => {
    if (approval.auth_id && approval.created_date && approval.updated_date && approval.mst_authorization) {
      const authId = approval.auth_id;
      const startDate = new Date(approval.created_date as any);
      const endDate = new Date(approval.updated_date as any);
      
      // Only include valid dates (end > start)
      if (endDate > startDate) {
        const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        
        if (!responderData[authId]) {
          responderData[authId] = { 
            count: 0, 
            totalHours: 0,
            user: approval.mst_authorization
          };
        }
        
        responderData[authId].count += 1;
        responderData[authId].totalHours += diffHours;
      }
    }
  });
  
  // Calculate average and format results
  const formattedResults = Object.entries(responderData)
    .map(([authId, data]) => {
      const avgHours = data.count > 0 ? data.totalHours / data.count : 0;
      return {
        auth_id: Number(authId),
        employee_name: data.user.employee_name,
        employee_code: data.user.employee_code,
        department: data.user.department?.department_name || 'Unknown',
        response_count: data.count,
        avg_response_hours: Math.round(avgHours * 10) / 10 // Round to 1 decimal
      };
    })
    .filter(item => item.response_count >= 3) // Only include users with minimum 3 responses
    .sort((a, b) => a.avg_response_hours - b.avg_response_hours) // Sort by fastest first
    .slice(0, 5); // Limit to top 5
  
  console.log(`✅ [getFastResponders] Found ${formattedResults.length} fast responders`);
  return formattedResults;
}

/**
 * Get users with highest growth in contribution
 */
async function getContributionGrowth(whereCondition: any, timeFilter: any) {
  console.log(`🔍 [getContributionGrowth] Calculating contribution growth`);
  
  // Get current time period start/end
  const currentStartDate = new Date(timeFilter.gte);
  const currentEndDate = new Date(timeFilter.lte);
  
  // Calculate previous time period with same duration
  const periodDuration = currentEndDate.getTime() - currentStartDate.getTime();
  const previousEndDate = new Date(currentStartDate);
  previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
  
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setTime(previousStartDate.getTime() - periodDuration);
  
  // Get document counts for current period
  const currentPeriodCounts = await prismaDB2.tr_handover.groupBy({
    by: ['auth_id'],
    where: {
      is_deleted: false,
      auth_id: { not: null },
      created_date: {
        gte: currentStartDate,
        lte: currentEndDate
      }
    },
    _count: {
      id: true
    }
  });
  
  // Get document counts for previous period
  const previousPeriodCounts = await prismaDB2.tr_handover.groupBy({
    by: ['auth_id'],
    where: {
      is_deleted: false,
      auth_id: { not: null },
      created_date: {
        gte: previousStartDate,
        lte: previousEndDate
      }
    },
    _count: {
      id: true
    }
  });
  
  // Collect all unique auth_ids
  const allAuthIds = [...new Set([
    ...currentPeriodCounts.map(item => item.auth_id),
    ...previousPeriodCounts.map(item => item.auth_id)
  ])].filter(id => id !== null) as number[];
  
  // Get user details
  const users = await prismaDB2.mst_authorization.findMany({
    where: {
      id: {
        in: allAuthIds
      }
    },
    include: {
      department: {
        select: {
          department_name: true
        }
      }
    }
  });
  
  // Calculate growth for each user
  const growthData = allAuthIds.map(authId => {
    const currentCount = currentPeriodCounts.find(item => item.auth_id === authId)?._count.id || 0;
    const previousCount = previousPeriodCounts.find(item => item.auth_id === authId)?._count.id || 0;
    
    let growthPercentage = 0;
    if (previousCount > 0) {
      growthPercentage = ((currentCount - previousCount) / previousCount) * 100;
    } else if (currentCount > 0) {
      growthPercentage = 100; // 100% growth for new contributors
    }
    
    const user = users.find(u => u.id === authId);
    
    return {
      auth_id: authId,
      employee_name: user?.employee_name || 'Unknown',
      employee_code: user?.employee_code || 'Unknown',
      department: user?.department?.department_name || 'Unknown',
      current_period_count: currentCount,
      previous_period_count: previousCount,
      growth_percentage: Math.round(growthPercentage)
    };
  });
  
  // Filter, sort, and limit results
  const topContributors = growthData
    .filter(item => item.current_period_count > 0) // Only include active contributors
    .sort((a, b) => b.growth_percentage - a.growth_percentage) // Sort by highest growth
    .slice(0, 5); // Limit to top 5
  
  console.log(`✅ [getContributionGrowth] Found ${topContributors.length} growing contributors`);
  return topContributors;
}