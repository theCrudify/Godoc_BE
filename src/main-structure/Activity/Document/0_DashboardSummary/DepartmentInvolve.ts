import { Request, Response } from "express";
import { prismaDB2 } from "../../../../config/database";

/**
 * Mendapatkan data keterlibatan departemen dalam dokumen
 * Menunjukkan status dokumen di setiap tahapan workflow
 */
export const getDepartmentInvolvement = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Ambil semua departemen yang aktif
    const departments = await prismaDB2.mst_department.findMany({
      where: {
        is_deleted: false,
        status: true
      },
      select: {
        id: true,
        department_name: true,
        department_code: true,
        plant: {
          select: {
            id: true,
            plant_name: true
          }
        }
      }
    });

    console.log(`Ditemukan ${departments.length} departemen aktif`);

    // 2. Untuk setiap departemen, hitung keterlibatan dokumen
    const result = await Promise.all(departments.map(async (dept) => {
      // A. Hitung total dokumen (dari proposed changes)
      const totalDocuments = await prismaDB2.tr_proposed_changes.count({
        where: {
          department_id: dept.id,
          is_deleted: false
        }
      });

      // B. Hitung dokumen yang masih di tahap proposed changes
      // (belum punya authorization doc)
      const proposedOnlyIds = await prismaDB2.tr_proposed_changes.findMany({
        where: {
          department_id: dept.id,
          is_deleted: false,
          authorizationDocs: {
            none: {}
          }
        },
        select: {
          id: true
        }
      });
      const proposedOnly = proposedOnlyIds.length;

      // C. Hitung dokumen yang di tahap authorization 
      // (punya authorization doc tapi belum handover)
      const authOnlyIds = await prismaDB2.tr_proposed_changes.findMany({
        where: {
          department_id: dept.id,
          is_deleted: false,
          authorizationDocs: {
            some: {}
          },
          tr_handover: {
            none: {}
          }
        },
        select: {
          id: true
        }
      });
      const authOnly = authOnlyIds.length;

      // D. Hitung dokumen yang di tahap handover tapi belum selesai
      const handoverNotFinishedIds = await prismaDB2.tr_proposed_changes.findMany({
        where: {
          department_id: dept.id,
          is_deleted: false,
          tr_handover: {
            some: {
              is_finished: false
            }
          }
        },
        select: {
          id: true
        }
      });
      const handoverNotFinished = handoverNotFinishedIds.length;
      
      // E. Hitung dokumen yang sudah selesai (handover finished)
      const completedIds = await prismaDB2.tr_proposed_changes.findMany({
        where: {
          department_id: dept.id,
          is_deleted: false,
          tr_handover: {
            some: {
              is_finished: true
            }
          }
        },
        select: {
          id: true
        }
      });
      const completed = completedIds.length;

      // Kembalikan data untuk departemen ini
      return {
        department_id: dept.id,
        department_name: dept.department_name,
        department_code: dept.department_code,
        plant_name: dept.plant?.plant_name || "-",
        
        // Total dokumen dan perhitungan status
        total_dokumen: totalDocuments,
        status_dokumen: {
          tahap_proposed_changes: proposedOnly,
          tahap_authorization: authOnly,
          tahap_handover: handoverNotFinished,
          sudah_selesai: completed
        },
        
        // Tambahan untuk verifikasi
        total_by_status: proposedOnly + authOnly + handoverNotFinished + completed
      };
    }));

    // 3. Urutkan berdasarkan jumlah total dokumen
    result.sort((a, b) => b.total_dokumen - a.total_dokumen);

    // 4. Kirim response
    res.status(200).json({
      status: "success",
      message: "Data keterlibatan departemen berhasil diambil",
      data: result
    });
    
  } catch (error) {
    console.error("Error saat mengambil data keterlibatan departemen:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data keterlibatan departemen",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};

/**
 * Mendapatkan detail keterlibatan departemen tertentu
 * dengan mengelompokkan dokumen berdasarkan status
 */
export const getDepartmentInvolvementDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const departmentId = parseInt(id);
    
    if (isNaN(departmentId)) {
      res.status(400).json({ 
        status: "error",
        message: "ID departemen tidak valid" 
      });
      return;
    }

    // 1. Ambil informasi departemen
    const department = await prismaDB2.mst_department.findUnique({
      where: { 
        id: departmentId,
        is_deleted: false 
      },
      include: {
        plant: true
      }
    });

    if (!department) {
      res.status(404).json({ 
        status: "error",
        message: `Departemen dengan ID ${departmentId} tidak ditemukan` 
      });
      return;
    }

    // 2. Ambil semua proposed changes untuk departemen ini
    const allProposedChanges = await prismaDB2.tr_proposed_changes.findMany({
      where: {
        department_id: departmentId,
        is_deleted: false
      },
      select: {
        id: true,
        project_name: true,
        status: true,
        progress: true,
        created_date: true,
        documentNumber: {
          select: {
            running_number: true
          }
        },
        // Include untuk membantu menentukan tahapan dokumen
        authorizationDocs: {
          select: {
            id: true
          }
        },
        tr_handover: {
          select: {
            id: true,
            is_finished: true
          }
        }
      }
    });

    // 3. Kelompokkan dokumen berdasarkan tahapan
    const proposedOnly = allProposedChanges.filter(pc => 
      pc.authorizationDocs.length === 0
    ).map(pc => ({
      id: pc.id,
      nama_proyek: pc.project_name,
      nomor_dokumen: pc.documentNumber?.running_number || "-",
      status: pc.status,
      progress: pc.progress,
      tanggal_dibuat: pc.created_date
    }));

    const authOnly = allProposedChanges.filter(pc => 
      pc.authorizationDocs.length > 0 && pc.tr_handover.length === 0
    ).map(pc => ({
      id: pc.id,
      nama_proyek: pc.project_name,
      nomor_dokumen: pc.documentNumber?.running_number || "-",
      status: pc.status,
      progress: pc.progress,
      tanggal_dibuat: pc.created_date
    }));

    const handoverNotFinished = allProposedChanges.filter(pc => 
      pc.tr_handover.length > 0 && !pc.tr_handover.some(h => h.is_finished === true)
    ).map(pc => ({
      id: pc.id,
      nama_proyek: pc.project_name,
      nomor_dokumen: pc.documentNumber?.running_number || "-",
      status: pc.status,
      progress: pc.progress,
      tanggal_dibuat: pc.created_date
    }));

    const completed = allProposedChanges.filter(pc => 
      pc.tr_handover.some(h => h.is_finished === true)
    ).map(pc => ({
      id: pc.id,
      nama_proyek: pc.project_name,
      nomor_dokumen: pc.documentNumber?.running_number || "-",
      status: pc.status,
      progress: pc.progress,
      tanggal_dibuat: pc.created_date
    }));

    // 5. Format data untuk response
    const result = {
      departemen: {
        id: department.id,
        nama: department.department_name,
        kode: department.department_code,
        plant: department.plant?.plant_name || "-"
      },
      statistik: {
        total_dokumen: allProposedChanges.length,
        tahap_proposed_changes: proposedOnly.length,
        tahap_authorization: authOnly.length,
        tahap_handover: handoverNotFinished.length,
        sudah_selesai: completed.length
      },
      dokumen_per_tahap: {
        tahap_proposed_changes: proposedOnly,
        tahap_authorization: authOnly,
        tahap_handover: handoverNotFinished,
        sudah_selesai: completed
      }
    };

    // 6. Kirim response
    res.status(200).json({
      status: "success",
      message: "Detail keterlibatan departemen berhasil diambil",
      data: result
    });
    
  } catch (error) {
    console.error("Error saat mengambil detail departemen:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil detail keterlibatan departemen",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prismaDB2.$disconnect();
  }
};