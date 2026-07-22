import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const smtpFrom = process.env.SMTP_FROM || 'info@alduraymih-law.sa';
const firmEmail = process.env.FIRM_NOTIFICATION_EMAIL || 'nio038758@gmail.com';

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

// Stylized Green/Gold Email Template Wrappers
const getEmailTemplate = (title: string, bodyContent: string, isRTL: boolean = true) => {
    const dir = isRTL ? 'rtl' : 'ltr';
    const align = isRTL ? 'right' : 'left';
    return `
    <div style="background-color: #f7f9f7; padding: 2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ${dir}; text-align: ${align};">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e1e7e2; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <!-- Header -->
            <tr style="background-color: #1a3020; text-align: center;">
                <td style="padding: 20px;">
                    <h1 style="color: #c5a880; margin: 0; font-size: 1.5rem; letter-spacing: 1px; font-weight: 500;">
                        د. سعود بن فهد الدريميح للمحاماة
                    </h1>
                    <div style="color: #ffffff; font-size: 0.85rem; margin-top: 5px;">Advocacy, Arbitration & Notarization</div>
                </td>
            </tr>
            <!-- Content -->
            <tr>
                <td style="padding: 40px 30px; color: #2c3e35; font-size: 1rem; line-height: 1.6;">
                    <h2 style="color: #1a3020; font-size: 1.25rem; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-top: 0;">${title}</h2>
                    ${bodyContent}
                </td>
            </tr>
            <!-- Footer -->
            <tr style="background-color: #f1f4f2; text-align: center; color: #6b7a72; font-size: 0.8rem;">
                <td style="padding: 20px; border-top: 1px solid #e1e7e2;">
                    <p style="margin: 0 0 5px 0;">مكتب الدكتور سعود بن فهد الدريميح للمحاماة والاستشارات القانونية والتوثيق</p>
                    <p style="margin: 0;">الرياض، المملكة العربية السعودية</p>
                </td>
            </tr>
        </table>
    </div>
    `;
};

export class EmailService {
    async sendConsultationAlert(consultation: any, files: any[]) {
        const title = `طلب استشارة جديد - رقم المرجع: ${consultation.referenceNumber}`;
        
        let filesListHTML = '<p>لا توجد مستندات مرفقة.</p>';
        if (files && files.length > 0) {
            filesListHTML = '<ul style="padding-right: 20px; line-height: 1.8; color: #1a3020;">';
            files.forEach(f => {
                filesListHTML += `<li>${f.fileName} (${(f.fileSize / 1024 / 1024).toFixed(2)} MB) - [المسار المحلي: ${f.filePath}]</li>`;
            });
            filesListHTML += '</ul>';
        }

        const bodyContent = `
            <p>مرحباً بك،</p>
            <p>تلقى النظام طلب استشارة جديداً بالتفاصيل التالية:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold; width: 140px;">الاسم الكامل:</td><td style="padding: 8px;">${consultation.fullName}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">رقم الجوال:</td><td style="padding: 8px;">${consultation.phone}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">البريد الإلكتروني:</td><td style="padding: 8px;">${consultation.email || 'لم يتم تقديمه'}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">المنشأة/الشركة:</td><td style="padding: 8px;">${consultation.company || 'لم يتم تقديمه'}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">الخدمة المطلوبة:</td><td style="padding: 8px;">${consultation.service || 'غير محدد'}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">درجة الأولوية:</td><td style="padding: 8px; color: ${consultation.priority === 'Emergency' ? 'red' : consultation.priority === 'Urgent' ? 'orange' : 'green'};">${consultation.priority}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">تفاصيل الرسالة:</td><td style="padding: 8px;">${consultation.message}</td></tr>
            </table>
            
            <h3 style="color: #1a3020; font-size: 1.1rem; border-bottom: 1px solid #c5a880; padding-bottom: 5px; margin-top: 20px;">المرفقات المرفوعة:</h3>
            ${filesListHTML}
            
            <p style="margin-top: 30px;">
                <a href="${process.env.CORS_ORIGIN || 'http://localhost:8000'}/admin" style="background-color: #1a3020; color: #c5a880; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
                    فتح لوحة التحكم للمراجعة
                </a>
            </p>
        `;

        const htmlContent = getEmailTemplate(title, bodyContent, true);

        await transporter.sendMail({
            from: smtpFrom,
            to: firmEmail,
            subject: `[جديد] ${title}`,
            html: htmlContent
        });
    }

