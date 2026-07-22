// Premium Interactive 3D Unified Flow System for Dr. Saud bin Fahd Al-Duraymih Law Office
// Refactored under a modular Multi-Manager Design: Apple × Porsche × Awwwards Quality Standards
// Cohesively coordinates: State, Theme, Language, Scene, UI, and Animations

// 1. Stage Configuration (3D Morph Coordinates)
const STAGE_CONFIG = [
    {
        id: 'shield',
        captionKey: 'morph_caption_shield',
        lightColor: 0xD4AF37,     // Warm Gold
        particleSpeed: 1.0,
        center: [
            [0.0, 3.2, -0.5], [-0.6, 2.0, 0.5], [0.6, 0.8, -0.5],
            [-0.4, -0.4, 0.6], [0.4, -1.6, -0.6], [-0.6, -2.8, 0.5], [0.0, -3.8, 0.0]
        ],
        left: [
            [-0.06, 3.2, -0.5], [-0.66, 2.0, 0.5], [0.54, 0.8, -0.5],
            [-0.46, -0.4, 0.6], [0.34, -1.6, -0.6], [-0.66, -2.8, 0.5], [-0.06, -3.8, 0.0]
        ],
        right: [
            [0.06, 3.2, -0.5], [-0.54, 2.0, 0.5], [0.66, 0.8, -0.5],
            [-0.34, -0.4, 0.6], [0.46, -1.6, -0.6], [-0.54, -2.8, 0.5], [0.06, -3.8, 0.0]
        ],
        extras: { grid: false, scale: false }
    },
    {
        id: 'framework',
        captionKey: 'morph_caption_framework',
        lightColor: 0x4A90E2,     // Ice Blue
        particleSpeed: 1.25,
        center: [
            [-1.9, 3.5, -1.0], [-1.1, 2.2, -0.5], [-2.1, 0.9, 0.0],
            [-1.2, -0.4, 0.5], [-1.9, -1.7, -0.5], [-1.1, -2.9, 0.0], [-1.7, -3.8, -1.0]
        ],
        left: [
            [-2.8, 3.5, -1.0], [-2.0, 2.2, -0.5], [-3.0, 0.9, 0.0],
            [-2.1, -0.4, 0.5], [-2.8, -1.7, -0.5], [-2.0, -2.9, 0.0], [-2.6, -3.8, -1.0]
        ],
        right: [
            [-1.0, 3.5, -1.0], [-0.2, 2.2, -0.5], [-1.2, 0.9, 0.0],
            [-0.3, -0.4, 0.5], [-1.0, -1.7, -0.5], [-0.2, -2.9, 0.0], [-0.8, -3.8, -1.0]
        ],
        extras: { grid: true, scale: false }
    },
    {
        id: 'balance',
        captionKey: 'morph_caption_balance',
        lightColor: 0xF5C518,     // Neutral Gold
        particleSpeed: 1.6,
        center: [
            [0.0, 3.0, -1.0], [0.0, 2.0, -1.0], [0.0, 1.0, -1.0],
            [0.0, 0.0, -1.0], [0.0, -1.0, -1.0], [0.0, -2.0, -1.0], [0.0, -2.8, -1.0]
        ],
        left: [
            [-2.2, 0.8, -1.0], [-2.2, 2.0, -1.0], [-1.5, 2.1, -1.0],
            [0.0, 2.2, -1.0], [0.0, 2.2001, -1.0], [0.0, 2.2002, -1.0], [0.0, 2.2003, -1.0]
        ],
        right: [
            [2.2, 0.8, -1.0], [2.2, 2.0, -1.0], [1.5, 2.1, -1.0],
            [0.0, 2.2, -1.0], [0.0, 2.2001, -1.0], [0.0, 2.2002, -1.0], [0.0, 2.2003, -1.0]
        ],
        extras: { grid: false, scale: true }
    },
    {
        id: 'circle',
        captionKey: 'morph_caption_circle',
        lightColor: 0x44704B,     // Sage Green
        particleSpeed: 1.1,
        center: [
            [0.0, 2.0, 0.0], [1.5, 1.0, 0.5], [1.5, -1.0, -0.5],
            [0.0, -2.0, 0.0], [-1.5, -1.0, 0.5], [-1.5, 1.0, -0.5], [0.0, 2.0, 0.0]
        ],
        left: [
            [-0.4, 2.0, -0.3], [1.1, 1.0, 0.2], [1.1, -1.0, -0.8],
            [-0.4, -2.0, -0.3], [-1.9, -1.0, 0.2], [-1.9, 1.0, -0.8], [-0.4, 2.0, -0.3]
        ],
        right: [
            [0.4, 2.0, 0.3], [1.9, 1.0, 0.8], [1.9, -1.0, -0.2],
            [0.4, -2.0, 0.3], [-1.1, -1.0, 0.8], [-1.1, 1.0, -0.2], [0.4, 2.0, 0.3]
        ],
        extras: { grid: false, scale: false }
    },
    {
        id: 'logo',
        captionKey: 'morph_caption_logo',
        lightColor: 0xB8860B,     // Bronze Gold
        particleSpeed: 0.8,
        center: [
            [0.0, 2.2, 0.5], [-1.2, 0.8, 0.0], [-1.2, -0.8, 0.0],
            [0.0, -2.2, -0.5], [1.2, -0.8, 0.0], [1.2, 0.8, 0.0], [0.0, 2.2, 0.5]
        ],
        left: [
            [0.0, 2.2, 0.5], [-1.2, 0.8, 0.0], [-1.2, -0.8, 0.0],
            [0.0, -2.2, -0.5], [1.2, -0.8, 0.0], [1.2, 0.8, 0.0], [0.0, 2.2, 0.5]
        ],
        right: [
            [0.0, 2.2, 0.5], [-1.2, 0.8, 0.0], [-1.2, -0.8, 0.0],
            [0.0, -2.2, -0.5], [1.2, -0.8, 0.0], [1.2, 0.8, 0.0], [0.0, 2.2, 0.5]
        ],
        extras: { grid: false, scale: false }
    }
];

// 2. State Manager Module (Single Source of Truth)
class StateManager {
    static state = {
        lang: 'ar',
        theme: 'dark',
        scrollProgress: 0,
        activePage: 'index'
    };

    static listeners = {};

    static init() {
        // Detect current page
        const path = window.location.pathname;
        if (path.includes('blog.html')) {
            this.state.activePage = 'blog';
        } else if (path.includes('contact.html')) {
            this.state.activePage = 'contact';
        } else {
            this.state.activePage = 'index';
        }

        // Get saved or preferred language
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            this.state.lang = savedLang;
        } else {
            const browserLang = navigator.language || navigator.userLanguage;
            this.state.lang = browserLang.startsWith('en') ? 'en' : 'ar';
        }

        // Get saved or preferred theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.state.theme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.state.theme = 'light';
        }
    }

    static getState(key) {
        return this.state[key];
    }

    static setState(key, value) {
        if (this.state[key] !== value) {
            this.state[key] = value;
            if (key === 'lang') localStorage.setItem('lang', value);
            if (key === 'theme') localStorage.setItem('theme', value);
            this.emit(key, value);
        }
    }

    static subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    static emit(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(cb => cb(value));
        }
    }
}
window.StateManager = StateManager;

// 3. Theme Manager Module (Dynamic Theme Engine)
class ThemeManager {
    static init() {
        StateManager.subscribe('theme', (theme) => this.applyTheme(theme));
        this.applyTheme(StateManager.getState('theme'));
        this.bindEvents();
    }

    static bindEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#theme-toggle-btn');
            if (btn) {
                const current = StateManager.getState('theme');
                StateManager.setState('theme', current === 'dark' ? 'light' : 'dark');
            }
        });
    }

    static applyTheme(theme) {
        const isLight = theme === 'light';
        document.documentElement.classList.toggle('light-theme', isLight);

        // Update theme toggle buttons markup on page
        const btns = document.querySelectorAll('#theme-toggle-btn');
        btns.forEach(btn => {
            btn.innerHTML = `<i class="fa-solid ${isLight ? 'fa-moon' : 'fa-sun'}"></i>`;
        });

        // Update logo images on page
        const logoImgs = document.querySelectorAll('#logo-img');
        logoImgs.forEach(img => {
            img.src = isLight ? 'logo-dark.png' : 'logo-light.png';
        });

        // Delegate to SceneManager if loaded
        if (window.experience && window.experience.scene) {
            window.experience.scene.updateTheme(theme);
        }
    }
}

// 4. Language Manager Module (Bilingual Localization Engine)
class LanguageManager {
    static init() {
        StateManager.subscribe('lang', (lang) => this.applyLanguage(lang));
        this.applyLanguage(StateManager.getState('lang'));
        this.bindEvents();
    }

    static bindEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#lang-toggle-btn');
            if (btn) {
                const current = StateManager.getState('lang');
                StateManager.setState('lang', current === 'ar' ? 'en' : 'ar');
            }
        });
    }

    static applyLanguage(lang) {
        const isAR = lang === 'ar';
        const dir = isAR ? 'rtl' : 'ltr';
        
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);

        // Translate nodes with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key] !== undefined) {
                // If it is a heading or span that has styling, we just update the text content cleanly
                const trans = window.TRANSLATIONS[lang][key];
                
                // Keep the icon inside the primary button if active
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = `<span>${trans}</span>`;
                    el.appendChild(icon);
                } else {
                    el.innerHTML = trans;
                }
            }
        });

        // Translate placeholders with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key] !== undefined) {
                el.setAttribute('placeholder', window.TRANSLATIONS[lang][key]);
            }
        });

        // Translate toggle buttons labels
        const langBtns = document.querySelectorAll('#lang-toggle-btn');
        langBtns.forEach(btn => {
            btn.innerHTML = `<span>${isAR ? 'EN' : 'عربي'}</span>`;
        });

        // Toggle visibility of the English hero subtitle under the Arabic one in Arabic mode
        const subEn = document.getElementById('hero-subtitle-en-sub');
        if (subEn) {
            subEn.style.display = isAR ? 'block' : 'none';
        }

        // Re-apply database settings dynamically on top of translations if loaded
        if (window.websiteSettings) {
            applyDynamicSettings(window.websiteSettings);
        }

        // Re-render dynamic services and FAQs when language changes
        if (typeof renderDynamicServices === 'function') {
            renderDynamicServices();
        }
        if (typeof renderDynamicFAQs === 'function') {
            renderDynamicFAQs();
        }

        // If the page is contact, update standard error strings and layout direction
        if (window.experience && window.experience.ui) {
            window.experience.ui.onLanguageChange(lang);
        }
    }
}

// 5. Math Utilities for 3D Curve Morphing
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

