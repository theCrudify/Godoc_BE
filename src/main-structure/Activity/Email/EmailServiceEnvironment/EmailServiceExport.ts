import nodemailer from 'nodemailer';
import { prismaDB2 } from "../../../../config/database";


// Definisi tipe untuk parameter email
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string;
}

const sendEmail = async ({ to, subject, html, cc = '' }: EmailOptions) => {
  try {
    const timestamp = Date.now();
    const plainText = html.replace(/<[^>]+>/g, ' '); // Konversi ke text biasa

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: false,
    });

    const uniqueSubject = `${subject} [${timestamp.toString().slice(-6)}]`;

    const mailOptions: any = {
      from: `"Go-Document System" <${process.env.SMTP_USER}>`,
      to,
      cc: cc || undefined,
      subject: uniqueSubject,
      html,
      text: plainText,
      messageId: `<${timestamp}-${Math.random().toString(36).substring(2, 10)}@aio.co.id>`,
      headers: {
        'X-Entity-Ref-ID': `${timestamp}-${Math.random().toString(36).substring(2, 8)}`,
        'X-Unique-ID': `${timestamp}`,
        'X-Mailer': 'GoDocumentMailer',
        'X-No-Auto-Attach': 'true'
      }
    };

    const info = await transport.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}${cc ? ` (cc: ${cc})` : ''}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Mendapatkan salam berdasarkan waktu saat ini
const getGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Selamat Pagi";
    } else if (hour >= 12 && hour < 15) {
        return "Selamat Siang";
    } else if (hour >= 15 && hour < 19) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
};

// Mendapatkan informasi running number dari dokumen
const getDocumentNumber = async (proposedChangesId: number): Promise<string> => {
    try {
        const proposedChange = await prismaDB2.tr_proposed_changes.findUnique({
            where: { id: proposedChangesId },
            include: {
                documentNumber: true
            }
        });

        if (!proposedChange || !proposedChange.documentNumber) {
            return "N/A";
        }

        return proposedChange.documentNumber.running_number || "N/A";
    } catch (error) {
        console.error("Error fetching document number:", error);
        return "N/A";
    }
};

// Mendapatkan gender title (Bapak/Ibu)
const getGenderTitle = (gender?: 'M' | 'F' | null): string => {
  return gender === 'F' ? 'Ibu' : 'Bapak';
};


// Mendapatkan format status untuk notifikasi
const getStatusText = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'DISETUJUI';
        case 'not_approved':
            return 'TIDAK DISETUJUI';
        case 'rejected':
            return 'DITOLAK';
        case 'on_going':
            return 'SEDANG DIPROSES';
        default:
            return status.toUpperCase();
    }
};


export {  getStatusText, sendEmail, getDocumentNumber, getGenderTitle, getGreeting  };