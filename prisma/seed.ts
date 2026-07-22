import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper content generators matching client/blog-data.js
function generateLegalEssayContent(title: string, categoryName: string) {
    const intro = `تحظى البيئة النظامية في المملكة العربية السعودية بتطور متسارع وغير مسبوق، تماشياً مع مستهدفات رؤية المملكة ٢٠٣٠ التي تسعى إلى تعزيز الجاذبية الاستثمارية ورفع مستوى الحوكمة والامتثال في كافة القطاعات الاقتصادية والاجتماعية. وفي هذا السياق، يأتي هذا البحث القانوني المعمق تحت عنوان "${title}" ليلقي الضوء على الأبعاد النظامية والقضائية لهذا الموضوع الحيوي، ومناقشة تفاصيله وتأثيره على الأفراد والشركات على حد سواء. إن فهم القوانين واللوائح التنظيمية لا يمثل مجرد إجراء شكلي، بل هو ركيزة أساسية لحماية الحقوق والوقاية من المنازعات القضائية التي قد تستنزف موارد المنشآت المالية والزمنية. يسعى مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية من خلال هذا التحليل القانوني المتخصص إلى تقديم دليل عملي واستشاري يجمع بين التأصيل الفقهي والخبرة القضائية العريقة.`;
    const section1Title = `أولاً: الإطار النظامي والتنظيمي المعمول به في المملكة العربية السعودية`;
    const section1Text = `إن تنظيم المسائل المتعلقة بـ ${categoryName} يخضع لشبكة متكاملة من القوانين واللوائح الصادرة عن الجهات التشريعية والتنفيذية في المملكة العربية السعودية، مثل وزارة العدل، وزارة التجارة، وزارة الموارد البشرية والتنمية الاجتماعية، وهيئة المقاولين والمهندسين والجهات الرقابية ذات العلاقة. على سبيل المثال، فإن نظام المعاملات المدنية الصادر مؤخراً، ونظام الشركات الجديد، ونظام العمل، ونظام التحكيم، يمثلون البنية التحتية الصلبة التي تدعم استقرار التعاملات المالية والمهنية.`;
    const section2Title = `ثانياً: التحليل القانوني والمخاطر المترتبة على عدم الامتثال أو ضعف الصياغة`;
    const section2Text = `تترتب على إغفال الجوانب التفصيلية في هذا المجال مخاطر نظامية ومالية جسيمة. ففي قضايا الشركات والتجارة، قد يؤدي غياب الحوكمة السليمة إلى إثارة المسؤولية التضامنية والشخصية للمديرين وأعضاء مجلس الإدارة عن ديون الشركة، أو التعرض لغرامات مالية قاسية من وزارة التجارة وهيئة السوق المالية. كما أن النزاعات الشريكة والتصفيات القضائية غالباً ما تعود لثغرات في عقود التأسيس أو اتفاقيات الشركاء الأولى التي لم تحدد بوضوح آليات التخارج وتقييم الحصص وفض النزاعات.`;
    const section3Title = `ثالثاً: دراسة تطبيقية وتوصيات وقائية عملية لحماية المنشآت والأفراد`;
    const section3Text = `من خلال القضايا المتنوعة التي باشرها مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية، نجد أن الوقاية القانونية والتخطيط الاستباقي هما دائماً الخيار الأقل تكلفة والأكثر أماناً لحماية المكتسبات وتفادي الخصومة القضائية. نوصي باتباع الخطوات والممارسات التالية لضمان السلامة القانونية المطلقة وتفادي النزاعات المستمرة:
    ١. المراجعة الدورية للعقود والاتفاقيات: يجب إخضاع كافة العقود والاتفاقيات ومذكرات التفاهم لمراجعة وتدقيق سنوي من قبل مستشار قانوني مرخص لضمان مواكبتها لأحدث الأنظمة والتعاميم الحكومية والقرارات القضائية التفسيرية الصادرة من المحكمة العليا.
    ٢. إدراج شرط التحكيم المصاغ بعناية: يُنصح بشدة بإدراج شرط تحكيم متكامل ومصاغ بطريقة علمية في العقود التجارية والاتفاقيات الاستثمارية، يحدد فيه مكان التحكيم، والقانون الواجب التطبيق، وعدد المحكمين، لضمان فض أي نزاع ينشأ بسرعة وسرية دون الحاجة لانتظار جلسات المحاكم العامة الطويلة.`;
    const conclusion = `ختاماً، إن التطور التشريعي المذهل الذي تشهده المملكة العربية السعودية يمثل فرصة عظيمة لنمو الاستثمار والأعمال في ظل بيئة نظامية آمنة وعادلة وشفافة. ومع ذلك، فإن هذا التطور المتسارع يتطلب يقظة قانونية دائمة ووعياً شاملاً بالحقوق والالتزامات. نأمل أن يكون هذا البحث القانوني المعمق قد قدم إجابات واضحة وتوصيات مفيدة تساهم في تعزيز ثقافة الامتثال والوعي النظامي.`;

    return `<div class="legal-article-content">${intro}<br><br><h3>${section1Title}</h3><p>${section1Text}</p><br><h3>${section2Title}</h3><p>${section2Text}</p><br><h3>${section3Title}</h3><p>${section3Text}</p><br><h3>الخلاصة والتوصيات النهائية</h3><p>${conclusion}</p></div>`;
}

