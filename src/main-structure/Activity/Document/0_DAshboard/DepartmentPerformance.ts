// src/main-structure/Dashboard/DepartmentPerformance.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { buildTimeFilterCondition } from "./DashboardOverview";

/**
 * Get department performance data for dashboard
 */
export const getDepartmentPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const timeFilter = buildTimeFilterCondition(req.query);
    const departmentId = Number(req.query.department_id);
    const userRole = req.query.role as string;
    
    console.log(`🔍 [DepartmentPerformance] Getting data with timeFilter:`, timeFilter);
    
    // Build base where condition based on user role
    let baseWhereCondition: any = {
      is_deleted: false,
      created_date: timeFilter
    };
    
    // Apply role-based filtering for department admin
    if (userRole === 'dept_admin' && departmentId) {
      baseWhereCondition.department_id = departmentId;
    }
    
    // Get department ranking data
    console.log(`📊 [DepartmentPerformance] Getting department ranking data`);
    const departmentRanking = await getDepartmentRanking(baseWhereCondition);
    
    // Get department response time data
    console.log(`📊 [DepartmentPerformance] Getting department response time data`);
    const departmentResponseTime = await getDepartmentResponseTime(baseWhereCondition, timeFilter);
    
    // Get department completion rate data
    console.log(`📊 [DepartmentPerformance] Getting department completion rate data`);
    const departmentCompletionRate = await getDepartmentCompletionRate(baseWhereCondition);
    
    // Combine all data and return response
    const responseData = {
      departmentRanking,
      departmentResponseTime,
      departmentCompletionRate,
      timeFilter: {
        startDate: timeFilter.gte,
        endDate: timeFilter.lte
      }
    };
    
    console.log(`✅ [DepartmentPerformance] Data collected successfully`);
    res.status(200).json({ data: responseData });
    
  } catch (error) {
    console.error("❌ Error getting department performance data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get department ranking based on document count
 */
async function getDepartmentRanking(whereCondition: any) {
  console.log(`🔍 [getDepartmentRanking] Calculating department ranking`);
  
  // Group documents by department and count
  const documentCounts = await prismaDB2.tr_handover.groupBy({
    by: ['department_id'],
    where: {
      ...whereCondition,
      department_id: {
        not: null
      }
    },
    _count: {
      id: true
    }
  });
  
  // Get department details
  const departmentIds = documentCounts.map(item => item.department_id).filter(id => id !== null) as number[];
  
  const departments = await prismaDB2.mst_department.findMany({
    where: {
      id: {
        in: departmentIds
      }
    },
    select: {
      id: true,
      department_name: true,
      department_code: true
    }
  });
  
  // Join data and sort by count
  const ranking = documentCounts
    .map(item => {
      const department = departments.find(d => d.id === item.department_id);
      return {
        department_id: item.department_id,
        department_name: department?.department_name || 'Unknown',
        department_code: department?.department_code || 'Unknown',
        document_count: item._count.id
      };
    })
    .sort((a, b) => b.document_count - a.document_count);
  
  console.log(`✅ [getDepartmentRanking] Ranked ${ranking.length} departments`);
  return ranking;
}

/**
 * Get average response time per department
 */
async function getDepartmentResponseTime(whereCondition: any, timeFilter: any) {
  console.log(`🔍 [getDepartmentResponseTime] Calculating response times`);
  
  // Get previous time period for comparison
  const currentStartDate = new Date(timeFilter.gte);
  const currentEndDate = new Date(timeFilter.lte);
  
  // Calculate the duration of current period in milliseconds
  const periodDuration = currentEndDate.getTime() - currentStartDate.getTime();
  
  // Set previous period with same duration
  const previousEndDate = new Date(currentStartDate);
  previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1); // Just before current start
  
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setTime(previousStartDate.getTime() - periodDuration);
  
  // Get all approval records for current period
  const currentApprovals = await prismaDB2.tr_handover_approval.findMany({
    where: {
      status: {
        in: ['approved', 'not_approved', 'rejected']
      },
      tr_handover: {
        is_deleted: false,
        department_id: {
          not: null
        },
        created_date: {
          gte: timeFilter.gte,
          lte: timeFilter.lte
        }
      },
      created_date: { not: null },
      updated_date: { not: null }
    },
    include: {
      tr_handover: {
        select: {
          department_id: true
        }
      }
    }
  });
  
  // Get all approval records for previous period
  const previousApprovals = await prismaDB2.tr_handover_approval.findMany({
    where: {
      status: {
        in: ['approved', 'not_approved', 'rejected']
      },
      tr_handover: {
        is_deleted: false,
        department_id: {
          not: null
        },
        created_date: {
          gte: previousStartDate,
          lte: previousEndDate
        }
      },
      created_date: { not: null },
      updated_date: { not: null }
    },
    include: {
      tr_handover: {
        select: {
          department_id: true
        }
      }
    }
  });
  
  // Process current period data
  const currentDepartmentData: Record<number, { count: number, totalHours: number }> = {};
  
  currentApprovals.forEach(approval => {
    if (approval.created_date && approval.updated_date && approval.tr_handover?.department_id) {
      const departmentId = approval.tr_handover.department_id;
      const startDate = new Date(approval.created_date as any);
      const endDate = new Date(approval.updated_date as any);
      const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (!currentDepartmentData[departmentId]) {
        currentDepartmentData[departmentId] = { count: 0, totalHours: 0 };
      }
      
      currentDepartmentData[departmentId].count += 1;
      currentDepartmentData[departmentId].totalHours += diffHours;
    }
  });
  
  // Process previous period data
  const previousDepartmentData: Record<number, { count: number, totalHours: number }> = {};
  
  previousApprovals.forEach(approval => {
    if (approval.created_date && approval.updated_date && approval.tr_handover?.department_id) {
      const departmentId = approval.tr_handover.department_id;
      const startDate = new Date(approval.created_date as any);
      const endDate = new Date(approval.updated_date as any);
      const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (!previousDepartmentData[departmentId]) {
        previousDepartmentData[departmentId] = { count: 0, totalHours: 0 };
      }
      
      previousDepartmentData[departmentId].count += 1;
      previousDepartmentData[departmentId].totalHours += diffHours;
    }
  });
  
  // Get department details
  const departmentIds = [
    ...Object.keys(currentDepartmentData),
    ...Object.keys(previousDepartmentData)
  ].map(Number);
  
  const uniqueDepartmentIds = [...new Set(departmentIds)];
  
  const departments = await prismaDB2.mst_department.findMany({
    where: {
      id: {
        in: uniqueDepartmentIds
      }
    },
    select: {
      id: true,
      department_name: true,
      department_code: true
    }
  });
  
  // Combine and format the results
  const result = uniqueDepartmentIds.map(deptId => {
    const department = departments.find(d => d.id === deptId);
    
    const currentData = currentDepartmentData[deptId];
    const currentAvgHours = currentData && currentData.count > 0 
      ? currentData.totalHours / currentData.count
      : 0;
    
    const previousData = previousDepartmentData[deptId];
    const previousAvgHours = previousData && previousData.count > 0 
      ? previousData.totalHours / previousData.count
      : 0;
    
    // Calculate trend percentage
    let trendPercentage = 0;
    if (previousAvgHours > 0) {
      // Negative percentage means improvement (less hours)
      trendPercentage = ((currentAvgHours - previousAvgHours) / previousAvgHours) * 100;
    }
    
    return {
      department_id: deptId,
      department_name: department?.department_name || 'Unknown',
      department_code: department?.department_code || 'Unknown',
      avg_response_hours: Math.round(currentAvgHours * 10) / 10, // Round to 1 decimal
      response_count: currentData?.count || 0,
      trend_percentage: Math.round(trendPercentage * 10) / 10,
      trend_direction: trendPercentage < 0 ? 'improved' : 'declined'
    };
  }).sort((a, b) => a.avg_response_hours - b.avg_response_hours); // Sort by fastest response time
  
  console.log(`✅ [getDepartmentResponseTime] Calculated response times for ${result.length} departments`);
  return result;
}

/**
 * Get completion rate by department
 */
async function getDepartmentCompletionRate(whereCondition: any) {
  console.log(`🔍 [getDepartmentCompletionRate] Calculating completion rates`);
  
  // Get all departments
  const departments = await prismaDB2.mst_department.findMany({
    where: {
      status: true
    },
    select: {
      id: true,
      department_name: true,
      department_code: true
    }
  });
  
  // Calculate document counts per department
  const completionRates = await Promise.all(departments.map(async (dept) => {
    // Total documents for this department
    const totalCount = await prismaDB2.tr_handover.count({
      where: {
        ...whereCondition,
        department_id: dept.id
      }
    });
    
    // Completed documents for this department
    const completedCount = await prismaDB2.tr_handover.count({
      where: {
        ...whereCondition,
        department_id: dept.id,
        status: 'done'
      }
    });
    
    // Calculate completion rate
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      department_id: dept.id,
      department_name: dept.department_name,
      department_code: dept.department_code,
      total_documents: totalCount,
      completed_documents: completedCount,
      completion_rate: Math.round(completionRate)
    };
  }));
  
  // Sort by completion rate (highest first)
  const sortedResults = completionRates
    .filter(dept => dept.total_documents > 0) // Only include departments with documents
    .sort((a, b) => b.completion_rate - a.completion_rate);
  
  console.log(`✅ [getDepartmentCompletionRate] Calculated rates for ${sortedResults.length} active departments`);
  return sortedResults;
}