    async sendClientConfirmation(consultation: any) {
        if (!consultation.email) return;

        const titleAr = `تم استلام طلب استشارتك بنجاح - رقم المرجع: ${consultation.referenceNumber}`;
        const bodyContentAr = `
            <p>عزيزنا العميل <strong>${consultation.fullName}</strong>،</p>
            <p>نشكرك على تواصلك مع مكتب الدكتور سعود بن فهد الدريميح للمحاماة والاستشارات القانونية.</p>
            <p>نود إفادتك بأنه قد تم استلام طلب استشارتك بنجاح وتحمل الرقم المرجعي التالي:</p>
            <div style="background-color: #f1f4f2; border: 1px dashed #c5a880; padding: 15px; font-size: 1.25rem; font-weight: bold; text-align: center; color: #1a3020; margin: 20px 0; border-radius: 4px;">
                ${consultation.referenceNumber}
            </div>
            <p>يقوم مستشارونا القانونيون حالياً بدراسة طلبك ومراجعة المرفقات (إن وجدت). سنتواصل معك خلال 24 ساعة عمل لتنسيق الخطوات التالية.</p>
            <p>تقبلوا خالص التحية والتقدير،</p>
        `;

        const titleEn = `Your Consultation Request Received - Reference: ${consultation.referenceNumber}`;
        const bodyContentEn = `
            <p>Dear Valued Client <strong>${consultation.fullName}</strong>,</p>
            <p>Thank you for contacting the Law Office of Dr. Saud bin Fahd Al-Duraymih.</p>
            <p>This is to confirm that we have successfully received your consultation request under the following reference ID:</p>
            <div style="background-color: #f1f4f2; border: 1px dashed #c5a880; padding: 15px; font-size: 1.25rem; font-weight: bold; text-align: center; color: #1a3020; margin: 20px 0; border-radius: 4px;">
                ${consultation.referenceNumber}
            </div>
            <p>Our legal experts are currently reviewing your request details and attachments. We will reach out to you within 24 business hours to discuss the next steps.</p>
            <p>Best regards,</p>
        `;

        const isAR = consultation.language !== 'en';
        const title = isAR ? titleAr : titleEn;
        const body = isAR ? bodyContentAr : bodyContentEn;
        const htmlContent = getEmailTemplate(title, body, isAR);

        await transporter.sendMail({
            from: smtpFrom,
            to: consultation.email,
            subject: title,
            html: htmlContent
        });
    }

    async sendPasswordResetEmail(email: string, resetUrl: string) {
        const title = 'طلب إعادة تعيين كلمة المرور / Password Reset Request';
        const bodyContent = `
            <p>مرحباً،</p>
            <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في لوحة التحكم لمكتب المحاماة.</p>
            <p>إذا كنت من قام بهذا الطلب، يرجى الضغط على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
            <p style="margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #1a3020; color: #c5a880; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
                    إعادة تعيين كلمة المرور / Reset Password
                </a>
            </p>
            <p>ملاحظة: هذا الرابط صالح لمدة ساعة واحدة فقط من وقت إصدار هذا البريد.</p>
            <p>إذا لم تكن أنت من طلب هذا التغيير، يرجى تجاهل هذا البريد تماماً.</p>
        `;

        const htmlContent = getEmailTemplate(title, bodyContent, true);

        await transporter.sendMail({
            from: smtpFrom,
            to: email,
            subject: title,
            html: htmlContent
        });
    }

    async sendEmailVerification(email: string, verifyUrl: string) {
        const title = 'تفعيل الحساب / Account Verification';
        const bodyContent = `
            <p>مرحباً،</p>
            <p>يرجى تفعيل حسابك الإداري بالضغط على رابط التأكيد أدناه:</p>
            <p style="margin: 20px 0;">
                <a href="${verifyUrl}" style="background-color: #1a3020; color: #c5a880; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
                    تفعيل الحساب / Activate Account
                </a>
            </p>
            <p>إذا لم تطلب إنشاء هذا الحساب، يرجى تجاهل هذا البريد.</p>
        `;

        const htmlContent = getEmailTemplate(title, bodyContent, true);

        await transporter.sendMail({
            from: smtpFrom,
            to: email,
            subject: title,
            html: htmlContent
        });
    }

    async sendConsultationReminder(email: string, name: string, dateStr: string, refId: string) {
        const title = 'تذكير بموعد الاستشارة القانونية / Consultation Appointment Reminder';
        const bodyContent = `
            <p>عزيزنا العميل <strong>${name}</strong>،</p>
            <p>نود تذكيركم بموعد جلستكم الاستشارية القانونية المجدولة:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">رقم الطلب:</td><td style="padding: 8px;">${refId}</td></tr>
                <tr style="border-bottom: 1px solid #e1e7e2;"><td style="padding: 8px; font-weight: bold;">الموعد المجدول:</td><td style="padding: 8px;">${dateStr}</td></tr>
            </table>
            <p>إذا كان لديكم أي تعديلات على الموعد، يرجى التواصل معنا فوراً عبر رقم الهاتف أو الواتساب.</p>
        `;

        const htmlContent = getEmailTemplate(title, bodyContent, true);

        await transporter.sendMail({
            from: smtpFrom,
            to: email,
            subject: title,
            html: htmlContent
        });
    }
}

export const emailService = new EmailService();

// Support legacy functional exports
export const sendConsultationAlert = (c: any, f: any[]) => emailService.sendConsultationAlert(c, f);
export const sendClientConfirmation = (c: any) => emailService.sendClientConfirmation(c);
export const sendPasswordResetEmail = (e: string, u: string) => emailService.sendPasswordResetEmail(e, u);