function generateLegalEssayContentEN(title: string, categoryNameEN: string) {
    const intro = `The regulatory environment in the Kingdom of Saudi Arabia is witnessing rapid and unprecedented development, in line with the objectives of Saudi Vision 2030, which seeks to enhance investment attractiveness and raise the level of governance and compliance across all economic and social sectors. In this context, this in-depth legal research under the title "${title}" sheds light on the regulatory and judicial dimensions of this vital topic, discussing its details and impact on both individuals and companies. Understanding laws and executive regulations is not a mere formality, but a fundamental pillar for protecting rights and preventing judicial disputes that may drain corporate financial and time resources. The Law Firm of Dr. Saud bin Fahd Al-Duraymih for Advocacy, Arbitration, and Notarization seeks, through this specialized legal analysis, to provide a practical and advisory guide combining academic depth with seasoned judicial experience.`;
    const section1Title = `First: The Applicable Regulatory & Legislative Framework in the Kingdom of Saudi Arabia`;
    const section1Text = `The regulation of matters related to ${categoryNameEN} is subject to an integrated network of laws and regulations issued by legislative and executive authorities in the Kingdom of Saudi Arabia, such as the Ministry of Justice, the Ministry of Commerce, the Ministry of Human Resources and Social Development, the Saudi Contractors Authority, and relevant regulatory bodies. For instance, the recently enacted Civil Transactions Law, the new Companies Law, the Labor Law, and the Arbitration Law represent the solid infrastructure supporting the stability of financial and professional transactions.`;
    const section2Title = `Second: Legal Analysis and Risks of Non-Compliance or Poor Drafting`;
    const section2Text = `Neglecting detailed aspects in this field entails severe legal and financial risks. In corporate and commercial disputes, the absence of proper governance may trigger joint and personal liability for managers and board members regarding corporate debts, or lead to harsh financial penalties from the Ministry of Commerce and the Capital Market Authority. Furthermore, shareholder disputes and judicial liquidations are often traced back to loopholes in incorporation contracts or initial shareholder agreements that failed to define exit mechanisms, share valuation, and dispute resolution paths clearly.`;
    const section3Title = `Third: Practical Study and Preventive Recommendations for Protecting Businesses & Individuals`;
    const section3Text = `Based on the diverse cases handled by the Law Office of Dr. Saud bin Fahd Al-Duraymih for Advocacy and Legal Consultations, we find that legal prevention and proactive planning are always the least expensive and safest options to protect gains and avoid judicial disputes. We recommend following these practices to ensure absolute legal safety and avoid ongoing conflicts:
    1. Periodic Review of Contracts: All contracts, agreements, and memorandums of understanding should be subject to an annual review by a licensed legal consultant to ensure compliance with the latest government regulations, circulars, and interpretative judicial rulings issued by the Supreme Court.
    2. Careful Drafting of the Arbitration Clause: It is highly recommended to include a comprehensive, professionally drafted arbitration clause in commercial contracts and investment agreements, specifying the place of arbitration, the applicable law, and the number of arbitrators to ensure any arising dispute is resolved swiftly and confidentially without waiting for public court sessions.`;
    const conclusion = `In conclusion, the remarkable legislative development in the Kingdom of Saudi Arabia represents a great opportunity for the growth of investments and businesses under a safe, fair, and transparent regulatory environment. However, this rapid development requires constant legal vigilance and comprehensive awareness of rights and obligations. We hope that this in-depth legal research has provided clear answers and useful recommendations contributing to the culture of compliance and regulatory awareness.`;

    return `<div class="legal-article-content-en" style="direction: ltr; text-align: left; font-family: sans-serif;">${intro}<br><br><h3>${section1Title}</h3><p>${section1Text}</p><br><h3>${section2Title}</h3><p>${section2Text}</p><br><h3>${section3Title}</h3><p>${section3Text}</p><br><h3>Conclusion & Final Recommendations</h3><p>${conclusion}</p></div>`;
}

function generateUniqueArticleContent(title: string, category: string, categoryName: string, keyword: string) {
    const intro = `تعد دراسة المسائل النظامية المتعلقة بـ "${keyword}" في الرياض إحدى المتطلبات الضرورية للمنشآت التجارية والشركات لضمان الاستدامة وتجنب الغرامات والمنازعات القضائية المعقدة. يسعى هذا التحليل التوضيحي المقدم من مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية إلى تبيان القواعد الإجرائية والأنظمة الأساسية المطبقة.`;
    const section1Title = `أولاً: المتطلبات القانونية والامتثال في الرياض لـ ${keyword}`;
    const section1Text = `عند التعامل مع تطبيقات ${keyword}، يجب الالتزام الكامل بنظام المعاملات المدنية ونظام الشركات السعودي الجديد. يشمل ذلك التأكد من صحة الصياغات التعاقدية وتسجيل المستندات بصورة رسمية إلكترونياً وتفادي أي ثغرات قد تعرض المنشأة للمسؤوليات التضامنية أو الغرامات.`;
    return `<div class="legal-article-analysis"><p>${intro}</p><br><h3>${section1Title}</h3><p>${section1Text}</p><br><p style="font-weight: 700; color: var(--color-green);">لمزيد من الاستفسارات المتخصصة حول ${keyword}، يسعدنا تواصلكم المباشر لحجز موعد استشارة قانونية مخصصة.</p></div>`;
}

function generateUniqueArticleContentEN(title: string, category: string, categoryNameEN: string, keywordEN: string) {
    const intro = `Studying the regulatory matters related to "${keywordEN}" in Riyadh is one of the necessary requirements for commercial entities and companies to ensure sustainability and avoid fines and complex judicial disputes. This explanatory analysis, provided by the Law Office of Dr. Saud bin Fahd Al-Duraymih for Advocacy, Arbitration, and Notarization, aims to clarify the applicable procedural rules and basic regulations.`;
    const section1Title = `First: Legal Requirements and Compliance in Riyadh for ${keywordEN}`;
    const section1Text = `When dealing with the applications of ${keywordEN}، one must fully comply with the Civil Transactions Law and the new Saudi Companies Law. This includes ensuring the validity of contractual drafting, officially registering documents electronically, and avoiding any loopholes that may expose the establishment to joint liability or fines.`;
    return `<div class="legal-article-analysis-en" style="direction: ltr; text-align: left; font-family: sans-serif;"><p>${intro}</p><br><h3>${section1Title}</h3><p>${section1Text}</p><br><p style="font-weight: 700; color: var(--color-green);">For more specialized inquiries regarding ${keywordEN}, we are pleased to have you contact us directly to schedule a dedicated legal consultation.</p></div>`;
}

