/**
 * Dr. Saud bin Fahd Al-Duraymih Law Office - Consultation Submission API
 * Interfaces with the local Node.js Express REST API using multipart/form-data.
 */
(function () {
    // 1. Client-Side Honeypot Anti-Spam Check
    function checkHoneypot(formDataRaw) {
        if (formDataRaw.website_field && formDataRaw.website_field.trim() !== "") {
            console.warn("Spam submission blocked via Honeypot check.");
            return false;
        }
        return true;
    }

    // 2. Client-Side Rate Limit check (60 seconds cooldown)
    function checkRateLimit() {
        const lastSubmit = localStorage.getItem('last_submit_timestamp');
        if (lastSubmit) {
            const timePassed = Date.now() - parseInt(lastSubmit);
            const cooldown = (window.CONFIG && window.CONFIG.RATE_LIMIT_COOLDOWN) || 60000;
            if (timePassed < cooldown) {
                return false;
            }
        }
        return true;
    }

    // 3. User agent telemetry helpers
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "Tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
            return "Mobile";
        }
        return "Desktop";
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let tem;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    // Generate unique session identifier
    function getSessionId() {
        let sid = sessionStorage.getItem('client_session_id');
        if (!sid) {
            sid = 'SESS-' + Date.now() + '-' + Math.round(Math.random() * 1000000);
            sessionStorage.setItem('client_session_id', sid);
        }
        return sid;
    }

    // Sanitize values
    function sanitizeText(str) {
        if (!str) return "";
        return str.toString().trim();
    }

    // Save offline queue
    function saveToQueue(payload) {
        try {
            // Strip attachments base64 to prevent localStorage quota overflows
            const queueItem = { ...payload };
            queueItem.attachments = [];
            queueItem.isOfflineBackup = true;

            const existing = localStorage.getItem('offline_consultation_queue');
            const queue = existing ? JSON.parse(existing) : [];
            queue.push(queueItem);
            localStorage.setItem('offline_consultation_queue', JSON.stringify(queue));
            console.log("Saved text-only consultation in offline queue:", queueItem.referenceId);
        } catch (e) {
            console.error("Failed to write to offline queue:", e);
        }
    }

    // Offline queue automatic sync retry loops
    async function processQueue() {
        if (!navigator.onLine) return;
        try {
            const existing = localStorage.getItem('offline_consultation_queue');
            if (!existing) return;
            
            const queue = JSON.parse(existing);
            if (queue.length === 0) return;

            console.log(`Syncing offline queue (${queue.length} items)...`);
            const remainingQueue = [];
            const endpoint = (window.CONFIG && window.CONFIG.API_ENDPOINT) || "/api";

            for (const item of queue) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15000);
                    
                    // Offline sync sends as JSON text details
                    const response = await fetch(`${endpoint}/consultations-sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        console.log("Successfully synced offline consultation:", item.referenceId);
                    } else {
                        remainingQueue.push(item);
                    }
                } catch (err) {
                    console.warn("Failed to sync offline item, retaining:", item.referenceId, err);
                    remainingQueue.push(item);
                }
            }

            localStorage.setItem('offline_consultation_queue', JSON.stringify(remainingQueue));
        } catch (e) {
            console.warn("Error processing offline queue sync:", e);
        }
    }

    window.addEventListener('online', processQueue);
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(processQueue, 3000);
    });

    // Public API Object
    const ConsultationAPI = {
        /**
         * Validates, structures, and submits form data to the Express backend
         * @param {Object} formDataRaw 
         * @returns {Promise<Object>} Response object { status: 'success', referenceId }
         */
        submit: async function (formDataRaw) {
            const lang = (window.StateManager && window.StateManager.getState('lang')) || 'ar';
            
            // 1. Honeypot check
            if (!checkHoneypot(formDataRaw)) {
                return { status: 'error', message: 'Spam validation failed' };
            }

            // 2. Client-side Rate Limit check
            if (!checkRateLimit()) {
                const errMsg = lang === 'ar' ? 'الرجاء الانتظار دقيقة قبل إرسال طلب آخر.' : 'Please wait a minute before submitting another request.';
                return { status: 'error', message: errMsg };
            }

            // 3. Validation
            const name = sanitizeText(formDataRaw.name);
            const phone = sanitizeText(formDataRaw.phone);
            const service = sanitizeText(formDataRaw.service || "general");
            const message = sanitizeText(formDataRaw.message || "");
            const priority = formDataRaw.priority || 'Normal';

            if (!name || name.length < 3) {
                return { status: 'validation_error', field: 'name', message: 'Invalid Name' };
            }

            const saudiPhoneRegex = /^(00966|\+966|966|0)?5[0-9]{8}$/;
            if (!phone || !saudiPhoneRegex.test(phone)) {
                return { status: 'validation_error', field: 'phone', message: 'Invalid Phone Number' };
            }

            // 4. Construct FormData (multipart/form-data)
            const formData = new FormData();
            formData.append('fullName', name);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('message', message);
            formData.append('language', lang);
            if (formDataRaw.email) {
                formData.append('email', sanitizeText(formDataRaw.email));
            }
            if (formDataRaw.company) {
                formData.append('company', sanitizeText(formDataRaw.company));
            }
            formData.append('theme', (window.StateManager && window.StateManager.getState('theme')) || 'dark');
            formData.append('priority', priority);
            formData.append('device', getDeviceType());
            formData.append('browser', getBrowserInfo());
            formData.append('screenResolution', `${window.screen.width}x${window.screen.height}`);
            formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            formData.append('pageUrl', window.location.href);
            formData.append('referrer', document.referrer || "Direct");

            // Append raw file instances (from UIManager selected files list)
            if (formDataRaw.files && formDataRaw.files.length > 0) {
                formDataRaw.files.forEach(file => {
                    formData.append('files', file);
                });
            }

            // 5. Send POST request
            const endpoint = (window.CONFIG && window.CONFIG.API_ENDPOINT) || "/api";
            const timeout = 60000; // 60 seconds upload timeout

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                // Submit to Node.js backend
                const response = await fetch(`${endpoint}/consultations`, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                
                const json = await response.json();
                
                if (!response.ok || json.status === 'error') {
                    throw new Error(json.message || `HTTP error ${response.status}`);
                }
                
                localStorage.setItem('last_submit_timestamp', Date.now().toString());
                return { status: 'success', referenceId: json.referenceNumber, data: json };

            } catch (err) {
                clearTimeout(timeoutId);
                console.error("Consultation submission failed:", err.message);

                // Fallback: save textual details in offline queue if offline or connection fails
                if (!navigator.onLine || err.name === 'AbortError') {
                    const tempRefId = 'LAW-' + Date.now();
                    const offlinePayload = {
                        referenceId: tempRefId,
                        fullName: name,
                        phone: phone,
                        service: service,
                        message: message,
                        language: lang,
                        priority: priority,
                        createdAt: new Date().toISOString()
                    };
                    saveToQueue(offlinePayload);
                    localStorage.setItem('last_submit_timestamp', Date.now().toString());
                    return { status: 'success', referenceId: tempRefId, fallback: true };
                }

                throw err;
            }
        }
    };

    window.ConsultationAPI = ConsultationAPI;
})();
