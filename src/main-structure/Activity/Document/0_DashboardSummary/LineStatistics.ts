import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";

/**
 * Mendapatkan statistik dokumen berdasarkan line_code
 * Berguna untuk membuat visualisasi seperti doughnut chart
 */
export const getLineCodeStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters
    const { 
      status,        // Filter berdasarkan status dokumen (opsional)
      exclude_done,  // Exclude dokumen dengan status 'done' (opsional)
      department_id, // Filter berdasarkan department_id (opsional)
      limit          // Batasi jumlah line_code (opsional, default: semua)
    } = req.query;
    
    // Bangun kondisi filter
    const whereCondition: any = {
      is_deleted: false
    };
    
    // Tambahkan filter status jika ada
    if (status) {
      whereCondition.status = status as string;
    }
    
    // Exclude dokumen dengan status 'done' jika diminta
    if (exclude_done === 'true') {
      whereCondition.status = {
        not: 'done'
      };
    }
    
    // Tambahkan filter department jika ada
    if (department_id) {
      whereCondition.department_id = parseInt(department_id as string);
    }
    
    // 1. Ambil semua proposed changes berdasarkan filter
    const allProposedChanges = await prismaDB2.tr_proposed_changes.findMany({
      where: whereCondition,
      select: {
        id: true,
        line_code: true,
        status: true,
        project_name: true,
        created_date: true
      }
    });
    
    console.log(`Ditemukan ${allProposedChanges.length} dokumen proposed changes`);
    
    // 2. Kelompokkan berdasarkan line_code
    const lineCodeGroups: { [key: string]: any[] } = {};
    
    allProposedChanges.forEach(doc => {
      const lineCode = doc.line_code || 'Unknown';
      
      if (!lineCodeGroups[lineCode]) {
        lineCodeGroups[lineCode] = [];
      }
      
      lineCodeGroups[lineCode].push(doc);
    });
    
    // 3. Siapkan hasil yang sudah dihitung
    let lineCodeStats = Object.keys(lineCodeGroups).map(lineCode => {
      const documents = lineCodeGroups[lineCode];
      const totalDocuments = documents.length;
      
      // Hitung berdasarkan status
      const statusCount: { [key: string]: number } = {};
      documents.forEach(doc => {
        const status = doc.status || 'unknown';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      
      // Hitung persentase dari total
      const percentage = (totalDocuments / allProposedChanges.length) * 100;
      
      // Ambil 5 dokumen terbaru untuk tampilan sampel
      const recentDocuments = documents
        .sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime())
        .slice(0, 5)
        .map(doc => ({
          id: doc.id,
          project_name: doc.project_name,
          status: doc.status,
          created_date: doc.created_date
        }));
      
      return {
        line_code: lineCode,
        total_documents: totalDocuments,
        percentage: parseFloat(percentage.toFixed(2)),
        status_breakdown: statusCount,
        recent_documents: recentDocuments
      };
    });
    
    // 4. Urutkan berdasarkan jumlah dokumen (terbanyak dulu)
    lineCodeStats = lineCodeStats.sort((a, b) => b.total_documents - a.total_documents);
    
    // 5. Batasi jumlah line_code jika diperlukan
    const limitNum = limit ? parseInt(limit as string) : lineCodeStats.length;
    if (limitNum < lineCodeStats.length) {
      // Jika ada pembatasan, gabungkan line_code yang tersisa ke "Others"
      const topLineCodeStats = lineCodeStats.slice(0, limitNum);
      const otherLineCodeStats = lineCodeStats.slice(limitNum);
      
      if (otherLineCodeStats.length > 0) {
        const totalOtherDocuments = otherLineCodeStats.reduce((sum, item) => sum + item.total_documents, 0);
        const otherPercentage = (totalOtherDocuments / allProposedChanges.length) * 100;
        
        // Gabungkan status breakdown
        const otherStatusBreakdown: { [key: string]: number } = {};
        otherLineCodeStats.forEach(item => {
          Object.keys(item.status_breakdown).forEach(status => {
            otherStatusBreakdown[status] = (otherStatusBreakdown[status] || 0) + item.status_breakdown[status];
          });
        });
        
        // Ambil beberapa recent documents dari Others
        const otherRecentDocs = otherLineCodeStats
          .flatMap(item => item.recent_documents)
          .sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime())
          .slice(0, 5);
        
        // Tambahkan "Others" ke hasil
        topLineCodeStats.push({
          line_code: "Others",
          total_documents: totalOtherDocuments,
          percentage: parseFloat(otherPercentage.toFixed(2)),
          status_breakdown: otherStatusBreakdown,
          recent_documents: otherRecentDocs,
        });
        
        lineCodeStats = topLineCodeStats;
      }
    }
    
    // 6. Untuk kebutuhan visualisasi, sediakan data dalam format chart-ready
    const chartData = {
      labels: lineCodeStats.map(item => item.line_code),
      datasets: [
        {
          data: lineCodeStats.map(item => item.total_documents),
          backgroundColor: generateColors(lineCodeStats.length)
        }
      ]
    };
    
    // 7. Siapkan statistik ringkasan
    const totalDocuments = allProposedChanges.length;
    const statusSummary: { [key: string]: number } = {};
    
    allProposedChanges.forEach(doc => {
      const status = doc.status || 'unknown';
      statusSummary[status] = (statusSummary[status] || 0) + 1;
    });
    
    // 8. Kirim respons
    res.status(200).json({
      status: "success",
      message: "Statistik line_code berhasil diambil",
      summary: {
        total_documents: totalDocuments,
        total_line_codes: Object.keys(lineCodeGroups).length,
        status_summary: statusSummary
      },
      data: lineCodeStats,
      chart_data: chartData
    });
    
  } catch (error) {
    console.error("Error saat mengambil statistik line_code:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil statistik line_code",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};

/**
 * Menghasilkan array warna untuk grafik
 * Menggunakan warna yang kontras untuk readability
 */
function generateColors(count: number): string[] {
  const baseColors = [
    '#FF6384', // Merah muda
    '#36A2EB', // Biru
    '#FFCE56', // Kuning
    '#4BC0C0', // Tosca
    '#9966FF', // Ungu
    '#FF9F40', // Oranye
    '#C9CBCF', // Abu-abu
    '#7FD47F', // Hijau
    '#FFA07A', // Salmon
    '#20B2AA', // Light sea green
    '#778899', // Light slate gray
    '#B0C4DE', // Light steel blue
    '#FFDEAD', // Navajo white
    '#DB7093', // Pale violet red
    '#F0E68C', // Khaki
    '#E6E6FA', // Lavender
    '#FFF0F5', // Lavender blush
    '#7B68EE', // Medium slate blue
    '#3CB371', // Medium sea green
    '#FA8072', // Salmon
  ];
  
  // Jika butuh lebih banyak warna, duplicate dan modifikasi baseColors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  } else {
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      // Generate warna acak jika butuh lebih banyak
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    }
    return colors;
  }
}

