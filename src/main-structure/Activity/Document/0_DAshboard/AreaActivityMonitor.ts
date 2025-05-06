// src/main-structure/Dashboard/AreaActivityMonitor.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { buildTimeFilterCondition } from "./DashboardOverview";

/**
 * Get area activity monitoring data for dashboard
 */
export const getAreaActivityData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const timeFilter = buildTimeFilterCondition(req.query);
    const departmentId = Number(req.query.department_id);
    const userRole = req.query.role as string;
    
    console.log(`🔍 [AreaActivityMonitor] Getting data with timeFilter:`, timeFilter);
    
    // Build base where condition based on user role
    let baseWhereCondition: any = {
      is_deleted: false,
      created_date: timeFilter
    };
    
    // Apply role-based filtering for department admin
    if (userRole === 'dept_admin' && departmentId) {
      baseWhereCondition.department_id = departmentId;
    }
    
    // Get active areas data
    console.log(`📊 [AreaActivityMonitor] Getting active areas data`);
    const activeAreas = await getActiveAreas(baseWhereCondition);
    
    // Get growth areas data
    console.log(`📊 [AreaActivityMonitor] Getting growth areas data`);
    const growthAreas = await getGrowthAreas(baseWhereCondition, timeFilter);
    
    // Get area response time data
    console.log(`📊 [AreaActivityMonitor] Getting area response times`);
    const areaResponseTimes = await getAreaResponseTimes(baseWhereCondition);
    
    // Combine all data and return response
    const responseData = {
      activeAreas,
      growthAreas,
      areaResponseTimes,
      timeFilter: {
        startDate: timeFilter.gte,
        endDate: timeFilter.lte
      }
    };
    
    console.log(`✅ [AreaActivityMonitor] Data collected successfully`);
    res.status(200).json({ data: responseData });
    
  } catch (error) {
    console.error("❌ Error getting area activity data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get the most active areas based on document count
 */
async function getActiveAreas(whereCondition: any) {
  console.log(`🔍 [getActiveAreas] Finding most active areas`);
  
  // Extract line codes from documents
  const documents = await prismaDB2.tr_handover.findMany({
    where: whereCondition,
    select: {
      doc_number: true
    }
  });
  
  // Parse line codes from doc_number format
  const lineCounts: Record<string, number> = {};
  
  documents.forEach(doc => {
    if (doc.doc_number) {
      // Assuming format like "XX/LINE_CODE/..."
      const parts = doc.doc_number.split('/');
      if (parts.length >= 2) {
        const lineCode = parts[1];
        lineCounts[lineCode] = (lineCounts[lineCode] || 0) + 1;
      }
    }
  });
  
  // Get all line data from the database
  const lines = await prismaDB2.mst_line.findMany({
    where: {
      is_deleted: false,
      code_line: {
        in: Object.keys(lineCounts)
      }
    },
    include: {
      areas: true,
      section_manufacture: {
        select: {
          section_name: true,
          department: {
            select: {
              department_name: true
            }
          }
        }
      }
    }
  });
  
  // Format and sort the results
  const activeAreas = Object.entries(lineCounts)
    .map(([lineCode, count]) => {
      const lineData = lines.find(line => line.code_line === lineCode);
      
      return {
        line_code: lineCode,
        line_name: lineData?.line || lineCode,
        section_name: lineData?.section_manufacture?.section_name || 'Unknown',
        department_name: lineData?.section_manufacture?.department?.department_name || 'Unknown',
        areas: lineData?.areas?.map(area => area.area).join(', ') || 'N/A',
        document_count: count
      };
    })
    .sort((a, b) => b.document_count - a.document_count);
  
  console.log(`✅ [getActiveAreas] Found ${activeAreas.length} active areas`);
  return activeAreas;
}

/**
 * Get areas with highest growth in document activity
 */
async function getGrowthAreas(whereCondition: any, timeFilter: any) {
  console.log(`🔍 [getGrowthAreas] Calculating area growth`);
  
  // Get current time period start/end
  const currentStartDate = new Date(timeFilter.gte);
  const currentEndDate = new Date(timeFilter.lte);
  
  // Calculate previous time period with same duration
  const periodDuration = currentEndDate.getTime() - currentStartDate.getTime();
  const previousEndDate = new Date(currentStartDate);
  previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
  
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setTime(previousStartDate.getTime() - periodDuration);
  
  // Get documents for current period
  const currentDocs = await prismaDB2.tr_handover.findMany({
    where: {
      is_deleted: false,
      created_date: {
        gte: currentStartDate,
        lte: currentEndDate
      }
    },
    select: {
      doc_number: true
    }
  });
  
  // Get documents for previous period
  const previousDocs = await prismaDB2.tr_handover.findMany({
    where: {
      is_deleted: false,
      created_date: {
       gte: previousStartDate,
       lte: previousEndDate
     }
   },
   select: {
     doc_number: true
   }
 });
 
 // Process current period data
 const currentLineCounts: Record<string, number> = {};
 
 currentDocs.forEach(doc => {
   if (doc.doc_number) {
     const parts = doc.doc_number.split('/');
     if (parts.length >= 2) {
       const lineCode = parts[1];
       currentLineCounts[lineCode] = (currentLineCounts[lineCode] || 0) + 1;
     }
   }
 });
 
 // Process previous period data
 const previousLineCounts: Record<string, number> = {};
 
 previousDocs.forEach(doc => {
   if (doc.doc_number) {
     const parts = doc.doc_number.split('/');
     if (parts.length >= 2) {
       const lineCode = parts[1];
       previousLineCounts[lineCode] = (previousLineCounts[lineCode] || 0) + 1;
     }
   }
 });
 
 // Get all unique line codes
 const allLineCodes = [...new Set([
   ...Object.keys(currentLineCounts),
   ...Object.keys(previousLineCounts)
 ])];
 
 // Get line data from the database
 const lines = await prismaDB2.mst_line.findMany({
   where: {
     is_deleted: false,
     code_line: {
       in: allLineCodes
     }
   },
   include: {
     areas: true,
     section_manufacture: {
       select: {
         section_name: true,
         department: {
           select: {
             department_name: true
           }
         }
       }
     }
   }
 });
 
 // Calculate growth for each line
 const growthData = allLineCodes.map(lineCode => {
   const currentCount = currentLineCounts[lineCode] || 0;
   const previousCount = previousLineCounts[lineCode] || 0;
   
   let growthPercentage = 0;
   if (previousCount > 0) {
     growthPercentage = ((currentCount - previousCount) / previousCount) * 100;
   } else if (currentCount > 0) {
     growthPercentage = 100; // 100% growth for new areas
   }
   
   const lineData = lines.find(line => line.code_line === lineCode);
   
   return {
     line_code: lineCode,
     line_name: lineData?.line || lineCode,
     section_name: lineData?.section_manufacture?.section_name || 'Unknown',
     department_name: lineData?.section_manufacture?.department?.department_name || 'Unknown',
     current_period_count: currentCount,
     previous_period_count: previousCount,
     growth_percentage: Math.round(growthPercentage),
     growth_raw: currentCount - previousCount
   };
 });
 
 // Filter, sort, and limit results
 const topGrowthAreas = growthData
   .filter(item => item.current_period_count > 0) // Only include active areas
   .sort((a, b) => b.growth_percentage - a.growth_percentage) // Sort by highest growth percentage
   .slice(0, 5); // Limit to top 5
 
 console.log(`✅ [getGrowthAreas] Found ${topGrowthAreas.length} growing areas`);
 return topGrowthAreas;
}

/**
* Get average response time for documents by area
*/
async function getAreaResponseTimes(whereCondition: any) {
 console.log(`🔍 [getAreaResponseTimes] Calculating area response times`);
 
 // Get all completed handover documents with their approval data
 const handovers = await prismaDB2.tr_handover.findMany({
   where: {
     ...whereCondition,
     status: 'done' // Only include completed documents
   },
   select: {
     id: true,
     doc_number: true,
     created_date: true,
     updated_at: true // Last update time
   }
 });
 
 // Process document data by line code
 const lineData: Record<string, { 
   totalHours: number, 
   count: number, 
   documents: any[] 
 }> = {};
 
 handovers.forEach(doc => {
   if (doc.doc_number && doc.created_date && doc.updated_at) {
     const parts = doc.doc_number.split('/');
     if (parts.length >= 2) {
       const lineCode = parts[1];
       
       // Calculate time from creation to completion
       const startDate = new Date(doc.created_date as any);
       const endDate = new Date(doc.updated_at as any);
       
       // Only include valid dates (end > start)
       if (endDate > startDate) {
         const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
         
         if (!lineData[lineCode]) {
           lineData[lineCode] = { totalHours: 0, count: 0, documents: [] };
         }
         
         lineData[lineCode].totalHours += diffHours;
         lineData[lineCode].count += 1;
         lineData[lineCode].documents.push(doc);
       }
     }
   }
 });
 
 // Get line information
 const lineCodes = Object.keys(lineData);
 const lines = await prismaDB2.mst_line.findMany({
   where: {
     is_deleted: false,
     code_line: {
       in: lineCodes
     }
   },
   include: {
     section_manufacture: {
       select: {
         section_name: true,
         department: {
           select: {
             department_name: true
           }
         }
       }
     }
   }
 });
 
 // Format and sort results
 const areaResponseTimes = Object.entries(lineData)
   .map(([lineCode, data]) => {
     const avgHours = data.count > 0 ? data.totalHours / data.count : 0;
     const lineInfo = lines.find(line => line.code_line === lineCode);
     
     return {
       line_code: lineCode,
       line_name: lineInfo?.line || lineCode,
       section_name: lineInfo?.section_manufacture?.section_name || 'Unknown',
       department_name: lineInfo?.section_manufacture?.department?.department_name || 'Unknown',
       avg_response_hours: Math.round(avgHours * 10) / 10, // Round to 1 decimal
       document_count: data.count
     };
   })
   .filter(item => item.document_count >= 3) // Only include areas with minimum 3 documents
   .sort((a, b) => a.avg_response_hours - b.avg_response_hours); // Sort by fastest first
 
 console.log(`✅ [getAreaResponseTimes] Calculated response times for ${areaResponseTimes.length} areas`);
 return areaResponseTimes;
}