// Optimized in-place Vector calculations to avoid GC pauses
let _tempP = null;
function updateTubeGeometry(geometry, curve, radius, tubularSegments, radialSegments) {
    if (!_tempP) _tempP = new THREE.Vector3();
    const frames = curve.computeFrenetFrames(tubularSegments, false);
    const positions = geometry.attributes.position.array;
    const tempNormal = new THREE.Vector3();
    
    let index = 0;
    for (let i = 0; i <= tubularSegments; i++) {
        curve.getPointAt(i / tubularSegments, _tempP);
        const N = frames.normals[i];
        const B = frames.binormals[i];
        
        for (let j = 0; j <= radialSegments; j++) {
            const v = (j / radialSegments) * Math.PI * 2;
            const sin = Math.sin(v);
            const cos = -Math.cos(v);
            
            tempNormal.copy(N).multiplyScalar(cos).addScaledVector(B, sin).normalize();
            
            positions[index * 3] = _tempP.x + tempNormal.x * radius;
            positions[index * 3 + 1] = _tempP.y + tempNormal.y * radius;
            positions[index * 3 + 2] = _tempP.z + tempNormal.z * radius;
            index++;
        }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
}

// 6. Scene Manager Module (WebGL & Lighting Setup)
class SceneManager {
    constructor(container) {
        this.container = container;
        if (!container) return;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x06110B, 0.015);
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.set(0, 0.4, 9.5);
        
        this.isMobile = window.innerWidth < 768;
        this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile, alpha: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.2 : 2));
        this.renderer.setSize(width, height);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);
        
        this.mainGroup = new THREE.Group();
        this.scene.add(this.mainGroup);
        
        this.setupLights();
        this.applyInitialTheme();
        
        this.colorA = new THREE.Color();
        this.colorB = new THREE.Color();
        this.colorTarget = new THREE.Color();
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(this.ambientLight);
        
        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        this.dirLight.position.set(5, 10, 7);
        this.scene.add(this.dirLight);
        
        this.rimLight = new THREE.DirectionalLight(0xD4AF37, 1.4);
        this.rimLight.position.set(-5, 5, -5);
        this.scene.add(this.rimLight);
    }

    applyInitialTheme() {
        const theme = StateManager.getState('theme');
        this.updateTheme(theme);
    }

    updateTheme(theme) {
        const isDark = theme === 'dark';
        const hexBg = isDark ? 0x06110B : 0xF3F7F5;
        
        if (this.scene) {
            this.scene.fog.color.setHex(hexBg);
        }
        if (this.renderer) {
            this.renderer.setClearColor(hexBg, 0);
        }
        if (this.ambientLight) {
            this.ambientLight.intensity = isDark ? 0.7 : 1.1;
        }
        if (this.dirLight) {
            this.dirLight.intensity = isDark ? 0.9 : 1.2;
        }
        if (this.rimLight) {
            this.rimLight.intensity = isDark ? 1.4 : 1.6;
        }
        
        // Adjust curves/meshes parameters on material inside MorphEngine if defined
        if (this.morph && this.morph.ribbonMaterial) {
            this.morph.updateThemeColors(isDark);
        }
    }

    updateLighting(stageA, stageB, easedT) {
        this.colorA.setHex(stageA.lightColor);
        this.colorB.setHex(stageB.lightColor);
        
        this.colorTarget.copy(this.colorA).lerp(this.colorB, easedT);
        this.rimLight.color.lerp(this.colorTarget, 0.05);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// 7. Morph Engine Module (Curves, Scale & Grid Interpolation)
class MorphEngine {
    constructor(sceneManager, isMobile) {
        this.sceneManager = sceneManager;
        this.isMobile = isMobile;
        
        this.tubularSegments = this.isMobile ? 40 : 100;
        this.radialSegments = this.isMobile ? 4 : 7;
        this.radius = this.isMobile ? 0.038 : 0.052;
        
        this.centerControlPoints = Array.from({ length: 7 }, () => new THREE.Vector3());
        this.leftControlPoints = Array.from({ length: 7 }, () => new THREE.Vector3());
        this.rightControlPoints = Array.from({ length: 7 }, () => new THREE.Vector3());
        
        this.curveCenter = new THREE.CatmullRomCurve3(this.centerControlPoints);
        this.curveLeft = new THREE.CatmullRomCurve3(this.leftControlPoints);
        this.curveRight = new THREE.CatmullRomCurve3(this.rightControlPoints);
        
        this.setupMaterials();
        this.setupMeshes();
        
        // Link morph inside SceneManager
        if (this.sceneManager) {
            this.sceneManager.morph = this;
            this.sceneManager.applyInitialTheme();
        }
    }

    setupMaterials() {
        const isMobile = this.isMobile;
        const isDark = StateManager.getState('theme') === 'dark';
        
        if (isMobile) {
            this.ribbonMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                emissive: isDark ? 0x221c0b : 0xe4d3a2,
                transparent: true,
                opacity: 0.65,
                shininess: 90
            });
        } else {
            this.ribbonMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                emissive: isDark ? 0x1a150c : 0xc4b184,
                roughness: isDark ? 0.05 : 0.15,
                metalness: isDark ? 0.1 : 0.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                transmission: 0.95,
                thickness: 0.8,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
        }
    }

    updateThemeColors(isDark) {
        if (!this.ribbonMaterial) return;
        if (this.isMobile) {
            this.ribbonMaterial.emissive.setHex(isDark ? 0x221c0b : 0xe4d3a2);
        } else {
            this.ribbonMaterial.emissive.setHex(isDark ? 0x1a150c : 0xc4b184);
            this.ribbonMaterial.roughness = isDark ? 0.05 : 0.15;
            this.ribbonMaterial.metalness = isDark ? 0.1 : 0.4;
        }
        this.ribbonMaterial.needsUpdate = true;
    }

    setupMeshes() {
        this.geomCenter = new THREE.TubeGeometry(this.curveCenter, this.tubularSegments, this.radius, this.radialSegments, false);
        this.meshCenter = new THREE.Mesh(this.geomCenter, this.ribbonMaterial);
        this.sceneManager.mainGroup.add(this.meshCenter);
        
        if (!this.isMobile) {
            this.geomLeft = new THREE.TubeGeometry(this.curveLeft, this.tubularSegments, this.radius, this.radialSegments, false);
            this.meshLeft = new THREE.Mesh(this.geomLeft, this.ribbonMaterial);
            this.sceneManager.mainGroup.add(this.meshLeft);
            
            this.geomRight = new THREE.TubeGeometry(this.curveRight, this.tubularSegments, this.radius, this.radialSegments, false);
            this.meshRight = new THREE.Mesh(this.geomRight, this.ribbonMaterial);
            this.sceneManager.mainGroup.add(this.meshRight);
            
            // Grid framework
            this.gridGeometry = new THREE.BufferGeometry();
            const gridPositions = new Float32Array(14 * 2 * 3);
            this.gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));
            this.gridMaterial = new THREE.LineBasicMaterial({
                color: 0xD4AF37,
                transparent: true,
                opacity: 0.0
            });
            this.gridMesh = new THREE.LineSegments(this.gridGeometry, this.gridMaterial);
            this.sceneManager.mainGroup.add(this.gridMesh);
            
            // Scale structure
            this.scalePartsMaterial = new THREE.MeshStandardMaterial({
                color: 0xD4AF37,
                metalness: 0.85,
                roughness: 0.18,
                transparent: true,
                opacity: 0.0
            });
            
            const panGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.02, 24);
            this.leftPanMesh = new THREE.Mesh(panGeom, this.scalePartsMaterial);
            this.rightPanMesh = new THREE.Mesh(panGeom, this.scalePartsMaterial);
            this.sceneManager.mainGroup.add(this.leftPanMesh);
            this.sceneManager.mainGroup.add(this.rightPanMesh);
            
            const pedGeom = new THREE.CylinderGeometry(0.8, 1.1, 0.15, 32);
            this.basePedestalMesh = new THREE.Mesh(pedGeom, this.scalePartsMaterial);
            this.basePedestalMesh.position.set(0.0, -2.8, -1.0);
            this.sceneManager.mainGroup.add(this.basePedestalMesh);
            
            this.chainsMaterial = new THREE.LineBasicMaterial({
                color: 0xD4AF37,
                transparent: true,
                opacity: 0.0
            });
            
            this.chainsGeometryLeft = new THREE.BufferGeometry();
            const strPosLeft = new Float32Array(3 * 2 * 3);
            this.chainsGeometryLeft.setAttribute('position', new THREE.BufferAttribute(strPosLeft, 3));
            this.leftStringsMesh = new THREE.LineSegments(this.chainsGeometryLeft, this.chainsMaterial);
            this.sceneManager.mainGroup.add(this.leftStringsMesh);
            
            this.chainsGeometryRight = new THREE.BufferGeometry();
            const strPosRight = new Float32Array(3 * 2 * 3);
            this.chainsGeometryRight.setAttribute('position', new THREE.BufferAttribute(strPosRight, 3));
            this.rightStringsMesh = new THREE.LineSegments(this.chainsGeometryRight, this.chainsMaterial);
            this.sceneManager.mainGroup.add(this.rightStringsMesh);
        }
        
        this._leftHook = new THREE.Vector3();
        this._rightHook = new THREE.Vector3();
        this._leftPanPos = new THREE.Vector3();
        this._rightPanPos = new THREE.Vector3();
    }

    update(stageIdx, nextIdx, easedT, scrollProgress, time) {
        const currentStage = STAGE_CONFIG[stageIdx];
        const nextStage = STAGE_CONFIG[nextIdx];
        
        // 1. Interpolate curves coordinates
        for (let i = 0; i < 7; i++) {
            const pA = currentStage.center[i];
            const pB = nextStage.center[i];
            this.centerControlPoints[i].set(
                lerp(pA[0], pB[0], easedT),
                lerp(pA[1], pB[1], easedT),
                lerp(pA[2], pB[2], easedT)
            );
            
            if (!this.isMobile) {
                const lA = currentStage.left[i];
                const lB = nextStage.left[i];
                this.leftControlPoints[i].set(
                    lerp(lA[0], lB[0], easedT),
                    lerp(lA[1], lB[1], easedT),
                    lerp(lA[2], lB[2], easedT)
                );
                
                const rA = currentStage.right[i];
                const rB = nextStage.right[i];
                this.rightControlPoints[i].set(
                    lerp(rA[0], rB[0], easedT),
                    lerp(rA[1], rB[1], easedT),
                    lerp(rA[2], rB[2], easedT)
                );
            }
        }
        
        // 2. Perform buffer geometry update
        updateTubeGeometry(this.geomCenter, this.curveCenter, this.radius, this.tubularSegments, this.radialSegments);
        
        if (!this.isMobile) {
            updateTubeGeometry(this.geomLeft, this.curveLeft, this.radius, this.tubularSegments, this.radialSegments);
            updateTubeGeometry(this.geomRight, this.curveRight, this.radius, this.tubularSegments, this.radialSegments);
            
            // 3. Grid scaffold visibility & buffer update
            let targetGridOpacity = 0.0;
            if (scrollProgress >= 0.15 && scrollProgress <= 0.45) {
                targetGridOpacity = 0.65 * Math.sin(((scrollProgress - 0.15) / 0.30) * Math.PI);
            }
            this.gridMaterial.opacity = lerp(this.gridMaterial.opacity, targetGridOpacity, 0.1);
            
            if (this.gridMaterial.opacity > 0.01) {
                const gridPositions = this.gridGeometry.attributes.position.array;
                let idx = 0;
                for (let i = 0; i < 7; i++) {
                    gridPositions[idx++] = this.curveLeft.points[i].x;
                    gridPositions[idx++] = this.curveLeft.points[i].y;
                    gridPositions[idx++] = this.curveLeft.points[i].z;
                    gridPositions[idx++] = this.curveCenter.points[i].x;
                    gridPositions[idx++] = this.curveCenter.points[i].y;
                    gridPositions[idx++] = this.curveCenter.points[i].z;
                    
                    gridPositions[idx++] = this.curveCenter.points[i].x;
                    gridPositions[idx++] = this.curveCenter.points[i].y;
                    gridPositions[idx++] = this.curveCenter.points[i].z;
                    gridPositions[idx++] = this.curveRight.points[i].x;
                    gridPositions[idx++] = this.curveRight.points[i].y;
                    gridPositions[idx++] = this.curveRight.points[i].z;
                }
                this.gridGeometry.attributes.position.needsUpdate = true;
            }
            
            // 4. Scale of justice parts update
            let targetScaleOpacity = 0.0;
            if (scrollProgress >= 0.35 && scrollProgress <= 0.65) {
                targetScaleOpacity = Math.sin(((scrollProgress - 0.35) / 0.30) * Math.PI);
            }
            this.scalePartsMaterial.opacity = lerp(this.scalePartsMaterial.opacity, targetScaleOpacity, 0.08);
            this.chainsMaterial.opacity = this.scalePartsMaterial.opacity * 0.5;
            
            if (this.scalePartsMaterial.opacity > 0.01) {
                this._leftHook.copy(this.curveLeft.points[0]);
                this._rightHook.copy(this.curveRight.points[0]);
                
                this._leftPanPos.copy(this._leftHook);
                this._leftPanPos.y -= 0.65;
                
                this._rightPanPos.copy(this._rightHook);
                this._rightPanPos.y -= 0.65;
                
                this.leftPanMesh.position.copy(this._leftPanPos);
                this.rightPanMesh.position.copy(this._rightPanPos);
                
                const leftStringsPos = this.chainsGeometryLeft.attributes.position.array;
                const rightStringsPos = this.chainsGeometryRight.attributes.position.array;
                
                const radiusOffset = 0.35;
                let index = 0;
                
                for (let angleIdx = 0; angleIdx < 3; angleIdx++) {
                    const theta = (angleIdx / 3) * Math.PI * 2 + time * 0.1;
                    const ox = Math.cos(theta) * radiusOffset;
                    const oz = Math.sin(theta) * radiusOffset;
                    
                    leftStringsPos[index * 6] = this._leftHook.x;
                    leftStringsPos[index * 6 + 1] = this._leftHook.y;
                    leftStringsPos[index * 6 + 2] = this._leftHook.z;
                    leftStringsPos[index * 6 + 3] = this._leftPanPos.x + ox;
                    leftStringsPos[index * 6 + 4] = this._leftPanPos.y;
                    leftStringsPos[index * 6 + 5] = this._leftPanPos.z + oz;
                    
                    rightStringsPos[index * 6] = this._rightHook.x;
                    rightStringsPos[index * 6 + 1] = this._rightHook.y;
                    rightStringsPos[index * 6 + 2] = this._rightHook.z;
                    rightStringsPos[index * 6 + 3] = this._rightPanPos.x + ox;
                    rightStringsPos[index * 6 + 4] = this._rightPanPos.y;
                    rightStringsPos[index * 6 + 5] = this._rightPanPos.z + oz;
                    
                    index++;
                }
                this.chainsGeometryLeft.attributes.position.needsUpdate = true;
                this.chainsGeometryRight.attributes.position.needsUpdate = true;
            }
        }
    }

    rebuild() {
        this.tubularSegments = this.isMobile ? 40 : 100;
        this.radialSegments = this.isMobile ? 4 : 7;
        this.radius = this.isMobile ? 0.038 : 0.052;
        
        if (this.meshCenter) {
            this.meshCenter.geometry.dispose();
            this.geomCenter = new THREE.TubeGeometry(this.curveCenter, this.tubularSegments, this.radius, this.radialSegments, false);
            this.meshCenter.geometry = this.geomCenter;
        }
        
        if (!this.isMobile) {
            if (this.meshLeft) {
                this.meshLeft.geometry.dispose();
                this.geomLeft = new THREE.TubeGeometry(this.curveLeft, this.tubularSegments, this.radius, this.radialSegments, false);
                this.meshLeft.geometry = this.geomLeft;
                this.meshLeft.visible = true;
            }
            if (this.meshRight) {
                this.meshRight.geometry.dispose();
                this.geomRight = new THREE.TubeGeometry(this.curveRight, this.tubularSegments, this.radius, this.radialSegments, false);
                this.meshRight.geometry = this.geomRight;
                this.meshRight.visible = true;
            }
            
            if (this.gridMesh) this.gridMesh.visible = true;
            if (this.leftPanMesh) this.leftPanMesh.visible = true;
            if (this.rightPanMesh) this.rightPanMesh.visible = true;
            if (this.basePedestalMesh) this.basePedestalMesh.visible = true;
            if (this.leftStringsMesh) this.leftStringsMesh.visible = true;
            if (this.rightStringsMesh) this.rightStringsMesh.visible = true;
        } else {
            if (this.meshLeft) this.meshLeft.visible = false;
            if (this.meshRight) this.meshRight.visible = false;
            if (this.gridMesh) this.gridMesh.visible = false;
            if (this.leftPanMesh) this.leftPanMesh.visible = false;
            if (this.rightPanMesh) this.rightPanMesh.visible = false;
            if (this.basePedestalMesh) this.basePedestalMesh.visible = false;
            if (this.leftStringsMesh) this.leftStringsMesh.visible = false;
            if (this.rightStringsMesh) this.rightStringsMesh.visible = false;
        }
    }
}