/**
 * Mendapatkan statistik linecode yang lebih terperinci dengan tahapan dokumen
 * Ideal untuk analisis status dokumen per line
 */
export const getLineCodeStatusFlow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department_id } = req.query;
    
    // Bangun kondisi filter
    const whereCondition: any = {
      is_deleted: false
    };
    
    // Filter berdasarkan department jika ada
    if (department_id) {
      whereCondition.department_id = parseInt(department_id as string);
    }
    
    // 1. Ambil data proposed changes dengan relasi
    const proposedChanges = await prismaDB2.tr_proposed_changes.findMany({
      where: whereCondition,
      select: {
        id: true,
        line_code: true,
        status: true,
        progress: true,
        authorizationDocs: {
          select: {
            id: true,
            status: true,
            progress: true
          }
        },
        tr_handover: {
          select: {
            id: true,
            status: true,
            progress: true,
            is_finished: true
          }
        }
      }
    });
    
    console.log(`Ditemukan ${proposedChanges.length} dokumen proposed changes`);
    
    // 2. Kelompokkan berdasarkan line_code
    const lineGroups: { [key: string]: any[] } = {};
    
    proposedChanges.forEach(doc => {
      const lineCode = doc.line_code || 'Unknown';
      
      if (!lineGroups[lineCode]) {
        lineGroups[lineCode] = [];
      }
      
      lineGroups[lineCode].push(doc);
    });
    
    // 3. Siapkan hasil dengan status flow
    const lineCodeFlowStats = Object.keys(lineGroups).map(lineCode => {
      const documents = lineGroups[lineCode];
      const totalDocuments = documents.length;
      
      // Kelompokkan dokumen berdasarkan tahapan workflow
      const workflow = {
        proposed_only: documents.filter(doc => 
          doc.authorizationDocs.length === 0 && doc.tr_handover.length === 0
        ).length,
        
        in_authorization: documents.filter(doc => 
          doc.authorizationDocs.length > 0 && doc.tr_handover.length === 0
        ).length,
        
        in_handover: documents.filter(doc => 
          doc.tr_handover.length > 0 && !doc.tr_handover.some((h: { is_finished: boolean; }) => h.is_finished === true)
        ).length,
        
        completed: documents.filter(doc => 
          doc.tr_handover.some((h: { is_finished: boolean; }) => h.is_finished === true)
        ).length
      };
      
      // Hitung persentase penyelesaian
      const completionRate = (workflow.completed / totalDocuments) * 100;
      
      // Status terperinci
      const statusCounts: { [key: string]: number } = {};
      documents.forEach(doc => {
        const status = doc.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      return {
        line_code: lineCode,
        total_documents: totalDocuments,
        workflow: workflow,
        completion_rate: parseFloat(completionRate.toFixed(2)),
        status_counts: statusCounts
      };
    });
    
    // 4. Urutkan berdasarkan jumlah dokumen total
    const sortedResult = lineCodeFlowStats.sort((a, b) => b.total_documents - a.total_documents);
    
    // 5. Siapkan data chart untuk setiap tahapan workflow
    const workflowChartData = {
      labels: sortedResult.map(item => item.line_code),
      datasets: [
        {
          label: 'Proposed Only',
          data: sortedResult.map(item => item.workflow.proposed_only),
          backgroundColor: '#36A2EB' // Biru
        },
        {
          label: 'In Authorization',
          data: sortedResult.map(item => item.workflow.in_authorization),
          backgroundColor: '#FFCE56' // Kuning
        },
        {
          label: 'In Handover',
          data: sortedResult.map(item => item.workflow.in_handover),
          backgroundColor: '#FF9F40' // Oranye
        },
        {
          label: 'Completed',
          data: sortedResult.map(item => item.workflow.completed),
          backgroundColor: '#4BC0C0' // Tosca
        }
      ]
    };
    
    // 6. Hitung total dokumen per tahapan untuk ringkasan
    const totalProposedOnly = sortedResult.reduce((sum, item) => sum + item.workflow.proposed_only, 0);
    const totalInAuthorization = sortedResult.reduce((sum, item) => sum + item.workflow.in_authorization, 0);
    const totalInHandover = sortedResult.reduce((sum, item) => sum + item.workflow.in_handover, 0);
    const totalCompleted = sortedResult.reduce((sum, item) => sum + item.workflow.completed, 0);
    const grandTotal = totalProposedOnly + totalInAuthorization + totalInHandover + totalCompleted;
    
    // 7. Kirim respons
    res.status(200).json({
      status: "success",
      message: "Statistik alur dokumen berdasarkan line_code berhasil diambil",
      summary: {
        total_documents: grandTotal,
        total_line_codes: sortedResult.length,
        workflow_summary: {
          proposed_only: totalProposedOnly,
          in_authorization: totalInAuthorization,
          in_handover: totalInHandover,
          completed: totalCompleted
        },
        completion_rate: parseFloat(((totalCompleted / grandTotal) * 100).toFixed(2))
      },
      data: sortedResult,
      chart_data: workflowChartData
    });
    
  } catch (error) {
    console.error("Error saat mengambil statistik flow line_code:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil statistik flow line_code",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};