function generateCriminalArticleContent(background: string, regulations: string, examples: string, faqs: any[], conclusion: string) {
    let faqHTML = '';
    if (faqs && faqs.length > 0) {
        faqHTML = '<h3>الأسئلة الشائعة حول هذا الموضوع</h3>';
        faqs.forEach(faq => {
            faqHTML += `<p><strong>س: ${faq.q}</strong><br>ج: ${faq.a}</p><br>`;
        });
    }
    return `<div class="legal-article-content"><p><strong>مقدمة:</strong> يعتبر فهم الأبعاد النظامية والجنائية في المملكة العربية السعودية من الركائز الأساسية لحماية الحقوق والمكتسبات، وتجنب المسؤوليات الجزائية. تهدف هذه الدراسة النظامية التثقيفية الصادرة عن مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية إلى تقديم تحليل قانوني رصين ومبسط لأهم القواعد والإجراءات المعمول بها.</p><br><h3>أولاً: الخلفية النظامية والبيئة التشريعية</h3><p>${background}</p><br><h3>ثانياً: الأنظمة واللوائح السعودية ذات العلاقة</h3><p>${regulations}</p><br><h3>ثالثاً: تطبيقات عملية وأمثلة واقعية</h3><p>${examples}</p><br>${faqHTML}<h3>الخلاصة والتوصيات النهائية</h3><p>${conclusion}</p><br><p style="font-size: 0.85rem; color: var(--color-text-light); font-style: italic; border-top: 1px solid rgba(68,112,75,0.1); padding-top: 10px;">إخلاء مسؤولية: هذا المقال مخصص لأغراض التثقيف والوعي النظامي العام فقط، ولا يمثل استشارة قانونية رسمية. لمناقشة تفاصيل قضيتكم وحجز موعد، يرجى التواصل مباشرة مع فريقنا القانوني.</p></div>`;
}

function generateCriminalArticleContentEN(backgroundEN: string, regulationsEN: string, summaryEN: string) {
    return `<div class="legal-article-content-en" style="direction: ltr; text-align: left; font-family: sans-serif;"><h4 style="color: var(--color-green); margin-bottom: 0.5rem; font-weight: 700;">Executive Summary</h4><p style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text-dark); margin-bottom: 1.5rem;">${summaryEN}</p><h4 style="color: var(--color-green); margin-bottom: 0.5rem; font-weight: 700;">Legal & Regulatory Background</h4><p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-text-light); margin-bottom: 1.5rem;">${backgroundEN}</p><h4 style="color: var(--color-green); margin-bottom: 0.5rem; font-weight: 700;">Key Applicable Saudi Regulations</h4><p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-text-light); margin-bottom: 1.5rem;">${regulationsEN}</p><p style="font-size: 0.8rem; color: var(--color-text-light); font-style: italic; border-top: 1px solid rgba(68,112,75,0.1); padding-top: 10px; margin-top: 20px;">Disclaimer: This summary is provided for general informational and educational purposes only, and does not constitute formal legal advice. For detailed legal assistance regarding your specific situation, please schedule a consultation with our legal office.</p></div>`;
}