// 8. Particle System Module
class ParticleSystem {
    constructor(sceneManager, isMobile) {
        this.sceneManager = sceneManager;
        this.isMobile = isMobile;
        this.particleCount = this.isMobile ? 600 : 800;
        
        this._tempVec = new THREE.Vector3();
        this._tempTangent = new THREE.Vector3();
        this._tempUp = new THREE.Vector3(0, 1, 0);
        this._tempNormal = new THREE.Vector3();
        this._tempBinormal = new THREE.Vector3();
        this._tempOffset = new THREE.Vector3();
        this._tempFinal = new THREE.Vector3();
        
        this.particlesData = [];
        this.setupParticles();
    }

    setupParticles() {
        this.particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const opacities = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            const uVal = Math.random();
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            
            sizes[i] = this.isMobile ? (0.015 + Math.random() * 0.035) : (0.02 + Math.random() * 0.055);
            opacities[i] = 0.4 + Math.random() * 0.6;
            
            this.particlesData.push({
                u: uVal,
                curveIndex: this.isMobile ? 1 : (i % 3),
                theta: Math.random() * Math.PI * 2,
                radius: this.isMobile ? (0.05 + Math.random() * 0.16) : (0.08 + Math.random() * 0.32),
                speed: 0.015 + Math.random() * 0.025,
                omega: 0.6 + Math.random() * 1.5
            });
        }
        
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        this.particlesGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
        
