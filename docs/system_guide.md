# دليـل تشغيـل النظـام المتكامـل (Dr. Saud Law Office Full-Stack Manual)

يرشدك هذا الدليل لتثبيت وتطوير ونشر الموقع القانوني، ويعتمد على:
- **Node.js (Express + TypeScript)** للواجهة الخلفية.
- **MySQL/MariaDB + Prisma ORM** لقاعدة البيانات، ويمكن إدارتها عبر phpMyAdmin.
- **لوحة تحكم زجاجية فاخرة (`/admin`)** لإدارة كافة محتويات الموقع والطلبات.
- **بنية تخزين ملفات محلية آمنة ومحمية** بدلاً من Google Drive.

---

## ١. هيكلية مجلدات المشروع (Folder Structure)

تم تنظيم المشروع بدقة لفصل المسؤوليات وتسهيل النشر:
```
draymih/
├── public/          # Frontend مستقل (Vite) ولوحة التحكم public/admin
├── backend/         # واجهة REST API المبنية بـ Express وTypeScript
│   └── src/         # Controllers, Middlewares, Routes, Services
├── prisma/          # مخطط قاعدة البيانات وملف البيانات الأولية
├── database/        # ملف schema.sql الجاهز للاستيراد عبر phpMyAdmin
├── uploads/         # المجلد الرئيسي لحفظ المرفقات (ينقسم محلياً)
│   ├── YYYY/MM/     # أرشيف طلبات الاستشارات
│   └── media/       # مكتبة الوسائط للوحة التحكم
├── docs/            # دليل تشغيل النظام والمستندات التقنية
└── scripts/         # نصوص تهيئة المخدم والإطلاق (Nginx, PM2)
```

---

## ٢. متطلبات التشغيل (System Prerequisites)

لتشغيل المشروع محلياً أو على مخدم الإنتاج، تحتاج لتوفير:
1. **Node.js** (إصدار v16 أو أعلى).
2. **MySQL 8+** أو **MariaDB 10.6+** (يمكن استعمال XAMPP مع phpMyAdmin محلياً).
3. **Nginx** (كموزع أحمال ومخدم عكسي للملفات الساكنة).
4. **PM2** (لإدارة عمليات خادم Node.js خلف الكواليس).

---

## ٣. خطوات الإطلاق والتشغيل المحلي (Setup & Boot Steps)

### أ. تهيئة ملف الإعدادات البيئية (`backend/.env`)
قم بنسخ الملف `backend/.env.example` إلى `backend/.env` وتعبئة المتغيرات التالية:
* `DATABASE_URL`: رابط MySQL بالشكل `mysql://USER:PASSWORD@127.0.0.1:3306/draymih_db`.
* `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: مفاتيح التشفير للتواقيع الرقمية لجلسات الموظفين.
* `SMTP_USER` / `SMTP_PASS`: بيانات حساب البريد الصادر التابع للمكتب.
* `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD`: حساب المدير الذي سيُنشأ عند تشغيل الـseed لأول مرة.

### ب. تثبيت الاعتمادات وبناء الخادم
افتح موجه الأوامر في مجلد `backend` ونفذ:
```bash
# تثبيت المكتبات البرمجية
npm install

# بناء ملفات خادم Express
npm run build
```

### ج. إنشاء قاعدة البيانات عبر phpMyAdmin
1. شغّل MySQL وافتح `http://localhost/phpmyadmin`.
2. أنشئ قاعدة باسم `draymih_db` بترميز `utf8mb4_unicode_ci`.
3. اختر القاعدة ثم **Import** واستورد الملف `database/schema.sql`.
4. تأكد أن بيانات الاتصال في `backend/.env` تطابق مستخدم وكلمة مرور MySQL.

بدلاً من الاستيراد اليدوي، يمكن لـPrisma إنشاء الجداول مباشرة:
```bash
npx prisma db push
npx prisma db seed
```
بيانات دخول المدير هي القيم التي وضعتها في `ADMIN_EMAIL` و`ADMIN_INITIAL_PASSWORD`؛ لا توجد كلمة مرور ثابتة داخل الكود.

### د. تشغيل الخادم
من جذر المشروع، ثبّت الحزم ثم شغّل الواجهتين معاً:
```bash
npm install
npm --prefix public install
npm run dev
```
يعمل الـFrontend على `http://localhost:5173` والـBackend API على `http://localhost:5000`.

يمكن تشغيل كل جزء منفصلاً:
```bash
npm run dev:frontend
npm run dev:backend
```

---

## ٤. النشر على مخدم الإنتاج (Production Deployment)

### أ. إدارة العمليات عبر PM2
قم بالانتقال للمجلد الرئيسي وتشغيل خادم Node.js عبر PM2 لضمان التشغيل المستمر وإعادة التشغيل التلقائي عند أي خلل:
```bash
pm2 start scripts/ecosystem.config.js --env production
```

### ب. تهيئة مخدم Nginx
قم بنسخ إعدادات الملف `scripts/nginx.conf` إلى مجلد إعدادات Nginx المتاحة للمواقع:
```bash
sudo cp scripts/nginx.conf /etc/nginx/sites-available/draymih-law-office
sudo ln -s /etc/nginx/sites-available/draymih-law-office /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
يقوم Nginx بتوجيه طلبات الواجهة الخلفية والعميل مباشرة ويحمي مجلد المرفقات `uploads` من التنفيذ المباشر لأي كود برمجي ضار قد يرفعه مخترقون.

---

## ٥. سياسات الرفع وإدارة المستندات الحساسة

* **مسار الحفظ**: تحفظ الملفات في مجلد محمي تلقائياً وفق التاريخ والرقم المرجعي:
  `uploads/YYYY/MM/LAW-YYYYMMDD-XXXXXX/`
* **الحدود الأمنية للرفع**:
  - الحد الأقصى للمستندات المرفقة: **٥ ملفات**.
  - الحد الأقصى لحجم الملف الواحد: **١٠ ميجابايت**.
  - الحد الأقصى الإجمالي للطلب الواحد: **٣٠ ميجابايت**.
  - الامتدادات المقبولة للملفات: `PDF, DOC, DOCX, PNG, JPG, JPEG`.
* **النزاهة والترابط المعاملاتي (Transactional Safety)**:
  يتم الرفع عبر الخادم في مخزن مؤقت أولاً (`uploads/temp/`). إذا نجح فحص قاعدة البيانات وتأكيد إدخال بيانات الطلب، تُنقل الملفات للمجلد النهائي للأرشفة ويتم إرسال إشعارات البريد. في حال فشل أي قيد لقاعدة البيانات أو انقطاع الاتصال، يقوم الخادم تلقائياً **بحذف المستندات المؤقتة** لمنع تراكم الملفات الميتة أو اليتيمة على القرص الصلب.
