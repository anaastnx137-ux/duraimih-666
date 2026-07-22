// Saudi Law Office Admin Dashboard Controller
let activeTab = 'dashboard';
let accessToken = null;
let currentUser = null;
let chartInstance = null;
let usersTabUnlocked = false;

const API_BASE = '/api';

async function safeJson(response) {
    const text = await response.text();
    try {
        const json = JSON.parse(text);
        if (json && json.success === false && json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
            const details = json.errors.map(e => `${e.message}`).join(', ');
            json.message = `${json.message} (${details})`;
        }
        return json;
    } catch (e) {
        console.error("Invalid server response:", text);
        throw new Error("Server returned invalid JSON.\n\nResponse:\n" + text);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 1. Authenticated Fetch API Wrapper (handles token validation & silent token refresh)
async function authenticatedFetch(url, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }
    if (accessToken) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
        options.headers['X-CSRF-Token'] = csrfToken;
    }

    let response = await fetch(url, options);

    // If Access Token expired, try silent token refresh
    if (response.status === 401) {
        console.warn("Access token expired, attempting refresh token rotation...");
        const refreshSuccess = await performTokenRefresh();
        if (refreshSuccess) {
            // Retry original request with new access token
            options.headers['Authorization'] = `Bearer ${accessToken}`;
            response = await fetch(url, options);
        } else {
            // Clear credentials & redirect to login
            handleLogoutRedirect();
            throw new Error("Session expired. Please log in again.");
        }
    }

    return response;
}

// Perform Silent Refresh Token request using HTTP-only cookies
async function performTokenRefresh() {
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST' });
        const json = await safeJson(res);
        if (json.success && json.accessToken) {
            accessToken = json.accessToken;
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// Handle login submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const rememberMe = document.getElementById('remember-me').checked;
    const errorEl = document.getElementById('login-error');

    if (errorEl) errorEl.style.display = 'none';

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const json = await safeJson(res);

        if (!json.success) {
            throw new Error(json.message || "Invalid credentials.");
        }

        accessToken = json.accessToken;
        currentUser = json.user;

        // Save session context if selected
        if (rememberMe) {
            localStorage.setItem('admin_user_context', JSON.stringify(json.user));
        }

        // Hide overlay, load page
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('app-wrapper').style.display = 'flex';
        
        document.getElementById('user-display-name').textContent = currentUser.fullName;
        document.getElementById('user-display-role').textContent = currentUser.role;

        showToast(`مرحباً بك، ${currentUser.fullName}`, 'success');
        const initialTab = window.location.hash.replace('#', '') || 'dashboard';
        switchTab(initialTab);
        loadNotificationPanelDetails();
        initSocket();

    } catch (err) {
        if (errorEl) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    }
});

// App startup bootstrapper
async function initApp() {
    // Try silently fetching a new access token
    const refreshed = await performTokenRefresh();
    if (refreshed) {
        // Hide login, load workspace
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('app-wrapper').style.display = 'flex';
        
        // Fetch current user details optionally or parse from stored context
        const context = localStorage.getItem('admin_user_context');
        if (context) {
            currentUser = JSON.parse(context);
            document.getElementById('user-display-name').textContent = currentUser.fullName;
            document.getElementById('user-display-role').textContent = currentUser.role;
        } else {
            document.getElementById('user-display-name').textContent = "مستشار إداري";
        }
        
        const initialTab = window.location.hash.replace('#', '') || 'dashboard';
        switchTab(initialTab);
        loadNotificationPanelDetails();
        initSocket();
    } else {
        // Stay on login box
        document.getElementById('auth-overlay').style.display = 'flex';
    }
}

let socket = null;
function initSocket() {
    if (window.io && !socket) {
        socket = io({ transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('[Socket] Connected to real-time notification socket.');
        });

        socket.on('notification', (data) => {
            // Play audio notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
            audio.play().catch(() => {});

            // Show real-time toast alert
            const isEN = document.documentElement.lang === 'en';
            const message = isEN ? data.messageEn : data.messageAr;
            showToast(message, 'info');

            // Prepend new notification to the active list and re-render
            const newNotif = {
                id: data.id || Date.now(),
                titleAr: data.titleAr || 'إشعار جديد',
                titleEn: data.titleEn || 'New Notification',
                messageAr: data.messageAr || message,
                messageEn: data.messageEn || message,
                isRead: false,
                createdAt: new Date().toISOString()
            };
            notificationsList.unshift(newNotif);
            if (typeof renderNotificationPanelList === 'function') {
                renderNotificationPanelList();
            }

            // Increment the header notifications badge counter
            const notifDot = document.getElementById('notif-count');
            if (notifDot) {
                const count = parseInt(notifDot.textContent || '0') + 1;
                notifDot.textContent = count;
                notifDot.style.display = 'flex';
            }

            // Dynamically refresh statistics if dashboard tab is active
            if (activeTab === 'dashboard') {
                renderDashboard();
            }
        });
    }
}

function handleLogoutRedirect() {
    accessToken = null;
    currentUser = null;
    usersTabUnlocked = false;
    localStorage.removeItem('admin_user_context');
    document.getElementById('app-wrapper').style.display = 'none';
    document.getElementById('auth-overlay').style.display = 'flex';
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {}
    handleLogoutRedirect();
    showToast("تم تسجيل الخروج بنجاح.", "info");
}

// 2. Tab switching logic
function switchTab(tabId) {
    if (tabId === 'users' && !usersTabUnlocked) {
        const prevTab = activeTab && activeTab !== 'users' ? activeTab : 'dashboard';
        showUserTabUnlockModal(prevTab);
        return;
    }

    activeTab = tabId;
    if (window.location.hash !== `#${tabId}`) {
        window.location.hash = tabId;
    }
    
    // Toggle active sidebar items
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('href') === `#${tabId}`) {
            el.classList.add('active');
        }
    });

    const pageTitleMap = {
        'dashboard': 'لوحة التحكم والتحليلات',
        'consultations': 'إدارة طلبات الاستشارة الواردة',
        'blog': 'إدارة مقالات المدونة والمنشورات',
        'services': 'إدارة مجالات الاختصاص والخدمات',
        'faqs': 'إدارة الأسئلة الشائعة',
        'testimonials': 'إدارة آراء وتوصيات العملاء',
        'media': 'مكتبة الملفات والوسائط',
        'users': 'حسابات الموظفين والصلاحيات',
        'settings': 'إعدادات الموقع ومعلومات الاتصال',
        'logs': 'سجلات النشاط ورقابة النظام'
    };

    document.getElementById('page-title').textContent = pageTitleMap[tabId] || 'لوحة التحكم';

    // Render active tab template
    const contentArea = document.getElementById('workspace-content');
    if (contentArea) {
        contentArea.innerHTML = `<div class="loading-state" style="text-align:center; padding:5rem 0;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--color-gold);"></i><p style="margin-top:1rem; color:var(--color-text-light);">جاري تحميل البيانات...</p></div>`;
    }

    // Load active panel renderers
    switch (tabId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'consultations':
            renderConsultations();
            break;
        case 'blog':
            renderBlog();
            break;
        case 'services':
            renderServices();
            break;
        case 'faqs':
            renderFAQs();
            break;
        case 'testimonials':
            renderTestimonials();
            break;
        case 'media':
            renderMedia();
            break;
        case 'users':
            renderUsers();
            break;
        case 'settings':
            renderSettings();
            break;
        case 'logs':
            renderLogs();
            break;
    }
}

// 3. Renderers methods

// TAB: Dashboard
async function renderDashboard() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/stats`);
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        const stats = json.stats;
        const container = document.getElementById('workspace-content');

        container.innerHTML = `
            <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>استشارات اليوم</p>
                        <h3>${stats.todaysConsultations}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-calendar-day"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>استشارات الشهر</p>
                        <h3>${stats.monthlyConsultations}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-calendar-days"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>قضايا قيد المراجعة</p>
                        <h3>${stats.openCases}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-folder-open" style="color:#ffc107;"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>الاستشارات المغلقة</p>
                        <h3>${stats.closedCases}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-circle-check" style="color:var(--color-green);"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>الخدمات القانونية</p>
                        <h3>${stats.servicesCount}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-gavel"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>المقالات والمدونة</p>
                        <h3>${stats.articlesCount}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-scroll"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>الأسئلة الشائعة</p>
                        <h3>${stats.faqsCount}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-circle-question"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>توصيات العملاء</p>
                        <h3>${stats.testimonialsCount}</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-star" style="color:#ffc107;"></i></div>
                </div>
                <div class="metric-card glass-panel">
                    <div class="metric-info">
                        <p>المساحة المستخدمة</p>
                        <h3>${stats.storageMB} MB</h3>
                    </div>
                    <div class="metric-icon-box"><i class="fa-solid fa-hard-drive"></i></div>
                </div>
            </div>

            <div class="dashboard-details-grid">
                <!-- Consultations Chart panel -->
                <div class="chart-panel glass-panel">
                    <div class="panel-title">مخطط الطلبات الشهري</div>
                    <div class="chart-container" style="position: relative; height:300px; width:100%;">
                        <canvas id="consultationsChart"></canvas>
                    </div>
                </div>

                <!-- Recent consultations list -->
                <div class="recent-consultations-panel glass-panel">
                    <div class="panel-title">أحدث الاستشارات الواردة</div>
                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>العميل</th>
                                    <th>الخدمة</th>
                                    <th>الحالة</th>
                                    <th>التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.latestConsultations.map(c => `
                                    <tr style="cursor:pointer;" onclick="viewConsultationDetails(${c.id})">
                                        <td style="font-weight:700;">${c.fullName}</td>
                                        <td>${c.service || 'غير محدد'}</td>
                                        <td><span class="status-pill ${c.status.toLowerCase().replace(' ', '_')}">${c.status}</span></td>
                                        <td>${new Date(c.createdAt).toLocaleDateString('ar-SA')}</td>
                                    </tr>
                                `).join('')}
                                ${stats.latestConsultations.length === 0 ? '<tr><td colspan="4" style="text-align:center;">لا توجد استشارات واردة حالياً.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Render Chart.js
        setTimeout(() => {
            const ctx = document.getElementById('consultationsChart')?.getContext('2d');
            if (!ctx) return;

            if (chartInstance) chartInstance.destroy();

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: stats.chartData.map(d => d.month),
                    datasets: [{
                        label: 'طلبات الاستشارة الواردة',
                        data: stats.chartData.map(d => d.consultations),
                        borderColor: '#c5a880',
                        backgroundColor: 'rgba(197, 168, 128, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3b8ad' } },
                        x: { grid: { display: false }, ticks: { color: '#a3b8ad' } }
                    }
                }
            });
        }, 100);

    } catch (e) {
        showToast(e.message, 'error');
    }
}