        // Reuse ShaderMaterial to avoid compiling new WebGL shaders on resize/rebuild
        if (!this.particleShaderMat) {
            this.particleShaderMat = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color(0xD4AF37) }
                },
                vertexShader: `
                    attribute float aSize;
                    attribute float aOpacity;
                    varying float vOpacity;
                    void main() {
                        vOpacity = aOpacity;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = aSize * (350.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying float vOpacity;
                    uniform vec3 uColor;
                    void main() {
                        float r = distance(gl_PointCoord, vec2(0.5));
                        if (r > 0.5) discard;
                        float edgeFade = 1.0 - (r * 2.0);
                        float centerGlow = exp(-r * 8.0) * 1.5;
                        vec3 finalColor = uColor + vec3(0.3, 0.2, 0.0) * centerGlow;
                        gl_FragColor = vec4(finalColor, vOpacity * (edgeFade + centerGlow * 0.5));
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
        }
        
        this.pointsMesh = new THREE.Points(this.particlesGeometry, this.particleShaderMat);
        this.sceneManager.mainGroup.add(this.pointsMesh);
    }

    update(dt, speedMultiplier, activeCurveCenter, activeCurveLeft, activeCurveRight, attractorIntensity, targetAttractor, specificCurveIndex) {
        const positions = this.particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const data = this.particlesData[i];
            
            let hoverSpeed = 1.0;
            if (attractorIntensity > 0 && (specificCurveIndex === -1 || data.curveIndex === specificCurveIndex)) {
                hoverSpeed = 2.5;
            }
            
            data.u = (data.u + data.speed * speedMultiplier * hoverSpeed * dt) % 1.0;
            data.theta = (data.theta + data.omega * dt) % (Math.PI * 2);
            
            const activeCurve = this.isMobile ? activeCurveCenter : 
                ((data.curveIndex === 0) ? activeCurveLeft : (data.curveIndex === 1 ? activeCurveCenter : activeCurveRight));
            
            if (!activeCurve) continue;
            
            activeCurve.getPointAt(data.u, this._tempVec);
            activeCurve.getTangentAt(data.u, this._tempTangent);
            
            this._tempUp.set(0, 1, 0);
            if (Math.abs(this._tempTangent.y) > 0.95) {
                this._tempUp.set(1, 0, 0);
            }
            
            this._tempNormal.crossVectors(this._tempUp, this._tempTangent).normalize();
            this._tempBinormal.crossVectors(this._tempTangent, this._tempNormal).normalize();
            
            this._tempOffset.set(0, 0, 0)
                .addScaledVector(this._tempNormal, Math.cos(data.theta) * data.radius)
                .addScaledVector(this._tempBinormal, Math.sin(data.theta) * data.radius);
                
            this._tempFinal.addVectors(this._tempVec, this._tempOffset);
            
            if (attractorIntensity > 0 && (specificCurveIndex === -1 || data.curveIndex === specificCurveIndex)) {
                const dist = this._tempFinal.distanceTo(targetAttractor);
                if (dist < 2.5) {
                    const pull = (1.0 - dist / 2.5) * attractorIntensity * 0.16;
                    this._tempFinal.lerp(targetAttractor, pull);
                }
            }
            
            positions[i * 3] = this._tempFinal.x;
            positions[i * 3 + 1] = this._tempFinal.y;
            positions[i * 3 + 2] = this._tempFinal.z;
        }
        this.particlesGeometry.attributes.position.needsUpdate = true;
    }

    rebuild() {
        this.particleCount = this.isMobile ? 600 : 800;
        this.sceneManager.mainGroup.remove(this.pointsMesh);
        this.particlesGeometry.dispose();
        this.particlesData = [];
        this.setupParticles();
    }
}

// 9. Animation Manager Module (Smooth Interpolations & Loops)
class AnimationManager {
    constructor(appInstance) {
        this.app = appInstance;
        this.scrollProgress = 0;
        this.targetProgress = 0;
        this.currentStage = 0;
        this.stageProgress = 0;
        this.easedProgress = 0;
        
        this.grabRotationOffset = new THREE.Vector2(0, 0);
        this.targetGrabRotationOffset = new THREE.Vector2(0, 0);
        
        this.scaleTapSpinActive = false;
        this.scaleTapSpinTimeStart = 0;
        
        this.lastTime = performance.now();
        this.attractorIntensity = 0;
        this.targetAttractor = new THREE.Vector3();
        
        this.cardPositions = [
            new THREE.Vector3(-2.2, -0.15, 0.4),
            new THREE.Vector3(0.0, -0.15, 0.4),
            new THREE.Vector3(2.2, -0.15, 0.4)
        ];
        
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            this.targetProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
            StateManager.setState('scrollProgress', this.targetProgress);

            // Handle floats visibility
            const whatsappFloat = document.querySelector(".whatsapp-float");
            const phoneFloat = document.querySelector(".phone-float");
            if (whatsappFloat && phoneFloat) {
                const footerDistance = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
                if (footerDistance < 150) {
                    whatsappFloat.style.opacity = "0";
                    whatsappFloat.style.pointerEvents = "none";
                    phoneFloat.style.opacity = "0";
                    phoneFloat.style.pointerEvents = "none";
                } else {
                    whatsappFloat.style.opacity = "1";
                    whatsappFloat.style.pointerEvents = "auto";
                    phoneFloat.style.opacity = "1";
                    phoneFloat.style.pointerEvents = "auto";
                }
            }
        });

        if (this.app.isMobile) {
            const container = document.getElementById("three-container");
            if (container) {
                container.addEventListener("touchstart", () => {
                    this.scaleTapSpinActive = true;
                    this.scaleTapSpinTimeStart = performance.now() * 0.001;
                }, { passive: true });
            }
        } else {
            window.addEventListener("mousemove", (e) => {
                const nx = (e.clientX / window.innerWidth) * 2 - 1;
                const ny = -(e.clientY / window.innerHeight) * 2 + 1;
                
                const maxRotX = 22 * Math.PI / 180;
                const maxRotY = 35 * Math.PI / 180;
                
                this.targetGrabRotationOffset.y = nx * maxRotY;
                this.targetGrabRotationOffset.x = -ny * maxRotX;
            });
        }
    }

    update() {
        this.scrollProgress = lerp(this.scrollProgress, this.targetProgress, 0.07);
        
        const intervals = STAGE_CONFIG.length - 1;
        const scaled = this.scrollProgress * intervals;
        this.currentStage = Math.min(Math.floor(scaled), intervals - 1);
        this.stageProgress = scaled - this.currentStage;
        this.easedProgress = easeInOutCubic(Math.min(Math.max(this.stageProgress, 0), 1));
    }

    tick(currentTime) {
        const deltaTime = (currentTime - this.lastTime) * 0.001;
        this.lastTime = currentTime;
        const time = currentTime * 0.001;
        
        this.update();
        
        if (!this.app.scene || !this.app.scene.camera) return;

        // Camera positioning logic based on scroll progress
        const baseCamY = this.app.isMobile ? 0.6 : 0.4;
        const baseCamZ = this.app.isMobile ? 5.5 : 9.5;
        let camY = baseCamY;
        let camZ = baseCamZ;
        
        const p = this.scrollProgress;
        if (p < 0.25) {
            camZ = lerp(baseCamZ, baseCamZ * 0.72, easeInOutCubic(p / 0.25));
        } else if (p < 0.50) {
            camY = lerp(baseCamY, baseCamY * 3.0, easeInOutCubic((p - 0.25) / 0.25));
            camZ = lerp(baseCamZ * 0.72, baseCamZ * 0.8, easeInOutCubic((p - 0.25) / 0.25));
        } else if (p < 0.75) {
            camY = baseCamY * 3.0;
            camZ = lerp(baseCamZ * 0.8, baseCamZ * 0.95, easeInOutCubic((p - 0.50) / 0.25));
        } else {
            camY = lerp(baseCamY * 3.0, baseCamY * 2.2, easeInOutCubic((p - 0.75) / 0.25));
            camZ = lerp(baseCamZ * 0.95, baseCamZ * 0.6, easeInOutCubic((p - 0.75) / 0.25));
        }
        
        this.app.scene.camera.position.set(0, camY, camZ);
        this.app.scene.camera.lookAt(0, this.app.isMobile ? 0.6 : 0.4, 0);
        
        // Grab rotations offset
        if (this.app.isMobile) {
            let mobileRotY = time * 0.22;
            if (this.scaleTapSpinActive) {
                const spinElapsed = time - this.scaleTapSpinTimeStart;
                if (spinElapsed < 1.8) {
                    const easeFactor = 1.0 - (spinElapsed / 1.8);
                    mobileRotY += Math.sin(easeFactor * Math.PI) * 3.0;
                } else {
                    this.scaleTapSpinActive = false;
                }
            }
            this.targetGrabRotationOffset.y = mobileRotY;
            this.targetGrabRotationOffset.x = Math.sin(time * 0.18) * (2 * Math.PI / 180);
        }
        
        this.grabRotationOffset.x = lerp(this.grabRotationOffset.x, this.targetGrabRotationOffset.x, 0.1);
        this.grabRotationOffset.y = lerp(this.grabRotationOffset.y, this.targetGrabRotationOffset.y, 0.1);
        
        this.app.scene.mainGroup.rotation.x = this.grabRotationOffset.x;
        this.app.scene.mainGroup.rotation.y = this.grabRotationOffset.y;
        
        // Update morph meshes geometries
        const nextIdx = Math.min(this.currentStage + 1, STAGE_CONFIG.length - 1);
        if (this.app.morph) {
            this.app.morph.update(this.currentStage, nextIdx, this.easedProgress, p, time);
        }
        
        // Update lighting colors
        this.app.scene.updateLighting(STAGE_CONFIG[this.currentStage], STAGE_CONFIG[nextIdx], this.easedProgress);
        
        // Update overlay captions texts
        this.updateCaptionOverlay(p);
        
        // Particle Attractor system details
        let attractorActive = false;
        let specificCurveIndex = -1;
        
        if (typeof window.hoveredCardIndex === 'number' && this.cardPositions[window.hoveredCardIndex]) {
            attractorActive = true;
            specificCurveIndex = window.hoveredCardIndex;
            this.targetAttractor.copy(this.cardPositions[window.hoveredCardIndex]);
        } else if (window.hoveredButtonActive) {
            attractorActive = true;
            this.targetAttractor.set(0.0, 2.3, 0.1);
        }
        
        this.attractorIntensity = lerp(this.attractorIntensity, attractorActive ? 1.0 : 0.0, 0.08);
        const particleSpeedCoeff = STAGE_CONFIG[this.currentStage].particleSpeed;
        
        if (this.app.particles && this.app.morph) {
            this.app.particles.update(
                deltaTime,
                particleSpeedCoeff,
                this.app.morph.curveCenter,
                this.app.morph.curveLeft,
                this.app.morph.curveRight,
                this.attractorIntensity,
                this.targetAttractor,
                specificCurveIndex
            );
        }
    }

    updateCaptionOverlay(globalProgress) {
        const container = document.getElementById('scene-caption');
        const captionText = document.getElementById('caption-text');
        const progressFill = document.getElementById('caption-progress-fill');
        
        if (!container || !captionText) return;

        const isVisible = globalProgress > 0.01 && globalProgress < 0.98;
        container.classList.toggle('visible', isVisible);

        const currentStage = STAGE_CONFIG[this.currentStage];
        if (currentStage) {
            const translationKey = currentStage.captionKey;
            captionText.innerText = window.t(translationKey);
        }

        if (progressFill) {
            progressFill.style.width = `${Math.min(this.stageProgress * 100, 100)}%`;
        }
    }
}

// 10. Blog Service (Decoupled Data Layer for Future Paginated API Integrations)
class BlogService {
    static getCategoryCounts() {
        const list = window.blogArticles || [];
        const counts = {
            all: list.length,
            commercial: 0,
            criminal: 0,
            corporate: 0,
            documentation: 0,
            arbitration: 0,
            labor: 0
        };

        list.forEach(art => {
            if (counts[art.category] !== undefined) {
                counts[art.category]++;
            }
        });
        return counts;
    }

    static getArticles({ category = 'all', searchQuery = '', start = 0, limit = 9 } = {}) {
        let list = window.blogArticles || [];
        
        // Filter by category
        if (category !== 'all') {
            list = list.filter(art => art.category === category);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(art => 
                art.title.toLowerCase().includes(query) ||
                (art.title_en && art.title_en.toLowerCase().includes(query)) ||
                art.excerpt.toLowerCase().includes(query) ||
                (art.excerpt_en && art.excerpt_en.toLowerCase().includes(query))
            );
        }

        const total = list.length;
        const pageSlice = list.slice(start, start + limit);

        return {
            articles: pageSlice,
            total: total,
            hasMore: start + limit < total
        };
    }

    static getArticleById(id) {
        const list = window.blogArticles || [];
        return list.find(art => art.id === id) || null;
    }
}

// 11. UI Manager Module (DOM Interactions & Page States Logic)
class UIManager {
    constructor() {
        this.activePage = StateManager.getState('activePage');
        this.currentStep = 1;
        this.totalSteps = 3;

        // Blog state
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.displayedCount = 0;
        this.loadBatchSize = 9;
        this.infiniteBatchSize = 6;
        this.blogIsLoading = false;

        this.initCommonUI();
        
        if (this.activePage === 'blog') {
            this.initBlogUI();
        } else if (this.activePage === 'contact') {
            this.initContactUI();
        }
    }

    initCommonUI() {
        // Services cards hover effects
        const cards = document.querySelectorAll('.service-card');
        const isMobile = window.innerWidth < 768;
        
        cards.forEach((card, index) => {
            if (!isMobile) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((centerY - y) / centerY) * 10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                });
            }
            
            card.addEventListener('mouseenter', () => {
                window.hoveredCardIndex = index;
                card.style.borderColor = 'var(--color-gold)';
            });
            
            card.addEventListener('mouseleave', () => {
                window.hoveredCardIndex = null;
                card.style.borderColor = 'var(--glass-border)';
            });
        });

        // CTA buttons hover effect mapping to WebGL particles attraction
        const primaryButtons = document.querySelectorAll('.btn-primary, .btn-cta-gold, .whatsapp-float, .phone-float');
        primaryButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                window.hoveredButtonActive = true;
            });
            btn.addEventListener('mouseleave', () => {
                window.hoveredButtonActive = false;
            });
        });

        // Dynamic Subtitle Word flipper on Hero
        this.initDynamicWordFlipper();

        // Bind scroll active navigation highlight
        const sections = document.querySelectorAll('.scroll-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length > 0) {
            window.addEventListener('scroll', () => {
                let currentSec = 'hero';
                const scrollPos = window.scrollY;
                
                sections.forEach(sec => {
                    const secTop = sec.offsetTop;
                    const secHeight = sec.clientHeight;
                    
                    if (scrollPos >= secTop - secHeight / 2.5) {
                        currentSec = sec.getAttribute('id');
                    }

                    // Add relative layout classes for advanced animations
                    if (scrollPos < secTop - secHeight / 2.0) {
                        sec.classList.add('scroll-below');
                        sec.classList.remove('scroll-above');
                    } else if (scrollPos > secTop + secHeight / 1.8) {
                        sec.classList.add('scroll-above');
                        sec.classList.remove('scroll-below');
                    } else {
                        sec.classList.remove('scroll-below');
                        sec.classList.remove('scroll-above');
                    }
                });

                sections.forEach(sec => {
                    sec.classList.toggle('active', sec.getAttribute('id') === currentSec);
                });

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${currentSec}` || href.includes(`#${currentSec}`));
                });
            });
        }
    }

    initDynamicWordFlipper() {
        const words = ["محاماة", "تحكيم", "توثيق"];
        const wordsEN = ["Advocacy", "Arbitration", "Notarization"];
        let index = 0;
        const el = document.getElementById("dynamic-word");
        if (!el) return;
        
        setInterval(() => {
            el.style.opacity = 0;
            el.style.transform = "translateY(12px)";
            
            setTimeout(() => {
                const lang = StateManager.getState('lang');
                const list = lang === 'ar' ? words : wordsEN;
                index = (index + 1) % list.length;
                el.innerText = list[index];
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }, 350);
        }, 3200);
    }

    // --- contact page logics ---
    initContactUI() {
        this.updateFormStepUI();
        this.initFileUploadUI();
    }

    initFileUploadUI() {
        this.selectedFiles = [];
        
        const dropZone = document.getElementById("drop-zone");
        const fileInput = document.getElementById("file-input");
        
        if (!dropZone || !fileInput) return;
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        // Drag over highlights
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });
        
        // Handle dropped files
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleSelectedFiles(files);
        });
        
        // Click drop-zone to select files (excluding the file input itself or browse button)
        dropZone.addEventListener('click', (e) => {
            if (e.target !== fileInput && !e.target.classList.contains('file-browse-btn')) {
                fileInput.click();
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleSelectedFiles(fileInput.files);
            fileInput.value = ''; // clear to allow re-selection
        });
    }

    showFileError(messageKey, replaceObj = {}) {
        const errorMsgEl = document.getElementById("file-error-msg");
        if (!errorMsgEl) return;
        const lang = StateManager.getState('lang');
        let text = window.TRANSLATIONS[lang][messageKey] || messageKey;
        
        for (const [k, v] of Object.entries(replaceObj)) {
            text = text.replace(`{${k}}`, v);
        }
        
        errorMsgEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${text}</span>`;
        errorMsgEl.style.display = "flex";
        errorMsgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearFileError() {
        const errorMsgEl = document.getElementById("file-error-msg");
        if (errorMsgEl) {
            errorMsgEl.style.display = "none";
            errorMsgEl.innerHTML = "";
        }
    }

    async handleSelectedFiles(files) {
        this.clearFileError();
        const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'application/octet-stream'
        ];
        
        if (this.selectedFiles.length + files.length > 5) {
            this.showFileError('err_max_files');
            return;
        }
        
        const addedStubs = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const name = file.name;
            const ext = name.split('.').pop().toLowerCase();
            
            if (!allowedExtensions.includes(ext)) {
                this.showFileError('err_file_type', { name });
                return;
            }
            
            if (file.type && !allowedMimeTypes.includes(file.type)) {
                this.showFileError('err_file_type', { name });
                return;
            }
            
            const isDuplicate = this.selectedFiles.some(f => f.file.name === name && f.file.size === file.size);
            if (isDuplicate) {
                this.showFileError('err_duplicate_file', { name });
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                this.showFileError('err_file_size', { name });
                return;
            }
            
            const fileStub = {
                file: file,
                base64: null,
                status: 'pending',
                progress: 0
            };
            this.selectedFiles.push(fileStub);
            addedStubs.push(fileStub);
        }
        
        this.renderSelectedFilesList();
        
        for (const fileStub of addedStubs) {
            await this.processFile(fileStub);
        }
    }

    async processFile(fileStub) {
        fileStub.status = 'reading';
        this.updateFileItemUI(fileStub);
        
        const file = fileStub.file;
        const name = file.name;
        const ext = name.split('.').pop().toLowerCase();
        
        try {
            let processedBlob = file;
            const isCompressibleImage = (ext === 'jpg' || ext === 'jpeg' || ext === 'png') && file.type.startsWith('image/');
            
            if (isCompressibleImage && file.size > 4 * 1024 * 1024) {
                fileStub.status = 'compressing';
                this.updateFileItemUI(fileStub);
                try {
                    processedBlob = await this.compressImageClientSide(file);
                } catch (err) {
                    console.warn("Client side compression failed, using original file:", err);
                    processedBlob = file;
                }
            }
            
            const base64Data = await this.readBlobAsBase64(processedBlob, (percent) => {
                fileStub.progress = percent;
                this.updateFileItemUI(fileStub);
            });
            
            fileStub.base64 = base64Data;
            fileStub.status = 'ready';
            fileStub.progress = 100;
            this.updateFileItemUI(fileStub);
            
            let totalRawSize = this.selectedFiles.reduce((acc, curr) => acc + curr.file.size, 0);
            if (totalRawSize > 30 * 1024 * 1024) {
                this.showFileError('err_total_size');
            }
        } catch (err) {
            fileStub.status = 'error';
            this.updateFileItemUI(fileStub);
            console.error("Failed processing file:", name, err);
        }
    }

    readBlobAsBase64(blob, progressCallback) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressCallback(percent);
                }
            };
            
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
        });
    }

    compressImageClientSide(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 2000;
                    
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Blob extraction failed"));
                        }
                    }, file.type, 0.75);
                };
                img.onerror = () => reject(new Error("Image load error"));
            };
            reader.onerror = () => reject(reader.error);
        });
    }

    renderSelectedFilesList() {
        const container = document.getElementById("selected-files-list");
        if (!container) return;
        
        container.innerHTML = "";
        
        this.selectedFiles.forEach((fileStub, index) => {
            const file = fileStub.file;
            const ext = file.name.split('.').pop().toLowerCase();
            let fileIcon = "fa-file-lines";
            
            if (ext === "pdf") {
                fileIcon = "fa-file-pdf";
            } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
                fileIcon = "fa-file-image";
            } else if (['doc', 'docx'].includes(ext)) {
                fileIcon = "fa-file-word";
            }
            
            const sizeStr = (file.size / 1024 / 1024).toFixed(2) + " MB";
            
            const fileItem = document.createElement("div");
            fileItem.className = "file-item-glass";
            fileItem.id = `file-item-${index}`;
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fa-solid ${fileIcon} file-type-icon"></i>
                    <div class="file-details">
                        <div class="file-name-size">
                            <span class="file-name" title="${file.name}">${file.name}</span>
                            <span class="file-size">${sizeStr}</span>
                        </div>
                        <div class="file-progress-container">
                            <div class="file-progress-bar" id="file-progress-bar-${index}" style="width: ${fileStub.progress}%"></div>
                        </div>
                    </div>
                </div>
                <button type="button" class="file-remove-btn" onclick="window.removeFile(${index})" aria-label="Remove File">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            
            container.appendChild(fileItem);
        });
    }

    updateFileItemUI(fileStub) {
        const index = this.selectedFiles.indexOf(fileStub);
        if (index === -1) return;
        
        const progressBar = document.getElementById(`file-progress-bar-${index}`);
        if (progressBar) {
            progressBar.style.width = `${fileStub.progress}%`;
            if (fileStub.status === 'compressing') {
                progressBar.style.backgroundColor = "var(--color-gold)";
            } else if (fileStub.status === 'ready') {
                progressBar.style.backgroundColor = "var(--color-green-light)";
            } else if (fileStub.status === 'error') {
                progressBar.style.backgroundColor = "#ff6b6b";
            } else {
                progressBar.style.backgroundColor = "var(--color-green-light)";
            }
        }
    }

    removeFile(index) {
        this.clearFileError();
        this.selectedFiles.splice(index, 1);
        this.renderSelectedFilesList();
        
        let totalRawSize = this.selectedFiles.reduce((acc, curr) => acc + curr.file.size, 0);
        if (totalRawSize > 30 * 1024 * 1024) {
            this.showFileError('err_total_size');
        }
    }

    updateUploadProgressUI(stageKey, progressPercent) {
        const lang = StateManager.getState('lang');
        let statusContainer = document.getElementById("upload-status-overlay");
        
        if (!statusContainer) {
            const formStep = document.getElementById("step-3");
            statusContainer = document.createElement("div");
            statusContainer.id = "upload-status-overlay";
            statusContainer.className = "upload-status-overlay";
            const formNav = formStep ? formStep.querySelector(".form-nav") : null;
            if (formStep && formNav) {
                formStep.insertBefore(statusContainer, formNav);
            } else if (formStep) {
                formStep.appendChild(statusContainer);
            }
        }
        
        const stageTexts = {
            preparing: window.TRANSLATIONS[lang]['stage_preparing'] || "Preparing files...",
            uploading: window.TRANSLATIONS[lang]['stage_uploading'] || "Uploading...",
            saving: window.TRANSLATIONS[lang]['stage_saving'] || "Saving consultation...",
            completed: window.TRANSLATIONS[lang]['stage_completed'] || "Completed."
        };
        
        statusContainer.innerHTML = `
            <div class="upload-status-header">
                <span class="upload-status-text">${stageTexts[stageKey]}</span>
                <span class="upload-status-percent">${progressPercent}%</span>
            </div>
            <div class="upload-status-progress">
                <div class="upload-status-bar" style="width: ${progressPercent}%"></div>
            </div>
        `;
        statusContainer.style.display = "flex";
    }

    hideUploadProgressUI() {
        const statusContainer = document.getElementById("upload-status-overlay");
        if (statusContainer) {
            statusContainer.style.display = "none";
        }
    }

    updateFormStepUI() {
        const total = this.totalSteps;
        for (let i = 1; i <= total; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            const indEl = document.getElementById(`step-ind-${i}`);
            if (stepEl && indEl) {
                if (i === this.currentStep) {
                    stepEl.classList.add('active');
                    indEl.className = "step-indicator active";
                } else {
                    stepEl.classList.remove('active');
                    indEl.className = i < this.currentStep ? "step-indicator completed" : "step-indicator";
                }
            }
        }

        const currentStepNumEl = document.getElementById('current-step-num');
        if (currentStepNumEl) {
            const isAR = StateManager.getState('lang') === 'ar';
            const digits = isAR ? ['٠', '١', '٢', '٣'] : ['0', '1', '2', '3'];
            currentStepNumEl.innerText = digits[this.currentStep] || this.currentStep;
        }

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn && nextBtn && submitBtn) {
            if (this.currentStep === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "block";
                submitBtn.style.display = "none";
            } else if (this.currentStep === total) {
                prevBtn.style.display = "block";
                nextBtn.style.display = "none";
                submitBtn.style.display = "block";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
                submitBtn.style.display = "none";
            }
        }
    }

    changeFormStep(stepChange) {
        const isForward = stepChange > 0;
        const lang = StateManager.getState('lang');
        
        if (isForward) {
            if (this.currentStep === 1) {
                const nameVal = document.getElementById("name").value.trim();
                const phoneVal = document.getElementById("phone").value.trim();
                if (nameVal.length < 3) {
                    alert(window.TRANSLATIONS[lang]['err_name']);
                    return;
                }
                if (!/^05\d{8}$/.test(phoneVal)) {
                    alert(window.TRANSLATIONS[lang]['err_phone']);
                    return;
                }
            } else if (this.currentStep === 2) {
                const caseVal = document.getElementById("case-type").value;
                if (!caseVal) {
                    alert(lang === 'ar' ? "يرجى تحديد الخدمة المطلوبة" : "Please select case specialty");
                    return;
                }
            }
        }

        this.currentStep += stepChange;
        this.currentStep = Math.min(Math.max(this.currentStep, 1), this.totalSteps);
        this.updateFormStepUI();
    }

    async handleContactPageSubmit(e) {
        e.preventDefault();
        
        // 1. Prevent concurrent submissions
        if (this.isSubmitting) return;
        
        const lang = StateManager.getState('lang');
        const submitBtn = document.getElementById('submit-btn');
        const prevBtn = document.getElementById('prev-btn');

        try {
            this.clearFileError();
            
            const descVal = document.getElementById('description').value.trim();
            if (descVal.length < 10) {
                this.showFileError('err_msg');
                return;
            }

            const nameVal = document.getElementById('name').value.trim();
            const phoneVal = document.getElementById('phone').value.trim();
            const caseSelect = document.getElementById('case-type');
            const caseText = caseSelect ? caseSelect.options[caseSelect.selectedIndex].text : "";
            const urgencyVal = document.querySelector('input[name="urgency"]:checked').value;
            const websiteField = document.getElementById('contact-website') ? document.getElementById('contact-website').value : '';

            // 2. Set submission locks
            this.isSubmitting = true;
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['form_sending']}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }
            if (prevBtn) {
                prevBtn.disabled = true;
            }

            // 3. Wait for any files still processing
            this.updateUploadProgressUI('preparing', 10);
            let processing = true;
            while (processing) {
                const hasProcessingFiles = this.selectedFiles.some(f => f.status === 'pending' || f.status === 'reading' || f.status === 'compressing');
                if (!hasProcessingFiles) {
                    processing = false;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            // 4. Collect raw File objects
            const rawFiles = this.selectedFiles
                .filter(f => f.status === 'ready')
                .map(f => f.file);

            const totalRawSize = rawFiles.reduce((acc, f) => acc + f.size, 0);
            const sizeInMB = (totalRawSize / (1024 * 1024)).toFixed(2);
            console.log(`Submitting consultation payload with ${rawFiles.length} attachments of total size: ${sizeInMB} MB`);

            // 5. Submit with retry loops
            const maxRetries = 3;
            let attempt = 0;

            const executeSubmit = async () => {
                attempt++;
                try {
                    this.updateUploadProgressUI('uploading', Math.min(20 + attempt * 20, 70));
                    
                    const submitData = {
                        name: nameVal,
                        phone: phoneVal,
                        service: caseText,
                        message: urgencyVal === 'emergency' ? `[EMERGENCY REQUEST] ${descVal}` : `[Urgency: ${urgencyVal}] ${descVal}`,
                        website_field: websiteField,
                        priority: urgencyVal === 'emergency' ? 'Emergency' : urgencyVal === 'urgent' ? 'Urgent' : 'Normal',
                        files: rawFiles
                    };
                    
                    this.updateUploadProgressUI('saving', 85);
                    const result = await ConsultationAPI.submit(submitData);
                    
                    if (result.status === 'success') {
                        this.updateUploadProgressUI('completed', 100);
                        
                        if (urgencyVal === 'emergency') {
                            const waMessage = `السلام عليكم، مرحبا
 أنا : ${nameVal}. 
رقم الجوال: ${phoneVal}. 
أرغب في استشارة طارئة بخصوص: ${caseText}.
 التفاصيل: ${descVal}

`;
                            const waNumber = (window.websiteSettings && window.websiteSettings.whatsapp) || '966500000000';
                            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
                            
                            this.showNotification(window.TRANSLATIONS[lang]['contact_page_emergency_title'], window.TRANSLATIONS[lang]['contact_page_emergency_desc']);
                            setTimeout(() => {
                                window.open(waUrl, "_blank");
                                this.renderContactPageSuccessScreen(result.referenceId);
                                this.hideUploadProgressUI();
                            }, 1200);
                        } else {
                            this.showNotification(window.TRANSLATIONS[lang]['toast_success_title'], window.TRANSLATIONS[lang]['toast_success_desc']);
                            setTimeout(() => {
                                this.renderContactPageSuccessScreen(result.referenceId);
                                this.hideUploadProgressUI();
                            }, 1000);
                        }
                    } else {
                        throw new Error(result.message || "Upload failed");
                    }
                } catch (err) {
                    if (attempt < maxRetries) {
                        console.warn(`Upload attempt ${attempt} failed: ${err.message}. Retrying...`);
                        await new Promise(resolve => setTimeout(resolve, attempt * 1500));
                        return executeSubmit();
                    } else {
                        console.error("Submission failed after max retries:", err);
                        this.hideUploadProgressUI();
                        
                        // Show actual error message instead of generic upload failed mask
                        const finalErrorMsg = err.message || 'err_upload_failed';
                        this.showFileError(finalErrorMsg);
                        this.isSubmitting = false;
                        
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['btn_retry'] || 'إعادة المحاولة'}</span>`;
                        }
                        if (prevBtn) {
                            prevBtn.disabled = false;
                        }
                    }
                }
            };

            await executeSubmit();

        } catch (globalErr) {
            console.error("Global submit error captured:", globalErr);
            this.hideUploadProgressUI();
            
            const finalErrorMsg = globalErr.message || 'err_upload_failed';
            this.showFileError(finalErrorMsg);
            this.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['btn_retry'] || 'إعادة المحاولة'}</span>`;
            }
            if (prevBtn) {
                prevBtn.disabled = false;
            }
        }
    }

    renderContactPageSuccessScreen(referenceId) {
        const card = document.querySelector('.contact-card-premium');
        if (!card) return;
        const lang = StateManager.getState('lang');
        
        card.innerHTML = `
            <div class="success-screen-premium" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 4rem 2rem; animation: fadeIn 0.8s ease forwards;">
                <div class="success-icon-pulse" style="width: 90px; height: 90px; border-radius: 50%; background: rgba(68, 112, 75, 0.1); border: 3px solid var(--color-green); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--color-green); margin-bottom: 2rem;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2 class="amiri-font" style="font-size: 2.2rem; color: var(--color-green); margin-bottom: 1rem; font-weight: 700;">${window.TRANSLATIONS[lang]['form_success_title']}</h2>
                <p style="font-size: 1.05rem; line-height: 1.8; color: var(--color-text-light); margin-bottom: 2.5rem; font-family: var(--font-tajawal); max-width: 480px;">
                    ${window.TRANSLATIONS[lang]['form_success_desc']}
                </p>
                
                ${referenceId ? `
                <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); padding: 0.75rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; font-family: monospace;">
                    <span style="font-size: 0.8rem; color: var(--color-text-light); display: block; margin-bottom: 4px; font-family: var(--font-cairo); font-weight: 700;">${lang === 'ar' ? 'رقم الاستشارة المرجعي:' : 'Consultation Reference ID:'}</span>
                    <strong style="color: var(--color-gold); font-size: 1.15rem; letter-spacing: 1px;">${referenceId}</strong>
                </div>
                ` : ''}

                <div class="success-direct-actions" style="border-top: 1.5px dashed rgba(212, 175, 55, 0.2); padding-top: 2rem; width: 100%;">
                    <p style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 1rem; font-family: var(--font-cairo); font-weight: 700;">${window.TRANSLATIONS[lang]['form_quick_contact']}</p>
                    <div class="direct-buttons-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 380px; margin: 0 auto;">
                        <a href="https://wa.me/966500000000?text=استفسار استشارة" target="_blank" class="btn btn-direct-whatsapp" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fa-brands fa-whatsapp"></i>
                            <span>${window.TRANSLATIONS[lang]['form_whatsapp']}</span>
                        </a>
                        <a href="tel:+966500000000" class="btn btn-direct-phone" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fa-solid fa-phone"></i>
                            <span>${window.TRANSLATIONS[lang]['form_call']}</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    onLanguageChange(lang) {
        // Redraw indicator steps values if active
        const indicators = ['١', '٢', '٣'];
        const indicatorsEN = ['1', '2', '3'];
        const list = lang === 'ar' ? indicators : indicatorsEN;
        for (let i = 1; i <= 3; i++) {
            const indEl = document.getElementById(`step-ind-${i}`);
            if (indEl && !indEl.classList.contains('completed')) {
                indEl.innerText = list[i - 1];
            }
        }
        this.updateFormStepUI();
        
        // Re-render blog if active
        if (this.activePage === 'blog') {
            this.updateBlogCategoryCounts();
            this.renderBlogInitialBatch();
        }
    }

    // --- blog page logics ---
    initBlogUI() {
        this.updateBlogCategoryCounts();
        this.renderBlogInitialBatch();
        this.setupBlogInfiniteScroll();
        this.checkBlogUrlParams();
    }

    updateBlogCategoryCounts() {
        const counts = BlogService.getCategoryCounts();
        const isAR = StateManager.getState('lang') === 'ar';
        Object.keys(counts).forEach(key => {
            const el = document.getElementById(`count-${key}`);
            if (el) {
                el.innerText = isAR ? this.convertToArabicNumber(counts[key]) : counts[key];
            }
        });
    }

    convertToArabicNumber(num) {
        const arabic = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        return num.toString().replace(/[0-9]/g, (d) => arabic[d]);
    }

    renderBlogArticles(list, append = false) {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        if (!append) {
            grid.innerHTML = '';
        }

        const lang = StateManager.getState('lang');
        const isAR = lang === 'ar';

        if (list.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-light); font-weight: 700;">${window.TRANSLATIONS[lang]['blog_empty']}</div>`;
            return;
        }

        list.forEach(art => {
            const card = document.createElement("article");
            card.className = "blog-card blog-card-clickable glass-panel";
            card.onclick = () => this.openBlogArticleModal(art.id);
            
            const title = isAR ? art.title : (art.title_en || art.title);
            const excerpt = isAR ? art.excerpt : (art.excerpt_en || art.excerpt);
            const categoryName = isAR ? art.categoryName : (art.categoryName_en || art.categoryName);
            const date = isAR ? art.date : (art.date_en || art.date);
            const readMore = window.TRANSLATIONS[lang]['blog_read_more'];

            card.innerHTML = `
                <div class="blog-card-icon-area">
                    <i class="fa-solid ${art.icon}"></i>
                </div>
                <div class="blog-header">
                    <span class="blog-category" style="color: var(--color-green); font-weight: 800; font-size: 0.8rem; background: rgba(68,112,75,0.06); padding: 2px 8px; border-radius: 4px;">${categoryName}</span>
                    <span class="blog-date" style="font-size: 0.8rem; color: var(--color-text-light);"><i class="fa-regular fa-calendar" style="margin-left: 3px;"></i>${date}</span>
                </div>
                <h3 class="blog-title" style="margin-top: 1rem; font-size: 1.15rem; color: var(--color-text-dark); line-height: 1.5; font-weight: 700;">${title}</h3>
                <p class="blog-excerpt" style="margin-top: 0.75rem; font-size: 0.88rem; color: var(--color-text-light); line-height: 1.6; flex-grow: 1;">${excerpt}</p>
                <div class="blog-more" style="margin-top: 1.5rem; display: flex; align-items: center; gap: 5px; color: var(--color-gold); font-weight: 700; font-size: 0.9rem;">
                    <span>${readMore}</span>
                    <i class="fa-solid fa-arrow-left" style="font-size: 0.8rem; transition: transform 0.2s;"></i>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderBlogInitialBatch() {
        this.displayedCount = 0;
        const result = BlogService.getArticles({
            category: this.selectedCategory,
            searchQuery: this.searchQuery,
            start: 0,
            limit: this.loadBatchSize
        });
        this.displayedCount = result.articles.length;
        this.renderBlogArticles(result.articles, false);
        this.toggleBlogSpinner(result.hasMore);
    }

    loadBlogNextBatch() {
        if (this.blogIsLoading) return;
        this.blogIsLoading = true;
        this.toggleBlogSpinner(true);

        setTimeout(() => {
            const result = BlogService.getArticles({
                category: this.selectedCategory,
                searchQuery: this.searchQuery,
                start: this.displayedCount,
                limit: this.infiniteBatchSize
            });
            this.displayedCount += result.articles.length;
            this.renderBlogArticles(result.articles, true);
            this.blogIsLoading = false;
            this.toggleBlogSpinner(result.hasMore);
        }, 400);
    }

    toggleBlogSpinner(show) {
        const spinner = document.getElementById("loading-spinner");
        if (spinner) {
            spinner.classList.toggle('hidden', !show);
        }
    }

    setupBlogInfiniteScroll() {
        window.addEventListener("scroll", () => {
            if (this.activePage !== 'blog') return;
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150) {
                const result = BlogService.getArticles({
                    category: this.selectedCategory,
                    searchQuery: this.searchQuery,
                    start: this.displayedCount,
                    limit: this.infiniteBatchSize
                });
                if (result.articles.length > 0) {
                    this.loadBlogNextBatch();
                }
            }
        });
    }

    filterBlogCategory(catKey, btnEl) {
        this.selectedCategory = catKey;
        const btns = document.querySelectorAll(".category-filter-btn");
        btns.forEach(b => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        this.renderBlogInitialBatch();
    }

    handleBlogSearchInput(event) {
        this.searchQuery = event.target.value.trim();
        this.renderBlogInitialBatch();
    }

    checkBlogUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('article'));
        if (articleId) {
            this.openBlogArticleModal(articleId);
        }
    }

    openBlogArticleModal(id) {
        const article = BlogService.getArticleById(id);
        if (!article) return;

        const lang = StateManager.getState('lang');
        const isAR = lang === 'ar';

        // Filter Related Articles using BlogService
        const related = BlogService.getArticles({
            category: article.category,
            limit: 4
        }).articles.filter(a => a.id !== article.id).slice(0, 3);
        let relatedHTML = "";
        
        if (related.length > 0) {
            const relatedSectionTitle = window.TRANSLATIONS[lang]['blog_modal_related'];
            relatedHTML = `
                <div class="related-articles-section">
                    <h4 class="related-title amiri-font"><i class="fa-solid fa-link" style="margin-left: 8px; color: var(--color-gold);"></i>${relatedSectionTitle}</h4>
                    <div class="related-grid">
            `;
            related.forEach(rel => {
                const relTitle = isAR ? rel.title : (rel.title_en || rel.title);
                const relDate = isAR ? rel.date : (rel.date_en || rel.date);
                relatedHTML += `
                    <div class="related-card" onclick="window.openArticle(${rel.id})">
                        <h5 class="related-card-title">${relTitle}</h5>
                        <span style="font-size: 0.75rem; color: var(--color-text-light); margin-top: 5px; display: block;"><i class="fa-regular fa-calendar" style="margin-left: 3px;"></i>${relDate}</span>
                    </div>
                `;
            });
            relatedHTML += `
                    </div>
                </div>
            `;
        }

        const modalContent = document.getElementById("modal-article-content");
        if (modalContent) {
            const title = isAR ? article.title : (article.title_en || article.title);
            const excerpt = isAR ? article.excerpt : (article.excerpt_en || article.excerpt);
            const categoryName = isAR ? article.categoryName : (article.categoryName_en || article.categoryName);
            const date = isAR ? article.date : (article.date_en || article.date);
            const readTime = isAR ? article.readTime : (article.readTime_en || article.readTime);
            
            const readTimeLabel = window.TRANSLATIONS[lang]['blog_modal_read_time'];
            const enNotice = (isAR || article.content_en) ? '' : `<p class="en-notice" style="color: var(--color-green); font-weight: 600; font-style: italic; margin-bottom: 1rem; border-left: 3px solid var(--color-green); padding-left: 10px;">${window.TRANSLATIONS[lang]['blog_en_notice']}</p>`;

            modalContent.innerHTML = `
                <div class="modal-article-meta">
                    <span><i class="fa-solid ${article.icon}" style="color: var(--color-gold); margin-left: 5px;"></i>${categoryName}</span>
                    <span><i class="fa-regular fa-calendar" style="margin-left: 5px;"></i>${date}</span>
                    <span><i class="fa-regular fa-clock" style="margin-left: 5px;"></i>${readTimeLabel} ${readTime}</span>
                </div>
                <h3 class="modal-article-title amiri-font">${title}</h3>
                <div class="modal-article-body">
                    ${enNotice}
                    <p style="margin-bottom: 1.5rem; font-weight: 600; color: var(--color-text-dark); border-right: 4px solid var(--color-gold); padding-right: 15px; background: rgba(212,175,55,0.03); padding-top: 10px; padding-bottom: 10px;">${excerpt}</p>
                    <p>${isAR ? article.content : (article.content_en || article.content)}</p>
                </div>
                ${relatedHTML}
            `;
        }

        const modal = document.getElementById("article-modal");
        if (modal) {
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        }

        // Adjust SEO properties dynamically
        const pageTitle = isAR ? article.title : (article.title_en || article.title);
        document.title = `${pageTitle} - مكتب د. سعود الدريميح`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", isAR ? article.excerpt : (article.excerpt_en || article.excerpt));
        }

        this.updateDynamicSchema(article);

        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?article=${article.id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    closeBlogArticleModal() {
        const modal = document.getElementById("article-modal");
        if (modal) {
            modal.classList.remove("open");
            document.body.style.overflow = "auto";
        }

        document.title = StateManager.getState('lang') === 'ar' ? 
            "المدونة القانونية - مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية" :
            "Legal Blog & Regulations - Law Office of Advocate/ Dr. Saud bin Fahd Al-Duraymih for Advocacy & Legal Consultations";

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "تصفح المدونة القانونية لمكتب د. سعود بن فهد الدريميح للاطلاع على مقالات قانونية ونصوص نظامية تغطي الأنظمة التجارية والعمالية والتحكيم والتوثيق بالسعودية.");
        }

        const oldSchema = document.getElementById("dynamic-article-schema");
        if (oldSchema) oldSchema.remove();

        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: cleanUrl }, '', cleanUrl);
    }

    updateDynamicSchema(article) {
        const oldSchema = document.getElementById("dynamic-article-schema");
        if (oldSchema) oldSchema.remove();

        const schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.excerpt,
            "datePublished": "2026-06-29T18:00:00+03:00",
            "author": {
                "@type": "Person",
                "name": "د. سعود بن فهد الدريميح"
            },
            "publisher": {
                "@type": "Organization",
                "name": "مكتب المحامي/ الدكتور سعود بن فهد الدريميح للمحاماة والإستشارات القانونية",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://alduraymih-law.sa/favicon.ico"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            },
            "articleBody": article.content
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "dynamic-article-schema";
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    showNotification(title, desc) {
        const toast = document.getElementById("toast-notification");
        const tTitle = document.getElementById("toast-title");
        const tDesc = document.getElementById("toast-desc");
        if (toast && tTitle && tDesc) {
            tTitle.innerText = title;
            tDesc.innerText = desc;
            toast.classList.add("show");
            
            setTimeout(() => {
                toast.classList.remove("show");
            }, 4500);
        }
    }
}

// Utility Debounce Helper
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 11. Experience Manager (Core Application Bootstrap)
class ExperienceManager {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        
        StateManager.init();
        ThemeManager.init();
        LanguageManager.init();

        const canvasContainer = document.getElementById("three-container");
        if (canvasContainer && hasWebGL()) {
            this.scene = new SceneManager(canvasContainer);
            this.morph = new MorphEngine(this.scene, this.isMobile);
            this.particles = new ParticleSystem(this.scene, this.isMobile);
            this.animation = new AnimationManager(this);
            
            this.setupRenderingLoop();
        } else {
            console.warn("WebGL unsupported or canvas container not present on page. Morphing engine skipped.");
            const fallback = document.getElementById("three-fallback");
            if (fallback) {
                fallback.classList.remove("fallback-hidden");
            }
        }

        // Load page interaction bindings
        this.ui = new UIManager();
    }

    setupRenderingLoop() {
        window.isRenderingActive = true;
        
        const container = document.getElementById("three-container");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                window.isRenderingActive = entry.isIntersecting;
                if (window.isRenderingActive && this.animation) {
                    this.animation.lastTime = performance.now();
                    requestAnimationFrame((t) => this.tick(t));
                }
            });
        }, { threshold: 0.05 });
        
        if (container) observer.observe(container);

        document.addEventListener("visibilitychange", () => {
            window.isRenderingActive = !document.hidden;
            if (window.isRenderingActive && this.animation) {
                this.animation.lastTime = performance.now();
                requestAnimationFrame((t) => this.tick(t));
            }
        });

        // Trigger first frame
        requestAnimationFrame((t) => this.tick(t));

        // Window resize binding
        window.addEventListener("resize", debounce(() => {
            if (!this.scene) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            this.scene.resize(width, height);
            
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== this.isMobile) {
                this.isMobile = newIsMobile;
                this.scene.isMobile = this.isMobile;
                this.morph.isMobile = this.isMobile;
                this.morph.rebuild();
                this.particles.isMobile = this.isMobile;
                this.particles.rebuild();
            }
        }, 150));
    }

    tick(currentTime) {
        if (!window.isRenderingActive) return;
        requestAnimationFrame((t) => this.tick(t));
        
        if (this.animation) {
            this.animation.tick(currentTime);
        }
        if (this.scene) {
            this.scene.render();
        }
    }
}

// WebGL support helper
function hasWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

// 12. Universal Exposes for HTML bindings
function openConsultationModal() {
    const modal = document.getElementById("consultation-modal");
    if (modal) {
        modal.classList.add("open");
        setupModalFocusTrap(modal);
    }
}

function closeConsultationModal() {
    const modal = document.getElementById("consultation-modal");
    if (modal) modal.classList.remove("open");
}

function toggleMobileMenu() {
    const panel = document.getElementById("mobile-menu-panel");
    if (panel) {
        panel.classList.toggle("active");
        if (panel.classList.contains("active")) {
            setupModalFocusTrap(panel);
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function setupModalFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex="0"], a');
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    firstFocusable.focus();
    
    modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

// Field validation helper
function validateField(inputEl, regex, errorMsg) {
    if (!inputEl) return true;
    const val = inputEl.value.trim();
    const isValid = regex.test(val);
    
    // Remove old error if exists
    const oldErr = inputEl.parentNode.querySelector(".error-msg");
    if (oldErr) oldErr.remove();
    
    if (!isValid) {
        inputEl.style.borderColor = "#FF4D4D";
        const err = document.createElement("span");
        err.className = "error-msg";
        err.style.color = "#FF4D4D";
        err.style.fontSize = "0.75rem";
        err.style.marginTop = "4px";
        err.style.display = "block";
        err.innerText = errorMsg;
        inputEl.parentNode.appendChild(err);
        inputEl.setAttribute("aria-invalid", "true");
    } else {
        inputEl.style.borderColor = "";
        inputEl.setAttribute("aria-invalid", "false");
    }
    return isValid;
}

// Handles direct landing page bottom contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    const lang = StateManager.getState('lang');
    
    const nameEl = document.getElementById("contact-name");
    const phoneEl = document.getElementById("contact-phone");
    const emailEl = document.getElementById("contact-email");
    const msgEl = document.getElementById("contact-message");
    const websiteField = document.getElementById("contact-website") ? document.getElementById("contact-website").value : "";
    
    const saudiPhoneRegex = /^(00966|\+966|966|0)?5[0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isNameValid = validateField(nameEl, /^.{3,}$/, window.TRANSLATIONS[lang]['err_name']);
    const isPhoneValid = validateField(phoneEl, saudiPhoneRegex, window.TRANSLATIONS[lang]['err_phone']);
    const isEmailValid = emailEl && emailEl.value.trim() === "" ? true : validateField(emailEl, emailRegex, window.TRANSLATIONS[lang]['err_email']);
    const isMsgValid = validateField(msgEl, /^.{10,}$/, window.TRANSLATIONS[lang]['err_msg']);
    
    [nameEl, phoneEl, emailEl, msgEl].forEach(el => {
        if (el) {
            el.addEventListener("input", () => {
                el.style.borderColor = "";
                const err = el.parentNode.querySelector(".error-msg");
                if (err) err.remove();
            });
        }
    });
    
    if (!isNameValid || !isPhoneValid || !isEmailValid || !isMsgValid) {
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['form_sending']}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    
    ConsultationAPI.submit({
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        message: msgEl.value.trim(),
        website_field: websiteField
    }).then(result => {
        if (result.status === 'success') {
            renderSuccessScreen(result.referenceId);
            if (window.experience && window.experience.ui) {
                window.experience.ui.showNotification(window.TRANSLATIONS[lang]['toast_success_title'], window.TRANSLATIONS[lang]['toast_success_desc']);
            }
        } else {
            alert(result.message || "Failed to submit consultation");
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['form_submit_btn']}</span>`;
        }
    }).catch(err => {
        console.error(err);
        alert(lang === 'ar' ? 'حدث خطأ أثناء الاتصال بالسيرفر. تأكد من فتح الموقع عبر الرابط المحلي http://localhost:5000 وتشغيل السيرفر.' : 'Failed to connect to server. Make sure you open the site via http://localhost:5000 and start the server.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['form_submit_btn']}</span>`;
    });
}

