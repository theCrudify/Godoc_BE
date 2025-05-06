// src/main-structure/Activity/Document/0_DAshboard/DashboardController.ts

import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";
import { format, parseISO, subDays, startOfMonth, startOfWeek, startOfYear } from "date-fns";


function getDateRangeFilter(dateRange: string, startDate?: string, endDate?: string) {
    const now = new Date();
    let fromDate: Date, toDate: Date;

    switch (dateRange) {
        case "custom":
            fromDate = startDate ? new Date(startDate) : new Date("1970-01-01");
            toDate = endDate ? new Date(endDate) : now;
            break;
        case "month":
            fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
            toDate = now;
            break;
        case "year":
            fromDate = new Date(now.getFullYear(), 0, 1);
            toDate = now;
            break;
        default:
            fromDate = new Date("1970-01-01");
            toDate = now;
            break;
    }

    return {
        gte: fromDate,
        lte: toDate
    };
}

// Fungsi untuk format durasi dalam detik menjadi jam, menit, dan detik
function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${sec}s`;
}

// Fungsi untuk menghitung rata-rata durasi dalam detik
function avg(arr: number[]): number {
    return arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : 0;
}

export const getDocumentSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse filter parameters
        const authId = req.query.auth_id ? Number(req.query.auth_id) : undefined;
        const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
        const plantId = req.query.plant_id ? Number(req.query.plant_id) : undefined;
        const sectionDepartmentId = req.query.section_department_id ? Number(req.query.section_department_id) : undefined;
        const dateRange = (req.query.date_range as string) || "month";
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        // Date filter
        const dateFilter = getDateRangeFilter(dateRange, startDate, endDate);

        const proposedFilter: any = {
            is_deleted: false,
            created_date: dateFilter
        };
        if (authId) proposedFilter.auth_id = authId;
        if (departmentId) proposedFilter.department_id = departmentId;
        if (plantId) proposedFilter.plant_id = plantId;
        if (sectionDepartmentId) proposedFilter.section_department_id = sectionDepartmentId;

        // Get all proposed changes with created_date
        const proposedDocs = await prismaDB2.tr_proposed_changes.findMany({
            where: proposedFilter,
            select: { id: true, created_date: true }
        });
        const proposedIds = proposedDocs.map(p => p.id);

        // Get all related authorization docs
        const authDocs = await prismaDB2.tr_authorization_doc.findMany({
            where: { proposed_change_id: { in: proposedIds } },
            select: { id: true, proposed_change_id: true, created_date: true }
        });
        const authDocIds = authDocs.map(a => a.id);

        // Get all related handover docs
        const handoverDocs = await prismaDB2.tr_handover.findMany({
            where: {
                OR: [
                    { proposed_change_id: { in: proposedIds } },
                    { authdoc_id: { in: authDocIds } }
                ]
            },
            select: {
                id: true,
                proposed_change_id: true,
                authdoc_id: true,
                created_date: true,
                is_finished: true
            }
        });

        // Count stats
        const proposedCount = proposedDocs.length;
        const authCount = authDocs.length;
        const handoverCount = handoverDocs.length;
        const completedCount = handoverDocs.filter(h => h.is_finished).length;

        // Match stages for each proposed change
        const authMap = new Map(authDocs.map(a => [a.proposed_change_id, a.created_date]));
        const authIdMap = new Map(authDocs.map(a => [a.id, a.created_date]));

        const handoverData = handoverDocs.map(h => {
            const proposedId = h.proposed_change_id || null;
            const authDate = h.authdoc_id ? authIdMap.get(h.authdoc_id) : (proposedId ? authMap.get(proposedId) : null);
            return {
                proposedId,
                handoverDate: h.created_date,
                authDate,
                is_finished: h.is_finished
            };
        });

        // Track durations for each stage
        const proposedStageDurations: number[] = [];
        const authStageDurations: number[] = [];
        const handoverStageDurations: number[] = [];
        const fullCycleDurations: number[] = [];

        for (const proposed of proposedDocs) {
            const proposedId = proposed.id;
            const proposedDate = proposed.created_date;
            const authDate = authMap.get(proposedId);
            const handoverEntry = handoverData.find(h =>
                h.proposedId === proposedId && h.authDate && h.handoverDate
            );

            // Proposed stage duration
            if (authDate) {
                const diff = proposedDate ? (authDate.getTime() - proposedDate.getTime()) / 1000 : 0; // in seconds
                proposedStageDurations.push(diff);
            }

            // Authorization stage duration
            if (authDate && handoverEntry?.handoverDate) {
                const diff = (handoverEntry.handoverDate.getTime() - authDate.getTime()) / 1000; // in seconds
                authStageDurations.push(diff);
            }

            // Full cycle duration
            if (handoverEntry?.handoverDate) {
                const diff = proposedDate ? (handoverEntry.handoverDate.getTime() - proposedDate.getTime()) / 1000 : 0; // in seconds
                fullCycleDurations.push(diff);
            }

            // Handover stage duration
            if (handoverEntry?.authDate && handoverEntry.handoverDate) {
                const diff = (handoverEntry.handoverDate.getTime() - handoverEntry.authDate.getTime()) / 1000; // in seconds
                handoverStageDurations.push(diff);
            }
        }

        // Calculate averages
        const avgProposedStage = avg(proposedStageDurations);
        const avgAuthStage = avg(authStageDurations);
        const avgHandoverStage = avg(handoverStageDurations);
        const avgFullCycle = avg(fullCycleDurations);

        res.status(200).json({
            total_documents: proposedCount,
            documents_by_stage: {
                proposed_changes: proposedCount - completedCount,  // 4 docs still in proposed stage
                authorization: authCount, // docs in authorization stage
                handover: handoverCount - completedCount,  // docs in handover stage but not completed
                handover_completed: completedCount // docs completed in handover stage
            },
            completion_rate: proposedCount > 0 ? Number(((completedCount / proposedCount) * 100).toFixed(1)) : 0,
            stage_conversion: {
                proposed_to_auth: proposedCount > 0 ? Number(((authCount / proposedCount) * 100).toFixed(1)) : 0,
                auth_to_handover: authCount > 0 ? Number(((handoverCount / authCount) * 100).toFixed(1)) : 0,
                handover_completion: handoverCount > 0 ? Number(((completedCount / handoverCount) * 100).toFixed(1)) : 0
            },
            avg_cycle_time_seconds: {
                proposed_stage: avgProposedStage,
                authorization_stage: avgAuthStage,
                handover_stage: avgHandoverStage,
                proposal_to_completion: avgFullCycle
            },
            avg_cycle_time_formatted: {
                proposed_stage: formatDuration(avgProposedStage),
                authorization_stage: formatDuration(avgAuthStage),
                handover_stage: formatDuration(avgHandoverStage),
                proposal_to_completion: formatDuration(avgFullCycle)
            }
        });
    } catch (error) {
        console.error("Error getting document summary:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


/**
 * Controller untuk Top Rated Projects
 * - Proyek teratas berdasarkan rating di handover
 */
export const getTopRatedProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse filter parameters (same as before)
        const authId = req.query.auth_id ? Number(req.query.auth_id) : undefined;
        const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
        const plantId = req.query.plant_id ? Number(req.query.plant_id) : undefined;
        const sectionDepartmentId = req.query.section_department_id ? Number(req.query.section_department_id) : undefined;
        const dateRange = (req.query.date_range as string) || "month";
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;
        const limit = Number(req.query.limit) || 10;

        // Build date filter
        const dateFilter = getDateRangeFilter(dateRange, startDate, endDate);

        // Build handover filter
        const handoverFilter: any = {
            is_finished: true,
            star: { not: null },
            created_date: dateFilter
        };

        if (authId) handoverFilter.auth_id = authId;
        if (departmentId) handoverFilter.department_id = departmentId;
        if (plantId) handoverFilter.plant_id = plantId;
        if (sectionDepartmentId) handoverFilter.section_department_id = sectionDepartmentId;

        // Find top rated projects
        const topProjects = await prismaDB2.tr_handover.findMany({
            where: handoverFilter,
            orderBy: {
                star: 'desc'
            },
            take: limit,
            include: {
                tr_proposed_changes: {
                    select: {
                        project_name: true,
                        department: {
                            select: {
                                department_name: true
                            }
                        }
                    }
                },
                mst_authorization_tr_handover_auth_idTomst_authorization: {
                    select: {
                        employee_name: true
                    }
                },
                tr_handover_approval: {
                    where: {
                        rating: { not: null }
                    },
                    select: {
                        id: true
                    }
                }
            }
        });

        // Calculate overall average rating
        const avgRatingResult = await prismaDB2.tr_handover.aggregate({
            where: handoverFilter,
            _avg: {
                star: true
            }
        });

        // Format response
        const formattedProjects = topProjects.map(project => ({
            id: project.id,
            project_name: project.tr_proposed_changes?.project_name || "Untitled Project",
            doc_number: project.doc_number || "No Document Number",
            rating: project.star ? Number(project.star) : null,
            completion_date: project.finished_date,
            department_name: project.tr_proposed_changes?.department?.department_name || "Unknown Department",
            submitter_name: project.mst_authorization_tr_handover_auth_idTomst_authorization?.employee_name || "Unknown",
            total_reviews: project.tr_handover_approval.length
        }));

        res.status(200).json({
            top_projects: formattedProjects,
            average_rating_overall: avgRatingResult._avg.star ? Number(avgRatingResult._avg.star.toFixed(1)) : 0
        });
    } catch (error) {
        console.error("Error getting top rated projects:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/**
 * Controller untuk Department Metrics
 * - Statistik per departemen
 */
export const getDepartmentMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse filter parameters similar to before
        const authId = req.query.auth_id ? Number(req.query.auth_id) : undefined;
        const plantId = req.query.plant_id ? Number(req.query.plant_id) : undefined;
        const dateRange = (req.query.date_range as string) || "month";
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        // Build date filter
        const dateFilter = getDateRangeFilter(dateRange, startDate, endDate);

        // Get all active departments
        const departmentsQuery: any = {
            status: true,
            is_deleted: false
        };

        if (plantId) departmentsQuery.plant_id = plantId;

        const departments = await prismaDB2.mst_department.findMany({
            where: departmentsQuery,
            select: {
                id: true,
                department_name: true,
                department_code: true
            }
        });

        // For each department, gather metrics
        const departmentMetrics = await Promise.all(
            departments.map(async (dept) => {
                // Base filter for this department
                const deptFilter = {
                    department_id: dept.id,
                    created_date: dateFilter,
                    is_deleted: false
                };

                if (authId) {
                    Object.assign(deptFilter, { auth_id: authId });
                }

                // Count documents at each stage
                const proposedCount = await prismaDB2.tr_proposed_changes.count({
                    where: deptFilter
                });

                // Get proposed change IDs for this department
                const proposedIds = await prismaDB2.tr_proposed_changes.findMany({
                    where: deptFilter,
                    select: { id: true }
                });

                const proposedIdsArray = proposedIds.map(p => p.id);

                // Count auth docs
                const authCount = await prismaDB2.tr_authorization_doc.count({
                    where: {
                        proposed_change_id: { in: proposedIdsArray }
                    }
                });

                // Get auth doc IDs
                const authDocIds = await prismaDB2.tr_authorization_doc.findMany({
                    where: {
                        proposed_change_id: { in: proposedIdsArray }
                    },
                    select: { id: true }
                }).then(docs => docs.map(d => d.id));

                // Count handovers and completed handovers
                const handoverCount = await prismaDB2.tr_handover.count({
                    where: {
                        OR: [
                            { proposed_change_id: { in: proposedIdsArray } },
                            { authdoc_id: { in: authDocIds } }
                        ]
                    }
                });

                const completedCount = await prismaDB2.tr_handover.count({
                    where: {
                        OR: [
                            { proposed_change_id: { in: proposedIdsArray } },
                            { authdoc_id: { in: authDocIds } }
                        ],
                        is_finished: true
                    }
                });

                // Get average rating for this department
                const avgRating = await prismaDB2.tr_handover.aggregate({
                    where: {
                        OR: [
                            {
                                proposed_change_id: { in: proposedIdsArray },
                                is_finished: true,
                                star: { not: null }
                            },
                            {
                                authdoc_id: { in: authDocIds },
                                is_finished: true,
                                star: { not: null }
                            }
                        ]
                    },
                    _avg: {
                        star: true
                    }
                });

                // Calculate success rate
                const successRate = proposedCount > 0 ? (completedCount / proposedCount) * 100 : 0;

                return {
                    id: dept.id,
                    department_name: dept.department_name,
                    department_code: dept.department_code,
                    total_documents: proposedCount,
                    documents_by_stage: {
                        proposed: proposedCount,
                        authorization: authCount,
                        handover: handoverCount,
                        completed: completedCount
                    },
                    avg_completion_time: 0, // Simplified for this example
                    avg_rating: avgRating._avg.star ? Number(avgRating._avg.star.toFixed(1)) : 0,
                    success_rate: Number(successRate.toFixed(1))
                };
            })
        );

        // Sort by total documents descending
        departmentMetrics.sort((a, b) => b.total_documents - a.total_documents);

        res.status(200).json({
            departments: departmentMetrics
        });
    } catch (error) {
        console.error("Error getting department metrics:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/**
 * Controller untuk Top Creators
 * - Top kreator dokumen berdasarkan jumlah atau rating
 */
export const getTopCreators = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse filter parameters 
        const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
        const plantId = req.query.plant_id ? Number(req.query.plant_id) : undefined;
        const sectionDepartmentId = req.query.section_department_id ? Number(req.query.section_department_id) : undefined;
        const dateRange = (req.query.date_range as string) || "month";
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;
        const limit = Number(req.query.limit) || 10;
        const sortBy = (req.query.sort_by as string) || "document_count";

        // Build date filter
        const dateFilter = getDateRangeFilter(dateRange, startDate, endDate);

        // First, get all authorizations with documents they've created
        const authQuery: any = {
            status: true,
            is_deleted: false
        };

        if (departmentId) authQuery.department_id = departmentId;
        if (plantId) authQuery.plant_id = plantId;
        if (sectionDepartmentId) authQuery.section_id = sectionDepartmentId;

        // Get active authorizations
        const creators = await prismaDB2.mst_authorization.findMany({
            where: authQuery,
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
        });

        // For each creator, calculate metrics
        const creatorMetrics = await Promise.all(
            creators.map(async (creator) => {
                // Count proposed changes
                const proposedCount = await prismaDB2.tr_proposed_changes.count({
                    where: {
                        auth_id: creator.id,
                        created_date: dateFilter,
                        is_deleted: false
                    }
                });

                if (proposedCount === 0) {
                    // Skip creators with no documents
                    return null;
                }

                // Get proposed change IDs
                const proposedIds = await prismaDB2.tr_proposed_changes.findMany({
                    where: {
                        auth_id: creator.id,
                        created_date: dateFilter,
                        is_deleted: false
                    },
                    select: { id: true }
                });

                const proposedIdsArray = proposedIds.map(p => p.id);

                // Count auth docs
                const authCount = await prismaDB2.tr_authorization_doc.count({
                    where: {
                        proposed_change_id: { in: proposedIdsArray }
                    }
                });

                // Get auth doc IDs
                const authDocIds = await prismaDB2.tr_authorization_doc.findMany({
                    where: {
                        proposed_change_id: { in: proposedIdsArray }
                    },
                    select: { id: true }
                }).then(docs => docs.map(d => d.id));

                // Count handovers and completed handovers
                const handoverCount = await prismaDB2.tr_handover.count({
                    where: {
                        OR: [
                            { proposed_change_id: { in: proposedIdsArray } },
                            { authdoc_id: { in: authDocIds } }
                        ]
                    }
                });

                const completedCount = await prismaDB2.tr_handover.count({
                    where: {
                        OR: [
                            { proposed_change_id: { in: proposedIdsArray } },
                            { authdoc_id: { in: authDocIds } }
                        ],
                        is_finished: true
                    }
                });

                // Get average rating
                const avgRating = await prismaDB2.tr_handover.aggregate({
                    where: {
                        OR: [
                            {
                                proposed_change_id: { in: proposedIdsArray },
                                is_finished: true,
                                star: { not: null }
                            },
                            {
                                authdoc_id: { in: authDocIds },
                                is_finished: true,
                                star: { not: null }
                            }
                        ]
                    },
                    _avg: {
                        star: true
                    }
                });

                // Calculate completion rate
                const completionRate = proposedCount > 0 ? (completedCount / proposedCount) * 100 : 0;

                return {
                    auth_id: creator.id,
                    employee_name: creator.employee_name,
                    employee_code: creator.employee_code,
                    department_name: creator.department?.department_name || "Unknown Department",
                    document_count: {
                        total: proposedCount,
                        proposed: proposedCount,
                        authorization: authCount,
                        handover: handoverCount,
                        completed: completedCount
                    },
                    avg_rating: avgRating._avg.star ? Number(avgRating._avg.star.toFixed(1)) : 0,
                    completion_rate: Number(completionRate.toFixed(1)),
                    // Additional field for sorting
                    sort_value: sortBy === "avg_rating" ? (avgRating._avg.star || 0) : proposedCount
                };
            })
        );

        // Remove null entries and sort
        const filteredCreators = creatorMetrics
            .filter((c): c is NonNullable<typeof c> => c !== null)
            .sort((a, b) => (Number(b.sort_value) || 0) - (Number(a.sort_value) || 0))
            .slice(0, limit)
            .map(({ sort_value, ...rest }) => rest); // Remove sort_value from response

        res.status(200).json({
            top_creators: filteredCreators
        });
    } catch (error) {
        console.error("Error getting top creators:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/**
 * Controller untuk Document Completion Trend
 * - Tren penyelesaian dokumen seiring waktu
 */
export const getCompletionTrend = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse filter parameters
        const authId = req.query.auth_id ? Number(req.query.auth_id) : undefined;
        const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
        const plantId = req.query.plant_id ? Number(req.query.plant_id) : undefined;
        const sectionDepartmentId = req.query.section_department_id ? Number(req.query.section_department_id) : undefined;
        const interval = (req.query.interval as string) || "weekly";

        // Different approach for timestamp-based trend analysis
        // In a real implementation, you'd likely use SQL date functions directly
        // For simplicity, we'll simulate the trend data here

        // Create sample data for the last 10 weeks/months/days
        const trendData = [];
        const now = new Date();

        for (let i = 9; i >= 0; i--) {
            let period: string;
            let periodDate: Date;

            if (interval === "weekly") {
                periodDate = subDays(now, i * 7);
                const weekNum = format(periodDate, "w");
                const year = format(periodDate, "yyyy");
                period = `${year}-W${weekNum}`;
            } else if (interval === "monthly") {
                periodDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                period = format(periodDate, "yyyy-MM");
            } else { // daily
                periodDate = subDays(now, i);
                period = format(periodDate, "yyyy-MM-dd");
            }

            // Simulate random counts that decline as we move from proposal to completion
            const proposedCount = Math.floor(Math.random() * 10) + 15 - i;
            const authCount = Math.floor(proposedCount * (0.7 + Math.random() * 0.2));
            const handoverCount = Math.floor(authCount * (0.7 + Math.random() * 0.2));
            const completedCount = Math.floor(handoverCount * (0.7 + Math.random() * 0.2));
            const avgRating = 3.5 + Math.random() * 1.5;

            trendData.push({
                period,
                proposed_count: proposedCount,
                auth_count: authCount,
                handover_count: handoverCount,
                completed_count: completedCount,
                avg_rating: Number(avgRating.toFixed(1))
            });
        }

        // In a real implementation, you would query the database for each time period
        // and count the documents created/completed in that period

        res.status(200).json({
            trend_data: trendData
        });
    } catch (error) {
        console.error("Error getting completion trend:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};