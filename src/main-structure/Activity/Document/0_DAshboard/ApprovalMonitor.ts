// src/main-structure/Dashboard/ApprovalMonitor.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { buildTimeFilterCondition } from "./DashboardOverview";

/**
 * Get approval monitoring data for dashboard
 */
export const getApprovalMonitorData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const timeFilter = buildTimeFilterCondition(req.query);
    const authId = Number(req.query.auth_id);
    const departmentId = Number(req.query.department_id);
    const userRole = req.query.role as string;
    
    console.log(`🔍 [ApprovalMonitor] Getting data with timeFilter:`, timeFilter);
    
    // Build base where condition based on user role
    let baseWhereCondition: any = {
      is_deleted: false,
      created_date: timeFilter
    };
    
    // Apply role-based filtering
    if (userRole === 'user' && authId) {
      baseWhereCondition.auth_id = authId;
    } else if (userRole === 'dept_admin' && departmentId) {
      baseWhereCondition.department_id = departmentId;
    }
    
    // Get approval pipeline data
    console.log(`📊 [ApprovalMonitor] Getting approval pipeline data`);
    const approvalPipeline = await getApprovalPipelineData(baseWhereCondition);
    
    // Get documents in approval process
    console.log(`📊 [ApprovalMonitor] Getting documents in approval process`);
    const documentsInApproval = await getDocumentsInApproval(baseWhereCondition, authId, userRole);
    
    // Get bottleneck indicators
    console.log(`📊 [ApprovalMonitor] Calculating bottleneck indicators`);
    const bottleneckIndicators = await getBottleneckIndicators(baseWhereCondition);
    
    // Combine all data and return response
    const responseData = {
      approvalPipeline,
      documentsInApproval,
      bottleneckIndicators,
      timeFilter: {
        startDate: timeFilter.gte,
        endDate: timeFilter.lte
      }
    };
    
    console.log(`✅ [ApprovalMonitor] Data collected successfully`);
    res.status(200).json({ data: responseData });
    
  } catch (error) {
    console.error("❌ Error getting approval monitor data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * Get approval pipeline data showing document counts at each approval step
 */
async function getApprovalPipelineData(whereCondition: any) {
  console.log(`🔍 [getApprovalPipelineData] Calculating pipeline data`);
  
  // Get count of documents at each step in the approval pipeline
  const pipeline = await prismaDB2.tr_handover_approval.groupBy({
    by: ['step'],
    where: {
      tr_handover: {
        is_deleted: false,
        created_date: whereCondition.created_date
      },
      status: {
        in: ['on_going', 'pending']
      }
    },
    _count: {
      handover_id: true
    },
    orderBy: {
      step: 'asc'
    }
  });
  
  // Format pipeline data for the frontend
  const formattedPipeline = pipeline.map(item => ({
    step: item.step,
    count: item._count.handover_id
  }));
  
  console.log(`✅ [getApprovalPipelineData] Found data for ${formattedPipeline.length} pipeline steps`);
  return formattedPipeline;
}

/**
 * Get documents currently in the approval process 
 */
async function getDocumentsInApproval(whereCondition: any, authId: number, userRole: string) {
  console.log(`🔍 [getDocumentsInApproval] Getting documents in approval`);
  
  // Build specific where conditions for documents in approval
  let approvalWhereCondition: any = {
    ...whereCondition,
    status: {
      in: ['onprogress', 'not_approved']
    }
  };
  
  // For regular users, include documents where they are current approvers
  if (userRole === 'user' && authId) {
    approvalWhereCondition = {
      is_deleted: false,
      created_date: whereCondition.created_date,
      status: {
        in: ['onprogress', 'not_approved']
      },
      OR: [
        { auth_id: authId }, // Documents they created
        {
          tr_handover_approval: {
            some: {
              auth_id: authId,
              status: 'on_going'
            }
          }
        } // Documents they need to approve
      ]
    };
  }
  
  // Get handover documents in approval
  const handovers = await prismaDB2.tr_handover.findMany({
    where: approvalWhereCondition,
    include: {
      mst_department: {
        select: { department_name: true }
      },
      mst_authorization_tr_handover_auth_idTomst_authorization: {
        select: { employee_name: true }
      },
      tr_handover_approval: {
        include: {
          mst_authorization: {
            select: { employee_name: true }
          }
        },
        orderBy: { step: 'asc' }
      }
    },
    orderBy: [
      { status: 'asc' },
      { created_date: 'asc' }
    ],
    take: 50 // Limit to prevent performance issues
  });
  
  // Format the data for the frontend
  const formattedHandovers = handovers.map(doc => {
    const currentApproval = doc.tr_handover_approval.find(a => a.status === 'on_going');
    const nextApproval = currentApproval
      ? doc.tr_handover_approval.find(a => a.step === (currentApproval.step || 0) + 1)
      : doc.tr_handover_approval[0];
    
    const waitingTime = currentApproval?.created_date 
      ? calculateWaitingTime(new Date(currentApproval.created_date as any))
      : null;
    
    const currentStep = currentApproval?.step || 0;
    const totalSteps = doc.tr_handover_approval.length;
    const progressPercentage = totalSteps > 0 
      ? Math.round((currentStep / totalSteps) * 100)
      : 0;
    
    return {
      id: doc.id,
      doc_number: doc.doc_number,
      type: 'handover',
      submitter: doc.mst_authorization_tr_handover_auth_idTomst_authorization?.employee_name || 'Unknown',
      department: doc.mst_department?.department_name || 'Unknown',
      status: doc.status,
      currentStep,
      totalSteps,
      progressPercentage,
      current_approver: currentApproval?.mst_authorization?.employee_name || 'None',
      next_approver: nextApproval?.mst_authorization?.employee_name || 'Final',
      waiting_time: waitingTime,
      created_date: doc.created_date,
      is_current_approver: currentApproval?.auth_id === authId
    };
  });
  
  console.log(`✅ [getDocumentsInApproval] Found ${formattedHandovers.length} documents in approval`);
  return formattedHandovers;
}

/**
 * Identify bottlenecks in the approval process
 */
async function getBottleneckIndicators(whereCondition: any) {
  console.log(`🔍 [getBottleneckIndicators] Calculating approval bottlenecks`);
  
  // Get average time for each approval step
  const handoverApprovals = await prismaDB2.tr_handover_approval.findMany({
    where: {
      tr_handover: {
        is_deleted: false,
        created_date: whereCondition.created_date
      },
      status: {
        in: ['approved', 'not_approved', 'rejected']
      },
      updated_date: { not: null }
    },
    select: {
      step: true,
      status: true,
      created_date: true,
      updated_date: true,
      mst_authorization: {
        select: {
          employee_name: true,
          department: {
            select: { department_name: true }
          }
        }
      }
    }
  });
  
  // Group by step and calculate average time
  const stepGroups: Record<number, { count: number, totalHours: number, statuses: Record<string, number> }> = {};
  
  handoverApprovals.forEach(approval => {
    if (approval.created_date && approval.updated_date) {
      const step = approval.step || 0;
      const startDate = new Date(approval.created_date as any);
      const endDate = new Date(approval.updated_date as any);
      
      // Calculate hours difference
      const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (!stepGroups[step]) {
        stepGroups[step] = { 
          count: 0, 
          totalHours: 0,
          statuses: { approved: 0, not_approved: 0, rejected: 0 }
        };
      }
      
      stepGroups[step].count += 1;
      stepGroups[step].totalHours += diffHours;
      
      // Count status occurrences
      if (approval.status) {
        stepGroups[step].statuses[approval.status] = 
          (stepGroups[step].statuses[approval.status] || 0) + 1;
      }
    }
  });
  
  // Calculate average response time per step and identify bottlenecks
  const stepMetrics = Object.entries(stepGroups).map(([step, data]) => {
    const avgHours = data.count > 0 ? data.totalHours / data.count : 0;
    const totalResponses = data.count;
    
    // Calculate approval rate
    const approvedCount = data.statuses.approved || 0;
    const approvalRate = totalResponses > 0 ? (approvedCount / totalResponses) * 100 : 0;
    
    return {
      step: Number(step),
      avg_hours: Math.round(avgHours * 10) / 10, // Round to 1 decimal
      total_responses: totalResponses,
      approval_rate: Math.round(approvalRate),
      status_breakdown: data.statuses
    };
  }).sort((a, b) => a.step - b.step);
  
  // Identify the step with the longest average response time (bottleneck)
  const bottleneckStep = [...stepMetrics].sort((a, b) => b.avg_hours - a.avg_hours)[0];
  
  console.log(`✅ [getBottleneckIndicators] Bottleneck identified at step ${bottleneckStep?.step || 'N/A'}`);
  return {
    step_metrics: stepMetrics,
    bottleneck_step: bottleneckStep ? bottleneckStep.step : null,
    bottleneck_avg_hours: bottleneckStep ? bottleneckStep.avg_hours : 0,
   bottleneck_approval_rate: bottleneckStep ? bottleneckStep.approval_rate : 0,
 };
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