function renderSuccessScreen(referenceId) {
    const panel = document.querySelector(".contact-form-panel");
    if (!panel) return;
    const lang = StateManager.getState('lang');
    panel.innerHTML = `
        <div class="success-screen-wrapper" style="text-align: center; padding: 2rem 1rem; color: var(--color-text-dark); animation: fadeInSuccess 0.5s ease-out forwards; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px;">
            <div class="success-icon-circle" style="width: 60px; height: 60px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); border: 2.5px solid #25D366; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                <i class="fa-solid fa-check" style="color: #25D366; font-size: 1.8rem;"></i>
            </div>
            <h3 class="amiri-font" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text-dark); line-height: 1.3;">${window.TRANSLATIONS[lang]['form_success_title']}</h3>
            <p style="font-size: 0.95rem; line-height: 1.7; color: var(--color-text-light); margin-bottom: 2rem; font-family: var(--font-tajawal); max-width: 420px; margin-left: auto; margin-right: auto;">
                ${window.TRANSLATIONS[lang]['form_success_desc']}
            </p>
            
            ${referenceId ? `
            <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 2rem; font-family: monospace; width: 100%; max-width: 320px;">
                <span style="font-size: 0.75rem; color: var(--color-text-light); display: block; margin-bottom: 2px; font-family: var(--font-cairo); font-weight: 700;">${lang === 'ar' ? 'رقم الاستشارة المرجعي:' : 'Consultation Reference ID:'}</span>
                <strong style="color: var(--color-gold); font-size: 1.05rem; letter-spacing: 1px;">${referenceId}</strong>
            </div>
            ` : ''}

            <div class="success-direct-actions" style="border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 1.5rem; width: 100%;">
                <p style="font-size: 0.8rem; color: var(--color-text-light); margin-bottom: 0.75rem; font-family: var(--font-cairo); font-weight: 700;">${window.TRANSLATIONS[lang]['form_quick_contact']}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 320px; margin: 0 auto;">
                    <a href="https://wa.me/966500000000?text=أود الاستفسار عن استشارة قانونية" target="_blank" class="btn" style="background-color: #25D366 !important; color: #FFFFFF !important; border: 1px solid #25D366 !important; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; font-family: var(--font-cairo); border-radius: 4px; padding: 0.65rem 0.5rem; text-decoration: none; font-size: 0.85rem;">
                        <i class="fa-brands fa-whatsapp"></i>
                        <span>${window.TRANSLATIONS[lang]['form_whatsapp']}</span>
                    </a>
                    <a href="tel:+966500000000" class="btn" style="background-color: transparent !important; color: var(--color-green) !important; border: 1.5px solid var(--color-green) !important; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; font-family: var(--font-cairo); border-radius: 4px; padding: 0.65rem 0.5rem; text-decoration: none; font-size: 0.85rem;">
                        <i class="fa-solid fa-phone"></i>
                        <span>${window.TRANSLATIONS[lang]['form_call']}</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Handles consultation request modal submission
function handleModalSubmit(event) {
    event.preventDefault();
    const lang = StateManager.getState('lang');
    
    const nameEl = document.getElementById("modal-name");
    const phoneEl = document.getElementById("modal-phone");
    const emailEl = document.getElementById("modal-email");
    const serviceEl = document.getElementById("modal-service");
    const descEl = document.getElementById("modal-desc");
    const websiteField = document.getElementById("modal-website") ? document.getElementById("modal-website").value : "";
    
    const saudiPhoneRegex = /^(00966|\+966|966|0)?5[0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isNameValid = validateField(nameEl, /^.{3,}$/, window.TRANSLATIONS[lang]['err_name']);
    const isPhoneValid = validateField(phoneEl, saudiPhoneRegex, window.TRANSLATIONS[lang]['err_phone']);
    const isEmailValid = emailEl && emailEl.value.trim() === "" ? true : validateField(emailEl, emailRegex, window.TRANSLATIONS[lang]['err_email']);
    const isDescValid = validateField(descEl, /^.{10,}$/, window.TRANSLATIONS[lang]['err_msg']);
    
    [nameEl, phoneEl, emailEl, descEl].forEach(el => {
        if (el) {
            el.addEventListener("input", () => {
                el.style.borderColor = "";
                const err = el.parentNode.querySelector(".error-msg");
                if (err) err.remove();
            });
        }
    });
    
    if (!isNameValid || !isPhoneValid || !isEmailValid || !isDescValid) {
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['form_sending']}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    
    const serviceText = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : "";

    ConsultationAPI.submit({
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        service: serviceText,
        message: descEl.value.trim(),
        website_field: websiteField
    }).then(result => {
        if (result.status === 'success') {
            closeConsultationModal();
            const successDesc = result.fallback ? 
                window.TRANSLATIONS[lang]['toast_registered_desc'] : 
                `${window.TRANSLATIONS[lang]['toast_success_desc']} (${lang === 'ar' ? 'رقم الطلب:' : 'Ref:'} ${result.referenceId})`;
            
            if (window.experience && window.experience.ui) {
                window.experience.ui.showNotification(window.TRANSLATIONS[lang]['toast_success_title'], successDesc);
            }
        } else {
            alert(result.message || "Failed to submit consultation");
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['modal_submit_btn']}</span>`;
        }
    }).catch(err => {
        console.error(err);
        alert(lang === 'ar' ? 'حدث خطأ أثناء الاتصال بالسيرفر. تأكد من فتح الموقع عبر الرابط المحلي http://localhost:5000 وتشغيل السيرفر.' : 'Failed to connect to server. Make sure you open the site via http://localhost:5000 and start the server.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${window.TRANSLATIONS[lang]['modal_submit_btn']}</span>`;
    });
}

