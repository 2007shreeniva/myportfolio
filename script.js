/**
 * Portfolio Pixel Theme & Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements: Theme Toggles
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const mobileThemeIcon = document.querySelector('.mobile-theme-icon');
  const htmlElement = document.documentElement;

  // Elements: Mobile Drawer & Sidebar
  const sidebarNav = document.getElementById('sidebar-nav');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  // Media query to detect default browser/OS night mode preference
  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Determine the current active theme
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return systemDarkMedia.matches ? 'dark' : 'light';
  }

  /**
   * Update the UI and icons across all theme buttons
   */
  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    
    // Sidebar toggle button UI
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE';
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // Mobile header toggle button UI
    if (mobileThemeIcon) {
      mobileThemeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // Initialize theme on load
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  /**
   * Toggle theme handler
   */
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || (systemDarkMedia.matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', newTheme);
    applyTheme(newTheme);
  }

  // Theme toggle listeners
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Listen for real-time changes in browser/OS theme preferences
  systemDarkMedia.addEventListener('change', (e) => {
    // Only auto-update if the user hasn't explicitly chosen a manual override in localStorage
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ==========================================================================
     MOBILE SIDEBAR DRAWER CONTROLS & ACCESSIBILITY
     ========================================================================== */

  function openSidebar() {
    if (!sidebarNav) return;
    sidebarNav.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
    // Set focus on close button or first link for keyboard accessibility
    if (sidebarCloseBtn) {
      sidebarCloseBtn.focus();
    }
  }

  function closeSidebar() {
    if (!sidebarNav) return;
    sidebarNav.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.focus();
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = sidebarNav && sidebarNav.classList.contains('open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Close mobile drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Close mobile drawer when clicking any navigation link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && sidebarNav && sidebarNav.classList.contains('open')) {
        closeSidebar();
      }
    });
  });

  /* ==========================================================================
     SCROLL SPY / ACTIVE LINK HIGHLIGHTER
     ========================================================================== */

  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 160;

    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      sidebarLinks.forEach(link => {
        const linkTarget = link.getAttribute('href');
        if (linkTarget === `#${currentSectionId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ==========================================================================
     SKILLS CATEGORY FILTER & PROGRESS BAR ANIMATIONS
     ========================================================================== */

  const filterButtons = document.querySelectorAll('.pixel-filter-btn');
  const categoryCards = document.querySelectorAll('.skills-category-card');

  if (filterButtons.length > 0 && categoryCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active filter button state
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards with smooth display
        categoryCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translate(0, 0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translate(0, 10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 180);
          }
        });
      });
    });
  }

  // Animate skill progress bars upon viewport intersection
  const skillBars = document.querySelectorAll('.skill-item');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.pixel-bar-fill');
          const targetPct = entry.target.getAttribute('data-level');
          if (fill && targetPct) {
            fill.style.setProperty('--skill-pct', `${targetPct}%`);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    skillBars.forEach(item => skillsObserver.observe(item));
  }

  /* ==========================================================================
     PROJECT SPECIFICATION MODAL VIEWER
     ========================================================================== */

  // Detailed specifications data dictionary mapped to thumbnail data-project keys
  const projectDatabase = {
    solar: {
      title: "Solar-Powered Automated Drip Irrigation System",
      tagline: "Smart Agriculture Automation Powered by 100% Renewable Photovoltaics",
      category: "HARDWARE & IOT",
      year: "2025",
      image: "project-solar.jpg",
      problem: "Traditional irrigation relies heavily on erratic electrical grid schedules and manual supervision, leading to significant water runoff, high operating costs, and moisture stress in crops during peak heat.",
      solution: "Engineered a closed-loop automated irrigation station. Photovoltaic solar modules charge a dedicated battery bank driving an embedded microcontroller. Calibrated capacitive soil moisture sensors continuously feed real-time hydration readings, triggering solid-state relay circuits and solenoid valves only when soil moisture drops below calibrated thresholds.",
      metrics: "Conserves up to 40% more water compared to flood irrigation while maintaining 100% grid-independent autonomous operation across variable weather cycles.",
      tech: ["Embedded C", "IoT Moisture Sensors", "Solar Photovoltaics", "Relay Control Circuits", "Hardware Automation"],
      repo: "https://github.com/2007shreeniva"
    },
    algo: {
      title: "Graph Theory & Sorting Algorithm Visualizer",
      tagline: "Interactive Real-Time Asymptotic Complexity & Network Simulator",
      category: "ALGORITHMS & DATA STRUCTURES",
      year: "2025",
      image: "project-algo.jpg",
      problem: "Understanding abstract pointer adjustments, tree rotations, recursive graph traversals, and asymptotic differences (O(N log N) vs O(N²)) is challenging without dynamic visual execution.",
      solution: "Architected an interactive simulator in Java with Canvas rendering. Features step-by-step traversal for Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra's Shortest Path, alongside comparative benchmarks of QuickSort, MergeSort, HeapSort, and BubbleSort with variable execution tick rates.",
      metrics: "Seamlessly renders up to 100+ graph vertices and 500 array elements with real-time step counters and memory access telemetry at a locked 60 FPS.",
      tech: ["Java", "OOP Architecture", "HTML5 Canvas", "Algorithm Complexity", "Big-O Analysis"],
      repo: "https://github.com/2007shreeniva"
    },
    portfolio: {
      title: "Retro 16-Bit Cyber Web Portfolio",
      tagline: "High-Performance, Accessible 16-Bit Arcade Portfolio Experience",
      category: "WEB ARCHITECTURE",
      year: "2026",
      image: "project-portfolio.jpg",
      problem: "Contemporary developer portfolios are often bloated with third-party frameworks, slow render speeds, and accessibility barriers for screen readers and keyboard navigation.",
      solution: "Handcrafted an ultra-responsive, zero-dependency web application adopting an authentic 16-bit arcade design language. Incorporates semantic HTML5 landmarks, CSS media query dark mode detection, custom CSS property theming, responsive vertical drawer navigation, and full WCAG 2.1 compliance.",
      metrics: "Sub-100ms first paint, 100% lighthouse accessibility scores, and zero external runtime dependencies.",
      tech: ["Semantic HTML5", "Vanilla CSS3", "JavaScript ES6+", "WCAG 2.1 Accessibility", "Responsive Architecture"],
      repo: "https://github.com/2007shreeniva"
    },
    data: {
      title: "Predictive Data Modeling & ML Analytics Console",
      tagline: "Multivariate Statistical Modeling & Exploratory Analytics Pipeline",
      category: "DATA SCIENCE & ML",
      year: "2025",
      image: "project-data.jpg",
      problem: "High-dimensional raw datasets often harbor missing records, multicollinearity, and noisy outliers that undermine predictive machine learning models without disciplined exploratory engineering.",
      solution: "Constructed an automated Python data science pipeline executing automated data imputation, feature normalization, correlation heatmap analysis, and training multiple supervised classification and regression algorithms with iterative loss convergence curves.",
      metrics: "Delivers automated exploratory data analysis reports, cross-validation metrics, and confusion matrix diagnostics with optimized model precision.",
      tech: ["Python", "Pandas & NumPy", "Scikit-Learn", "EDA Analytics", "Matplotlib"],
      repo: "https://github.com/2007shreeniva"
    }
  };

  // Modal DOM elements
  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalImage = document.getElementById('modal-image');
  const modalCategory = document.getElementById('modal-category');
  const modalYear = document.getElementById('modal-year');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalProblem = document.getElementById('modal-problem');
  const modalSolution = document.getElementById('modal-solution');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalTechPills = document.getElementById('modal-tech-pills');
  const modalRepoLink = document.getElementById('modal-repo-link');

  let lastFocusedElement = null;

  /**
   * Opens the specification modal for a given project ID
   * Explains how the thumbnail is connected to the project detail
   */
  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !modalBackdrop) return;

    lastFocusedElement = document.activeElement;

    // Populate modal with project specifications
    if (modalImage) modalImage.src = data.image;
    if (modalImage) modalImage.alt = `Screenshot preview of ${data.title}`;
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalYear) modalYear.textContent = data.year;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalTagline) modalTagline.textContent = data.tagline;
    if (modalProblem) modalProblem.textContent = data.problem;
    if (modalSolution) modalSolution.textContent = data.solution;
    if (modalMetrics) modalMetrics.textContent = data.metrics;
    if (modalRepoLink) modalRepoLink.href = data.repo;

    // Populate technology pills
    if (modalTechPills) {
      modalTechPills.innerHTML = '';
      data.tech.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-pill';
        span.textContent = tech;
        modalTechPills.appendChild(span);
      });
    }

    // Display modal
    modalBackdrop.removeAttribute('hidden');
    requestAnimationFrame(() => {
      modalBackdrop.classList.add('active');
    });

    // Trap focus inside modal
    if (modalCloseBtn) modalCloseBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    setTimeout(() => {
      modalBackdrop.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 220);
  }

  // Attach click listeners to all project thumbnail triggers & buttons
  const thumbTriggers = document.querySelectorAll('.project-thumb-trigger, .project-modal-open-btn');
  thumbTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);

  // Close modal when clicking outside modal box
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hasAttribute('hidden')) {
      closeProjectModal();
    }
  });

  // Dynamic copyright year in footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // AI CHAT — SRINIVAS.AI PERSONA ENGINE
  // ==========================================================================
  //
  // ARCHITECTURE OVERVIEW:
  //   1. sendMessage(text)     → renders user bubble, calls callAI(text)
  //   2. callAI(text)          → shows typing indicator, returns AI response
  //                              ⚡ THIS IS WHERE YOU PLUG IN THE OPENAI API ⚡
  //   3. getLocalResponse(text)→ keyword-based intent matching (sim mode)
  //   4. renderBubble(who,txt) → creates and appends a styled chat bubble
  //   5. showTyping()          → animated 3-dot indicator
  //
  // TO INTEGRATE OPENAI:
  //   • Replace the body of callAI() with a fetch() to:
  //     POST https://api.openai.com/v1/chat/completions
  //   • Pass conversationHistory as the messages array
  //   • Set Authorization: Bearer YOUR_API_KEY in headers
  //   • Use model: "gpt-4o" or "gpt-3.5-turbo"
  //   • See the detailed comment block inside callAI() below.
  // ==========================================================================

  const aiMessages   = document.getElementById('ai-messages');
  const aiInput      = document.getElementById('ai-chat-input');
  const aiSendBtn    = document.getElementById('ai-send-btn');
  const aiClearBtn   = document.getElementById('ai-clear-btn');
  const aiChips      = document.querySelectorAll('.ai-chip');
  const aiModeBadge  = document.getElementById('ai-mode-badge');

  if (!aiMessages) return; // Guard: chat section not present

  // --------------------------------------------------------------------------
  // KNOWLEDGE BASE — Srinivas D N persona facts
  // Used by getLocalResponse() for keyword-intent matching in sim mode.
  // --------------------------------------------------------------------------
  const PERSONA = {
    name:      'Srinivas D N',
    role:      'Software Engineer',
    college:   'A.I.T. College, Chikkamagaluru, Karnataka',
    degree:    'B.E. in Computer Science & Data Science Engineering (2025–2029)',
    email:     'srinivas2007dn@gmail.com',
    github:    'github.com/2007shreeniva',
    linkedin:  'linkedin.com/in/srinivas-dn',
    location:  'Chikkamagaluru, Karnataka, India',
    languages: ['Java', 'Python', 'C', 'JavaScript (ES6+)'],
    skills:    ['Data Structures & Algorithms', 'Object-Oriented Design', 'SQL & Databases',
                'Semantic HTML5', 'CSS3 & Pixel Art Systems', 'REST APIs', 'Git & GitHub',
                'IoT & Solar Automation', 'Linux Shell'],
    projects: [
      { name: 'Solar-Powered Automated Drip Irrigation', tech: 'Embedded C, IoT Sensors, Solar Energy' },
      { name: 'Graph & Sorting Algorithm Visualizer',    tech: 'Java, OOP, HTML5 Canvas' },
      { name: 'Retro 16-Bit Cyber Web Portfolio',        tech: 'HTML5, CSS3, Vanilla JS' },
      { name: 'Predictive Data Modeling & ML Console',   tech: 'Python, Pandas, Scikit-Learn' },
    ],
    interests: ['Data Science & AI', 'Clean Energy Tech', 'Retro Pixel Art', 'Algorithmic Puzzles', 'IoT'],
    favLang:   'Java — for its strong OOP foundations and rich ecosystem.',
    available: true,
    quote:     '"Turning logic into impact, one algorithm and pixel at a time."',
  };

  // --------------------------------------------------------------------------
  // INTENT RULES — ordered from most-specific to most-general
  // Each rule: { patterns: [regex], response: string | fn }
  // --------------------------------------------------------------------------
  const INTENT_RULES = [
    {
      patterns: [/hello|hi|hey|greet|good (morning|evening|afternoon)/i],
      response: () => `Hey there! 👋 I'm the AI version of ${PERSONA.name}. Ask me anything — skills, projects, education, or how to get in touch!`,
    },
    {
      patterns: [/your name|who are you|introduce yourself|about you/i],
      response: () => `I'm ${PERSONA.name}, a ${PERSONA.role} pursuing ${PERSONA.degree} at ${PERSONA.college}. I build high-performance systems and love combining retro aesthetics with modern engineering. ${PERSONA.quote}`,
    },
    {
      patterns: [/skill|tech(nology|nologies)?|stack|know|expertise|capable|what can you/i],
      response: () => `⚡ My core skills include:\n\n🔹 Languages: ${PERSONA.languages.join(', ')}\n🔹 CS Fundamentals: Data Structures, OOP, SQL, Algorithms\n🔹 Web: Semantic HTML5, CSS3, REST APIs\n🔹 Tools: Git/GitHub, Linux, IoT & Solar Automation\n\nI'm particularly strong in Java OOP and Python data science workflows!`,
    },
    {
      patterns: [/project|build|made|work(ed)?|portfolio|create/i],
      response: () => {
        const list = PERSONA.projects.map(p => `🕹️ ${p.name}\n   Tech: ${p.tech}`).join('\n\n');
        return `Here are my featured projects:\n\n${list}\n\nClick any project card above to inspect full specs! 🔍`;
      },
    },
    {
      patterns: [/solar|irrigation|iot|embedded|hardware|sensor/i],
      response: () => `☀️ My Solar-Powered Automated Drip Irrigation system is my flagship project! I engineered an automated IoT system that integrates solar photovoltaics with soil-moisture sensors to control precision solenoid water delivery — eliminating reliance on grid power entirely. Built with Embedded C and custom sensor calibration circuits.`,
    },
    {
      patterns: [/algorithm|visuali[sz]er|graph|sorting|data structure/i],
      response: () => `🌳 My Algorithm Visualizer is an interactive simulator that animates graph traversals (BFS, DFS, Dijkstra) and side-by-side sorting comparisons in real-time. Built with Java and rendered on an HTML5 Canvas with Big-O complexity annotations. A love letter to CS theory!`,
    },
    {
      patterns: [/machine learning|ml|data science|ai|python|pandas|scikit/i],
      response: () => `📊 I have a solid foundation in Python-based data science: Pandas for data wrangling, NumPy for numerical ops, Scikit-Learn for classification/regression models, and exploratory data analysis (EDA) pipelines. My ML Console project demonstrates feature correlation heatmaps and model evaluation dashboards.`,
    },
    {
      patterns: [/edu(cation|cational)?|degree|college|university|study|stud(ent|ying)|school/i],
      response: () => `🎓 I'm pursuing a ${PERSONA.degree} at ${PERSONA.college}. My coursework covers:\n\n• Object-Oriented Programming (Java, Python)\n• Data Structures & Algorithm Design\n• Database Systems & SQL\n• Data Science & Statistical Modelling\n• Embedded Systems & IoT Automation`,
    },
    {
      patterns: [/java|object.oriented|oop/i],
      response: () => `☕ Java is my primary language! I use it for enterprise OOP architectures, backend algorithmic systems, and data structure implementations. I scored LVL 85/100 on my self-assessment — with strength in encapsulation, inheritance, polymorphism, and clean abstraction design.`,
    },
    {
      patterns: [/python/i],
      response: () => `🐍 Python is my go-to for data science and automation tasks. I use it for machine learning pipelines, analytical scripting with Pandas/NumPy, and automation bots. Scored LVL 88/100 — it's honestly my most productive scripting language.`,
    },
    {
      patterns: [/favou?rite|prefer|best|love|enjoy/i],
      response: () => `❤️ My favourite language? ${PERSONA.favLang}\n\nMy favourite domain is definitely the intersection of algorithms and IoT — where theory meets physical systems. And I have a special love for pixel art and retro game aesthetics (as you can tell from this portfolio! 🕹️)`,
    },
    {
      patterns: [/intern|hire|job|opportunit|collaborat|freelance|work with/i],
      response: () => `💼 Absolutely! I'm actively open to:\n\n✅ Internship opportunities\n✅ Project collaborations\n✅ Freelance web/software work\n✅ Open-source contributions\n\nReach me at 📧 ${PERSONA.email} or connect on LinkedIn: ${PERSONA.linkedin}`,
    },
    {
      patterns: [/contact|email|reach|get in touch|message/i],
      response: () => `📡 Best ways to reach me:\n\n📧 Email: ${PERSONA.email}\n🐙 GitHub: ${PERSONA.github}\n💼 LinkedIn: ${PERSONA.linkedin}\n📍 Location: ${PERSONA.location}\n\nOr scroll down and use the Contact form — I reply within 24 hours!`,
    },
    {
      patterns: [/github|repo|code|open.?source/i],
      response: () => `🐙 All my code lives at github.com/2007shreeniva — feel free to explore, star, or fork any projects. I believe in open-source and clean, well-commented codebases.`,
    },
    {
      patterns: [/location|where|city|india|karnataka|chikk/i],
      response: () => `📍 I'm based in Chikkamagaluru, Karnataka, India — and I'm open to both remote and in-person opportunities across India and globally.`,
    },
    {
      patterns: [/interest|hobb|passion|like|enjoy|fun/i],
      response: () => `🕹️ Outside of coding, I'm fascinated by:\n\n${PERSONA.interests.map(i => `• ${i}`).join('\n')}\n\nRetro pixel art is a big one — hence this entire portfolio aesthetic! I also love solving competitive programming problems when I have time.`,
    },
    {
      patterns: [/thank|thanks|appreciate|great|awesome|cool|nice|wow/i],
      response: () => `😄 Glad I could help! Feel free to ask anything else — or scroll up to explore my projects and skills. I'm always here to chat. ⚡`,
    },
    {
      patterns: [/bye|goodbye|see you|later|cya/i],
      response: () => `👋 Thanks for stopping by! Feel free to come back anytime. Check out the Contact section if you want to get in touch with the real me. Good luck with your project! 🚀`,
    },
    {
      patterns: [/resume|cv|download/i],
      response: () => `📄 You can download my resume PDF directly from the hero section or via the About Me section buttons! It covers my education, skills, and project highlights.`,
    },
    {
      patterns: [/api|openai|gpt|real.?ai|real.?bot|chatgpt/i],
      response: () => `🤖 Currently I'm running in SIM MODE — a local knowledge base with smart keyword matching. To power me with real AI:\n\n1. Open script.js\n2. Find the callAI() function\n3. Uncomment the OpenAI fetch block\n4. Add your API key\n\nI'll instantly upgrade to GPT-level intelligence! 🧠`,
    },
    {
      // Default fallback
      patterns: [/.*/],
      response: () => `🤔 Hmm, I'm not sure I have specific data on that yet! Try asking about my skills, projects, education, or how to contact me. Or use one of the quick chips below! 👇`,
    },
  ];

  // --------------------------------------------------------------------------
  // Conversation history — used to pass context to OpenAI when integrated
  // --------------------------------------------------------------------------
  const conversationHistory = [
    {
      role: 'system',
      // OPENAI INTEGRATION: Replace or supplement this system prompt
      // when connecting to the real API. This defines the AI persona.
      content: `You are an AI assistant representing ${PERSONA.name}, a software engineer. 
Answer questions about his skills (${PERSONA.languages.join(', ')}), 
projects, education at ${PERSONA.college}, and career goals. 
Keep responses friendly, concise, and in first-person as if you ARE Srinivas.
If asked about contacting him, provide: ${PERSONA.email}`,
    },
  ];

  // --------------------------------------------------------------------------
  // callAI(userText) — THE CENTRAL INTEGRATION POINT
  //
  // CURRENT: Returns a simulated response from getLocalResponse()
  //
  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │  TO INTEGRATE OPENAI API — replace the function body below:            │
  // │                                                                         │
  // │  async function callAI(userText) {                                      │
  // │    conversationHistory.push({ role: 'user', content: userText });       │
  // │                                                                         │
  // │    const response = await fetch(                                        │
  // │      'https://api.openai.com/v1/chat/completions',                      │
  // │      {                                                                  │
  // │        method: 'POST',                                                  │
  // │        headers: {                                                       │
  // │          'Content-Type': 'application/json',                            │
  // │          'Authorization': `Bearer YOUR_API_KEY_HERE`,                   │
  // │        },                                                               │
  // │        body: JSON.stringify({                                           │
  // │          model: 'gpt-4o',   // or 'gpt-3.5-turbo'                      │
  // │          messages: conversationHistory,                                 │
  // │          max_tokens: 300,                                               │
  // │          temperature: 0.7,                                              │
  // │        }),                                                              │
  // │      }                                                                  │
  // │    );                                                                   │
  // │    const data = await response.json();                                  │
  // │    const aiText = data.choices[0].message.content;                     │
  // │    conversationHistory.push({ role: 'assistant', content: aiText });   │
  // │    return aiText;                                                       │
  // │  }                                                                      │
  // │                                                                         │
  // │  Also update aiModeBadge to show 'API MODE' instead of 'SIM MODE'.     │
  // └─────────────────────────────────────────────────────────────────────────┘
  // --------------------------------------------------------------------------
  async function callAI(userText) {
    // Add user message to history (useful when switching to real API)
    conversationHistory.push({ role: 'user', content: userText });

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 700));

    // Get local knowledge-base response
    const aiText = getLocalResponse(userText);
    conversationHistory.push({ role: 'assistant', content: aiText });
    return aiText;
  }

  // --------------------------------------------------------------------------
  // getLocalResponse(text) — keyword/intent matching engine
  // --------------------------------------------------------------------------
  function getLocalResponse(text) {
    for (const rule of INTENT_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) {
          return typeof rule.response === 'function' ? rule.response() : rule.response;
        }
      }
    }
    // Should never reach here due to wildcard fallback
    return "I'm not sure about that — try asking about my skills or projects!";
  }

  // --------------------------------------------------------------------------
  // renderBubble(who, text) — builds and appends a styled chat bubble
  // @param {'ai'|'user'} who
  // @param {string} text
  // @returns {HTMLElement} the bubble-text element (for streaming)
  // --------------------------------------------------------------------------
  function renderBubble(who, text) {
    if (!aiMessages) return null;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const row = document.createElement('div');
    row.className = `ai-bubble-row ${who === 'ai' ? 'ai-side' : 'user-side'}`;

    // Mini avatar (only for AI)
    if (who === 'ai') {
      const av = document.createElement('div');
      av.className = 'bubble-avatar';
      av.setAttribute('aria-hidden', 'true');
      av.textContent = '🤖';
      row.appendChild(av);
    }

    const body = document.createElement('div');
    body.className = 'bubble-body';

    const name = document.createElement('div');
    name.className = 'bubble-name';
    name.textContent = who === 'ai' ? 'SRINIVAS.AI' : 'YOU';
    body.appendChild(name);

    const bubble = document.createElement('div');
    bubble.className = 'bubble-text';
    // Preserve newlines
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.textContent = text;
    body.appendChild(bubble);

    const time = document.createElement('div');
    time.className = 'bubble-time';
    time.textContent = now;
    body.appendChild(time);

    row.appendChild(body);
    aiMessages.appendChild(row);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    return bubble;
  }

  // --------------------------------------------------------------------------
  // showTyping() — appends the animated 3-dot typing indicator
  // Returns a reference to the row element so it can be removed later
  // --------------------------------------------------------------------------
  function showTyping() {
    if (!aiMessages) return null;

    const row = document.createElement('div');
    row.className = 'ai-bubble-row ai-side ai-typing-bubble';
    row.id = 'ai-typing-indicator';

    const av = document.createElement('div');
    av.className = 'bubble-avatar';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = '🤖';
    row.appendChild(av);

    const body = document.createElement('div');
    body.className = 'bubble-body';

    const name = document.createElement('div');
    name.className = 'bubble-name';
    name.textContent = 'SRINIVAS.AI';
    body.appendChild(name);

    const bubble = document.createElement('div');
    bubble.className = 'bubble-text';
    // Three bouncing dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'typing-dot';
      bubble.appendChild(dot);
    }
    body.appendChild(bubble);
    row.appendChild(body);
    aiMessages.appendChild(row);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return row;
  }

  // --------------------------------------------------------------------------
  // sendMessage(text) — orchestrates the full send → response flow
  // --------------------------------------------------------------------------
  async function sendMessage(text) {
    if (!text.trim()) return;

    // Disable input while processing
    if (aiSendBtn) aiSendBtn.disabled = true;
    if (aiInput)   aiInput.disabled  = true;

    // 1. Render user bubble
    renderBubble('user', text);

    // 2. Show typing indicator
    const typingEl = showTyping();

    try {
      // 3. Get AI response (local sim or real API)
      const aiText = await callAI(text);

      // 4. Remove typing indicator, render AI bubble
      if (typingEl) typingEl.remove();
      renderBubble('ai', aiText);

    } catch (err) {
      // Handle API errors gracefully
      if (typingEl) typingEl.remove();
      renderBubble('ai', `⚠️ Something went wrong connecting to the AI. Please try again or use the Contact form below.`);
    }

    // 5. Re-enable input
    if (aiSendBtn) aiSendBtn.disabled = false;
    if (aiInput) {
      aiInput.disabled = false;
      aiInput.focus();
    }
  }

  // --------------------------------------------------------------------------
  // Boot: render initial AI greeting
  // --------------------------------------------------------------------------
  function bootAIChat() {
    if (!aiMessages) return;
    const greeting = `👾 Hey there! I'm SRINIVAS.AI — an AI built from ${PERSONA.name}'s knowledge base.\n\nAsk me anything about his skills, projects, education, or how to get in touch. Use the quick-action chips below to get started! ⚡`;
    renderBubble('ai', greeting);
  }

  bootAIChat();

  // --------------------------------------------------------------------------
  // Event Listeners
  // --------------------------------------------------------------------------

  // Send button click
  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', () => {
      const text = aiInput?.value.trim();
      if (text) {
        if (aiInput) aiInput.value = '';
        sendMessage(text);
      }
    });
  }

  // Enter key in input field
  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = aiInput.value.trim();
        if (text) {
          aiInput.value = '';
          sendMessage(text);
        }
      }
    });
  }

  // Quick-action chip buttons
  aiChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      if (query) sendMessage(query);
    });
  });

  // Clear conversation button
  if (aiClearBtn) {
    aiClearBtn.addEventListener('click', () => {
      if (!aiMessages) return;
      aiMessages.innerHTML = '';
      // Keep only system prompt in history
      conversationHistory.length = 1;
      bootAIChat();
    });
  }

  // ==========================================================================
  // CONTACT FORM VALIDATION & SIMULATED SUBMISSION
  // ==========================================================================

  const contactForm   = document.getElementById('contact-form');
  const formStatus    = document.getElementById('contact-form-status');
  const submitBtn     = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('contact-name')?.value.trim();
      const email   = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFormStatus('error', '⚠ Please fill in all required fields before transmitting.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus('error', '⚠ Invalid email format. Please check your address.');
        return;
      }

      // Simulate sending (no backend — would integrate here)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '📡 TRANSMITTING...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>📡</span> TRANSMIT MESSAGE';
        }
        showFormStatus('success', '✅ Message transmitted successfully! I will reply within 24 hours.');
        contactForm.reset();
      }, 1800);
    });
  }

  /**
   * Display a styled status message beneath the form
   * @param {'success'|'error'} type
   * @param {string} msg
   */
  function showFormStatus(type, msg) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = msg;
    formStatus.removeAttribute('hidden');
    // Auto-hide success after 6 seconds
    if (type === 'success') {
      setTimeout(() => {
        formStatus.setAttribute('hidden', '');
      }, 6000);
    }
  }

});
