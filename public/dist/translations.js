// Localization database and Translation API for Dr. Saud bin Fahd Al-Duraymih Law Office
// Supports bilingual state (AR/EN) with layout adjustments (RTL/LTR)

const TRANSLATIONS = {
    ar: {
        // Navigation Header
        logo_title: "مكتب الدكتور سعود بن فهد الدريميح",
        logo_subtitle: "للمحاماة والاستشارات القانونية",
        services_page_title: "خدماتنا القانونية - مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية",
        nav_home: "الرئيسية",
        nav_about: "عن المكتب",
        nav_services: "خدماتنا",
        nav_blog: "المدونة",
        nav_contact: "اتصل بنا",
        btn_consultation: "طلب استشارة",

        // Hero Section
        hero_title: "حلول قانونية واضحة <span class=\"text-gold-gradient\">وحماية لمكتسباتك</span> بقوة القانون",
        hero_subtitle: "مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية",
        hero_cta: "طلب استشارة",
        hero_scroll_hint: "اسحب للأسفل لاستكشاف الرحلة القانونية",

        // About Section
        about_badge: "عن المكتب",
        about_title_1: "ريادة ترتكز على ",
        about_title_2: "القيم والخبرة",
        about_desc: "نؤمن في مكتب الدكتور سعود بن فهد الدريميح بأن مهنة المحاماة رسالة سامية لحماية الحقوق وإرساء قيم العدالة. نجمع بين المعرفة العميقة بالأنظمة السعودية والشريعة الإسلامية وبين الفهم الدقيق للاحتياجات التجارية الحديثة.",
        about_stat_experience: "سنة خبرة",
        about_stat_cases: "قضية ناجحة",
        about_stat_confidentiality: "التزام بالسرية",

        // FAQs Section
        faqs_badge: "الأسئلة الشائعة",
        faqs_title_1: "إجابات ",
        faqs_title_2: "لاستفساراتكم",
        faqs_title_3: " القانونية",

        // Services Section
        services_badge: "مجالات الاختصاص",
        services_title_1: "خدماتنا ",
        services_title_2: "القانونية",
        services_title_3: " المتميزة",
        services_more_btn: "عرض كافة الخدمات",
        services_hero_desc: "نقدم حلولاً قانونية واستراتيجية متكاملة لقطاع الأعمال والمنشآت التجارية، كما نوفر دعماً قانونياً شاملاً للأفراد ونزاعات التقاضي والتحكيم والتوثيق لحماية مكتسباتكم وضمان أمان معاملاتكم.",
        services_details_title: "تفاصيل الاختصاص والخدمات الفرعية",

        service_1_title: "الإدارة القانونية المتكاملة",
        service_1_desc: "تقدم دعماً قانونياً دائماً للشركات والمنشآت من خلال إدارة قانونية شاملة تشمل الاستشارات، العقود، السياسات، الامتثال، وتمثيل الشركة قانونياً، بما يضمن استقرارها وحمايتها من المخاطر.",
        service_1_cta: "احجز الآن",

        service_2_title: "التمثيل القضائي والتحكيم",
        service_2_desc: "تقدم تمثيلاً قانونياً شاملاً أمام المحاكم والجهات القضائية. وندير قضايا التحكيم والنزاعات التجارية باحترافية تامة، لضمان حماية حقوق العميل وتسريع مسار الفصل.",
        service_2_cta: "احجز الآن",

        service_3_title: "صياغة ومراجعة العقود والاتفاقيات",
        service_3_desc: "تعد وتراجع العقود بجميع أنواعها لضمان وضوح الالتزامات وحماية الحقوق، وتصيغ الاتفاقيات بطريقة دقيقة تقلل النزاعات وتعزز القوة التفاوضية للعميل.",
        service_3_cta: "احجز الآن",

        service_4_title: "تحصيل الديون وتنفيذ السندات",
        service_4_desc: "تقدم خدمة احترافية لتنفيذ الأحكام والسندات التنفيذية مثل الشيكات والسندات لأمر والكمبيالات، وتتولى إدارة ملفات التحصيل المتعثر حتى استرجاع المبالغ المستحقة.",
        service_4_cta: "احجز الآن",

        service_5_title: "تنظيم الثروات والشركات العائلية",
        service_5_desc: "تنظم العلاقة بين الشركاء والورثة في الكيانات العائلية. وتعد مواثيق الحوكمة واتفاقيات الإدارة والتوريث، لضمان استمرارية النشاط ومنع النزاعات المستقبلية.",
        service_5_cta: "احجز الآن",

        service_6_title: "تأسيس وتصفية الشركات والكيانات",
        service_6_desc: "تؤسس الشركات والكيانات النظامية بكافة أنواعها. وتدير تصفيتها عند الحاجة بطريقة قانونية منظمة تشمل التوثيق، الحصر، وإنهاء العلاقة مع الجهات الرسمية.",
        service_6_cta: "احجز الآن",

        service_7_title: "الحراسة القضائية",
        service_7_desc: "تتولى الحراسة القضائية على الأموال أو الشركات أو العقارات محل النزاع بناء على أوامر قضائية، وتديرها بطريقة محايدة ومنظمة تضمن الحفاظ على الحقوق وسلامة الأصل حتى انتهاء الخلاف.",
        service_7_cta: "اقرأ المزيد",

        service_8_title: "إعداد السياسات واللوائح الداخلية والامتثال",
        service_8_desc: "تعد السياسات واللوائح الداخلية للمنشآت بمهنية عالية، وتنظم العلاقة بين الإدارات والموظفين، وتعزز الامتثال للأنظمة السعودية والحوكمة المؤسسية.",
        service_8_cta: "اقرأ المزيد",

        service_9_title: "الاستشارات القانونية المتخصصة",
        service_9_desc: "تقدم استشارات قانونية دقيقة في مختلف الأنظمة، تشمل مراجعة القرارات، تحليل العقود، وتفسير الأنظمة، بهدف تمكين العميل من اتخاذ قرارات نظامية مدروسة.",
        service_9_cta: "اقرأ المزيد",

        service_10_title: "أمانة السر ومجلس الإدارة",
        service_10_desc: "تقدم خدمة أمانة السر لمجالس الإدارة بالشركات، بما في ذلك إعداد المحاضر ومتابعة التنفيذ وضمان التوثيق الكامل والالتزام النظامي للمجلس.",
        service_10_cta: "اقرأ المزيد",

        service_11_title: "دعم الشركات داخل مجلس الإدارة",
        service_11_desc: "تقدم خدمة دعم الشركات داخل مجلس الإدارة، بما في ذلك إرشاد والنصح، والإدارة النظامية بما يضمن استقرارها واستمرارية عملها.",
        service_11_cta: "اقرأ المزيد",

        service_12_title: "دعم الشركات للإدراج في السوق المالية",
        service_12_desc: "تقدم خدمة دعم الشركات للإدراج في السوق المالية الرئيسية (تداول) أو السوق الموازية (نمو)، بما في ذلك التأهل القانوني والإداري لضمان استيفاء شروط الهيئة والسوق.",
        service_12_cta: "اقرأ المزيد",

        // Detailed Service Categories (AR)
        cat_corporate_title: "خدمات الشركات",
        cat_corporate_item1: "تأسيس الشركات وتعديل عقود التأسيس.",
        cat_corporate_item2: "الحوكمة والامتثال.",
        cat_corporate_item3: "صياغة ومراجعة العقود والاتفاقيات.",
        cat_corporate_item4: "الاندماج والاستحواذ.",
        cat_corporate_item5: "إعادة الهيكلة القانونية.",
        cat_corporate_item6: "تصفية الشركات.",
        cat_corporate_item7: "تحصيل الديون التجارية.",
        cat_corporate_item8: "خدمات أمانة سر الشركات.",

        cat_litigation_title: "التقاضي وتسوية المنازعات",
        cat_litigation_item1: "الترافع أمام جميع المحاكم.",
        cat_litigation_item2: "المنازعات التجارية.",
        cat_litigation_item3: "المنازعات المدنية.",
        cat_litigation_item4: "المنازعات العمالية.",
        cat_litigation_item5: "المنازعات الإدارية.",
        cat_litigation_item6: "التنفيذ وإجراءات التحصيل.",
        cat_litigation_item7: "التحكيم.",
        cat_litigation_item8: "الوساطة والتسويات الودية.",

        cat_consultation_title: "الاستشارات القانونية",
        cat_consultation_item1: "الاستشارات القانونية الفورية.",
        cat_consultation_item2: "إعداد المذكرات والرأي القانوني.",
        cat_consultation_item3: "دراسة المخاطر القانونية.",
        cat_consultation_item4: "التفسير النظامي للوائح والأنظمة.",
        cat_consultation_item5: "الدعم القانوني المستمر للشركات.",

        cat_contracts_title: "العقود",
        cat_contracts_item1: "صياغة العقود.",
        cat_contracts_item2: "مراجعة العقود.",
        cat_contracts_item3: "التفاوض على العقود.",
        cat_contracts_item4: "عقود المقاولات.",
        cat_contracts_item5: "عقود الشراكة والاستثمار.",
        cat_contracts_item6: "عقود العمل.",
        cat_contracts_item7: "عقود التوريد والتشغيل والصيانة.",

        cat_ip_title: "خدمات الملكية الفكرية",
        cat_ip_item1: "تسجيل العلامات التجارية.",
        cat_ip_item2: "حماية حقوق المؤلف.",
        cat_ip_item3: "براءات الاختراع.",
        cat_ip_item4: "نقل وترخيص الحقوق.",
        cat_ip_item5: "الاعتراضات والنزاعات.",

        cat_individuals_title: "خدمات الأفراد",
        cat_individuals_item1: "القضايا المدنية.",
        cat_individuals_item2: "القضايا التجارية.",
        cat_individuals_item3: "قضايا الأحوال الشخصية.",
        cat_individuals_item4: "قضايا الميراث والتركات.",
        cat_individuals_item5: "المطالبات المالية.",
        cat_individuals_item6: "التعويضات.",
        cat_individuals_item7: "تنفيذ الأحكام.",

        cat_investors_title: "خدمات المستثمرين ورواد الأعمال",
        cat_investors_item1: "تأسيس المشاريع.",
        cat_investors_item2: "اختيار الكيان القانوني.",
        cat_investors_item3: "اتفاقيات الشركاء.",
        cat_investors_item4: "الجولات الاستثمارية.",
        cat_investors_item5: "الامتثال النظامي.",
        cat_investors_item6: "حماية الأصول.",

        cat_contracting_title: "خدمات المقاولات والمشاريع",
        cat_contracting_item1: "عقود المقاولات.",
        cat_contracting_item2: "المطالبات المالية.",
        cat_contracting_item3: "أوامر التغيير.",
        cat_contracting_item4: "تمديد مدد المشاريع.",
        cat_contracting_item5: "مطالبات التأخير.",
        cat_contracting_item6: "فض المنازعات.",
        cat_contracting_item7: "التسويات الودية.",
        cat_contracting_item8: "إدارة المطالبات التعاقدية.",
        cat_contracting_item9: "مراجعة المستخلصات.",
        cat_contracting_item10: "تحليل المخاطر التعاقدية.",

        cat_execution_title: "خدمات التنفيذ",
        cat_execution_item1: "تنفيذ الأحكام.",
        cat_execution_item2: "تنفيذ السندات التنفيذية.",
        cat_execution_item3: "تحصيل الديون.",
        cat_execution_item4: "متابعة إجراءات التنفيذ.",
        cat_execution_item5: "إيقاف التنفيذ والاعتراضات.",

        cat_documentation_title: "خدمات التوثيق",
        cat_documentation_item1: "إعداد العقود والاتفاقيات.",
        cat_documentation_item2: "الإقرارات والتعهدات.",
        cat_documentation_item3: "الوكالات.",
        cat_documentation_item4: "محاضر الاجتماعات.",
        cat_documentation_item5: "توثيق الشركات.",

        // Contact Section
        contact_title_1: "تواصل معنا ",
        contact_title_2: "مباشرة",
        contact_desc: "يسعدنا استقبال استفساراتكم وتحديد موعد لمناقشة قضاياكم وتقديم الدعم القانوني المناسب.",
        contact_loc_label: "الموقع الرئيسي",
        contact_loc_val: "الرياض، حي النخيل، طريق الملك فهد",
        contact_phone_label: "الهاتف والواتساب",
        contact_email_label: "البريد الإلكتروني",

        // Form
        form_name_label: "الاسم الكريم",
        form_name_placeholder: "الاسم الكامل",
        form_phone_placeholder: "+966 50 000 0000",
        form_phone_label: "رقم الجوال",
        form_email_label: "البريد الإلكتروني",
        form_email_placeholder: "name@domain.com",
        form_msg_label: "تفاصيل الاستفسار",
        form_msg_placeholder: "اكتب نبذة مختصرة عن الخدمة أو الاستفسار المطلوب",
        form_submit_btn: "احجز استشارتك المجانية",
        form_quick_contact: "أو تواصل معنا مباشرة:",
        form_whatsapp: "واتساب",
        form_call: "اتصال مباشر",
        form_success_title: "تم استلام طلبكم بنجاح",
        form_success_desc: "نُقدّر ثقتكم بمكتبنا، وسيقوم فريقنا القانوني بمراجعة الطلب والتواصل معكم في أقرب وقت ممكن.",
        form_sending: "جاري إرسال طلبكم...",

        // Modal
        modal_title: "طلب استشارة قانونية",
        modal_subtitle: "يرجى تعبئة النموذج وسيقوم أحد مستشارينا بالتواصل معكم خلال 24 ساعة.",
        modal_name_label: "الاسم الكامل",
        modal_name_placeholder: "الاسم ثلاثي",
        modal_phone_label: "رقم الجوال",
        modal_phone_placeholder: "05xxxxxxxx",
        modal_email_label: "البريد الإلكتروني",
        modal_email_placeholder: "mail@example.sa",
        modal_service_label: "نوع الاستشارة المطلوب",
        modal_service_placeholder: "اختر مجال القضية/الاستشارة",
        modal_service_opt1: "المحاماة والتقاضي (شركات، عقار، إداري)",
        modal_service_opt2: "التحكيم والوساطة التجارية",
        modal_service_opt3: "التوثيق وصياغة ومراجعة العقود",
        modal_service_opt4: "استشارات حوكمة وتأسيس شركات",
        modal_service_opt5: "استشارة قانونية أخرى",
        modal_desc_label: "تفاصيل القضية/الاستفسار",
        modal_desc_placeholder: "يرجى كتابة لمحة مختصرة عن موضوع الاستشارة",
        modal_submit_btn: "تأكيد طلب الاستشارة",

        // Multi-stage Contact Page
        contact_page_subtitle: "يرجى تعبئة النموذج خطوة بخطوة للبدء في معالجة طلبك بدقة وسرعة",
        contact_page_step: "الخطوة",
        contact_page_of: "من",
        contact_page_step1_title: "١. المعلومات الشخصية",
        contact_page_step2_title: "٢. تفاصيل القضية",
        contact_page_step3_title: "٣. درجة الاستعجال",
        contact_page_urgency_label: "مدى استعجال القضية",
        contact_page_urg_low: "استشارة عادية (خلال ٢٤ ساعة)",
        contact_page_urg_medium: "استشارة متوسطة (خلال ١٢ ساعة)",
        contact_page_urg_high: "حالة طارئة ومستعجلة (فورية)",
        contact_page_btn_prev: "السابق",
        contact_page_btn_next: "التالي",
        contact_page_btn_submit: "إرسال حجز الاستشارة",
        contact_page_emergency_title: "طلب استشارة طارئة",
        contact_page_emergency_desc: "جاري توجيهك إلى الواتساب للتواصل الهاتفي والمتابعة الفورية.",

        // Validation Errors
        err_name: "الرجاء كتابة الاسم الكامل (3 أحرف على الأقل)",
        err_phone: "الرجاء كتابة رقم جوال سعودي صحيح (مثال: 0500000000)",
        err_email: "الرجاء كتابة بريد إلكتروني صحيح",
        err_msg: "الرجاء كتابة تفاصيل الاستفسار (10 أحرف على الأقل)",
        err_desc: "الرجاء كتابة لمحة مختصرة عن موضوع الاستشارة",

        // Toast
        toast_success_title: "تم إرسال طلبكم بنجاح",
        toast_success_desc: "نشكرك على ثقتك، سنتواصل معك قريباً.",
        toast_registered_title: "تم تسجيل الطلب",
        toast_registered_desc: "شكراً لكم، تم حفظ بيانات حجز الاستشارة بنجاح.",

        // Blog Main
        blog_badge: "المدونة والثقافة النظامية",
        blog_hero_title: "المدونة والثقافة النظامية",
        blog_search_placeholder: "ابحث عن المقالات...",
        blog_search_title: "البحث في المدونة",
        blog_cats_title: "أقسام المدونة الرئيسية",
        blog_cat_all: "جميع المقالات",
        blog_cat_commercial: "الأنظمة التجارية",
        blog_cat_criminal: "القضايا الجنائية",
        blog_cat_corporate: "حوكمة وتأسيس الشركات",
        blog_cat_documentation: "التوثيق وعقود الشركات",
        blog_cat_arbitration: "التحكيم والوساطة",
        blog_cat_labor: "المنازعات العمالية",
        blog_empty: "لا توجد مقالات تطابق شروط البحث.",
        blog_read_more: "اقرأ المقال بالكامل",
        blog_modal_read_time: "وقت القراءة:",
        blog_modal_related: "مقالات ذات صلة بالتصنيف",
        blog_en_notice: "",

        // Footer & copyright
        copyright: "© ٢٠٢٦ مكتب الدكتور سعود بن فهد الدريميح للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.",

        // Morph Captions (dynamic 3D overlay text)
        morph_caption_shield: "نحمي طموحك",
        morph_caption_framework: "نبني استراتيجيتك",
        morph_caption_balance: "نوازن الحقوق",
        morph_caption_circle: "نرتب الحلول",
        morph_caption_logo: "معك حتى النهاية",

        // Upload File Component
        upload_label: "المرفقات والمستندات الداعمة (اختياري)",
        drag_drop_text: "اسحب وأفلت الملفات هنا أو",
        browse_files: "تصفح الملفات",
        upload_limits: "الحد الأقصى 5 ملفات. الحجم الأقصى للملف 10 ميجابايت. الحجم الكلي الأقصى 30 ميجابايت.",
        stage_preparing: "جاري تجهيز الملفات...",
        stage_uploading: "جاري رفع الملفات...",
        stage_saving: "جاري حفظ الاستشارة وتخزين المستندات...",
        stage_completed: "تم الإرسال بنجاح.",
        btn_retry: "إعادة المحاولة",
        err_max_files: "لا يمكن رفع أكثر من 5 ملفات.",
        err_file_size: "الملف {name} يتجاوز الحد المسموح به (10 ميجابايت).",
        err_total_size: "إجمالي حجم الملفات يتجاوز الحد الأقصى (30 ميجابايت).",
        err_file_type: "نوع الملف {name} غير مدعوم. المسموح به: PDF, DOC, DOCX, JPG, JPEG, PNG.",
        err_duplicate_file: "الملف {name} مضاف بالفعل.",
        err_payload_limit: "حجم الطلب كبير جداً، يرجى تقليل حجم الملفات المرفقة.",
        err_upload_failed: "فشل الرفع. الرجاء إعادة المحاولة."
    },
    en: {
        // Navigation Header
        logo_title: "Dr. Saud bin Fahd Al-Duraymih Law Office",
        logo_subtitle: "Advocacy & Legal Consultations",
        services_page_title: "Legal Services - Law Office of Advocate/ Dr. Saud bin Fahd Al-Duraymih for Advocacy & Legal Consultations",
        nav_home: "Home",
        nav_about: "About Us",
        nav_services: "Services",
        nav_blog: "Blog",
        nav_contact: "Contact",
        btn_consultation: "Request Consultation",

        // Hero Section
        hero_title: "Clear legal solutions <span class=\"text-gold-gradient\">and protection for your achievements</span> by the power of law",
        hero_subtitle: "Law Office of Advocate/ Dr. Saud bin Fahd Al-Duraymih for Advocacy & Legal Consultations",
        hero_cta: "Get Consultation",
        hero_scroll_hint: "Scroll down to explore the legal journey",

        // About Section
        about_badge: "About Us",
        about_title_1: "Leadership Driven by ",
        about_title_2: "Values & Experience",
        about_desc: "At Dr. Saud bin Fahd Al-Duraymih Law Office, we believe that advocacy is a noble mission to protect rights and establish justice. We combine deep knowledge of Saudi laws and Islamic Sharia with a thorough understanding of modern commercial needs.",
        about_stat_experience: "Years of Experience",
        about_stat_cases: "Successful Cases",
        about_stat_confidentiality: "Confidentiality Commitment",

        // FAQs Section
        faqs_badge: "FAQs",
        faqs_title_1: "Answers ",
        faqs_title_2: "to Your Legal",
        faqs_title_3: " Queries",

        // Services Section
        services_badge: "Areas of Expertise",
        services_title_1: "Our ",
        services_title_2: "Premium Legal",
        services_title_3: " Services",
        services_more_btn: "View All Services",
        services_hero_desc: "We offer integrated legal and strategic solutions for the business sector and commercial entities, and provide comprehensive legal support for individuals, litigation, arbitration, and notarization to protect your achievements and ensure the security of your transactions.",
        services_details_title: "Specialization Details & Sub-Services",

        service_1_title: "Integrated Legal Administration",
        service_1_desc: "Provides continuous legal support to companies and establishments through comprehensive legal management including consultations, contracts, policies, compliance, and legal representation of the company, ensuring its stability and protection from risks.",
        service_1_cta: "Book Now",

        service_2_title: "Litigation & Arbitration",
        service_2_desc: "Provides comprehensive legal representation before courts and judicial bodies. We manage arbitration cases and commercial disputes with utmost professionalism to protect the client's rights and expedite resolution.",
        service_2_cta: "Book Now",

        service_3_title: "Drafting & Reviewing Contracts and Agreements",
        service_3_desc: "Prepares and reviews all types of contracts to ensure clarity of obligations and protection of rights, and drafts agreements precisely to minimize disputes and strengthen the client's negotiating power.",
        service_3_cta: "Book Now",

        service_4_title: "Debt Collection & Enforcement of Deeds",
        service_4_desc: "Provides professional service for executing judgments and executive deeds such as checks, promissory notes, and bills of exchange, and handles delinquent accounts until recovery.",
        service_4_cta: "Book Now",

        service_5_title: "Wealth Management & Family Businesses",
        service_5_desc: "Regulates relationships between partners and heirs in family entities. Prepares governance charters, management and succession agreements to ensure business continuity and prevent future disputes.",
        service_5_cta: "Book Now",

        service_6_title: "Company Setup & Liquidation",
        service_6_desc: "Establishes all types of companies and legal entities. Manages their liquidation when needed in a legal and organized manner, including documentation, inventory, and closing official relations.",
        service_6_cta: "Book Now",

        service_7_title: "Judicial Custodianship",
        service_7_desc: "Handles judicial custodianship over disputed funds, companies, or real estate based on court orders, managing them neutrally and orderly to preserve rights and assets until disputes end.",
        service_7_cta: "Book Now",

        service_8_title: "Internal Policies, Regulations & Compliance",
        service_8_desc: "Prepares internal policies and rules for facilities with high professionalism, organizing relations between departments and employees, and promoting compliance with Saudi regulations.",
        service_8_cta: "Book Now",

        service_9_title: "Specialized Legal Consultations",
        service_9_desc: "Provides accurate legal consultations in various systems, including decision review, contract analysis, and system interpretation, to enable sound decision-making.",
        service_9_cta: "Book Now",

        service_10_title: "Corporate Secretarial Services",
        service_10_desc: "Provides secretarial services for corporate boards of directors, including preparing minutes, following up on execution, and ensuring full documentation and legal compliance.",
        service_10_cta: "Book Now",

        service_11_title: "Boardroom Support for Corporates",
        service_11_desc: "Provides support services to boardroom members, including legal advice, guidance, and systematic management to ensure board stability and operational continuity.",
        service_11_cta: "Book Now",

        service_12_title: "IPO & Capital Market Support",
        service_12_desc: "Supports companies aiming for listing on the Main Market (Tadawul) or Parallel Market (Nomu), including legal and administrative qualifying to meet Capital Market Authority requirements.",
        service_12_cta: "Book Now",

        // Detailed Service Categories (EN)
        cat_corporate_title: "Corporate Services",
        cat_corporate_item1: "Incorporating companies and amending articles of association.",
        cat_corporate_item2: "Governance and compliance.",
        cat_corporate_item3: "Drafting and reviewing contracts and agreements.",
        cat_corporate_item4: "Mergers and acquisitions.",
        cat_corporate_item5: "Legal restructuring.",
        cat_corporate_item6: "Company liquidation.",
        cat_corporate_item7: "Commercial debt collection.",
        cat_corporate_item8: "Corporate secretarial services.",

        cat_litigation_title: "Litigation & Dispute Resolution",
        cat_litigation_item1: "Advocacy before all courts.",
        cat_litigation_item2: "Commercial disputes.",
        cat_litigation_item3: "Civil disputes.",
        cat_litigation_item4: "Labor disputes.",
        cat_litigation_item5: "Administrative disputes.",
        cat_litigation_item6: "Execution and collection procedures.",
        cat_litigation_item7: "Arbitration.",
        cat_litigation_item8: "Mediation and amicable settlements.",

        cat_consultation_title: "Legal Consultations",
        cat_consultation_item1: "Immediate legal consultations.",
        cat_consultation_item2: "Preparing briefs and legal opinions.",
        cat_consultation_item3: "Assessing legal risks.",
        cat_consultation_item4: "Statutory interpretation of rules and regulations.",
        cat_consultation_item5: "Continuous legal support for companies.",

        cat_contracts_title: "Contracts & Agreements",
        cat_contracts_item1: "Contract drafting.",
        cat_contracts_item2: "Contract review.",
        cat_contracts_item3: "Contract negotiation.",
        cat_contracts_item4: "Construction contracts.",
        cat_contracts_item5: "Partnership and investment contracts.",
        cat_contracts_item6: "Employment contracts.",
        cat_contracts_item7: "Supply, operation, and maintenance contracts.",

        cat_ip_title: "Intellectual Property Services",
        cat_ip_item1: "Trademark registration.",
        cat_ip_item2: "Copyright protection.",
        cat_ip_item3: "Patent registration.",
        cat_ip_item4: "Transfer and licensing of rights.",
        cat_ip_item5: "Objections and disputes.",

        cat_individuals_title: "Individual Services",
        cat_individuals_item1: "Civil cases.",
        cat_individuals_item2: "Commercial cases.",
        cat_individuals_item3: "Family law & personal status.",
        cat_individuals_item4: "Inheritance & estate disputes.",
        cat_individuals_item5: "Financial claims.",
        cat_individuals_item6: "Compensation claims.",
        cat_individuals_item7: "Execution of judgments.",

        cat_investors_title: "Investors & Entrepreneurs",
        cat_investors_item1: "Project incorporation.",
        cat_investors_item2: "Selection of legal entity type.",
        cat_investors_item3: "Shareholders' agreements.",
        cat_investors_item4: "Investment rounds support.",
        cat_investors_item5: "Regulatory compliance.",
        cat_investors_item6: "Asset protection.",

        cat_contracting_title: "Contracting & Projects Services",
        cat_contracting_item1: "Construction contracting.",
        cat_contracting_item2: "Financial claims.",
        cat_contracting_item3: "Change orders.",
        cat_contracting_item4: "Project duration extensions.",
        cat_contracting_item5: "Delay claims.",
        cat_contracting_item6: "Dispute resolution.",
        cat_contracting_item7: "Amicable settlements.",
        cat_contracting_item8: "Contractual claims management.",
        cat_contracting_item9: "Review of payment certificates.",
        cat_contracting_item10: "Contractual risk analysis.",

        cat_execution_title: "Execution Services",
        cat_execution_item1: "Enforcement of court judgments.",
        cat_execution_item2: "Enforcement of executive deeds.",
        cat_execution_item3: "Debt collection.",
        cat_execution_item4: "Tracking execution procedures.",
        cat_execution_item5: "Stay of execution and objections.",

        cat_documentation_title: "Notarization Services",
        cat_documentation_item1: "Preparing contracts and agreements.",
        cat_documentation_item2: "Declarations and undertakings.",
        cat_documentation_item3: "Power of attorneys.",
        cat_documentation_item4: "Minutes of meetings.",
        cat_documentation_item5: "Corporate notarization.",

        // Contact Section
        contact_title_1: "Contact Us ",
        contact_title_2: "Directly",
        contact_desc: "We are pleased to receive your inquiries and schedule a meeting to discuss your cases and provide the appropriate legal support.",
        contact_loc_label: "Headquarters",
        contact_loc_val: "Riyadh, Al-Nakheel District, King Fahd Road",
        contact_phone_label: "Phone & WhatsApp",
        contact_email_label: "Email Address",

        // Form
        form_name_label: "Full Name",
        form_name_placeholder: "Enter full name",
        form_phone_label: "Phone Number",
        form_phone_placeholder: "+966 50 000 0000",
        form_email_label: "Email Address",
        form_email_placeholder: "name@domain.com",
        form_msg_label: "Inquiry Details",
        form_msg_placeholder: "Write a brief summary of the required service or inquiry",
        form_submit_btn: "Book Your Free Consultation",
        form_quick_contact: "Or contact us directly:",
        form_whatsapp: "WhatsApp",
        form_call: "Direct Call",
        form_success_title: "Inquiry Submitted Successfully",
        form_success_desc: "We appreciate your trust. Our legal team will review your inquiry and contact you shortly.",
        form_sending: "Sending request...",

        // Modal
        modal_title: "Request Legal Consultation",
        modal_subtitle: "Please fill out the form and one of our consultants will contact you within 24 hours.",
        modal_name_label: "Full Name",
        modal_name_placeholder: "Enter full name",
        modal_phone_label: "Phone Number",
        modal_phone_placeholder: "05xxxxxxxx",
        modal_email_label: "Email Address",
        modal_email_placeholder: "mail@example.sa",
        modal_service_label: "Required Service Category",
        modal_service_placeholder: "Select case/consultation category",
        modal_service_opt1: "Advocacy & Litigation (Corporate, Real Estate, Administrative)",
        modal_service_opt2: "Commercial Arbitration & Mediation",
        modal_service_opt3: "Notarization & Contract Drafting/Review",
        modal_service_opt4: "Corporate Governance & Company Setup",
        modal_service_opt5: "Other Legal Consultation",
        modal_desc_label: "Case/Inquiry Description",
        modal_desc_placeholder: "Please write a brief summary of the consultation topic",
        modal_submit_btn: "Confirm Consultation Request",

        // Multi-stage Contact Page
        contact_page_subtitle: "Please fill out the form step-by-step to start processing your request",
        contact_page_step: "Step",
        contact_page_of: "of",
        contact_page_step1_title: "1. Personal Information",
        contact_page_step2_title: "2. Case Details",
        contact_page_step3_title: "3. Urgency Level",
        contact_page_urgency_label: "Case Urgency",
        contact_page_urg_low: "Regular Consultation (within 24 hours)",
        contact_page_urg_medium: "Priority Consultation (within 12 hours)",
        contact_page_urg_high: "Emergency Case (Immediate)",
        contact_page_btn_prev: "Previous",
        contact_page_btn_next: "Next",
        contact_page_btn_submit: "Submit Consultation Request",
        contact_page_emergency_title: "Emergency Case Request",
        contact_page_emergency_desc: "Redirecting you to WhatsApp for immediate telephone and follow-up contact.",

        // Validation Errors
        err_name: "Please enter your full name (minimum 3 characters)",
        err_phone: "Please enter a valid Saudi phone number (e.g. 0500000000)",
        err_email: "Please enter a valid email address",
        err_msg: "Please enter inquiry details (minimum 10 characters)",
        err_desc: "Please write a brief summary of the consultation topic",

        // Toast
        toast_success_title: "Submitted Successfully",
        toast_success_desc: "Thank you for your trust. We will contact you soon.",
        toast_registered_title: "Request Registered",
        toast_registered_desc: "Thank you, your consultation booking data has been saved successfully.",

        // Blog Main
        blog_badge: "Legal Blog & Cultivation",
        blog_hero_title: "Legal Blog & Regulations",
        blog_search_placeholder: "Search articles...",
        blog_search_title: "Search Blog",
        blog_cats_title: "Main Blog Categories",
        blog_cat_all: "All Articles",
        blog_cat_commercial: "Commercial Regulations",
        blog_cat_criminal: "Criminal Cases",
        blog_cat_corporate: "Corporate Governance & Company Setup",
        blog_cat_documentation: "Notarization & Corporate Contracts",
        blog_cat_arbitration: "Arbitration & Mediation",
        blog_cat_labor: "Labor Disputes",
        blog_empty: "No articles match the search criteria.",
        blog_read_more: "Read Full Article",
        blog_modal_read_time: "Read time:",
        blog_modal_related: "Related articles by category",
        blog_en_notice: "*(Note: Legal articles are in Arabic, showing original text with English metadata)*",

        // Footer & copyright
        copyright: "© 2026 Dr. Saud bin Fahd Al-Duraymih Law Firm. All rights reserved.",

        // Morph Captions (dynamic 3D overlay text)
        morph_caption_shield: "We protect your ambition",
        morph_caption_framework: "We build your strategy",
        morph_caption_balance: "We balance rights",
        morph_caption_circle: "We arrange solutions",
        morph_caption_logo: "With you till the end",

        // Upload File Component
        upload_label: "Attachments & Supporting Documents (Optional)",
        drag_drop_text: "Drag & drop files here or",
        browse_files: "Browse Files",
        upload_limits: "Max 5 files. Max size per file 10 MB. Max total 30 MB.",
        stage_preparing: "Preparing files...",
        stage_uploading: "Uploading...",
        stage_saving: "Saving consultation...",
        stage_completed: "Completed.",
        btn_retry: "Retry Submission",
        err_max_files: "You cannot upload more than 5 files.",
        err_file_size: "File {name} exceeds the maximum size (10 MB).",
        err_total_size: "Total size of files exceeds the maximum limit (30 MB).",
        err_file_type: "File type for {name} is not supported. Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG.",
        err_duplicate_file: "File {name} has already been added.",
        err_payload_limit: "Payload size is too large, please reduce attachment sizes.",
        err_upload_failed: "Upload failed. Please try again."
    },
};

// Simple global translation helper
function t(key) {
    const lang = localStorage.getItem('lang') || 'ar';
    return TRANSLATIONS[lang][key] || key;
}

// Bind translation elements to window scope
window.TRANSLATIONS = TRANSLATIONS;
window.t = t;