// Binds contacts page step navigation callbacks
function changeStep(stepChange) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.changeFormStep(stepChange);
    }
}

function handleFormSubmit(e) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.handleContactPageSubmit(e);
    }
}

// Binds blog page filter/search callbacks
function filterCategory(catKey, btnEl) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.filterBlogCategory(catKey, btnEl);
    }
}

function handleSearch(event) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.handleBlogSearchInput(event);
    }
}

function openArticle(id) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.openBlogArticleModal(id);
    }
}

function closeArticleModal() {
    if (window.experience && window.experience.ui) {
        window.experience.ui.closeBlogArticleModal();
    }
}

function handleModalBackdropClick(event) {
    if (event.target === document.getElementById("article-modal")) {
        closeArticleModal();
    }
}

function removeFile(index) {
    if (window.experience && window.experience.ui) {
        window.experience.ui.removeFile(index);
    }
}

// Bind universal handlers to window
window.openConsultationModal = openConsultationModal;
window.closeConsultationModal = closeConsultationModal;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.handleContactSubmit = handleContactSubmit;
window.handleModalSubmit = handleModalSubmit;
window.changeStep = changeStep;
window.handleFormSubmit = handleFormSubmit;
window.filterCategory = filterCategory;
window.handleSearch = handleSearch;
window.openArticle = openArticle;
window.closeArticleModal = closeArticleModal;
window.handleModalBackdropClick = handleModalBackdropClick;
window.removeFile = removeFile;