async function main() {
  console.log("Seeding database values...");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const defaultPass = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminEmail || !defaultPass || defaultPass.length < 12) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD (minimum 12 characters) are required to seed the administrator."
    );
  }

  // 1. Seed Roles
  const roles = [
    { name: "Super Admin", description: "صلاحيات كاملة لكافة أجزاء النظام وإدارة المستخدمين والصلاحيات وسجلات النشاط." },
    { name: "Admin", description: "صلاحيات كافة أجزاء النظام والخدمات والمدونة والاستشارات ما عدا التعديل على المستخدمين والصلاحيات." },
    { name: "Editor", description: "صلاحيات كاملة مثل الأدمن لكافة الخدمات والمدونة والاستشارات والإعدادات ما عدا التعديل على المستخدمين والصلاحيات." },
    { name: "Reception", description: "صلاحيات العرض والمراجعة فقط للاستشارات والبيانات بدون إمكانية التعديل أو الإضافة أو الحذف." }
  ];

  const dbRoles = [];
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role
    });
    dbRoles.push(r);
  }

  // 2. Seed Permissions
  const permissions = [
    { name: "manage_blog", description: "Ability to draft, edit, publish, or delete blog articles and categories." },
    { name: "view_consultations", description: "Access to view lists and detail cards of client consultations." },
    { name: "edit_consultations", description: "Ability to update statuses, assign staff, and edit consultation notes." },
    { name: "edit_settings", description: "Access to update general site configurations like office hours, phone, and logos." },
    { name: "manage_users", description: "Create, view, activate, edit or delete admin staff users (Super Admin only)." },
    { name: "view_audit_logs", description: "View comprehensive system audit logs of staff activity (Super Admin only)." }
  ];

  const dbPermissions = {};
  for (const perm of permissions) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
    dbPermissions[perm.name] = p;
  }

  // 3. Connect Role-Permissions mapping
  const superAdminRole = dbRoles.find(r => r.name === "Super Admin")!;
  const adminRole = dbRoles.find(r => r.name === "Admin")!;
  const editorRole = dbRoles.find(r => r.name === "Editor")!;
  const receptionRole = dbRoles.find(r => r.name === "Reception")!;

  // Clear existing role-permissions for precise sync
  await prisma.rolePermission.deleteMany({
    where: {
      roleId: {
        in: [superAdminRole.id, adminRole.id, editorRole.id, receptionRole.id]
      }
    }
  });

  // Map Super Admin to all permissions
  for (const pName of Object.keys(dbPermissions)) {
    const p = dbPermissions[pName];
    await prisma.rolePermission.create({
      data: { roleId: superAdminRole.id, permissionId: p.id }
    });
  }

  // Map Admin permissions (Everything EXCEPT manage_users)
  const adminPerms = ["manage_blog", "view_consultations", "edit_consultations", "edit_settings", "view_audit_logs"];
  for (const pName of adminPerms) {
    const p = dbPermissions[pName];
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: p.id }
    });
  }

  // Map Editor permissions (Same as Admin)
  const editorPerms = ["manage_blog", "view_consultations", "edit_consultations", "edit_settings", "view_audit_logs"];
  for (const pName of editorPerms) {
    const p = dbPermissions[pName];
    await prisma.rolePermission.create({
      data: { roleId: editorRole.id, permissionId: p.id }
    });
  }

  // Map Reception permissions (View & Review only - no edit/delete/manage permissions)
  const receptionPerms = ["view_consultations"];
  for (const pName of receptionPerms) {
    const p = dbPermissions[pName];
    await prisma.rolePermission.create({
      data: { roleId: receptionRole.id, permissionId: p.id }
    });
  }

  // 4. Seed the initial Super Admin from environment variables.
  const hash = bcrypt.hashSync(defaultPass, 12);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      fullName: "المدير العام (سوبر أدمن)",
      email: adminEmail,
      passwordHash: hash,
      roleId: superAdminRole.id,
      isActive: true
    }
  });

  // 5. Seed WebsiteSettings
  const settings = [
    { key: "phone", value: "+966500000000", description: "رقم الهاتف والاتصال المباشر" },
    { key: "whatsapp", value: "966500000000", description: "رقم المحادثة والاتصال الفوري بالواتساب" },
    { key: "email", value: "info@alduraymih-law.sa", description: "البريد الإلكتروني للمكتب" },
    { key: "address_ar", value: "الرياض، حي النخيل، طريق الملك فهد", description: "العنوان الرئيسي للمكتب (عربي)" },
    { key: "address_en", value: "Riyadh, Al-Nakheel District, King Fahd Road", description: "العنوان الرئيسي للمكتب (إنجليزي)" },
    { key: "office_hours_ar", value: "الأحد - الخميس (٨:٠٠ ص - ٥:٠٠ م)", description: "مواعيد وأوقات العمل الرسمية (عربي)" },
    { key: "office_hours_en", value: "Sunday - Thursday (8:00 AM - 5:00 PM)", description: "مواعيد وأوقات العمل الرسمية (إنجليزي)" },
    { key: "logo_dark", value: "logo-dark.png", description: "ملف الشعار المظلم" },
    { key: "logo_light", value: "logo-light.png", description: "ملف الشعار المضيء" },
    { key: "meta_title_ar", value: "مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية", description: "عنوان الموقع الرئيسي لمحركات البحث (عربي)" },
    { key: "meta_title_en", value: "Law Office of Advocate/ Dr. Saud bin Fahd Al-Duraymih for Advocacy & Legal Consultations", description: "عنوان الموقع الرئيسي لمحركات البحث (إنجليزي)" },
    { key: "meta_description_ar", value: "يقدم مكتب الدكتور سعود بن فهد الدريميح خدمات محاماة، استشارات قانونية، توثيق فوري، تحكيم تجاري ومنازعات عمالية للشركات والأفراد بالرياض.", description: "شرح الموقع لمحركات البحث (عربي)" },
    { key: "meta_description_en", value: "Dr. Saud bin Fahd Al-Duraymih Law Firm offers legal advocacy, corporate governance, notarization, and arbitration services in Riyadh.", description: "شرح الموقع لمحركات البحث (إنجليزي)" }
  ];

  for (const set of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: set.key },
      update: {},
      create: set
    });
  }

  // 6. Seed Legal Services
  const services = [
    {
      slug: "integrated-corporate-law",
      titleAr: "الإدارة القانونية المتكاملة",
      titleEn: "Integrated Legal Administration",
      descriptionAr: "تقدم دعماً قانونياً دائماً للشركات والمنشآت من خلال إدارة قانونية شاملة تشمل الاستشارات، العقود، السياسات، الامتثال، وتمثيل الشركة قانونياً، بما يضمن استقرارها وحمايتها من المخاطر.",
      descriptionEn: "Provides continuous legal support to companies and establishments through comprehensive legal management including consultations, contracts, policies, compliance, and legal representation of the company, ensuring its stability and protection from risks.",
      icon: "fa-building-shield",
      isActive: true,
      orderIndex: 1
    },
    {
      slug: "litigation-arbitration",
      titleAr: "التمثيل القضائي والتحكيم",
      titleEn: "Litigation & Arbitration",
      descriptionAr: "تقدم تمثيلاً قانونياً شاملاً أمام المحاكم والجهات القضائية. وندير قضايا التحكيم والنزاعات التجارية باحترافية تامة، لضمان حماية حقوق العميل وتسريع مسار الفصل.",
      descriptionEn: "Provides comprehensive legal representation before courts and judicial bodies. We manage arbitration cases and commercial disputes with utmost professionalism to protect the client's rights and expedite resolution.",
      icon: "fa-gavel",
      isActive: true,
      orderIndex: 2
    },
    {
      slug: "contract-drafting-review",
      titleAr: "صياغة ومراجعة العقود والاتفاقيات",
      titleEn: "Drafting & Reviewing Contracts and Agreements",
      descriptionAr: "تعد وتراجع العقود بجميع أنواعها لضمان وضوح الالتزامات وحماية الحقوق، وتصيغ الاتفاقيات بطريقة دقيقة تقلل النزاعات وتعزز القوة التفاوضية للعميل.",
      descriptionEn: "Prepares and reviews all types of contracts to ensure clarity of obligations and protection of rights, and drafts agreements precisely to minimize disputes and strengthen the client's negotiating power.",
      icon: "fa-file-signature",
      isActive: true,
      orderIndex: 3
    },
    {
      slug: "debt-collection",
      titleAr: "تحصيل الديون وتنفيذ السندات",
      titleEn: "Debt Collection & Enforcement of Deeds",
      descriptionAr: "تقدم خدمة احترافية لتنفيذ الأحكام والسندات التنفيذية مثل الشيكات والسندات لأمر والكمبيالات، وتتولى إدارة ملفات التحصيل المتعثر حتى استرجاع المبالغ المستحقة.",
      descriptionEn: "Provides professional service for executing judgments and executive deeds such as checks, promissory notes, and bills of exchange, and handles delinquent accounts until recovery.",
      icon: "fa-briefcase",
      isActive: true,
      orderIndex: 4
    },
    {
      slug: "family-business-governance",
      titleAr: "تنظيم الثروات والشركات العائلية",
      titleEn: "Wealth Management & Family Businesses",
      descriptionAr: "تنظم العلاقة بين الشركاء والورثة في الكيانات العائلية. وتعد مواثيق الحوكمة واتفاقيات الإدارة والتوريث، لضمان استمرارية النشاط ومنع النزاعات المستقبلية.",
      descriptionEn: "Regulates relationships between partners and heirs in family entities. Prepares governance charters, management and succession agreements to ensure business continuity and prevent future disputes.",
      icon: "fa-sitemap",
      isActive: true,
      orderIndex: 5
    },
    {
      slug: "company-setup-liquidation",
      titleAr: "تأسيس وتصفية الشركات والكيانات",
      titleEn: "Company Setup & Liquidation",
      descriptionAr: "تؤسس الشركات والكيانات النظامية بكافة أنواعها. وتدير تصفيتها عند الحاجة بطريقة قانونية منظمة تشمل التوثيق، الحصر، وإنهاء العلاقة مع الجهات الرسمية.",
      descriptionEn: "Establishes all types of companies and legal entities. Manages their liquidation when needed in a legal and organized manner, including documentation, inventory, and closing official relations.",
      icon: "fa-globe",
      isActive: true,
      orderIndex: 6
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s
    });
  }

  // 7. Seed FAQs
  const faqs = [
    {
      questionAr: "كيف يمكنني تقديم طلب استشارة قانونية؟",
      questionEn: "How can I request a legal consultation?",
      answerAr: "يمكنك تعبئة نموذج حجز الاستشارة المكون من 3 خطوات على صفحة 'اتصل بنا' وإرفاق أي مستندات لازمة، وسيقوم فريقنا القانوني بمراجعتها والتواصل معكم هاتفياً أو عبر الواتساب والبريد الإلكتروني خلال 24 ساعة.",
      answerEn: "You can fill out the 3-step consultation booking form on the 'Contact Us' page and attach any supporting files. Our legal team will review them and contact you within 24 hours via phone, WhatsApp, or email.",
      isActive: true,
      orderIndex: 1
    },
    {
      questionAr: "هل يقدم المكتب خدمات توثيق معتمدة رسمياً؟",
      questionEn: "Does the office provide officially certified notarization?",
      answerAr: "نعم، يمتلك المكتب ترخيص موثق معتمد من وزارة العدل السعودية، مما يتيح لنا إصدار وتوثيق عقود الشركات، الوكالات الشرعية، الإقرارات المالية، وإفراغ العقارات فورا دون الحاجة لمراجعة كتابة العدل.",
      answerEn: "Yes, our office holds a certified notary license from the Saudi Ministry of Justice, allowing us to immediately notarize corporate contracts, power of attorneys, financial declarations, and property transfers without visiting public courts.",
      isActive: true,
      orderIndex: 2
    }
  ];

  for (let idx = 0; idx < faqs.length; idx++) {
    await prisma.fAQ.create({
      data: {
        questionAr: faqs[idx].questionAr,
        questionEn: faqs[idx].questionEn,
        answerAr: faqs[idx].answerAr,
        answerEn: faqs[idx].answerEn,
        isActive: faqs[idx].isActive,
        orderIndex: idx + 1
      }
    });
  }

  // 8. Seed Blog Categories
  const categories = [
    { slug: "commercial", nameAr: "الأنظمة التجارية", nameEn: "Commercial Regulations" },
    { slug: "corporate", nameAr: "حوكمة وتأسيس الشركات", nameEn: "Corporate Governance & Incorporation" },
    { slug: "documentation", nameAr: "التوثيق وعقود الشركات", nameEn: "Notarization & Corporate Contracts" },
    { slug: "arbitration", nameAr: "التحكيم والوساطة", nameEn: "Arbitration & Mediation" },
    { slug: "labor", nameAr: "المنازعات العمالية", nameEn: "Labor Disputes" },
    { slug: "criminal", nameAr: "القضايا الجنائية", nameEn: "Criminal Cases" }
  ];

  const dbCategories = {};
  for (const cat of categories) {
    const c = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
    dbCategories[cat.slug] = c;
  }

  // 9. Seed static articles (IDs 1–10)
  const staticArticles = [
    {
      id: 1,
      slug: "corporate-lawyer-riyadh-investments",
      titleAr: "دور محامي الشركات الجديد في الرياض لحماية الاستثمارات الأجنبية والمحلية",
      titleEn: "The Role of the New Corporate Lawyer in Riyadh in Protecting Foreign and Local Investments",
      excerptAr: "يستعرض هذا المقال دور محامي الشركات الجديد بالرياض في مساعدة الشركات المحلية والأجنبية لتأسيس أعمالها التجارية وفقاً لأحدث الأنظمة الصادرة في المملكة وتجنب الثغرات التعاقدية الشائعة.",
      excerptEn: "This article reviews the role of the new corporate lawyer in Riyadh in helping local and foreign companies establish their business according to the latest regulations.",
      category: "corporate",
      icon: "fa-building-shield",
      readTimeAr: "١٢ دقيقة",
      readTimeEn: "12 mins",
      isFeatured: true,
      contentAr: generateLegalEssayContent("دور محامي الشركات الجديد في الرياض لحماية الاستثمارات الأجنبية والمحلية", "حوكمة وتأسيس الشركات"),
      contentEn: generateLegalEssayContentEN("The Role of the New Corporate Lawyer in Riyadh in Protecting Foreign and Local Investments", "Corporate Governance & Incorporation")
    },
    {
      id: 2,
      slug: "commercial-lawyer-riyadh-settling-disputes",
      titleAr: "كيف تختار أفضل محامي تجاري في الرياض لتسوية منازعات العقود التجارية؟",
      titleEn: "How to Choose the Best Commercial Lawyer in Riyadh to Settle Contract Disputes?",
      excerptAr: "أهم المعايير لاختيار محامي تجاري في الرياض يمتلك الخبرة الكافية في صياغة ومراجعة العقود وتمثيل الشركات أمام المحاكم التجارية واللجان شبه القضائية بكفاءة عالية.",
      excerptEn: "The most important criteria for choosing a commercial lawyer in Riyadh who has sufficient experience in drafting, reviewing contracts and court representation.",
      category: "commercial",
      icon: "fa-gavel",
      readTimeAr: "١٥ دقيقة",
      readTimeEn: "15 mins",
      isFeatured: false,
      contentAr: generateLegalEssayContent("كيف تختار أفضل محامي تجاري في الرياض لتسوية منازعات العقود التجارية؟", "الأنظمة التجارية"),
      contentEn: generateLegalEssayContentEN("How to Choose the Best Commercial Lawyer in Riyadh to Settle Contract Disputes?", "Commercial Regulations")
    },
    {
      id: 3,
      slug: "notarizing-corporate-contracts-certified-notary",
      titleAr: "أهمية توثيق عقود تأسيس الشركات إلكترونياً عبر موثق معتمد بوزارة العدل",
      titleEn: "The Importance of Notarizing Corporate Establishment Contracts Electronically Via Certified Notary",
      excerptAr: "شرح شامل لخدمات التوثيق الفوري وعقود التأسيس، والوكالات والإقرارات المالية بشكل رسمي وفوري عبر مكتب موثق معتمد دون الحاجة لمراجعة كتابة العدل.",
      excerptEn: "A comprehensive explanation of instant notarization services, corporate contracts, and declarations via a certified notary without visiting courts.",
      category: "documentation",
      icon: "fa-file-signature",
      readTimeAr: "١٠ دقائق",
      readTimeEn: "10 mins",
      isFeatured: false,
      contentAr: generateLegalEssayContent("أهمية توثيق عقود تأسيس الشركات إلكترونياً عبر موثق معتمد بوزارة العدل", "التوثيق وعقود الشركات"),
      contentEn: generateLegalEssayContentEN("The Importance of Notarizing Corporate Establishment Contracts Electronically Via Certified Notary", "Notarization & Corporate Contracts")
    },
    {
      id: 4,
      slug: "commercial-arbitration-saudi-arabia-effective-alternative",
      titleAr: "التحكيم التجاري في السعودية كبديل فعال لحل النزاعات الاستثمارية الكبرى",
      titleEn: "Commercial Arbitration in Saudi Arabia as an Effective Alternative to Resolve Major Investment Disputes",
      excerptAr: "لماذا يفضل المستثمرون شرط التحكيم في العقود التجارية؟ نستعرض ملامح نظام التحكيم السعودي ودور المحكم المعتمد في إصدار أحكام نهائية ملزمة للطرفين.",
      excerptEn: "Why do investors prefer arbitration clauses in commercial contracts? We review the Saudi arbitration system and the role of certified arbitrators.",
      category: "arbitration",
      icon: "fa-scale-balanced",
      readTimeAr: "١٨ دقيقة",
      readTimeEn: "18 mins",
      isFeatured: false,
      contentAr: generateLegalEssayContent("التحكيم التجاري في السعودية كبديل فعال لحل النزاعات الاستثمارية الكبرى", "التحكيم والوساطة"),
      contentEn: generateLegalEssayContentEN("Commercial Arbitration in Saudi Arabia as an Effective Alternative to Resolve Major Investment Disputes", "Arbitration & Mediation")
    },
    {
      id: 5,
      slug: "new-saudi-labor-law-employee-employer-rights",
      titleAr: "حقوق العامل وصاحب العمل في نظام العمل السعودي الجديد: دليل تفصيلي",
      titleEn: "Employee and Employer Rights in the New Saudi Labor Law: A Detailed Guide",
      excerptAr: "قراءة في أحدث تعديلات نظام العمل السعودي لعام ٢٠٢٦، وتفاصيل إنهاء العقد ومكافأة نهاية الخدمة والمخالفات العمالية وكيفية صياغة لوائح تنظيم العمل.",
      excerptEn: "A review of the latest amendments to the Saudi Labor Law for 2026, contract termination rules, and end-of-service benefits.",
      category: "labor",
      icon: "fa-briefcase",
      readTimeAr: "١٤ دقيقة",
      readTimeEn: "14 mins",
      isFeatured: false,
      contentAr: generateLegalEssayContent("حقوق العامل وصاحب العمل في نظام العمل السعودي الجديد: دليل تفصيلي", "المنازعات العمالية"),
      contentEn: generateLegalEssayContentEN("Employee and Employer Rights in the New Saudi Labor Law: A Detailed Guide", "Labor Disputes")
    }
  ];

  for (const article of staticArticles) {
    const cat = dbCategories[article.category]!;
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        authorId: adminUser.id,
        categoryId: cat.id,
        slug: article.slug,
        titleAr: article.titleAr,
        titleEn: article.titleEn,
        excerptAr: article.excerptAr,
        excerptEn: article.excerptEn,
        contentAr: article.contentAr,
        contentEn: article.contentEn,
        icon: article.icon,
        readTimeAr: article.readTimeAr,
        readTimeEn: article.readTimeEn,
        status: "Published",
        isFeatured: article.isFeatured,
        publishedAt: new Date(),
        keywords: [article.titleAr, "استشارات بالرياض"],
        tags: [cat.nameAr, "أنظمة قانونية"]
      }
    });
  }

  // 10. Seed Criminal static articles (IDs 11–20)
  const criminalArticles = [
    {
      slug: "cybercrime-law-riyadh-penalties",
      titleAr: "نظام مكافحة جرائم المعلوماتية بالرياض وعقوبات التشهير والابتزاز",
      titleEn: "Cybercrime Law in Riyadh: Defamation and Extortion Penalties",
      excerptAr: "دراسة شاملة لنظام مكافحة جرائم المعلوماتية السعودي، والوقاية من الابتزاز الإلكتروني والاختراقات مع توضيح العقوبات والغرامات النظامية.",
      excerptEn: "An in-depth study of the Saudi Cybercrime Law, protecting against online extortion and hacking, with details on statutory penalties.",
      icon: "fa-laptop-code",
      readTimeAr: "١٢ دقيقة",
      readTimeEn: "12 mins",
      isFeatured: true,
      contentAr: generateCriminalArticleContent(
        "نشأت الجرائم المعلوماتية مع تطور التقنية الرقمية السريع، مما استدعى إصدار تشريعات حاسمة لضبط سلوك الأفراد والمؤسسات الفضائي الرقمي وحماية الفضاء السيبراني بالمملكة.",
        "يحدد نظام مكافحة جرائم المعلوماتية السعودي عقوبات تبدأ من السجن لمدة لا تزيد عن سنة وغرامة لا تتجاوز 500 ألف ريال للتشهير، وتصل إلى السجن 5 سنوات وغرامة 3 ملايين ريال لجرائم اختراق الشبكات والابتزاز المنظم.",
        "قيام شخص بنشر محادثات خاصة أو معلومات كاذبة تسيء لسمعة تاجر أو منشأة تجارية عبر وسائل التواصل الاجتماعي، مما يشكل جريمة تشهير معلوماتية مكتملة الأركان.",
        [{ q: "هل يعاقب النظام على التشهير في مجموعات الواتساب الخاصة؟", a: "نعم، يعتبر إرسال رسائل تشهيرية أو إساءة في مجموعة واتساب - حتى وإن كان خاصاً - استخداماً لشبكة معلوماتية لإنتاج ما من شأنه المساس بالحقوق والسمعة ويعاقب عليه النظام." }],
        "إن الحذر عند صياغة المنشورات وتأمين الحسابات الإلكترونية يمثل خط الدفاع الأول لتفادي التعرض للملاحقة الجزائية."
      ),
      contentEn: generateCriminalArticleContentEN(
        "The transition to digital authentication and electronic portals (Najiz, Absher) has significantly mitigated document tampering but increased digital forgery risks.",
        "Tampering with official documents carries up to 5 years imprisonment and severe financial penalties for both the forger and the user.",
        "Discusses the Saudi Anti-Forgery Regulations, highlighting penalties for altering truth in documents, falsifying official seals, and using forged items with prior knowledge."
      )
    },
    {
      slug: "combating-money-laundering-saudi-compliance",
      titleAr: "مكافحة غسيل الأموال في المملكة العربية السعودية: التزامات المنشآت العقارية والتجارية",
      titleEn: "Combating Money Laundering in Saudi Arabia: Corporate and Real Estate Compliance",
      excerptAr: "تعرف على أركان جريمة غسل الأموال في النظام السعودي والتدابير الوقائية التي يجب على الشركات والمنشآت اتخاذها للامتثال وتفادي الشبهات.",
      excerptEn: "Learn about the pillars of money laundering crimes in Saudi law and the preventive measures corporations must implement for compliance.",
      icon: "fa-money-bill-transfer",
      readTimeAr: "١٤ دقيقة",
      readTimeEn: "14 mins",
      isFeatured: false,
      contentAr: generateCriminalArticleContent(
        "تعد مكافحة الجرائم المالية وغسيل الأموال أولوية استراتيجية للمملكة لضمان سلامة واستقرار النظام المالي وجذب الاستثمارات العالمية الآمنة تماشياً مع المعايير الدولية.",
        "يفرض نظام مكافحة غسيل الأموال السعودي التزامات صارمة على الشركات مثل مبدأ 'عرف عميلك' والاحتفاظ بالسجلات والوثائق المالية لمدة لا تقل عن 10 سنوات وإبلاغ وحدة التحريات المالية فوراً عن أي عملية مشبوهة.",
        "شراء عقارات بمبالغ نقدية ضخمة ومجهولة المصدر وإعادة بيعها بسرعة بخسارة طفيفة للحصول على شيكات بنكية نظيفة، مما يثير شبهة غسيل أموال قوية تستوجب التحقيق القضائي.",
        [{ q: "ما هي عقوبة التستر على عملية غسيل أموال مشبوهة؟", a: "يعاقب النظام كل من يثبت علمه ويشترك بالتستر أو الإخفاء بالسجن لمدد تصل إلى 15 عاماً وغرامات مالية تصل إلى 7 ملايين ريال، مع مصادرة الأموال والأصول محل الجريمة." }],
        "يعد تطبيق سياسات الحوكمة الصارمة والامتثال المالي الدرع الواقي للشركات من الانزلاق في شبهات المعاملات المالية غير المشروعة."
      ),
      contentEn: generateCriminalArticleContentEN(
        "In alignment with FATF guidelines, Saudi Arabia enforces rigorous financial inspection and audit standards to prevent financial crimes.",
        "The AML Law regulates transactions, requiring immediate reporting of suspicious transactions and strict bookkeeping for 10 years.",
        "An overview of the Saudi Anti-Money Laundering (AML) system, detailing client due diligence obligations for corporate entities and the legal risks of non-compliance."
      )
    }
  ];

  const crimCat = dbCategories["criminal"]!;
  for (const article of criminalArticles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        authorId: adminUser.id,
        categoryId: crimCat.id,
        slug: article.slug,
        titleAr: article.titleAr,
        titleEn: article.titleEn,
        excerptAr: article.excerptAr,
        excerptEn: article.excerptEn,
        contentAr: article.contentAr,
        contentEn: article.contentEn,
        icon: article.icon,
        readTimeAr: article.readTimeAr,
        readTimeEn: article.readTimeEn,
        status: "Published",
        isFeatured: article.isFeatured,
        publishedAt: new Date(),
        keywords: [article.titleAr, "قضايا جنائية بالرياض"],
        tags: ["القضايا الجنائية", "أنظمة جنائية"]
      }
    });
  }

  // 11. Seed dynamic loop-generated articles (IDs 21–60)
  const categoriesList = [
    { key: "commercial", name: "الأنظمة التجارية", name_en: "Commercial Regulations" },
    { key: "corporate", name: "حوكمة وتأسيس الشركات", name_en: "Corporate Governance & Incorporation" },
    { key: "documentation", name: "التوثيق وعقود الشركات", name_en: "Notarization & Corporate Contracts" },
    { key: "arbitration", name: "التحكيم والوساطة", name_en: "Arbitration & Mediation" },
    { key: "labor", name: "المنازعات العمالية", name_en: "Labor Disputes" },
    { key: "criminal", name: "القضايا الجنائية", name_en: "Criminal Cases" }
  ];

  const keywords = [
    "محامي تجاري في الرياض",
    "حوكمة الشركات السعودية",
    "موثق معتمد من وزارة العدل",
    "تحكيم النزاعات التجارية",
    "قضايا مكتب العمل والعمال",
    "صياغة العقود والاتفاقيات",
    "الاستثمار الأجنبي بالمملكة",
    "الشركات ذات المسؤولية المحدودة",
    "تصفية الشركات والشركاء",
    "الإفلاس القضائي وحماية الدائنين",
    "حقوق المتهم والقضاء الجزائي",
    "جرائم المعلوماتية بالرياض",
    "الاحتيال المالي وخيانة الأمانة",
    "مكافحة غسيل الأموال بالسعودية",
    "التلبس والتفتيش الجنائي"
  ];

  const keywordsEN = [
    "Commercial Lawyer in Riyadh",
    "Saudi Corporate Governance",
    "Certified Notary by the Ministry of Justice",
    "Commercial Disputes Arbitration",
    "Labor and Work Office Cases",
    "Drafting Contracts and Agreements",
    "Foreign Investment in the Kingdom",
    "Limited Liability Companies",
    "Liquidation of Companies and Partners",
    "Judicial Bankruptcy and Creditor Protection",
    "Rights of the Accused & Penal Judiciary",
    "Cybercrimes in Riyadh",
    "Financial Fraud & Trust Breach",
    "Anti-Money Laundering in KSA",
    "Flagrante Delicto & Criminal Search"
  ];

  const icons = ["fa-folder-open", "fa-user-tie", "fa-landmark", "fa-file-shield", "fa-clipboard-check"];

  for (let i = 21; i <= 60; i++) {
    const catRaw = categoriesList[i % categoriesList.length];
    const cat = dbCategories[catRaw.key]!;
    const kw = keywords[i % keywords.length];
    const kw_en = keywordsEN[i % keywordsEN.length];
    const icon = icons[i % icons.length];
    const day = 25 - (i % 20);

    const titleText = `دراسة نظامية معمقة حول ${kw} وتطبيقاتها القضائية في مدينة الرياض`;
    const titleTextEN = `In-depth legal study on ${kw_en} and its judicial applications in Riyadh`;
    const slug = `in-depth-study-${catRaw.key}-riyadh-part-${i}`;

    await prisma.blogArticle.upsert({
      where: { slug },
      update: {},
      create: {
        authorId: adminUser.id,
        categoryId: cat.id,
        slug,
        titleAr: titleText,
        titleEn: titleTextEN,
        excerptAr: `نقدم في هذا المقال دراسة نظامية تطبيقية حول ${kw} مع تقديم نصائح وإرشادات قانونية هامة لأصحاب الأعمال التجارية والشركات بمختلف القطاعات بالمملكة.`,
        excerptEn: `In this article, we present an applied legal study on ${kw_en} with important legal advice and guidelines for business owners and companies in various sectors of the Kingdom.`,
        icon,
        readTimeAr: `${12 + (i % 8)} دقيقة`,
        readTimeEn: `${12 + (i % 8)} mins`,
        status: "Published",
        isFeatured: false,
        publishedAt: new Date(),
        keywords: [kw, `${kw} بالسعودية`],
        tags: [cat.nameAr, "دراسات نظامية"],
        contentAr: generateUniqueArticleContent(titleText, catRaw.key, catRaw.name, kw),
        contentEn: generateUniqueArticleContentEN(titleTextEN, catRaw.key, catRaw.name_en, kw_en)
      }
    });
  }

  console.log("Seeding database values completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error occurred while seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