// TAB: Consultations
let currentConsultationsPage = 1;
async function renderConsultations(page = 1, statusFilter = '', searchVal = '') {
    try {
        currentConsultationsPage = page;
        let query = `?page=${page}&limit=10`;
        if (statusFilter) query += `&status=${statusFilter}`;
        if (searchVal) query += `&search=${encodeURIComponent(searchVal)}`;

        const res = await authenticatedFetch(`${API_BASE}/admin/consultations${query}`);
        const json = await safeJson(res);

        const container = document.getElementById('workspace-content');
        if (res.status === 403 || !json.success) {
            container.innerHTML = `
                <div class="unauthorized-state" style="text-align:center; padding:5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:var(--color-gold); margin-bottom:1rem;"></i>
                    <h3 style="color:white; margin-bottom:0.5rem; font-weight:700;">ليست لديكم الصلاحية الكافية</h3>
                    <p style="color:var(--color-text-light);">عذراً، لا تملك الصلاحيات المطلوبة للوصول إلى طلبات الاستشارة القانونية.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = `
            <div class="actions-bar glass-panel" style="padding:1rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; gap:1.5rem;">
                <div class="search-box" style="flex-grow:1; position:relative;">
                    <i class="fa-solid fa-magnifying-glass" style="position:absolute; right:15px; top:50%; transform:translateY(-50%); color:var(--color-gold);"></i>
                    <input type="text" id="consultation-search-input" value="${searchVal}" placeholder="ابحث باسم العميل، الجوال، رقم المرجع، تفاصيل القضية..." style="width:100%; padding:10px 45px 10px 15px; background:rgba(255,255,255,0.02); border:1px solid var(--glass-border); border-radius:6px; color:white;" onchange="executeConsultationsSearch()">
                </div>
                <div class="filters" style="display:flex; gap:1rem;">
                    <select id="consultation-status-filter" style="padding:10px 15px; background:var(--color-bg-dark); border:1px solid var(--glass-border); border-radius:6px; color:white;" onchange="executeConsultationsSearch()">
                        <option value="">جميع الحالات</option>
                        <option value="New" ${statusFilter === 'New' ? 'selected' : ''}>New</option>
                        <option value="In Review" ${statusFilter === 'In Review' ? 'selected' : ''}>In Review</option>
                        <option value="Scheduled" ${statusFilter === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="Closed" ${statusFilter === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </div>
            </div>

            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>رقم المرجع</th>
                                <th>اسم العميل</th>
                                <th>الجوال</th>
                                <th>الخدمة المطلوبة</th>
                                <th>الأولوية</th>
                                <th>الحالة</th>
                                <th>التاريخ</th>
                                <th>العمليات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${json.consultations.map(c => `
                                <tr>
                                    <td style="font-weight:700; color:var(--color-gold);">${c.referenceNumber}</td>
                                    <td>${c.fullName}</td>
                                    <td dir="ltr" style="text-align:right;">${c.phone}</td>
                                    <td>${c.service || 'غير محدد'}</td>
                                    <td><span class="priority-label ${c.priority.toLowerCase()}">${c.priority}</span></td>
                                    <td><span class="status-pill ${c.status.toLowerCase().replace(' ', '_')}">${c.status}</span></td>
                                    <td>${new Date(c.createdAt).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div style="display:flex; gap:5px;">
                                            <button class="btn btn-primary" style="padding:5px 12px; font-size:0.78rem;" onclick="viewConsultationDetails(${c.id})">عرض التفاصيل</button>
                                            <button class="btn btn-logout" style="padding:5px 12px; font-size:0.78rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteConsultation(${c.id})">حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                            ${json.consultations.length === 0 ? '<tr><td colspan="8" style="text-align:center; padding:2rem 0;">لا توجد طلبات مطابقة للبحث.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination navigation controls -->
                ${renderTablePagination(json.pagination, 'renderConsultations', statusFilter, searchVal)}
            </div>
        `;

    } catch (e) {
        showToast(e.message, 'error');
    }
}

function executeConsultationsSearch() {
    const searchVal = document.getElementById('consultation-search-input').value.trim();
    const statusVal = document.getElementById('consultation-status-filter').value;
    renderConsultations(1, statusVal, searchVal);
}

// TAB: Consultation Details Modal view
async function viewConsultationDetails(id) {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/consultations/${id}`);
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        const c = json.consultation;

        // Render modal overlay
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'consultation-details-modal';
        modal.innerHTML = `
            <div class="modal-box glass-panel" style="width:100%; max-width:800px; padding:2.5rem; max-height:90vh; overflow-y:auto;">
                <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:1rem; margin-bottom:1.5rem;">
                    <h3>تفاصيل طلب الاستشارة: ${c.referenceNumber}</h3>
                    <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('consultation-details-modal')" style="cursor:pointer; font-size:1.4rem; color:var(--color-gold);"></i>
                </div>
                <div class="modal-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                    <div>
                        <h4 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:5px; margin-bottom:10px;">البيانات الشخصية والاتصال</h4>
                        <p style="margin-bottom:8px;"><strong>اسم العميل:</strong> ${c.fullName}</p>
                        <p style="margin-bottom:8px;"><strong>الجوال:</strong> <span dir="ltr">${c.phone}</span></p>
                        <p style="margin-bottom:8px;"><strong>البريد الإلكتروني:</strong> ${c.email || 'غير متوفر'}</p>
                        <p style="margin-bottom:8px;"><strong>الشركة/المنشأة:</strong> ${c.company || 'غير متوفر'}</p>
                    </div>
                    <div>
                        <h4 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:5px; margin-bottom:10px;">تفاصيل الحالة والتخصص</h4>
                        <p style="margin-bottom:8px;"><strong>نوع القضية/الخدمة:</strong> ${c.service || 'غير محدد'}</p>
                        <p style="margin-bottom:8px;"><strong>درجة الأولوية:</strong> <span class="priority-label ${c.priority.toLowerCase()}">${c.priority}</span></p>
                        <p style="margin-bottom:8px;"><strong>اللغة المفضلة:</strong> ${c.language === 'en' ? 'English (EN)' : 'العربية (AR)'}</p>
                        <p style="margin-bottom:8px;"><strong>الحالة الحالية:</strong> <span class="status-pill ${c.status.toLowerCase().replace(' ', '_')}">${c.status}</span></p>
                    </div>
                </div>

                <div style="margin-top:1.5rem;">
                    <h4 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:5px; margin-bottom:10px;">تفاصيل الرسالة الاستشارية</h4>
                    <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:6px; border:1px solid var(--color-border); white-space:pre-line;">
                        ${c.message}
                    </div>
                </div>

                <div style="margin-top:1.5rem;">
                    <h4 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:5px; margin-bottom:10px;">الملفات والمرفقات الداعمة</h4>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${c.files.map(f => `
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.01); padding:10px; border-radius:6px; border:1px solid var(--color-border);">
                                <span><i class="fa-regular fa-file-pdf" style="color:var(--color-gold); margin-left:8px;"></i>${f.fileName} (${(f.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                                 <a href="#" onclick="downloadSecureFile(event, ${f.id}, '${f.fileName}')" class="btn btn-primary" style="padding:4px 12px; font-size:0.75rem; text-decoration:none;"><i class="fa-solid fa-download"></i> تحميل</a>
                            </div>
                        `).join('')}
                        ${c.files.length === 0 ? '<p style="color:var(--color-text-light); font-size:0.85rem;">لا توجد مستندات مرفوعة.</p>' : ''}
                    </div>
                </div>

                <!-- Admin Action form: update status/assign user -->
                <form id="update-consultation-form" style="margin-top:2rem; border-top:1px solid var(--color-border); padding-top:1.5rem;" onsubmit="saveConsultationUpdates(event, ${c.id})">
                    <h4 style="color:var(--color-gold); margin-bottom:15px;">إجراءات المتابعة والتعديل</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1rem;">
                        <div class="form-group">
                            <label>تحديث حالة الطلب</label>
                            <select id="update-status" style="padding:10px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; width:100%;">
                                <option value="New" ${c.status === 'New' ? 'selected' : ''}>New (طلب جديد)</option>
                                <option value="In Review" ${c.status === 'In Review' ? 'selected' : ''}>In Review (قيد الدراسة)</option>
                                <option value="Scheduled" ${c.status === 'Scheduled' ? 'selected' : ''}>Scheduled (تم جدولة الجلسة)</option>
                                <option value="Closed" ${c.status === 'Closed' ? 'selected' : ''}>Closed (مغلق)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>تعديل الأولوية</label>
                            <select id="update-priority" style="padding:10px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; width:100%;">
                                <option value="Normal" ${c.priority === 'Normal' ? 'selected' : ''}>Normal</option>
                                <option value="Urgent" ${c.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
                                <option value="Emergency" ${c.priority === 'Emergency' ? 'selected' : ''}>Emergency</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:1.5rem;">
                        <label>ملاحظات إدارية داخلية (مرئية للموظفين فقط)</label>
                        <textarea id="update-notes" rows="3" style="width:100%; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; padding:10px;">${c.notes || ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> حفظ التغييرات واللوائح</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

    } catch (e) {
        showToast(e.message, 'error');
    }
}

async function saveConsultationUpdates(e, id) {
    e.preventDefault();
    const status = document.getElementById('update-status').value;
    const priority = document.getElementById('update-priority').value;
    const notes = document.getElementById('update-notes').value.trim();

    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/consultations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, priority, notes })
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم تحديث حالة طلب الاستشارة والملف بنجاح.", "success");
        closeModal('consultation-details-modal');
        renderConsultations(currentConsultationsPage);

    } catch (err) {
        showToast(err.message, 'error');
    }
}

// TAB: Blog
async function renderBlog() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/blog`);
        const json = await safeJson(res);

        const container = document.getElementById('workspace-content');
        if (res.status === 403 || !json.success) {
            container.innerHTML = `
                <div class="unauthorized-state" style="text-align:center; padding:5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:var(--color-gold); margin-bottom:1rem;"></i>
                    <h3 style="color:white; margin-bottom:0.5rem; font-weight:700;">ليست لديكم الصلاحية الكافية</h3>
                    <p style="color:var(--color-text-light);">عذراً، لا تملك الصلاحيات المطلوبة للوصول إلى إدارة مقالات المدونة والمنشورات.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = `
            <div class="actions-bar" style="text-align:left; margin-bottom:1.5rem;">
                <button class="btn btn-primary" onclick="showBlogArticleModal()"><i class="fa-solid fa-plus"></i> كتابة ونشر مقال جديد</button>
            </div>
            
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>المقال</th>
                                <th>التصنيف</th>
                                <th>الكاتب</th>
                                <th>الحالة</th>
                                <th>تاريخ النشر</th>
                                <th>العمليات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${json.articles.map(art => `
                                <tr>
                                    <td style="font-weight:700;">${art.titleAr}</td>
                                    <td>${art.category ? art.category.nameAr : 'غير محدد'}</td>
                                    <td>${art.author ? art.author.fullName : 'غير متوفر'}</td>
                                    <td><span class="status-pill ${art.status === 'Published' ? 'scheduled' : 'review'}">${art.status}</span></td>
                                    <td>${art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('ar-SA') : 'مسودة'}</td>
                                    <td>
                                        <div style="display:flex; gap:5px;">
                                            <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="showBlogArticleModal(${art.id})"><i class="fa-regular fa-edit"></i> تعديل</button>
                                            <button class="btn btn-logout" style="padding:4px 10px; font-size:0.75rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteBlogArticle(${art.id})"><i class="fa-regular fa-trash-can"></i> حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                            ${json.articles.length === 0 ? '<tr><td colspan="6" style="text-align:center;">لا توجد مقالات مدونة منشورة حالياً.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// TAB: Blog Article Create/Edit Modal
let blogCategoriesCache = [];
async function fetchBlogCategories() {
    if (blogCategoriesCache.length > 0) return blogCategoriesCache;
    try {
        const res = await fetch(`${API_BASE}/blog/categories`);
        const json = await safeJson(res);
        if (json.success) {
            blogCategoriesCache = json.categories;
        }
    } catch {}
    return blogCategoriesCache;
}

async function showBlogArticleModal(articleId = null) {
    try {
        const categories = await fetchBlogCategories();
        let art = {
            id: '', slug: '', titleAr: '', titleEn: '', excerptAr: '', excerptEn: '',
            contentAr: '', contentEn: '', categoryId: '', status: 'Draft', isFeatured: false,
            icon: 'fa-scroll', keywords: [], tags: [], readTimeAr: '', readTimeEn: ''
        };

        if (articleId) {
            const res = await authenticatedFetch(`${API_BASE}/admin/blog`);
            const json = await safeJson(res);
            const found = json.articles.find(a => a.id === articleId);
            if (found) art = found;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'blog-article-modal';
        modal.innerHTML = `
            <div class="modal-box glass-panel" style="width:100%; max-width:900px; padding:2.5rem; max-height:90vh; overflow-y:auto;">
                <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:1rem; margin-bottom:1.5rem;">
                    <h3>${articleId ? 'تعديل المقال القانوني' : 'كتابة مقال قانوني جديد'}</h3>
                    <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('blog-article-modal')" style="cursor:pointer; font-size:1.4rem; color:var(--color-gold);"></i>
                </div>
                <form id="blog-article-form" onsubmit="saveBlogArticle(event, ${articleId})">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                        <div class="form-group">
                            <label>العنوان (عربي)</label>
                            <input type="text" id="art-titleAr" value="${art.titleAr}" required>
                        </div>
                        <div class="form-group">
                            <label>العنوان (إنجليزي)</label>
                            <input type="text" id="art-titleEn" value="${art.titleEn}" required style="direction:ltr; text-align:left;">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                        <div class="form-group">
                            <label>الرابط الفرعي (Slug)</label>
                            <input type="text" id="art-slug" value="${art.slug}" required placeholder="e.g. corporate-governance-riyadh" style="direction:ltr; text-align:left;">
                            <small style="color: rgba(255,255,255,0.4); font-size: 0.75rem; margin-top: 4px; display: block;">ملاحظة: يجب أن يحتوي الرابط على أحرف إنجليزية صغيرة وعلامة (-) فقط (مثال: my-article-slug)</small>
                        </div>
                        <div class="form-group">
                            <label>التصنيف الرئيسي</label>
                            <select id="art-categoryId" required style="padding:10px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; width:100%;">
                                <option value="" disabled selected>اختر التصنيف</option>
                                ${categories.map(c => `<option value="${c.id}" ${art.categoryId === c.id ? 'selected' : ''}>${c.nameAr} / ${c.nameEn}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                        <div class="form-group">
                            <label>مقتطف قصير للمقال (عربي)</label>
                            <textarea id="art-excerptAr" rows="2" required>${art.excerptAr}</textarea>
                        </div>
                        <div class="form-group">
                            <label>مقتطف قصير للمقال (إنجليزي)</label>
                            <textarea id="art-excerptEn" rows="2" required style="direction:ltr; text-align:left;">${art.excerptEn}</textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>المحتوى التفصيلي للمقال (عربي)</label>
                        <textarea id="art-contentAr" rows="8" style="font-family:monospace;">${art.contentAr}</textarea>
                    </div>

                    <div class="form-group">
                        <label>المحتوى التفصيلي للمقال (إنجليزي)</label>
                        <textarea id="art-contentEn" rows="8" style="font-family:monospace; direction:ltr; text-align:left;">${art.contentEn}</textarea>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1rem;">
                        <div class="form-group">
                            <label>الكلمات الدالة للأرشفة (SEO Keywords - Comma separated)</label>
                            <input type="text" id="art-keywords" value="${(art.keywords || []).join(', ')}" placeholder="e.g. محاماة, استشارات, الرياض">
                        </div>
                        <div class="form-group">
                            <label>الوسوم (SEO Tags - Comma separated)</label>
                            <input type="text" id="art-tags" value="${(art.tags || []).join(', ')}" placeholder="e.g. استشارات, جنائي, عقاري">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>أيقونة المقال (FontAwesome)</label>
                            <input type="text" id="art-icon" value="${art.icon}" placeholder="fa-scroll">
                        </div>
                        <div class="form-group">
                            <label>الصورة البارزة (Featured Image URL)</label>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="art-imagePath" value="${art.imagePath || ''}" placeholder="/uploads/filename.jpg" style="flex-grow:1;">
                                <input type="file" id="art-imageFile" style="display:none;" onchange="uploadBlogFeaturedImage(this)">
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('art-imageFile').click()" style="padding:10px 15px; font-size:0.85rem;"><i class="fa-solid fa-upload"></i></button>
                            </div>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>حالة المقال</label>
                            <select id="art-status" style="padding:10px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; width:100%;">
                                <option value="Draft" ${art.status === 'Draft' ? 'selected' : ''}>مسودة (Draft)</option>
                                <option value="Published" ${art.status === 'Published' ? 'selected' : ''}>نشر فوري (Published)</option>
                            </select>
                        </div>
                        <div class="form-group" style="display:flex; align-items:center; height:100%; padding-top:25px;">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="art-isFeatured" ${art.isFeatured ? 'checked' : ''}>
                                <span>مقالة مميزة (Featured)</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> حفظ المقال</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        if (window.tinymce) {
            tinymce.baseURL = 'https://cdn.jsdelivr.net/npm/tinymce@6';
            tinymce.init({
                selector: '#art-contentAr',
                directionality: 'rtl',
                license_key: 'gpl',
                plugins: 'directionality link image code lists table',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | ltr rtl | bullist numlist | code',
                height: 300,
                setup: function (editor) {
                    editor.on('change', function () {
                        editor.save();
                    });
                }
            });
            tinymce.init({
                selector: '#art-contentEn',
                directionality: 'ltr',
                license_key: 'gpl',
                plugins: 'directionality link image code lists table',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | ltr rtl | bullist numlist | code',
                height: 300,
                setup: function (editor) {
                    editor.on('change', function () {
                        editor.save();
                    });
                }
            });
        }

        const slugInput = document.getElementById('art-slug');
        const titleEnInput = document.getElementById('art-titleEn');
        let userEditedSlug = false;

        if (slugInput) {
            slugInput.addEventListener('input', function(e) {
                userEditedSlug = true;
                e.target.value = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-');
            });
        }

        if (titleEnInput && slugInput && !articleId) {
            titleEnInput.addEventListener('input', function(e) {
                if (!userEditedSlug) {
                    slugInput.value = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                        .replace(/-+/g, '-');
                }
            });
        }

    } catch (e) {
        showToast(e.message, 'error');
    }
}

async function saveBlogArticle(e, id) {
    e.preventDefault();
    if (window.tinymce) {
        tinymce.triggerSave();
    }
    
    const contentAr = document.getElementById('art-contentAr').value.trim();
    const contentEn = document.getElementById('art-contentEn').value.trim();

    if (!contentAr) {
        showToast("يرجى كتابة المحتوى التفصيلي للمقال باللغة العربية.", "error");
        return;
    }
    if (!contentEn) {
        showToast("يرجى كتابة المحتوى التفصيلي للمقال باللغة الإنجليزية.", "error");
        return;
    }

    let slug = document.getElementById('art-slug').value.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

    if (!slug) {
        const titleEn = document.getElementById('art-titleEn').value.trim();
        slug = titleEn
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
    }

    if (!slug) {
        showToast("يرجى كتابة الرابط الفرعي (Slug) باللغة الإنجليزية.", "error");
        return;
    }

    const payload = {
        titleAr: document.getElementById('art-titleAr').value.trim(),
        titleEn: document.getElementById('art-titleEn').value.trim(),
        slug,
        categoryId: parseInt(document.getElementById('art-categoryId').value),
        excerptAr: document.getElementById('art-excerptAr').value.trim(),
        excerptEn: document.getElementById('art-excerptEn').value.trim(),
        contentAr,
        contentEn,
        icon: document.getElementById('art-icon').value.trim() || 'fa-scroll',
        imagePath: document.getElementById('art-imagePath').value.trim() || null,
        status: document.getElementById('art-status').value,
        isFeatured: document.getElementById('art-isFeatured').checked,
        keywords: document.getElementById('art-keywords').value.split(',').map(k => k.trim()).filter(Boolean),
        tags: document.getElementById('art-tags').value.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/blog/${id}` : `${API_BASE}/admin/blog`;
        
        const res = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم حفظ المقال بنجاح.", "success");
        closeModal('blog-article-modal');
        renderBlog();

    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteBlogArticle(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/blog/${id}`, { method: 'DELETE' });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم حذف المقال بنجاح.", "success");
        renderBlog();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// TAB: Services, FAQ, Testimonials
async function renderServices() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/services`);
        const json = await safeJson(res);
        const container = document.getElementById('workspace-content');
        container.innerHTML = `
            <div class="actions-bar" style="text-align:left; margin-bottom:1.5rem;">
                <button class="btn btn-primary" onclick="showServiceModal()"><i class="fa-solid fa-plus"></i> إضافة خدمة قانونية</button>
            </div>
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>الخدمة (عربي)</th>
                            <th>الخدمة (إنجليزي)</th>
                            <th>الرابط الفرعي (Slug)</th>
                            <th>حالة النشاط</th>
                            <th>العمليات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${json.services.map(s => `
                            <tr>
                                <td style="font-weight:700;">${s.titleAr}</td>
                                <td>${s.titleEn}</td>
                                <td>${s.slug}</td>
                                <td><span class="status-pill ${s.isActive ? 'scheduled' : 'closed'}">${s.isActive ? 'نشط' : 'معطل'}</span></td>
                                <td>
                                    <div style="display:flex; gap:5px;">
                                        <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="showServiceModal(${s.id})">تعديل</button>
                                        <button class="btn btn-logout" style="padding:4px 10px; font-size:0.75rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteService(${s.id})">حذف</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) { showToast(e.message, 'error'); }
}

async function showServiceModal(id = null) {
    let service = { id: '', slug: '', titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', icon: 'fa-scale-balanced', isActive: true, orderIndex: 0 };
    if (id) {
        const res = await authenticatedFetch(`${API_BASE}/admin/services`);
        const json = await safeJson(res);
        const found = json.services.find(s => s.id === id);
        if (found) service = found;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'service-modal';
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:600px; padding:2rem;">
            <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:15px;">
                <h3>${id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h3>
                <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('service-modal')"></i>
            </div>
            <form onsubmit="saveService(event, ${id})">
                <div class="form-group">
                    <label>الاسم الفرعي (Slug)</label>
                    <input type="text" id="srv-slug" value="${service.slug}" required style="direction:ltr; text-align:left;">
                    <small style="color: rgba(255,255,255,0.4); font-size: 0.75rem; margin-top: 4px; display: block;">ملاحظة: يجب أن يحتوي الرابط على أحرف إنجليزية صغيرة وعلامة (-) فقط (مثال: my-service-slug)</small>
                </div>
                <div class="form-group">
                    <label>العنوان (عربي)</label>
                    <input type="text" id="srv-titleAr" value="${service.titleAr}" required>
                </div>
                <div class="form-group">
                    <label>العنوان (إنجليزي)</label>
                    <input type="text" id="srv-titleEn" value="${service.titleEn}" required style="direction:ltr; text-align:left;">
                </div>
                <div class="form-group">
                    <label>تفاصيل الوصف (عربي)</label>
                    <textarea id="srv-descriptionAr" rows="3" required>${service.descriptionAr}</textarea>
                </div>
                <div class="form-group">
                    <label>تفاصيل الوصف (إنجليزي)</label>
                    <textarea id="srv-descriptionEn" rows="3" required style="direction:ltr; text-align:left;">${service.descriptionEn}</textarea>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label>أيقونة FontAwesome</label>
                        <input type="text" id="srv-icon" value="${service.icon || 'fa-scale-balanced'}" style="direction:ltr; text-align:left;">
                    </div>
                    <div class="form-group">
                        <label>ترتيب الظهور</label>
                        <input type="number" id="srv-orderIndex" min="0" value="${service.orderIndex || 0}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="srv-isActive" ${service.isActive ? 'checked' : ''}>
                        <span>الخدمة ظاهرة في الموقع</span>
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">حفظ البيانات</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const srvSlugInput = document.getElementById('srv-slug');
    const srvTitleEnInput = document.getElementById('srv-titleEn');
    let userEditedSrvSlug = false;

    if (srvSlugInput) {
        srvSlugInput.addEventListener('input', function(e) {
            userEditedSrvSlug = true;
            e.target.value = e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');
        });
    }

    if (srvTitleEnInput && srvSlugInput && !id) {
        srvTitleEnInput.addEventListener('input', function(e) {
            if (!userEditedSrvSlug) {
                srvSlugInput.value = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-');
            }
        });
    }
}

async function saveService(e, id) {
    e.preventDefault();

    let slug = document.getElementById('srv-slug').value.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

    if (!slug) {
        const titleEn = document.getElementById('srv-titleEn').value.trim();
        slug = titleEn
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
    }

    if (!slug) {
        showToast("يرجى كتابة الاسم الفرعي (Slug) باللغة الإنجليزية.", "error");
        return;
    }

    const payload = {
        slug,
        titleAr: document.getElementById('srv-titleAr').value.trim(),
        titleEn: document.getElementById('srv-titleEn').value.trim(),
        descriptionAr: document.getElementById('srv-descriptionAr').value.trim(),
        descriptionEn: document.getElementById('srv-descriptionEn').value.trim(),
        icon: document.getElementById('srv-icon').value.trim() || 'fa-scale-balanced',
        orderIndex: parseInt(document.getElementById('srv-orderIndex').value) || 0,
        isActive: document.getElementById('srv-isActive').checked
    };
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/services/${id}` : `${API_BASE}/admin/services`;
        const res = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم الحفظ بنجاح.", "success");
        closeModal('service-modal');
        renderServices();
    } catch (err) { showToast(err.message, 'error'); }
}

// TAB: FAQ
async function renderFAQs() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/faqs`);
        const json = await safeJson(res);
        const container = document.getElementById('workspace-content');
        container.innerHTML = `
            <div class="actions-bar" style="text-align:left; margin-bottom:1.5rem;">
                <button class="btn btn-primary" onclick="showFAQModal()"><i class="fa-solid fa-plus"></i> إضافة سؤال جديد</button>
            </div>
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>السؤال (عربي)</th>
                            <th>النشاط</th>
                            <th>العمليات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${json.faqs.map(f => `
                            <tr>
                                <td style="font-weight:700;">${f.questionAr}</td>
                                <td><span class="status-pill ${f.isActive ? 'scheduled' : 'closed'}">${f.isActive ? 'نشط' : 'معطل'}</span></td>
                                <td>
                                    <div style="display:flex; gap:5px;">
                                        <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="showFAQModal(${f.id})">تعديل</button>
                                        <button class="btn btn-logout" style="padding:4px 10px; font-size:0.75rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteFAQ(${f.id})">حذف</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) { showToast(e.message, 'error'); }
}

async function showFAQModal(id = null) {
    let faq = { id: '', questionAr: '', questionEn: '', answerAr: '', answerEn: '', isActive: true, orderIndex: 0 };
    if (id) {
        const res = await authenticatedFetch(`${API_BASE}/admin/faqs`);
        const json = await safeJson(res);
        const found = json.faqs.find(f => f.id === id);
        if (found) faq = found;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'faq-modal';
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:600px; padding:2rem;">
            <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:15px;">
                <h3>${id ? 'تعديل السؤال' : 'إضافة سؤال'}</h3>
                <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('faq-modal')"></i>
            </div>
            <form onsubmit="saveFAQ(event, ${id})">
                <div class="form-group">
                    <label>السؤال (عربي)</label>
                    <input type="text" id="faq-questionAr" value="${faq.questionAr}" required>
                </div>
                <div class="form-group">
                    <label>السؤال (إنجليزي)</label>
                    <input type="text" id="faq-questionEn" value="${faq.questionEn}" required style="direction:ltr; text-align:left;">
                </div>
                <div class="form-group">
                    <label>الإجابة (عربي)</label>
                    <textarea id="faq-answerAr" rows="3" required>${faq.answerAr}</textarea>
                </div>
                <div class="form-group">
                    <label>الإجابة (إنجليزي)</label>
                    <textarea id="faq-answerEn" rows="3" required style="direction:ltr; text-align:left;">${faq.answerEn}</textarea>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; align-items:end;">
                    <div class="form-group">
                        <label>ترتيب الظهور</label>
                        <input type="number" id="faq-orderIndex" min="0" value="${faq.orderIndex || 0}">
                    </div>
                    <div class="form-group">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="faq-isActive" ${faq.isActive ? 'checked' : ''}>
                            <span>السؤال ظاهر في الموقع</span>
                        </label>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">حفظ</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveFAQ(e, id) {
    e.preventDefault();
    const payload = {
        questionAr: document.getElementById('faq-questionAr').value.trim(),
        questionEn: document.getElementById('faq-questionEn').value.trim(),
        answerAr: document.getElementById('faq-answerAr').value.trim(),
        answerEn: document.getElementById('faq-answerEn').value.trim(),
        orderIndex: parseInt(document.getElementById('faq-orderIndex').value) || 0,
        isActive: document.getElementById('faq-isActive').checked
    };
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/faqs/${id}` : `${API_BASE}/admin/faqs`;
        const res = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حفظ السؤال بنجاح.", "success");
        closeModal('faq-modal');
        renderFAQs();
    } catch (err) { showToast(err.message, 'error'); }
}

// TAB: Testimonials
async function renderTestimonials() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/testimonials`);
        const json = await safeJson(res);
        const container = document.getElementById('workspace-content');
        container.innerHTML = `
            <div class="actions-bar" style="text-align:left; margin-bottom:1.5rem;">
                <button class="btn btn-primary" onclick="showTestimonialModal()"><i class="fa-solid fa-plus"></i> إضافة توصية جديدة</button>
            </div>
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>العميل (عربي)</th>
                            <th>التقييم</th>
                            <th>النشاط</th>
                            <th>العمليات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${json.testimonials.map(t => `
                            <tr>
                                <td style="font-weight:700;">${t.clientNameAr}</td>
                                <td>${'★'.repeat(t.rating)}</td>
                                <td><span class="status-pill ${t.isActive ? 'scheduled' : 'closed'}">${t.isActive ? 'نشط' : 'معطل'}</span></td>
                                <td>
                                    <div style="display:flex; gap:5px;">
                                    <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="showTestimonialModal(${t.id})">تعديل</button>
                                    <button class="btn btn-logout" style="padding:4px 10px; font-size:0.75rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteTestimonial(${t.id})">حذف</button>
                                </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) { showToast(e.message, 'error'); }
}

async function showTestimonialModal(id = null) {
    let t = { id: '', clientNameAr: '', clientNameEn: '', companyAr: '', companyEn: '', contentAr: '', contentEn: '', rating: 5, isActive: true };
    if (id) {
        const res = await authenticatedFetch(`${API_BASE}/admin/testimonials`);
        const json = await safeJson(res);
        const found = json.testimonials.find(x => x.id === id);
        if (found) t = found;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'testimonial-modal';
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:600px; padding:2rem;">
            <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:15px;">
                <h3>${id ? 'تعديل التوصية' : 'إضافة توصية'}</h3>
                <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('testimonial-modal')"></i>
            </div>
            <form onsubmit="saveTestimonial(event, ${id})">
                <div class="form-group">
                    <label>اسم العميل (عربي)</label>
                    <input type="text" id="t-nameAr" value="${t.clientNameAr}" required>
                </div>
                <div class="form-group">
                    <label>اسم العميل (إنجليزي)</label>
                    <input type="text" id="t-nameEn" value="${t.clientNameEn}" required style="direction:ltr; text-align:left;">
                </div>
                <div class="form-group">
                    <label>الشركة/الصفة (عربي، اختياري)</label>
                    <input type="text" id="t-companyAr" value="${t.companyAr || ''}">
                </div>
                <div class="form-group">
                    <label>الشركة/الصفة (إنجليزي، اختياري)</label>
                    <input type="text" id="t-companyEn" value="${t.companyEn || ''}" style="direction:ltr; text-align:left;">
                </div>
                <div class="form-group">
                    <label>الوصف أو المحتوى (عربي)</label>
                    <textarea id="t-contentAr" rows="3" required>${t.contentAr}</textarea>
                </div>
                <div class="form-group">
                    <label>الوصف أو المحتوى (إنجليزي)</label>
                    <textarea id="t-contentEn" rows="3" required style="direction:ltr; text-align:left;">${t.contentEn}</textarea>
                </div>
                <div class="form-group">
                    <label>التقييم (١ - ٥ نجوم)</label>
                    <input type="number" id="t-rating" min="1" max="5" value="${t.rating}">
                </div>
                <div class="form-group">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="t-isActive" ${t.isActive ? 'checked' : ''}>
                        <span>التوصية ظاهرة في الموقع</span>
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">حفظ</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveTestimonial(e, id) {
    e.preventDefault();
    const payload = {
        clientNameAr: document.getElementById('t-nameAr').value.trim(),
        clientNameEn: document.getElementById('t-nameEn').value.trim(),
        companyAr: document.getElementById('t-companyAr').value.trim() || null,
        companyEn: document.getElementById('t-companyEn').value.trim() || null,
        contentAr: document.getElementById('t-contentAr').value.trim(),
        contentEn: document.getElementById('t-contentEn').value.trim(),
        rating: parseInt(document.getElementById('t-rating').value),
        isActive: document.getElementById('t-isActive').checked
    };
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/testimonials/${id}` : `${API_BASE}/admin/testimonials`;
        const res = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم الحفظ بنجاح.", "success");
        closeModal('testimonial-modal');
        renderTestimonials();
    } catch (err) { showToast(err.message, 'error'); }
}

// TAB: Website Settings
async function renderSettings() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/settings`);
        const json = await safeJson(res);
        const settings = json.settings;

        const container = document.getElementById('workspace-content');
        container.innerHTML = `
            <div class="table-panel glass-panel" style="padding:2rem; max-width:900px; margin:0 auto; max-height:80vh; overflow-y:auto;">
                <form id="settings-form" onsubmit="saveWebsiteSettings(event)">
                    
                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px;"><i class="fa-solid fa-phone"></i> معلومات الاتصال والعناوين</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>رقم الهاتف</label>
                            <input type="text" id="set-phone" value="${settings.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>رقم الواتساب (بدون أصفار أو +، e.g. 9665...)</label>
                            <input type="text" id="set-whatsapp" value="${settings.whatsapp || ''}">
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:1.5rem;">
                        <label>البريد الإلكتروني للمكتب</label>
                        <input type="email" id="set-email" value="${settings.email || ''}">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>عنوان المكتب (عربي)</label>
                            <input type="text" id="set-address_ar" value="${settings.address_ar || ''}">
                        </div>
                        <div class="form-group">
                            <label>عنوان المكتب (إنجليزي)</label>
                            <input type="text" id="set-address_en" value="${settings.address_en || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>

                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px; margin-top:30px;"><i class="fa-solid fa-clock"></i> أوقات العمل</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>ساعات العمل (عربي)</label>
                            <input type="text" id="set-hours_ar" value="${settings.office_hours_ar || ''}">
                        </div>
                        <div class="form-group">
                            <label>ساعات العمل (إنجليزي)</label>
                            <input type="text" id="set-hours_en" value="${settings.office_hours_en || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>

                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px; margin-top:30px;"><i class="fa-solid fa-image"></i> شعار الموقع (Logo)</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>الشعار للمظهر المظلم (Dark Mode Logo)</label>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="set-logo_dark" value="${settings.logo_dark || ''}" style="flex-grow:1;">
                                <input type="file" id="set-logo_dark_file" style="display:none;" onchange="uploadSettingImage('set-logo_dark', this)">
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('set-logo_dark_file').click()"><i class="fa-solid fa-upload"></i></button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>الشعار للمظهر المضيء (Light Mode Logo)</label>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="set-logo_light" value="${settings.logo_light || ''}" style="flex-grow:1;">
                                <input type="file" id="set-logo_light_file" style="display:none;" onchange="uploadSettingImage('set-logo_light', this)">
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('set-logo_light_file').click()"><i class="fa-solid fa-upload"></i></button>
                            </div>
                        </div>
                    </div>

                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px; margin-top:30px;"><i class="fa-solid fa-house"></i> محتوى البانر الرئيسي (Hero Banner)</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>العنوان الرئيسي للبانر (عربي)</label>
                            <input type="text" id="set-hero_title_ar" value="${settings.hero_title_ar || ''}">
                        </div>
                        <div class="form-group">
                            <label>العنوان الرئيسي للبانر (إنجليزي)</label>
                            <input type="text" id="set-hero_title_en" value="${settings.hero_title_en || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>العنوان الفرعي للبانر (عربي)</label>
                            <input type="text" id="set-hero_subtitle_ar" value="${settings.hero_subtitle_ar || ''}">
                        </div>
                        <div class="form-group">
                            <label>العنوان الفرعي للبانر (إنجليزي)</label>
                            <input type="text" id="set-hero_subtitle_en" value="${settings.hero_subtitle_en || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>

                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px; margin-top:30px;"><i class="fa-brands fa-share-nodes"></i> مواقع التواصل الاجتماعي</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>رابط فيسبوك (Facebook)</label>
                            <input type="text" id="set-facebook" value="${settings.facebook || ''}" style="direction:ltr; text-align:left;">
                        </div>
                        <div class="form-group">
                            <label>رابط تويتر / إكس (Twitter/X)</label>
                            <input type="text" id="set-twitter" value="${settings.twitter || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>رابط لينكد إن (LinkedIn)</label>
                            <input type="text" id="set-linkedin" value="${settings.linkedin || ''}" style="direction:ltr; text-align:left;">
                        </div>
                        <div class="form-group">
                            <label>رابط إنستغرام (Instagram)</label>
                            <input type="text" id="set-instagram" value="${settings.instagram || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>

                    <h3 style="color:var(--color-gold); border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:20px; margin-top:30px;"><i class="fa-solid fa-globe"></i> تهيئة محركات البحث (SEO)</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>عنوان الموقع الرئيسي (عربي)</label>
                            <input type="text" id="set-meta_title_ar" value="${settings.meta_title_ar || ''}">
                        </div>
                        <div class="form-group">
                            <label>عنوان الموقع الرئيسي (إنجليزي)</label>
                            <input type="text" id="set-meta_title_en" value="${settings.meta_title_en || ''}" style="direction:ltr; text-align:left;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div class="form-group">
                            <label>شرح الموقع الرئيسي (عربي)</label>
                            <textarea id="set-meta_description_ar" rows="3">${settings.meta_description_ar || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>شرح الموقع الرئيسي (إنجليزي)</label>
                            <textarea id="set-meta_description_en" rows="3" style="direction:ltr; text-align:left;">${settings.meta_description_en || ''}</textarea>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="margin-top:20px;"><i class="fa-solid fa-save"></i> حفظ جميع الإعدادات</button>
                </form>
            </div>
        `;
    } catch (e) {
        showToast(e.message, 'error');
    }
}

async function saveWebsiteSettings(e) {
    e.preventDefault();
    const payload = {
        settings: {
            phone: document.getElementById('set-phone').value.trim(),
            whatsapp: document.getElementById('set-whatsapp').value.trim(),
            email: document.getElementById('set-email').value.trim(),
            address_ar: document.getElementById('set-address_ar').value.trim(),
            address_en: document.getElementById('set-address_en').value.trim(),
            office_hours_ar: document.getElementById('set-hours_ar').value.trim(),
            office_hours_en: document.getElementById('set-hours_en').value.trim(),
            logo_dark: document.getElementById('set-logo_dark').value.trim(),
            logo_light: document.getElementById('set-logo_light').value.trim(),
            hero_title_ar: document.getElementById('set-hero_title_ar').value.trim(),
            hero_title_en: document.getElementById('set-hero_title_en').value.trim(),
            hero_subtitle_ar: document.getElementById('set-hero_subtitle_ar').value.trim(),
            hero_subtitle_en: document.getElementById('set-hero_subtitle_en').value.trim(),
            facebook: document.getElementById('set-facebook').value.trim(),
            twitter: document.getElementById('set-twitter').value.trim(),
            linkedin: document.getElementById('set-linkedin').value.trim(),
            instagram: document.getElementById('set-instagram').value.trim(),
            meta_title_ar: document.getElementById('set-meta_title_ar').value.trim(),
            meta_title_en: document.getElementById('set-meta_title_en').value.trim(),
            meta_description_ar: document.getElementById('set-meta_description_ar').value.trim(),
            meta_description_en: document.getElementById('set-meta_description_en').value.trim()
        }
    };

    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم تحديث إعدادات الموقع بنجاح.", "success");
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// TAB: Media Library
async function renderMedia() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/media`);
        const json = await safeJson(res);
        const container = document.getElementById('workspace-content');

        if (res.status === 403 || !json.success) {
            container.innerHTML = `
                <div class="unauthorized-state" style="text-align:center; padding:5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:var(--color-gold); margin-bottom:1rem;"></i>
                    <h3 style="color:white; margin-bottom:0.5rem; font-weight:700;">ليست لديكم الصلاحية الكافية</h3>
                    <p style="color:var(--color-text-light);">عذراً، لا تملك الصلاحيات المطلوبة للوصول إلى مكتبة الوسائط والملفات.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="actions-bar glass-panel" style="padding:1.5rem; margin-bottom:1.5rem;">
                <h4 style="margin-bottom:10px;">رفع ملفات جديدة لمكتبة الميديا</h4>
                <form id="media-upload-form" onsubmit="uploadMediaAsset(event)" style="display:flex; gap:15px; align-items:center;">
                    <input type="file" id="media-file-input" required accept=".png,.jpg,.jpeg,.gif,.svg,.webp" style="background:transparent; border:none; padding:0;">
                    <button type="submit" class="btn btn-primary"><i class="fa-solid fa-cloud-arrow-up"></i> رفع الصورة</button>
                </form>
            </div>

            <div class="media-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:1.5rem;">
                ${json.files.map(f => `
                    <div class="media-card glass-panel" style="padding:10px; display:flex; flex-direction:column; gap:10px; align-items:center; position:relative; overflow:hidden;">
                        <img src="${f.url}" style="width:100%; height:120px; object-fit:contain; border-radius:6px; background:#070d09;" alt="${f.name}">
                        <span style="font-size:0.75rem; text-align:center; word-break:break-all; max-width:100%; color:var(--color-text-light);">${f.name}</span>
                        <div style="display:flex; gap:10px; width:100%; justify-content:center;">
                            <button class="btn btn-primary" style="padding:3px 8px; font-size:0.7rem;" onclick="copyToClipboard('${f.url}')">رابط</button>
                            <button class="btn btn-logout" style="padding:3px 8px; font-size:0.7rem; border-color:rgba(220,53,69,0.3);" onclick="deleteMediaFile('${f.name}')">حذف</button>
                        </div>
                    </div>
                `).join('')}
                ${json.files.length === 0 ? '<div style="grid-column: 1/-1; text-align:center; padding:3rem 0; color:var(--color-text-light);">لا توجد ملفات مرفوعة حالياً.</div>' : ''}
            </div>
        `;
    } catch (e) {
        showToast(e.message, 'error');
    }
}

async function uploadMediaAsset(e) {
    e.preventDefault();
    const fileInput = document.getElementById('media-file-input');
    if (!fileInput || fileInput.files.length === 0) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/media`, {
            method: 'POST',
            body: formData
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم رفع الملف بنجاح.", "success");
        renderMedia();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteMediaFile(fileName) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الملف نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/media/${fileName}`, { method: 'DELETE' });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم حذف الملف بنجاح.", "success");
        renderMedia();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// TAB: Users
async function renderUsers() {
    try {
        const [usersRes, rolesRes] = await Promise.all([
            authenticatedFetch(`${API_BASE}/admin/users`),
            authenticatedFetch(`${API_BASE}/admin/roles`)
        ]);
        const usersJson = await safeJson(usersRes);
        const rolesJson = await safeJson(rolesRes);

        const container = document.getElementById('workspace-content');
        if (usersRes.status === 403 || rolesRes.status === 403 || !usersJson.success || !rolesJson.success) {
            container.innerHTML = `
                <div class="unauthorized-state" style="text-align:center; padding:5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:var(--color-gold); margin-bottom:1rem;"></i>
                    <h3 style="color:white; margin-bottom:0.5rem; font-weight:700;">ليست لديكم الصلاحية الكافية</h3>
                    <p style="color:var(--color-text-light);">عذراً، لا تملك الصلاحيات المطلوبة للوصول إلى حسابات الموظفين والصلاحيات.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = `
            <div class="actions-bar" style="text-align:left; margin-bottom:1.5rem;">
                <button class="btn btn-primary" onclick="showInviteUserModal()"><i class="fa-solid fa-user-plus"></i> إضافة موظف جديد</button>
            </div>
            
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>الاسم الكامل</th>
                            <th>البريد الإلكتروني</th>
                            <th>الدور الوظيفي</th>
                            <th>حالة الحساب</th>
                            <th>العمليات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usersJson.users.map(u => `
                            <tr>
                                <td style="font-weight:700;">${u.fullName}</td>
                                <td>${u.email}</td>
                                <td>${u.role.name}</td>
                                <td><span class="status-pill ${u.isActive ? 'scheduled' : 'closed'}">${u.isActive ? 'نشط' : 'معطل'}</span></td>
                                <td>
                                    <div style="display:flex; gap:5px;">
                                    <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="showInviteUserModal(${u.id})">تعديل</button>
                                    ${(u.id === 1 || u.email === 'admin@alduraymih-law.sa' || (currentUser && u.id === currentUser.id)) ? '' : `<button class="btn btn-logout" style="padding:4px 10px; font-size:0.75rem; border:1px solid rgba(220,53,69,0.3);" onclick="deleteUserAccount(${u.id})">حذف</button>`}
                                </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        showToast(e.message, 'error');
    }
}

async function showInviteUserModal(id = null) {
    const rolesRes = await authenticatedFetch(`${API_BASE}/admin/roles`);
    const rolesJson = await safeJson(rolesRes);

    let u = { id: '', fullName: '', email: '', roleId: '', isActive: true };
    if (id) {
        const usersRes = await authenticatedFetch(`${API_BASE}/admin/users`);
        const usersJson = await safeJson(usersRes);
        const found = usersJson.users.find(x => x.id === id);
        if (found) u = found;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'user-modal';
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:500px; padding:2rem;">
            <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:10px; margin-bottom:15px;">
                <h3>${id ? 'تعديل حساب موظف' : 'إضافة حساب موظف جديد'}</h3>
                <i class="fa-solid fa-xmark closeModalBtn" onclick="closeModal('user-modal')"></i>
            </div>
            <form onsubmit="saveUserAccount(event, ${id})">
                <div class="form-group">
                    <label>الاسم الكامل</label>
                    <input type="text" id="usr-fullName" value="${u.fullName}" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" id="usr-email" value="${u.email}" required style="direction:ltr; text-align:left;">
                </div>
                ${id ? `
                    <div class="form-group">
                        <label>تغيير كلمة المرور (اختياري)</label>
                        <div class="input-icon-wrapper">
                            <input type="password" id="usr-password" placeholder="اتركها فارغة إذا لم ترغب في التغيير">
                            <i class="fa-solid fa-eye password-toggle-icon" onclick="togglePasswordVisibility('usr-password', this)"></i>
                        </div>
                    </div>
                ` : `
                    <div class="form-group">
                        <label>كلمة المرور المؤقتة</label>
                        <div class="input-icon-wrapper">
                            <input type="password" id="usr-password" required placeholder="••••••••">
                            <i class="fa-solid fa-eye password-toggle-icon" onclick="togglePasswordVisibility('usr-password', this)"></i>
                        </div>
                    </div>
                `}
                <div class="form-group">
                    <label>الدور والصلاحيات</label>
                    <select id="usr-roleId" required style="padding:10px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px; width:100%;">
                        <option value="" disabled selected>اختر الدور</option>
                        ${rolesJson.roles.map(r => `<option value="${r.id}" ${u.roleId === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="usr-isActive" ${u.isActive ? 'checked' : ''}>
                        <span>تنشيط الحساب</span>
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">حفظ الحساب</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveUserAccount(e, id) {
    e.preventDefault();
    const roleId = parseInt(document.getElementById('usr-roleId').value);
    const isActive = document.getElementById('usr-isActive').checked;
    const fullName = document.getElementById('usr-fullName').value.trim();

    const payload = { 
        fullName, 
        email: document.getElementById('usr-email').value.trim(),
        roleId, 
        isActive 
    };
    if (!id) {
        payload.password = document.getElementById('usr-password').value;
    } else {
        const passVal = document.getElementById('usr-password')?.value;
        if (passVal) {
            payload.password = passVal;
        }
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/admin/users/${id}` : `${API_BASE}/admin/users`;

        const res = await authenticatedFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);

        showToast("تم حفظ حساب الموظف بنجاح.", "success");
        closeModal('user-modal');
        renderUsers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// TAB: Activity Logs
async function renderLogs(page = 1, searchVal = '') {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/logs?page=${page}&limit=15&search=${encodeURIComponent(searchVal)}`);
        const json = await safeJson(res);

        const container = document.getElementById('workspace-content');
        if (res.status === 403 || !json.success) {
            container.innerHTML = `
                <div class="unauthorized-state" style="text-align:center; padding:5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:var(--color-gold); margin-bottom:1rem;"></i>
                    <h3 style="color:white; margin-bottom:0.5rem; font-weight:700;">ليست لديكم الصلاحية الكافية</h3>
                    <p style="color:var(--color-text-light);">عذراً، لا تملك الصلاحيات المطلوبة للوصول إلى سجلات العمليات ورقابة النظام.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = `
            <div class="actions-bar" style="margin-bottom:1.5rem; display:flex; gap:10px;">
                <input type="text" id="logs-search-input" value="${searchVal}" placeholder="ابحث في العمليات أو التفاصيل أو المستخدم..." style="padding:10px 15px; width:100%; max-width:400px; background:var(--color-bg-dark); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                <button class="btn btn-primary" onclick="triggerLogsSearch()"><i class="fa-solid fa-search"></i> تصفية</button>
            </div>
            <div class="table-panel glass-panel" style="padding:1.5rem;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>العملية</th>
                                <th>التفاصيل</th>
                                <th>الموظف</th>
                                <th>عنوان IP</th>
                                <th>تاريخ التسجيل</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${json.logs.map(l => `
                                <tr>
                                    <td style="font-weight:700; color:var(--color-gold);">${l.action}</td>
                                    <td>${l.details || ''}</td>
                                    <td>${l.user ? l.user.fullName : 'غير معروف'}</td>
                                    <td dir="ltr" style="text-align:right;">${l.ipAddress || ''}</td>
                                    <td>${new Date(l.createdAt).toLocaleString('ar-SA')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${renderTablePagination(json.pagination, 'renderLogs', '', searchVal)}
            </div>
        `;
    } catch (e) {
        showToast(e.message, 'error');
    }
}

function triggerLogsSearch() {
    const searchVal = document.getElementById('logs-search-input').value.trim();
    renderLogs(1, searchVal);
}
window.triggerLogsSearch = triggerLogsSearch;


// 4. Utility systems (Modals, Toasts, Paginations)

function closeModal(modalId) {
    if (modalId === 'blog-article-modal' && window.tinymce) {
        tinymce.remove('#art-contentAr');
        tinymce.remove('#art-contentEn');
    }
    const el = document.getElementById(modalId);
    if (el) el.remove();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';
    const iconColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color:${iconColor}; font-size:1.2rem;"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function renderTablePagination(pag, functionName, statusFilter = '', searchVal = '') {
    if (!pag || pag.totalPages <= 1) return '';

    const pages = [];
    const statusParam = statusFilter ? `'${statusFilter}'` : "''";
    const searchParam = searchVal ? `'${searchVal}'` : "''";

    for (let i = 1; i <= pag.totalPages; i++) {
        const activeClass = i === pag.page ? 'active' : '';
        pages.push(`
            <button class="btn btn-primary pagination-btn ${activeClass}" 
                style="padding:6px 12px; font-size:0.8rem; background:${i === pag.page ? 'var(--color-gold)' : 'rgba(255,255,255,0.02)'}; color:${i === pag.page ? 'var(--color-bg-dark)' : 'white'};"
                onclick="${functionName}(${i}, ${statusParam}, ${searchParam})">
                ${i}
            </button>
        `);
    }

    return `
        <div class="pagination-wrapper" style="display:flex; justify-content:center; gap:8px; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--color-border);">
            ${pages.join('')}
        </div>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast("تم نسخ رابط الملف إلى الحافظة.", "info");
}

// Notifications panel getters
let notificationsList = [];
async function loadNotificationPanelDetails() {
    try {
        // 1. Fetch stats to update badges
        const statsRes = await authenticatedFetch(`${API_BASE}/admin/stats`);
        const statsJson = await safeJson(statsRes);
        const badge = document.getElementById('badge-new-consultations');
        const notifTriggerBadge = document.getElementById('notif-count');
        const openCasesCount = statsJson.stats.openCases;

        if (openCasesCount > 0) {
            if (badge) {
                badge.textContent = openCasesCount;
                badge.style.display = 'inline-block';
            }
            if (notifTriggerBadge) {
                notifTriggerBadge.textContent = openCasesCount;
                notifTriggerBadge.style.display = 'flex';
            }
        } else {
            if (badge) badge.style.display = 'none';
            if (notifTriggerBadge) notifTriggerBadge.style.display = 'none';
        }

        // 2. Fetch recent notifications
        const notifRes = await authenticatedFetch(`${API_BASE}/admin/notifications`);
        const notifJson = await safeJson(notifRes);
        if (notifJson.success && Array.isArray(notifJson.notifications)) {
            notificationsList = notifJson.notifications;
            renderNotificationPanelList();
        }
    } catch (err) {
        console.error("Failed to load notifications:", err);
    }
}

function renderNotificationPanelList() {
    const listEl = document.getElementById('notifications-list');
    if (!listEl) return;

    if (notificationsList.length === 0) {
        listEl.innerHTML = `<p class="empty-msg">لا توجد إشعارات جديدة.</p>`;
        return;
    }

    listEl.innerHTML = '';
    notificationsList.forEach(n => {
        const item = document.createElement('div');
        item.className = `notif-item ${!n.isRead ? 'unread' : ''}`;
        
        // Show local time formatting
        const dateStr = new Date(n.createdAt).toLocaleDateString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
        });

        item.innerHTML = `
            <div class="notif-title">${n.titleAr}</div>
            <div class="notif-desc">${n.messageAr}</div>
            <span class="notif-time">${dateStr}</span>
        `;
        
        // Clicking a notification redirects to consultations tab
        item.addEventListener('click', () => {
            switchTab('consultations');
            toggleNotificationPanel(); // Close panel
        });
        
        listEl.appendChild(item);
    });
}

async function markAllNotificationsRead() {
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/notifications/mark-read`, {
            method: 'POST'
        });
        const json = await safeJson(res);
        if (json.success) {
            // Update local state to read
            notificationsList.forEach(n => n.isRead = true);
            renderNotificationPanelList();
            
            // Clear the trigger badge
            const notifTriggerBadge = document.getElementById('notif-count');
            if (notifTriggerBadge) {
                notifTriggerBadge.style.display = 'none';
                notifTriggerBadge.textContent = '0';
            }
            
            showToast('تم تحديد جميع الإشعارات كمقروءة.', 'success');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function toggleNotificationPanel() {
    const el = document.getElementById('notifications-panel');
    if (el) {
        el.style.display = el.style.display === 'none' ? 'flex' : 'none';
    }
}

window.renderNotificationPanelList = renderNotificationPanelList;
window.markAllNotificationsRead = markAllNotificationsRead;

// Initialize boot trigger
document.addEventListener('DOMContentLoaded', initApp);
window.switchTab = switchTab;
window.handleLogout = handleLogout;
window.closeModal = closeModal;
window.viewConsultationDetails = viewConsultationDetails;
window.saveConsultationUpdates = saveConsultationUpdates;
window.showBlogArticleModal = showBlogArticleModal;
window.saveBlogArticle = saveBlogArticle;
window.deleteBlogArticle = deleteBlogArticle;
window.showServiceModal = showServiceModal;
window.saveService = saveService;
window.renderServices = renderServices;
window.showFAQModal = showFAQModal;
window.saveFAQ = saveFAQ;
window.renderFAQs = renderFAQs;
window.showTestimonialModal = showTestimonialModal;
window.saveTestimonial = saveTestimonial;
window.renderTestimonials = renderTestimonials;
window.saveWebsiteSettings = saveWebsiteSettings;
window.uploadMediaAsset = uploadMediaAsset;
window.deleteMediaFile = deleteMediaFile;
window.copyToClipboard = copyToClipboard;
window.showInviteUserModal = showInviteUserModal;
window.saveUserAccount = saveUserAccount;
window.renderUsers = renderUsers;
window.renderLogs = renderLogs;
window.toggleNotificationPanel = toggleNotificationPanel;
window.executeConsultationsSearch = executeConsultationsSearch;
window.renderConsultations = renderConsultations;

window.addEventListener('hashchange', () => {
    const tabId = window.location.hash.replace('#', '') || 'dashboard';
    const validTabs = ['dashboard', 'consultations', 'blog', 'services', 'faqs', 'testimonials', 'media', 'users', 'settings', 'logs'];
    if (validTabs.includes(tabId) && activeTab !== tabId) {
        switchTab(tabId);
    }
});

async function deleteConsultation(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب الاستشاري نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/consultations/${id}`, {
            method: 'DELETE'
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حذف طلب الاستشارة بنجاح.", "success");
        if (document.getElementById('consultation-modal')) {
            closeModal('consultation-modal');
        }
        renderConsultations(currentConsultationsPage);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function uploadBlogFeaturedImage(input) {
    const file = input.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/media`, {
            method: 'POST',
            body: formData
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        document.getElementById('art-imagePath').value = json.file.url;
        showToast("تم رفع وتعيين الصورة البارزة بنجاح.", "success");
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteService(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الخدمة نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/services/${id}`, {
            method: 'DELETE'
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حذف الخدمة بنجاح.", "success");
        renderServices();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteFAQ(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا السؤال نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/faqs/${id}`, {
            method: 'DELETE'
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حذف السؤال بنجاح.", "success");
        renderFAQs();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteTestimonial(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه التوصية نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/testimonials/${id}`, {
            method: 'DELETE'
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حذف التوصية بنجاح.", "success");
        renderTestimonials();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteUserAccount(id) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف حساب هذا الموظف نهائياً؟")) return;
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/users/${id}`, {
            method: 'DELETE'
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        showToast("تم حذف الموظف بنجاح.", "success");
        renderUsers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

window.deleteConsultation = deleteConsultation;
window.uploadBlogFeaturedImage = uploadBlogFeaturedImage;
window.deleteService = deleteService;
window.deleteFAQ = deleteFAQ;
window.deleteTestimonial = deleteTestimonial;
window.deleteUserAccount = deleteUserAccount;

async function uploadSettingImage(inputId, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/media`, {
            method: 'POST',
            body: formData
        });
        const json = await safeJson(res);
        if (!json.success) throw new Error(json.message);
        document.getElementById(inputId).value = json.file.url;
        showToast("تم رفع وتحديث الشعار بنجاح.", "success");
    } catch (err) {
        showToast(err.message, 'error');
    }
}

window.uploadSettingImage = uploadSettingImage;

async function downloadSecureFile(e, fileId, fileName) {
    e.preventDefault();
    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/files/${fileId}`);
        if (!res.ok) throw new Error("فشل في تحميل الملف.");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        showToast(err.message, 'error');
    }
}
window.downloadSecureFile = downloadSecureFile;

function showForgotPasswordModal() {
    document.getElementById('forgot-password-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'forgot-password-modal';
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:440px; padding:2.5rem; text-align:center;">
            <div style="font-size:3rem; color:var(--color-gold); margin-bottom:1rem;">
                <i class="fa-solid fa-circle-info"></i>
            </div>
            <h3 style="margin-bottom:0.5rem; color:var(--color-text-dark);">استعادة كلمة المرور</h3>
            <p style="color:var(--color-text-light); font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6;">
                الرجاء التواصل مع إدارة المكتب لإعادة تعيين كلمة المرور الخاصة بك.
            </p>
            <div style="display:flex; justify-content:center;">
                <button type="button" class="btn btn-primary" onclick="closeModal('forgot-password-modal')" style="min-width: 120px;">حسناً</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.showForgotPasswordModal = showForgotPasswordModal;

function togglePasswordVisibility(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.classList.remove('fa-eye');
        iconEl.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconEl.classList.remove('fa-eye-slash');
        iconEl.classList.add('fa-eye');
    }
}
window.togglePasswordVisibility = togglePasswordVisibility;

function showUserTabUnlockModal(prevTab) {
    // Remove if already exists
    document.getElementById('user-unlock-modal')?.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'user-unlock-modal';
    modal.style.zIndex = '11000'; // Make sure it sits above the main screen
    modal.innerHTML = `
        <div class="modal-box glass-panel" style="width:100%; max-width:440px; padding:2.5rem; text-align:center;">
            <div style="font-size:3rem; color:var(--color-gold); margin-bottom:1rem;">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3 style="margin-bottom:0.5rem; color:var(--color-text-dark);">تأكيد الهوية للدخول</h3>
            <p style="color:var(--color-text-light); font-size:0.9rem; margin-bottom:1.5rem; line-height:1.5;">
                يرجى إدخال كلمة المرور الخاصة بك لتأكيد هويتك والوصول إلى شاشة الموظفين والصلاحيات.
            </p>
            <form id="user-unlock-form" onsubmit="verifyUserTabUnlock(event, '${prevTab}')">
                <div class="form-group" style="margin-bottom:1.5rem;">
                    <div class="input-icon-wrapper">
                        <i class="fa-solid fa-lock input-icon"></i>
                        <input type="password" id="unlock-password" required placeholder="••••••••" style="padding-left: 45px !important;">
                        <i class="fa-solid fa-eye password-toggle-icon" onclick="togglePasswordVisibility('unlock-password', this)"></i>
                    </div>
                </div>
                <div id="unlock-error" style="color:#ff4d4d; font-size:0.85rem; margin-bottom:1rem; display:none;"></div>
                <div style="display:flex; gap:1rem; justify-content:center;">
                    <button type="button" class="btn btn-secondary" onclick="cancelUserTabUnlock('${prevTab}')" style="background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); color:white;">إلغاء</button>
                    <button type="submit" class="btn btn-primary">تأكيد الدخول</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function verifyUserTabUnlock(event, prevTab) {
    event.preventDefault();
    const password = document.getElementById('unlock-password').value;
    const errorEl = document.getElementById('unlock-error');
    if (errorEl) errorEl.style.display = 'none';

    try {
        const res = await authenticatedFetch(`${API_BASE}/admin/verify-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const json = await safeJson(res);
        if (json.success) {
            usersTabUnlocked = true;
            document.getElementById('user-unlock-modal')?.remove();
            switchTab('users');
            showToast('تم التحقق بنجاح.', 'success');
        } else {
            throw new Error(json.message || 'كلمة المرور غير صحيحة.');
        }
    } catch (err) {
        if (errorEl) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    }
}

function cancelUserTabUnlock(prevTab) {
    document.getElementById('user-unlock-modal')?.remove();
    // Revert tab hash
    window.location.hash = prevTab;
}

window.showUserTabUnlockModal = showUserTabUnlockModal;
window.verifyUserTabUnlock = verifyUserTabUnlock;
window.cancelUserTabUnlock = cancelUserTabUnlock;