// Helper to overwrite hardcoded settings from the database dynamically
function applyDynamicSettings(settings) {
    if (!settings) return;
    const lang = (window.StateManager && window.StateManager.getState('lang')) || 'ar';
    const isAR = lang !== 'en';

    // 1. Direct phone link and text
    if (settings.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.href = `tel:${settings.phone}`;
            if (el.textContent.includes('+') || el.textContent.includes('05')) {
                el.textContent = settings.phone;
            }
        });
        document.querySelectorAll('.contact-phone-text').forEach(el => {
            el.textContent = settings.phone;
        });
    }

    // 2. Direct WhatsApp links (retains message strings)
    if (settings.whatsapp) {
        document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
            const rawTextMatch = el.href.match(/text=([^&]+)/);
            const textParam = rawTextMatch ? decodeURIComponent(rawTextMatch[1]) : '';
            el.href = `https://wa.me/${settings.whatsapp}${textParam ? '?text=' + encodeURIComponent(textParam) : ''}`;
        });
    }

    // 3. Email fields
    if (settings.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
            el.href = `mailto:${settings.email}`;
            if (el.textContent.includes('@')) {
                el.textContent = settings.email;
            }
        });
        document.querySelectorAll('.email-text').forEach(el => {
            el.textContent = settings.email;
        });
    }

    // 4. Working hours
    const hoursVal = isAR ? settings.office_hours_ar : settings.office_hours_en;
    if (hoursVal) {
        document.querySelectorAll('[data-i18n="working_hours"], .working-hours, .hours-text').forEach(el => {
            el.textContent = hoursVal;
        });
    }

    // 5. Office Address
    const addressVal = isAR ? settings.address_ar : settings.address_en;
    if (addressVal) {
        document.querySelectorAll('[data-i18n="office_address"], [data-i18n="contact_loc_val"], .address-text, .office-address').forEach(el => {
            el.textContent = addressVal;
        });
    }

        // 6. Header/Footer Logo replacements
    if (settings.logo_dark) {
        document.querySelectorAll('img[src*="logo-dark"]').forEach(el => {
            el.src = settings.logo_dark; // served from the public server/uploads/media
        });
    }
    if (settings.logo_light) {
        document.querySelectorAll('img[src*="logo-light"]').forEach(el => {
            el.src = settings.logo_light;
        });
    }

    // 8. Dynamic Hero Title & Subtitle replacements
    const heroTitleVal = isAR ? settings.hero_title_ar : settings.hero_title_en;
    if (heroTitleVal) {
        document.querySelectorAll('[data-i18n="hero_title"]').forEach(el => {
            el.textContent = heroTitleVal;
        });
    }
    const heroSubtitleVal = isAR ? settings.hero_subtitle_ar : settings.hero_subtitle_en;
    if (heroSubtitleVal) {
        document.querySelectorAll('[data-i18n="hero_subtitle"]').forEach(el => {
            el.textContent = heroSubtitleVal;
        });
    }
    if (settings.hero_subtitle_en) {
        const subEn = document.getElementById('hero-subtitle-en-sub');
        if (subEn) {
            subEn.textContent = settings.hero_subtitle_en;
        }
    }

    // 7. Dynamic SEO Updates
    const titleVal = isAR ? settings.meta_title_ar : settings.meta_title_en;
    if (titleVal) {
        document.title = titleVal;
    }
    const descVal = isAR ? settings.meta_description_ar : settings.meta_description_en;
    if (descVal) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', descVal);
        }
    }
}

