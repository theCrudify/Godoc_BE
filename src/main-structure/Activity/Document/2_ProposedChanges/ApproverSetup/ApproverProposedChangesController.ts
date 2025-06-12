// src/main-structure/Activity/Document/2_ProposedChanges/ApproverChangeController.ts

import { Request, Response } from 'express';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { prismaDB2 } from '../../../../../config/database';
import { sendEmail } from '../../../Email/EmailServiceEnvironment/EmailServiceExport'
// Create this as a separate file: src/main-structure/Activity/Email/ApproverChangeEmail.ts
// Then import these functions in your ApproverChangeController.ts




/**
 * Send email notification when approver change request is submitted
 */
/**
 * Send email notification when approver change request is submitted
 */
export const sendApproverChangeRequestEmail = async (changeRequest: any, requesterDepartmentId?: number) => {
  try {
    console.log('📧 Sending approver change request email notification');
    console.log('🔍 DEBUG: Requester department_id:', requesterDepartmentId);

    const projectName = changeRequest.tr_proposed_changes?.project_name || 'Unknown Project';
    const requestId = changeRequest.id;
    const fromApprover = changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization?.employee_name || 'Unknown';
    const toApprover = changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization?.employee_name || 'Unknown';
    const requester = changeRequest.mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization?.employee_name || 'Unknown';
    const reason = changeRequest.reason;
    const urgent = changeRequest.urgent;
    const step = changeRequest.tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval?.step || 'Unknown';
    const actor = changeRequest.tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval?.actor || 'Unknown';

    // Get admin emails (Super Admin + Admin with same department)
    const adminEmails = await getAdminEmails(requesterDepartmentId);
    
    if (adminEmails.length === 0) {
      console.warn('⚠️ WARNING: No admin emails found! Cannot send notification.');
      return;
    }

    console.log('🔍 DEBUG: Will send emails to:', adminEmails);
    
    const subject = urgent 
      ? `[URGENT] Request Perubahan Approver - ${projectName} (Request #${requestId})`
      : `Request Perubahan Approver - ${projectName} (Request #${requestId})`;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">
            ${urgent ? '🚨 ' : '📋 '}Request Perubahan Approver
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #007bff; margin-top: 0;">Detail Request</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Request ID:</td>
                <td style="padding: 8px 0;">#${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Project:</td>
                <td style="padding: 8px 0;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Diajukan oleh:</td>
                <td style="padding: 8px 0;">${requester}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Step Approval:</td>
                <td style="padding: 8px 0;">Step ${step} (${actor})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Dari Approver:</td>
                <td style="padding: 8px 0;">${fromApprover}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Ke Approver:</td>
                <td style="padding: 8px 0;"><strong style="color: #28a745;">${toApprover}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Prioritas:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${urgent ? '#dc3545' : '#6c757d'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${urgent ? 'URGENT' : 'NORMAL'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Alasan:</td>
                <td style="padding: 8px 0;">${reason}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #495057;">
              <strong>Tindakan Diperlukan:</strong><br>
              Silakan review dan proses request perubahan approver ini melalui sistem Go-Document.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              Email ini dikirim otomatis oleh sistem Go-Document.<br>
              Tanggal: ${new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send to each admin
    let successCount = 0;
    for (const adminEmail of adminEmails) {
      if (adminEmail) {
        try {
          await sendEmail({
            to: adminEmail,
            subject,
            html: emailTemplate
          });
          console.log(`✅ Request email sent to admin: ${adminEmail}`);
          successCount++;
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${adminEmail}:`, emailError);
        }
      }
    }

    console.log(`📧 Email sending completed. Success: ${successCount}/${adminEmails.length}`);

    // Log the notification
    await prismaDB2.tr_notification_log.create({
      data: {
        notification_type: 'approver_change_request',
        recipients: adminEmails.filter(Boolean),
        sent_count: successCount,
        urgent: urgent,
        related_id: changeRequest.id,
        details: {
          request_id: changeRequest.id,
          project_name: projectName,
          from_approver: fromApprover,
          to_approver: toApprover,
          requester: requester,
          requester_department_id: requesterDepartmentId,
          reason: reason
        }
      }
    });

  } catch (error) {
    console.error('❌ Error sending approver change request email:', error);
    throw error;
  }
};

/**
 * Send email notification when approver change request is processed (approved/rejected)
 */
export const sendApproverChangeResultEmail = async (
  changeRequest: any, 
  status: 'approved' | 'rejected', 
  adminDecision: string
) => {
  try {
    console.log(`📧 Sending approver change result email (${status})`);

    const projectName = changeRequest.tr_proposed_changes?.project_name || 'Unknown Project';
    const requestId = changeRequest.id;
    const fromApprover = changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization?.employee_name || 'Unknown';
    const toApprover = changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization?.employee_name || 'Unknown';
    const requesterEmail = changeRequest.mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization?.email;
    const requesterName = changeRequest.mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization?.employee_name || 'Unknown';
    const reason = changeRequest.reason;
    const step = changeRequest.tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval?.step || 'Unknown';
    const actor = changeRequest.tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval?.actor || 'Unknown';

    if (!requesterEmail) {
      console.log('⚠️ No requester email found, skipping notification');
      return;
    }

    const isApproved = status === 'approved';
    const subject = `Request Perubahan Approver ${isApproved ? 'DISETUJUI' : 'DITOLAK'} - ${projectName} (Request #${requestId})`;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">
            ${isApproved ? '✅' : '❌'} Request Perubahan Approver ${isApproved ? 'Disetujui' : 'Ditolak'}
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #007bff; margin-top: 0;">Detail Request</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Request ID:</td>
                <td style="padding: 8px 0;">#${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Project:</td>
                <td style="padding: 8px 0;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Step Approval:</td>
                <td style="padding: 8px 0;">Step ${step} (${actor})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Dari Approver:</td>
                <td style="padding: 8px 0;">${fromApprover}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Ke Approver:</td>
                <td style="padding: 8px 0;"><strong style="color: #28a745;">${toApprover}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Alasan Request:</td>
                <td style="padding: 8px 0;">${reason}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${isApproved ? '#28a745' : '#dc3545'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${isApproved ? 'DISETUJUI' : 'DITOLAK'}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: ${isApproved ? '#d4edda' : '#f8d7da'}; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid ${isApproved ? '#28a745' : '#dc3545'};">
            <h4 style="margin: 0 0 10px 0; color: ${isApproved ? '#155724' : '#721c24'};">Keputusan Admin:</h4>
            <p style="margin: 0; color: ${isApproved ? '#155724' : '#721c24'};">${adminDecision}</p>
          </div>

          ${isApproved ? `
          <div style="background-color: #d1ecf1; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #0c5460;">
              <strong>Informasi:</strong><br>
              Approver untuk step ${step} (${actor}) telah berhasil diubah ke <strong>${toApprover}</strong>.
              Proses approval dapat dilanjutkan dengan approver yang baru.
            </p>
          </div>
          ` : `
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #721c24;">
              <strong>Informasi:</strong><br>
              Request perubahan approver ditolak. Approver tetap <strong>${fromApprover}</strong>.
              Anda dapat mengajukan request baru dengan alasan yang lebih detail jika diperlukan.
            </p>
          </div>
          `}

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              Email ini dikirim otomatis oleh sistem Go-Document.<br>
              Tanggal: ${new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: requesterEmail,
      subject,
      html: emailTemplate
    });

    console.log(`✅ Result email sent to requester: ${requesterEmail}`);

  } catch (error) {
    console.error('❌ Error sending approver change result email:', error);
    throw error;
  }
};

/**
 * Send email notifications when admin performs bypass operation
 */
export const sendBypassNotificationEmails = async (
  proposedChange: any,
  affectedApprovals: any[],
  bypassReason: string,
  adminUser: any
) => {
  try {
    console.log('📧 Sending bypass notification emails to affected approvers');

    const projectName = proposedChange.project_name || 'Unknown Project';
    const adminName = adminUser?.employee_name || 'System Admin';
    const bypassDate = new Date().toLocaleString('id-ID');

    const subject = `[URGENT] Sistem Approval Di-bypass - ${projectName}`;

    // Send email to each affected approver
    for (const approval of affectedApprovals) {
      const approverEmail = approval.authorization?.email;
      const approverName = approval.authorization?.employee_name || 'Unknown';

      if (!approverEmail) {
        console.log(`⚠️ No email found for approver: ${approverName}`);
        continue;
      }

      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">
              🚨 Pemberitahuan: Sistem Approval Di-bypass
            </h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #007bff; margin-top: 0;">Detail Bypass</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Project:</td>
                  <td style="padding: 8px 0;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Approver:</td>
                  <td style="padding: 8px 0;">${approverName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Step:</td>
                  <td style="padding: 8px 0;">Step ${approval.step} (${approval.actor})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Status Sebelum:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #ffc107; color: #212529; padding: 2px 6px; border-radius: 3px; font-size: 12px;">
                      ${approval.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Status Sekarang:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #28a745; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">
                      APPROVED (BYPASS)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Di-bypass oleh:</td>
                  <td style="padding: 8px 0;"><strong>${adminName}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Tanggal:</td>
                  <td style="padding: 8px 0;">${bypassDate}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">Alasan Bypass:</h4>
              <p style="margin: 0; color: #856404;">${bypassReason}</p>
            </div>

            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; color: #0c5460;">
                <strong>Informasi:</strong><br>
                Sistem approval untuk project ini telah di-bypass oleh Super Admin. 
                Approval Anda tidak lagi diperlukan untuk project ini. 
                Project telah otomatis disetujui dan dapat dilanjutkan.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Email ini dikirim otomatis oleh sistem Go-Document.<br>
                Jika ada pertanyaan, silakan hubungi administrator sistem.
              </p>
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: approverEmail,
        subject,
        html: emailTemplate
      });

      console.log(`✅ Bypass notification sent to: ${approverEmail} (${approverName})`);
    }

    // Also send summary email to requester/submitter if available
    const submitterEmail = proposedChange.mst_authorization?.email;
    if (submitterEmail) {
      const submitterTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #28a745; margin-bottom: 20px;">
              ✅ Project Anda Telah Disetujui (Bypass)
            </h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #007bff; margin-top: 0;">Detail Project</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Project:</td>
                  <td style="padding: 8px 0;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      APPROVED (BYPASS)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Disetujui oleh:</td>
                  <td style="padding: 8px 0;">${adminName} (Super Admin)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Tanggal:</td>
                  <td style="padding: 8px 0;">${bypassDate}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; color: #155724;">
                <strong>Selamat!</strong><br>
                Project Anda telah disetujui melalui bypass system oleh Super Admin. 
                Anda dapat melanjutkan ke tahap berikutnya sesuai prosedur yang berlaku.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Email ini dikirim otomatis oleh sistem Go-Document.
              </p>
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: submitterEmail,
        subject: `✅ Project Disetujui (Bypass) - ${projectName}`,
        html: submitterTemplate
      });

      console.log(`✅ Bypass notification sent to submitter: ${submitterEmail}`);
    }

  } catch (error) {
    console.error('❌ Error sending bypass notification emails:', error);
    throw error;
  }
};


/**
 * Helper function to get admin emails from database
 * - All Super Admin (regardless of department)
 * - Admin with same department_id as requester
 */
const getAdminEmails = async (requester_department_id?: number): Promise<string[]> => {
  try {
    console.log('🔍 DEBUG: Getting admin emails for department_id:', requester_department_id);
    
    const whereConditions = {
      AND: [
        {
          status: true,
          is_deleted: false,
          email: {
            not: null
          }
        },
        {
          OR: [
            // All Super Admin (no department filter)
            {
              role: {
                role_name: 'Super Admin'
              }
            },
            // Admin with same department as requester (only if department_id provided)
            ...(requester_department_id ? [{
              AND: [
                {
                  role: {
                    role_name: 'Admin'
                  }
                },
                {
                  department_id: requester_department_id
                }
              ]
            }] : [])
          ]
        }
      ]
    };

    const admins = await prismaDB2.mst_authorization.findMany({
      where: whereConditions,
      include: {
        role: {
          select: {
            role_name: true
          }
        },
        department: {
          select: {
            department_name: true
          }
        }
      }
    });

    console.log('🔍 DEBUG: Found admins:', admins.map(admin => ({
      name: admin.employee_name,
      email: admin.email,
      role: admin.role?.role_name,
      department: admin.department?.department_name,
      department_id: admin.department_id
    })));
    
    console.log('🔍 DEBUG: Admin count:', admins.length);

    const emails = admins.map(admin => admin.email).filter(Boolean) as string[];
    console.log('🔍 DEBUG: Valid admin emails:', emails);

    return emails;
  } catch (error) {
    console.error('❌ Error getting admin emails:', error);
    return [];
  }
};

// Interface untuk user yang login
interface AuthenticatedUser {
  auth_id: number;
  employee_code: string;
  employee_name: string;
  email: string;
  user_role: 'user' | 'admin' | 'Super Admin';
}

// Extend Request untuk include user
interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}


/**
 * 1. REQUEST PERUBAHAN APPROVER OLEH USER
 * Endpoint: POST /api/approver-change/request
 */
export const requestApproverChange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      proposed_changes_id,
      approval_id,
      current_auth_id,
      new_auth_id,
      reason,
      urgent = false
    } = req.body;

    const requester_auth_id = req.user?.auth_id;

    // Validasi input required
    if (!proposed_changes_id || !approval_id || !current_auth_id || !new_auth_id || !reason) {
      res.status(400).json({ 
        error: "Missing required fields",
        required: ["proposed_changes_id", "approval_id", "current_auth_id", "new_auth_id", "reason"]
      });
      return;
    }

    // Validasi: Cek apakah proposed change masih aktif
    const proposedChange = await prismaDB2.tr_proposed_changes.findUnique({
      where: { id: proposed_changes_id },
      select: { 
        id: true,
        project_name: true,
        item_changes: true,
        status: true, 
        progress: true,
        is_deleted: true
      }
    });

    if (!proposedChange || proposedChange.is_deleted) {
      res.status(404).json({ 
        error: "Proposed change tidak ditemukan atau sudah dihapus" 
      });
      return;
    }

    if (proposedChange.status === 'done') {
      res.status(400).json({ 
        error: "Proposed change sudah selesai, tidak dapat mengubah approver" 
      });
      return;
    }

    // Validasi: Cek apakah approval masih pending/on_going
    const approval = await prismaDB2.tr_proposed_changes_approval.findUnique({
      where: { id: approval_id },
      select: { 
        id: true,
        proposed_changes_id: true,
        auth_id: true,
        step: true,
        status: true,
        actor: true
      }
    });

    if (!approval) {
      res.status(404).json({ 
        error: "Approval step tidak ditemukan" 
      });
      return;
    }

    if (approval.proposed_changes_id !== proposed_changes_id) {
      res.status(400).json({ 
        error: "Approval step tidak sesuai dengan proposed change" 
      });
      return;
    }

    if (!['pending', 'on_going'].includes(approval.status || '')) {
      res.status(400).json({ 
        error: `Approval sudah diproses (${approval.status}), tidak dapat diubah` 
      });
      return;
    }

    if (approval.auth_id !== current_auth_id) {
      res.status(400).json({ 
        error: "Current approver tidak sesuai dengan data di sistem" 
      });
      return;
    }

    // Validasi: Cek apakah new approver valid
    const newApprover = await prismaDB2.mst_authorization.findUnique({
      where: { id: new_auth_id },
      select: { 
        id: true,
        employee_name: true, 
        employee_code: true,
        email: true,
        status: true,
        is_deleted: true
      }
    });

    if (!newApprover || newApprover.is_deleted || !newApprover.status) {
      res.status(400).json({ 
        error: "Approver baru tidak valid atau tidak aktif" 
      });
      return;
    }

    // Validasi: Cek apakah current approver valid
    const currentApprover = await prismaDB2.mst_authorization.findUnique({
      where: { id: current_auth_id },
      select: { 
        id: true,
        employee_name: true, 
        employee_code: true,
        email: true
      }
    });

    if (!currentApprover) {
      res.status(400).json({ 
        error: "Current approver tidak ditemukan" 
      });
      return;
    }

    // Cek apakah sudah ada pending request untuk approval ini
    const existingRequest = await prismaDB2.tr_approver_change_request.findFirst({
      where: {
        approval_id: approval_id,
        status: 'pending'
      }
    });

    if (existingRequest) {
      res.status(400).json({ 
        error: "Sudah ada request pending untuk approval step ini" 
      });
      return;
    }

    // Create change request
    const changeRequest = await prismaDB2.tr_approver_change_request.create({
      data: {
        proposed_changes_id,
        approval_id,
        current_auth_id,
        new_auth_id,
        reason,
        urgent,
        requested_by: req.user?.employee_code || '',
        requester_auth_id,
        status: 'pending',
        priority: urgent ? 'urgent' : 'normal',
        created_date: new Date()
      },
      include: {
        tr_proposed_changes: {
          select: { 
            project_name: true, 
            item_changes: true,
            status: true,
            progress: true
          }
        },
        mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization: {
          select: { 
            employee_name: true, 
            employee_code: true,
            email: true
          }
        },
        mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization: {
          select: { 
            employee_name: true, 
            employee_code: true,
            email: true
          }
        },
        mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization: {
          select: {
            employee_name: true,
            employee_code: true,
            email: true
          }
        },
        tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval: {
          select: {
            step: true,
            actor: true,
            status: true
          }
        }
      }
    });

    // Send email to admin
    await sendApproverChangeRequestEmail(changeRequest);

    // Create history record
    await prismaDB2.tr_proposed_changes_history.create({
      data: {
        proposed_changes_id,
        auth_id: requester_auth_id,
        description: "Request perubahan approver disubmit",
        note: `Request mengubah approver step ${approval.step} (${approval.actor}) dari ${currentApprover.employee_name} ke ${newApprover.employee_name}. Alasan: ${reason}`,
        status: 'change_requested',
        action_type: 'change_approver',
        related_request_id: changeRequest.id,
        created_date: new Date(),
        created_by: req.user?.employee_code
      }
    });

    res.status(201).json({
      message: "Request perubahan approver berhasil disubmit",
      data: {
        request_id: changeRequest.id,
        proposed_changes: changeRequest.tr_proposed_changes,
        from_approver: changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization,
        to_approver: changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization,
        reason: changeRequest.reason,
        urgent: changeRequest.urgent,
        status: changeRequest.status,
        created_date: changeRequest.created_date
      }
    });

  } catch (error) {
    console.error("❌ Error creating approver change request:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * 2. GET PENDING REQUESTS UNTUK ADMIN
 * Endpoint: GET /api/approver-change/pending
 */
export const getPendingApproverChangeRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const priority = req.query.priority as string;
    const searchTerm = req.query.search as string;

    // Validate admin role
    if (!['admin', 'Super Admin'].includes(req.user?.user_role || '')) {
      res.status(403).json({ error: "Unauthorized: Admin access required" });
      return;
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      status: 'pending',
      is_deleted: false
    };

    if (priority && ['low', 'normal', 'high', 'urgent'].includes(priority)) {
      whereClause.priority = priority;
    }

    if (searchTerm) {
      whereClause.OR = [
        {
          tr_proposed_changes: {
            project_name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        {
          reason: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization: {
            employee_name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        {
          mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization: {
            employee_name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Get requests with pagination
    const [requests, totalCount] = await Promise.all([
      prismaDB2.tr_approver_change_request.findMany({
        where: whereClause,
        include: {
          tr_proposed_changes: {
            select: {
              project_name: true,
              item_changes: true,
              status: true,
              progress: true,
              department: {
                select: { department_name: true }
              },
              plant: {
                select: { plant_name: true }
              }
            }
          },
          mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization: {
            select: {
              employee_name: true,
              employee_code: true,
              email: true
            }
          },
          mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization: {
            select: {
              employee_name: true,
              employee_code: true,
              email: true
            }
          },
          mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization: {
            select: {
              employee_name: true,
              employee_code: true,
              email: true
            }
          },
          tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval: {
            select: {
              step: true,
              actor: true,
              status: true
            }
          }
        },
        orderBy: [
          { urgent: 'desc' },
          { priority: 'desc' },
          { created_date: 'desc' }
        ],
        skip,
        take: limit
      }),
      prismaDB2.tr_approver_change_request.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "Pending approver change requests retrieved successfully",
      data: requests,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error("❌ Error getting pending requests:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * 3. PROCESS REQUEST OLEH ADMIN (APPROVE/REJECT)
 * Endpoint: PATCH /api/approver-change/:id/process
 */
export const processApproverChangeRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_decision } = req.body;
    const admin_auth_id = req.user?.auth_id;

    // Validate input
    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ 
        error: "Status harus 'approved' atau 'rejected'" 
      });
      return;
    }

    if (!admin_decision || admin_decision.trim() === '') {
      res.status(400).json({ 
        error: "Admin decision wajib diisi" 
      });
      return;
    }

    // Validate admin role
    if (!['admin', 'Super Admin'].includes(req.user?.user_role || '')) {
      res.status(403).json({ error: "Unauthorized: Admin access required" });
      return;
    }

    const changeRequest = await prismaDB2.tr_approver_change_request.findUnique({
      where: { id: Number(id) },
      include: {
        tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval: true,
        tr_proposed_changes: {
          select: {
            project_name: true,
            item_changes: true,
            status: true,
            progress: true
          }
        },
        mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization: {
          select: {
            employee_name: true,
            employee_code: true,
            email: true
          }
        },
        mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization: {
          select: {
            employee_name: true,
            employee_code: true,
            email: true
          }
        },
        mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization: {
          select: {
            employee_name: true,
            employee_code: true,
            email: true
          }
        }
      }
    });

    if (!changeRequest) {
      res.status(404).json({ error: "Request tidak ditemukan" });
      return;
    }

    if (changeRequest.status !== 'pending') {
      res.status(400).json({ 
        error: `Request sudah diproses dengan status: ${changeRequest.status}` 
      });
      return;
    }

    // Cek apakah approval masih valid untuk diubah
    const approval = changeRequest.tr_proposed_changes_approval_tr_approver_change_request_approval_idTotr_proposed_changes_approval;
    if (!approval || !['pending', 'on_going'].includes(approval.status || '')) {
      res.status(400).json({ 
        error: `Approval step sudah diproses (${approval?.status}), tidak dapat diubah` 
      });
      return;
    }

    const processedDate = new Date();
    let updatedApproval = null;

    // Update request status
    const updatedRequest = await prismaDB2.tr_approver_change_request.update({
      where: { id: Number(id) },
      data: {
        status: status as 'approved' | 'rejected',
        admin_decision: admin_decision.trim(),
        processed_by: req.user?.employee_code,
        processed_by_auth_id: admin_auth_id,
        processed_date: processedDate
      }
    });

    if (status === 'approved') {
      // Get current version
      const currentApproval = approval;
      const newVersion = (currentApproval?.version || 1) + 1;

      // Update approval with new approver
      updatedApproval = await prismaDB2.tr_proposed_changes_approval.update({
        where: { id: changeRequest.approval_id },
        data: {
          auth_id: changeRequest.new_auth_id,
          version: newVersion,
          original_auth_id: changeRequest.current_auth_id,
          changed_from_request_id: changeRequest.id,
          change_reason: changeRequest.reason,
          changed_by: admin_auth_id,
          changed_date: processedDate,
          is_changed: true,
          note: `Approver diubah dari ${changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization?.employee_name} ke ${changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization?.employee_name} berdasarkan request #${changeRequest.id}. Keputusan admin: ${admin_decision}`
        }
      });

      // Create change history
      await prismaDB2.tr_approver_change_history.create({
        data: {
          approval_id: changeRequest.approval_id,
          proposed_changes_id: changeRequest.proposed_changes_id,
          change_request_id: changeRequest.id,
          action_type: 'change_approved',
          from_auth_id: changeRequest.current_auth_id,
          to_auth_id: changeRequest.new_auth_id,
          version_from: currentApproval?.version || 1,
          version_to: newVersion,
          reason: changeRequest.reason,
          actor_auth_id: admin_auth_id,
          actor_name: req.user?.employee_name,
          actor_role: req.user?.user_role,
          metadata: {
            admin_decision,
            request_id: changeRequest.id,
            processed_by: req.user?.employee_code,
            urgent: changeRequest.urgent,
            priority: changeRequest.priority
          },
          created_date: processedDate,
          ip_address: req.ip || req.socket.remoteAddress
        }
      });

      // Update proposed changes history
      await prismaDB2.tr_proposed_changes_history.create({
        data: {
          proposed_changes_id: changeRequest.proposed_changes_id,
          auth_id: admin_auth_id,
          description: "Approver berhasil diubah oleh admin",
          note: `Approver step ${currentApproval?.step} (${currentApproval?.actor}) diubah dari ${changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization?.employee_name} ke ${changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization?.employee_name}. Keputusan admin: ${admin_decision}`,
          status: 'approver_changed',
          action_type: 'change_approver',
          related_request_id: changeRequest.id,
          created_date: processedDate,
          created_by: req.user?.employee_code
        }
      });
    } else {
      // For rejected requests, just create history
      await prismaDB2.tr_proposed_changes_history.create({
        data: {
          proposed_changes_id: changeRequest.proposed_changes_id,
          auth_id: admin_auth_id,
          description: "Request perubahan approver ditolak oleh admin",
          note: `Request mengubah approver step ${approval?.step} dari ${changeRequest.mst_authorization_tr_approver_change_request_current_auth_idTomst_authorization?.employee_name} ke ${changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization?.employee_name} ditolak. Keputusan admin: ${admin_decision}`,
          status: 'change_rejected',
          action_type: 'change_approver',
          related_request_id: changeRequest.id,
          created_date: processedDate,
          created_by: req.user?.employee_code
        }
      });
    }

    // Send result email to requester
    await sendApproverChangeResultEmail(changeRequest, status, admin_decision);

    // Log notification
    await prismaDB2.tr_notification_log.create({
      data: {
        notification_type: `approver_change_${status}`,
        recipients: [changeRequest.mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization?.email || ''].filter(Boolean),
        sent_count: changeRequest.mst_authorization_tr_approver_change_request_requester_auth_idTomst_authorization?.email ? 1 : 0,
        urgent: changeRequest.urgent,
        related_id: changeRequest.id,
        details: {
          request_id: changeRequest.id,
          admin_decision,
          processed_by: req.user?.employee_code,
          processed_by_name: req.user?.employee_name
        }
      }
    });

    res.status(200).json({
      message: `Request berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`,
      data: {
        request_id: changeRequest.id,
        status: updatedRequest.status,
        admin_decision,
        processed_by: req.user?.employee_name,
        processed_date: processedDate,
        updated_approval: updatedApproval ? {
          id: updatedApproval.id,
          new_approver: changeRequest.mst_authorization_tr_approver_change_request_new_auth_idTomst_authorization,
          version: updatedApproval.version,
          changed_date: updatedApproval.changed_date
        } : null
      }
    });

  } catch (error) {
    console.error("❌ Error processing approver change request:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