function renderDynamicServices() {
    const grids = document.querySelectorAll('.services-cards-grid');
    if (grids.length === 0 || !window.services) return;

    const lang = (typeof StateManager !== 'undefined' && StateManager.getState('lang')) || 'ar';
    const isEN = lang === 'en';

    grids.forEach(grid => {
        grid.innerHTML = '';

        const activeServices = window.services
            .filter(s => s.isActive)
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

        activeServices.forEach(s => {
            const title = isEN ? (s.titleEn || s.titleAr) : (s.titleAr || s.titleEn);
            const desc = isEN ? (s.descriptionEn || s.descriptionAr) : (s.descriptionAr || s.descriptionEn);
            const cta = isEN ? 'Read More' : 'اقرأ المزيد';
            
            const isServicesPage = window.location.pathname.includes('services.html');
            const ctaLink = isServicesPage ? 'contact.html' : `services.html#${s.slug}`;

            const card = document.createElement('div');
            card.className = 'service-card glass-panel';
            card.style.cssText = `padding: 2.5rem 2rem; border-radius: 20px; transition: var(--transition-premium); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 1.2rem; min-height: 320px; border: 1px solid rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);`;
            
            card.innerHTML = `
                <div class="service-icon" style="width: 60px; height: 60px; border-radius: 15px; background: rgba(68, 112, 75, 0.1); border: 2px solid var(--color-green); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--color-green);">
                    <i class="fa-solid ${s.icon || 'fa-scale-balanced'}"></i>
                </div>
                <h3 class="service-title" style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-dark); margin: 0; font-family: var(--font-cairo);">${title}</h3>
                <p class="service-desc" style="font-size: 0.95rem; color: var(--color-text-light); line-height: 1.7; margin: 0; flex-grow: 1;">${desc}</p>
                <a href="${ctaLink}" class="btn-text-gold" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--color-gold); text-decoration: none; font-size: 0.9rem;">
                    <span>${cta}</span>
                    <i class="fa-solid ${isEN ? 'fa-arrow-right' : 'fa-arrow-left'}" style="font-size: 0.8rem;"></i>
                </a>
            `;
            grid.appendChild(card);
        });
    });
}

function renderDynamicFAQs() {
    const container = document.getElementById('faqs-accordion-container');
    if (!container || !window.faqs) return;

    const lang = (typeof StateManager !== 'undefined' && StateManager.getState('lang')) || 'ar';
    const isEN = lang === 'en';

    container.innerHTML = '';

    const activeFaqs = window.faqs
        .filter(f => f.isActive)
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    if (activeFaqs.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--color-text-light); font-size: 1rem;">${isEN ? 'No FAQs available.' : 'لا تتوفر أسئلة شائعة حالياً.'}</p>`;
        return;
    }

    activeFaqs.forEach((f, idx) => {
        const question = isEN ? (f.questionEn || f.questionAr) : (f.questionAr || f.questionEn);
        const answer = isEN ? (f.answerEn || f.answerAr) : (f.answerAr || f.answerEn);

        const item = document.createElement('div');
        item.className = 'faq-accordion-item';
        if (idx === 0) {
            item.className += ' active';
        }

        item.innerHTML = `
            <div class="faq-accordion-header">
                <h4 class="faq-accordion-title">${question}</h4>
                <div class="faq-accordion-icon"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="faq-accordion-content" style="${idx === 0 ? 'max-height: 200px;' : ''}">
                <p class="faq-accordion-answer">${answer}</p>
            </div>
        `;

        const header = item.querySelector('.faq-accordion-header');
        const content = item.querySelector('.faq-accordion-content');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            container.querySelectorAll('.faq-accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-accordion-content').style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        container.appendChild(item);
        
        if (idx === 0) {
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            }, 100);
        }
    });
}

// Initialize Core Application asynchronously
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch and compile dynamic website configurations
    try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success) {
            applyDynamicSettings(json.settings);
            window.websiteSettings = json.settings;
        }
    } catch (err) {
        console.error("Failed to load settings from API, using default layout:", err);
    }

    // Fetch and render dynamic services
    try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success) {
            window.services = json.services;
            renderDynamicServices();
            if (typeof StateManager !== 'undefined') {
                StateManager.subscribe('lang', () => {
                    renderDynamicServices();
                });
            }
        }
    } catch (err) {
        console.error("Failed to load services from API:", err);
    }

    // Fetch and render dynamic FAQs
    try {
        const res = await fetch('/api/faqs');
        const json = await res.json();
        if (json.success) {
            window.faqs = json.faqs;
            renderDynamicFAQs();
            if (typeof StateManager !== 'undefined') {
                StateManager.subscribe('lang', () => {
                    renderDynamicFAQs();
                });
            }
        }
    } catch (err) {
        console.error("Failed to load FAQs from API:", err);
    }

    // 2. Fetch all published blog articles
    try {
        const res = await fetch('/api/blog?limit=100');
        const json = await res.json();
        if (json.success) {
            window.blogArticles = json.articles.map(art => {
                const isAR = (typeof StateManager !== 'undefined' && StateManager.getState('lang')) !== 'en';
                return {
                    id: art.id,
                    title: art.titleAr,
                    title_en: art.titleEn,
                    excerpt: art.excerptAr,
                    excerpt_en: art.excerptEn,
                    content: art.contentAr,
                    content_en: art.contentEn,
                    category: art.category.slug,
                    categoryName: art.category.nameAr,
                    categoryName_en: art.category.nameEn,
                    date: new Date(art.publishedAt || art.createdAt).toLocaleDateString(isAR ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                    date_en: new Date(art.publishedAt || art.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                    readTime: art.readTimeAr || '١٠ دقائق',
                    readTime_en: art.readTimeEn || '10 mins',
                    icon: art.icon,
                    image: art.imagePath || `images/blog/dynamic-${art.category.slug}.jpg`,
                    slug: art.slug,
                    keywords: art.keywords,
                    tags: art.tags,
                    featured: art.isFeatured
                };
            });
        }
    } catch (err) {
        console.error("Failed to load blog data from API, using default fallback:", err);
    }

    window.experience = new ExperienceManager();
});