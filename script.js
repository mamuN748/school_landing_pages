/**
 * ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয় - Interactive Script
 * Features:
 * - Mobile Menu Drawer
 * - Sticky Header Scroll Detection
 * - Live Notice Board Rotator
 * - Animated Number Count-Up (Intersection Observer)
 * - Academic Curriculum Tab Switcher
 * - Faculty Filter
 * - Campus Photo Gallery Filter & Fullscreen Lightbox
 * - Admission & Inquiry Modals + Toast Alerts
 * - Back to Top Button
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 0. ADMIN ROUTE REDIRECT CONTROLLER (/admin or #/admin)
  // =========================================================================
  const checkAdminNavigation = () => {
    const hash = (window.location.hash || "").toLowerCase();
    const path = (window.location.pathname || "").toLowerCase();
    if (
      hash === "#admin" ||
      hash === "#/admin" ||
      hash.indexOf("admin") !== -1 ||
      path.endsWith("/admin") ||
      path.endsWith("/admin/") ||
      path.indexOf("/admin") !== -1
    ) {
      if (path.indexOf("/admin/") === -1) {
        window.location.href = "admin/index.html";
      }
    }
  };
  checkAdminNavigation();
  window.addEventListener("hashchange", checkAdminNavigation);

  // =========================================================================
  // 1. NATIVE BENGALI NOTICES & NUMERAL UTILITIES
  // =========================================================================
  let activeNotices = [
    { date: "১৪ অক্টোবর, ২০২৬", title: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ১০ম শ্রেণিতে ভর্তি বিজ্ঞপ্তি: বিজ্ঞান ও মানবিক (আর্টস) বিভাগ", link: "#notice" },
    { date: "১৮ অক্টোবর, ২০২৬", title: "ময়মনসিংহ শিক্ষা বোর্ডের অধীনে বার্ষিক মূল্যায়ন ও অভিভাবক-শিক্ষক মতবিনিময় সভা", link: "#notice" },
    { date: "২২ অক্টোবর, ২০২৬", title: "ধোবাউড়া উপজেলা আন্তঃস্কুল ক্রীড়া ও বিজ্ঞান অলিম্পিয়াড প্রস্তুতি সভা", link: "#teachers" },
    { date: "০২ নভেম্বর, ২০২৬", title: "বিদ্যালয়ের সুবিশাল ২০০ শতাংশ খেলার মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক উৎসব", link: "#gallery" }
  ];

  // Pull real published notices from database if available
  if (window.SchoolDB && window.SchoolDB.getNotices) {
    try {
      const dbNotices = window.SchoolDB.getNotices().filter((n) => n.isPublished);
      if (dbNotices.length > 0) {
        activeNotices = dbNotices.map((n) => ({
          date: n.date,
          title: n.title,
          link: n.fileUrl || "#notice"
        }));
      }
    } catch (e) {}
  }

  // Bengali numerals converter helper
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBanglaNum = (str) => {
    return String(str).replace(/[0-9]/g, (d) => bnDigits[d]);
  };

  // =========================================================================
  // 2. MOBILE NAVIGATION DRAWER & BACKDROP
  // =========================================================================
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navBackdrop = document.getElementById("mobile-nav-backdrop");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const navLinks = document.querySelectorAll(".nav-link");

  const openDrawer = () => {
    menuToggle?.classList.add("active");
    menuToggle?.classList.add("is-active");
    menuToggle?.setAttribute("aria-expanded", "true");
    navMenu?.classList.add("open");
    navBackdrop?.classList.add("open");
    document.body.classList.add("nav-open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    menuToggle?.classList.remove("active");
    menuToggle?.classList.remove("is-active");
    menuToggle?.setAttribute("aria-expanded", "false");
    navMenu?.classList.remove("open");
    navBackdrop?.classList.remove("open");
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
  };

  // Robust smooth navigation to target section
  const navigateToSection = (targetId, hashString) => {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // 1. Immediately close mobile drawer and release scroll lock
    closeDrawer();

    const doScroll = (isSmooth = true) => {
      const headerEl = document.getElementById("header");
      const headerHeight = headerEl ? headerEl.offsetHeight : 70;
      const elementTop = targetEl.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      const targetY = Math.max(0, Math.round(elementTop - headerHeight));

      window.scrollTo({
        top: targetY,
        behavior: isSmooth ? "smooth" : "auto"
      });
    };

    // Ensure body scroll is unlocked immediately
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Immediate scroll
    doScroll(true);

    // Follow-up after drawer transition starts
    setTimeout(() => doScroll(true), 100);

    // Final accurate snap after drawer transition ends (350ms)
    setTimeout(() => doScroll(false), 350);

    // Update active nav-link highlighting
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === hashString) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    if (history.pushState) {
      history.pushState(null, null, hashString);
    }
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerCloseBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDrawer();
    });

    navBackdrop?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDrawer();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        closeDrawer();
      }
    });

    // Event delegation on nav links list
    const navLinksList = document.querySelector(".nav-links-list");
    if (navLinksList) {
      navLinksList.addEventListener("click", (e) => {
        const link = e.target.closest("a.nav-link");
        if (!link) return;
        const targetHref = link.getAttribute("href");
        if (targetHref && targetHref.startsWith("#") && targetHref.length > 1) {
          e.preventDefault();
          const targetId = targetHref.substring(1);
          navigateToSection(targetId, targetHref);
        }
      });
    }

    // Direct listener on all nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetHref = link.getAttribute("href");
        if (targetHref && targetHref.startsWith("#") && targetHref.length > 1) {
          e.preventDefault();
          const targetId = targetHref.substring(1);
          navigateToSection(targetId, targetHref);
        } else {
          closeDrawer();
        }
      });
    });
  }

  // =========================================================================
  // 3. HEADER SCROLL EFFECT & ACTIVE SECTION HIGHLIGHTING
  // =========================================================================
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("main section[id]");

  const handleScroll = () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    // Back to top visibility
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Active navigation highlight
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Back to top click handler
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================================
  // 3.5. HERO BANNER SLIDER (DESKTOP & MOBILE AUTO-SLIDE & USER-FRIENDLY NAV)
  // =========================================================================
  const initHeroSlider = (config) => {
    const {
      containerId,
      slidesSelector,
      dotsSelector,
      textContainerId,
      textSlidesSelector,
      prevBtnId,
      nextBtnId,
      autoSlideInterval = 5000,
    } = config;

    const container = document.getElementById(containerId);
    if (!container) return;

    const slides = container.querySelectorAll(slidesSelector);
    const dots = container.querySelectorAll(dotsSelector);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    // Text slides (either inside a dedicated text container or inside container)
    let textSlides = null;
    if (textContainerId) {
      const textCont = document.getElementById(textContainerId);
      if (textCont && textSlidesSelector) {
        textSlides = textCont.querySelectorAll(textSlidesSelector);
      }
    } else if (textSlidesSelector) {
      textSlides = container.querySelectorAll(textSlidesSelector);
    }

    if (!slides || slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideTimer = null;
    let isTransitioning = false;

    const goToSlide = (newIndex) => {
      if (isTransitioning) return;
      isTransitioning = true;

      if (newIndex < 0) {
        currentIndex = slides.length - 1;
      } else if (newIndex >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = newIndex;
      }

      // Update image slides
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      // Update text slides synchronously
      if (textSlides && textSlides.length > 0) {
        textSlides.forEach((ts, idx) => {
          if (idx === currentIndex) {
            ts.classList.add("active");
          } else {
            ts.classList.remove("active");
          }
        });
      }

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add("active");
          dot.setAttribute("aria-current", "true");
        } else {
          dot.classList.remove("active");
          dot.removeAttribute("aria-current");
        }
      });

      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    // Prev / Next button clicks
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoSlide();
      });
    }

    // Dot indicator clicks
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(idx);
        startAutoSlide();
      });
    });

    // Pause on mouse hover (desktop)
    container.addEventListener("mouseenter", stopAutoSlide);
    container.addEventListener("mouseleave", startAutoSlide);

    // Touch gesture swipe detection (mobile/tablet)
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
        stopAutoSlide();
      },
      { passive: true }
    );

    container.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = touchStartX - touchEndX;
          const diffY = touchStartY - touchEndY;

          // If horizontal swipe is dominant and > 35px
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
            if (diffX > 0) {
              nextSlide(); // swiped left -> go next
            } else {
              prevSlide(); // swiped right -> go prev
            }
          }
        }
        startAutoSlide();
      },
      { passive: true }
    );

    // Start auto slide initially
    startAutoSlide();
  };

  // Initialize Desktop Hero Slider
  initHeroSlider({
    containerId: "hero-desktop-slider",
    slidesSelector: ".hero-slide",
    dotsSelector: ".slider-dot",
    textContainerId: "hero-desktop-text-slider",
    textSlidesSelector: ".hero-text-slide",
    prevBtnId: "hero-slider-prev",
    nextBtnId: "hero-slider-next",
    autoSlideInterval: 5000,
  });

  // Initialize Mobile Hero Slider
  initHeroSlider({
    containerId: "hero-mobile-slider",
    slidesSelector: ".hero-mobile-slide",
    dotsSelector: ".mobile-slider-dot",
    textSlidesSelector: ".hero-mobile-text-slide",
    prevBtnId: "hero-mobile-prev",
    nextBtnId: "hero-mobile-next",
    autoSlideInterval: 5000,
  });

  // =========================================================================
  // 4. NOTICE BOARD & ANNOUNCEMENTS ROTATOR
  // =========================================================================
  let currentNoticeIndex = 0;
  const noticeDateEl = document.getElementById("notice-display-date");
  const noticeTitleEl = document.getElementById("notice-display-title");
  const topbarTickerEl = document.getElementById("topbar-ticker-text");
  const btnNoticePrev = document.getElementById("btn-notice-prev");
  const btnNoticeNext = document.getElementById("btn-notice-next");

  const updateNotice = (index) => {
    if (!activeNotices || !activeNotices.length) return;
    currentNoticeIndex = (index + activeNotices.length) % activeNotices.length;
    const item = activeNotices[currentNoticeIndex];
    if (noticeDateEl && noticeTitleEl) {
      noticeDateEl.textContent = item.date;
      noticeTitleEl.textContent = item.title;
      noticeTitleEl.setAttribute("href", item.link);
    }
    if (topbarTickerEl) {
      topbarTickerEl.textContent = `${item.title} (${item.date})`;
    }
  };

  btnNoticePrev?.addEventListener("click", () => updateNotice(currentNoticeIndex - 1));
  btnNoticeNext?.addEventListener("click", () => updateNotice(currentNoticeIndex + 1));

  // Auto rotate notices every 6 seconds
  let noticeInterval = setInterval(() => updateNotice(currentNoticeIndex + 1), 6000);
  const noticeBanner = document.querySelector(".notice-banner");
  noticeBanner?.addEventListener("mouseenter", () => clearInterval(noticeInterval));
  noticeBanner?.addEventListener("mouseleave", () => {
    clearInterval(noticeInterval);
    noticeInterval = setInterval(() => updateNotice(currentNoticeIndex + 1), 6000);
  });

  // =========================================================================
  // 4. Animated Stats Counter (Smooth Intersection Observer)
  // =========================================================================
  const statsElements = document.querySelectorAll(".stats-number");
  let statsAnimated = false;

  const animateStats = () => {
    statsElements.forEach((el) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const customSuffix = el.getAttribute("data-suffix");
      const isDecimal = customSuffix === null && (el.textContent.includes("%") || target % 1 !== 0);
      const suffix = customSuffix !== null ? customSuffix : (isDecimal ? "%" : "+");
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        if (isDecimal) {
          el.textContent = toBanglaNum(currentVal.toFixed(1)) + suffix;
        } else {
          el.textContent = toBanglaNum(Math.floor(currentVal).toLocaleString()) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            el.textContent = toBanglaNum(target.toFixed(1)) + suffix;
          } else {
            el.textContent = toBanglaNum(Math.floor(target).toLocaleString()) + suffix;
          }
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
          }
        });
      },
      { threshold: 0.15 }
    );
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 5. Academic Curriculum Tab Switcher
  // =========================================================================
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetId = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });

  // =========================================================================
  // 6. Teacher Button Interactive Toggle & Faculty Department Filter
  // Clicking the Teacher Button reveals Head Master first, then square teachers
  // =========================================================================
  const btnToggleTeachers = document.getElementById("btn-toggle-teachers");
  const btnToggleExTeachers = document.getElementById("btn-toggle-ex-teachers");
  const teachersRosterWrapper = document.getElementById("teachers-roster-wrapper");
  const exTeachersRosterWrapper = document.getElementById("ex-teachers-roster-wrapper");
  const teacherBtnStatus = document.getElementById("teacher-btn-status");
  const exTeacherBtnStatus = document.getElementById("ex-teacher-btn-status");

  // =========================================================================
  // 6a. MAIN ADMIN AUTHENTICATION (Mamun190a - PIN: 112292)
  // =========================================================================
  const MAIN_ADMIN_CREDENTIALS = {
    username: "Mamun190a",
    pin: "112292",
    displayName: "মামুন মিয়া (Mamun Mia)"
  };

  const adminAuthModal = document.getElementById("admin-auth-modal-overlay");
  const btnCloseAdminAuth = document.getElementById("btn-close-admin-auth-modal");
  const btnCancelAdminAuth = document.getElementById("btn-cancel-admin-auth");
  const formAdminAuth = document.getElementById("form-admin-auth");
  const adminInputUser = document.getElementById("admin-input-user");
  const adminInputPin = document.getElementById("admin-input-pin");
  const adminAuthErrorMsg = document.getElementById("admin-auth-error-msg");
  const btnTogglePinVisibility = document.getElementById("btn-toggle-pin-visibility");

  const btnAdminLoginNav = document.getElementById("btn-admin-login-nav");
  const btnMobileAdminLogin = document.getElementById("btn-mobile-admin-login");
  const btnMobileAdminDashboard = document.getElementById("btn-mobile-admin-dashboard");
  const btnMobileAdminLogout = document.getElementById("btn-mobile-admin-logout");
  const drawerAdminSessionBox = document.getElementById("drawer-admin-session-box");
  const btnNavAdminDashboard = document.getElementById("btn-nav-admin-dashboard");
  const adminSessionBadge = document.getElementById("admin-session-badge");
  const btnAdminLogout = document.getElementById("btn-admin-logout");
  const footerAdminLink = document.getElementById("footer-admin-link");

  let pendingAdminAction = null; // Callback to run right after successful login

  const isAdminLoggedIn = () => {
    return sessionStorage.getItem("ghoshgaon_main_admin_session") === "Mamun190a";
  };

  const openAdminAuthModal = (onSuccessAction = null) => {
    pendingAdminAction = onSuccessAction;
    if (adminAuthModal) {
      if (adminAuthErrorMsg) {
        adminAuthErrorMsg.style.display = "none";
        adminAuthErrorMsg.textContent = "";
      }
      formAdminAuth?.reset();
      adminAuthModal.classList.add("active");
      adminAuthModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        adminInputUser?.focus();
      }, 100);
    }
  };

  const closeAdminAuthModal = () => {
    if (adminAuthModal) {
      adminAuthModal.classList.remove("active");
      adminAuthModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  btnTogglePinVisibility?.addEventListener("click", () => {
    if (!adminInputPin) return;
    if (adminInputPin.type === "password") {
      adminInputPin.type = "text";
      btnTogglePinVisibility.textContent = "🙈";
    } else {
      adminInputPin.type = "password";
      btnTogglePinVisibility.textContent = "👁️";
    }
  });

  const updateAdminUI = () => {
    const loggedIn = isAdminLoggedIn();
    if (loggedIn) {
      document.body.classList.add("is-admin-active");
      if (btnAdminLoginNav) btnAdminLoginNav.style.display = "none";
      if (adminSessionBadge) adminSessionBadge.style.display = "inline-flex";
      if (btnMobileAdminLogin) btnMobileAdminLogin.style.display = "none";
      if (btnMobileAdminDashboard) btnMobileAdminDashboard.style.display = "block";
      if (drawerAdminSessionBox) drawerAdminSessionBox.style.display = "flex";

      // Floating indicator
      let floatingBar = document.getElementById("admin-floating-status-bar");
      if (!floatingBar) {
        floatingBar = document.createElement("div");
        floatingBar.id = "admin-floating-status-bar";
        floatingBar.className = "admin-floating-status-bar";
        floatingBar.innerHTML = `
          <span>🛡️ মেইন এডমিন:</span>
          <span class="admin-name-tag">Mamun190a</span>
          <button type="button" class="btn-dash-floating" id="floating-btn-admin-dash" title="ভিজিটর অ্যানালিটিক্স ড্যাশবোর্ড">📊 ড্যাশবোর্ড</button>
          <button type="button" class="btn-admin-logout" id="floating-btn-admin-logout" title="লগআউট">লগআউট</button>
        `;
        document.body.appendChild(floatingBar);
        document.getElementById("floating-btn-admin-logout")?.addEventListener("click", logoutAdmin);
        document.getElementById("floating-btn-admin-dash")?.addEventListener("click", () => openAdminDashboardModal());
      } else {
        floatingBar.style.display = "flex";
      }

      // Update faculty bar status
      const statusPill = document.querySelector(".faculty-status-pill span:not(.pulse-dot)");
      if (statusPill) {
        statusPill.textContent = "👑 মেইন এডমিন মোড সক্রিয়";
      }
      const addTeacherBtnText = document.querySelector("#btn-open-teacher-modal span");
      if (addTeacherBtnText) {
        addTeacherBtnText.textContent = "নতুন শিক্ষকের তথ্য যুক্ত করুন";
      }
    } else {
      document.body.classList.remove("is-admin-active");
      if (btnAdminLoginNav) btnAdminLoginNav.style.display = "inline-flex";
      if (adminSessionBadge) adminSessionBadge.style.display = "none";
      if (btnMobileAdminLogin) btnMobileAdminLogin.style.display = "block";
      if (btnMobileAdminDashboard) btnMobileAdminDashboard.style.display = "none";
      if (drawerAdminSessionBox) drawerAdminSessionBox.style.display = "none";

      const floatingBar = document.getElementById("admin-floating-status-bar");
      if (floatingBar) {
        floatingBar.style.display = "none";
      }

      const statusPill = document.querySelector(".faculty-status-pill span:not(.pulse-dot)");
      if (statusPill) {
        statusPill.textContent = "সহকারী ও প্রাক্তন শিক্ষকমণ্ডলীর তথ্য ব্যবস্থাপনা";
      }
    }
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("ghoshgaon_main_admin_session");
    updateAdminUI();
    showToast("🔒 মেইন এডমিন সেশন সমাপ্ত হয়েছে। সাধারণ ভিজিটর মোডে ফিরে এসেছে।");
  };

  formAdminAuth?.addEventListener("submit", (e) => {
    e.preventDefault();
    const userVal = adminInputUser?.value.trim() || "";
    const pinVal = adminInputPin?.value.trim() || "";

    if (userVal.toLowerCase() === MAIN_ADMIN_CREDENTIALS.username.toLowerCase() && pinVal === MAIN_ADMIN_CREDENTIALS.pin) {
      sessionStorage.setItem("ghoshgaon_main_admin_session", "Mamun190a");
      closeAdminAuthModal();
      updateAdminUI();
      showToast(`🎉 স্বাগতম মেইন এডমিন মোড সক্রিয় হয়েছে।`);

      if (typeof pendingAdminAction === "function") {
        const action = pendingAdminAction;
        pendingAdminAction = null;
        setTimeout(action, 250);
      }
    } else {
      if (adminAuthErrorMsg) {
        adminAuthErrorMsg.style.display = "block";
        adminAuthErrorMsg.textContent = "❌ ভুল ইউজারনেম অথবা পিন কোড! শুধুমাত্র অনুমোদিত মেইন এডমিন প্রবেশ করতে পারবেন।";
      }
      if (adminInputPin) adminInputPin.value = "";
    }
  });

  btnAdminLoginNav?.addEventListener("click", () => openAdminAuthModal());
  btnMobileAdminLogin?.addEventListener("click", () => {
    closeDrawer();
    openAdminAuthModal();
  });
  btnMobileAdminDashboard?.addEventListener("click", () => {
    closeDrawer();
    openAdminDashboardModal();
  });
  btnMobileAdminLogout?.addEventListener("click", () => {
    closeDrawer();
    logoutAdmin();
  });
  footerAdminLink?.addEventListener("click", (e) => {
    e.preventDefault();
    if (isAdminLoggedIn()) {
      showToast("আপনি ইতিমধ্যে মেইন এডমিন হিসেবে লগইন আছেন।");
    } else {
      openAdminAuthModal();
    }
  });
  btnAdminLogout?.addEventListener("click", logoutAdmin);
  btnCloseAdminAuth?.addEventListener("click", closeAdminAuthModal);
  btnCancelAdminAuth?.addEventListener("click", closeAdminAuthModal);

  adminAuthModal?.addEventListener("click", (e) => {
    if (e.target === adminAuthModal) closeAdminAuthModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && adminAuthModal?.classList.contains("active")) {
      closeAdminAuthModal();
    }
  });

  // Initial Admin UI update
  updateAdminUI();

  // =========================================================================
  // 6b. VISITOR ENTRY GATEWAY & ADMIN ANALYTICS DASHBOARD
  // নাম ও এসএসসি পাশের বছর সংগ্রহ এবং এডমিন ড্যাশবোর্ডে ভিউ ও ভিজিটর ট্র্যাকিং
  // =========================================================================
  const visitorEntryModal = document.getElementById("visitor-entry-modal");
  const formVisitorEntry = document.getElementById("form-visitor-entry");
  const visitorNameInput = document.getElementById("visitor-name");
  const visitorSscYearSelect = document.getElementById("visitor-ssc-year");

  const adminDashboardModal = document.getElementById("admin-dashboard-modal");
  const btnCloseAdminDashboard = document.getElementById("btn-close-admin-dashboard");
  const btnCloseDashboardBottom = document.getElementById("btn-close-dashboard-bottom");
  const btnExportVisitorsCsv = document.getElementById("btn-export-visitors-csv");
  const btnDashTestEntry = document.getElementById("btn-dash-test-entry");
  const btnDashSeedSamples = document.getElementById("btn-dash-seed-samples");
  const btnDashClearData = document.getElementById("btn-dash-clear-data");
  const dashSearchInput = document.getElementById("dash-search-input");
  const dashCategoryFilter = document.getElementById("dash-category-filter");
  const adminDashTableBody = document.getElementById("admin-dash-table-body");
  const adminDashEmptyState = document.getElementById("admin-dash-empty-state");

  const dashStatTotalViews = document.getElementById("dash-stat-total-views");
  const dashStatRegisteredCount = document.getElementById("dash-stat-registered-count");
  const dashStatAlumniCount = document.getElementById("dash-stat-alumni-count");
  const dashStatOthersCount = document.getElementById("dash-stat-others-count");

  // Bengali numerals converter
  const toBnNum = (n) => {
    if (n === null || n === undefined) return "০";
    return n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
  };

  // Safe HTML string sanitization
  const sanitizeHtml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // 1. Populate SSC Passing Years (1973 - 2026) + Categories
  const populateVisitorSscYears = () => {
    if (!visitorSscYearSelect) return;
    visitorSscYearSelect.innerHTML = '<option value="" disabled selected>এসএসসি পাশের সাল / আপনার পরিচয় নির্বাচন করুন...</option>';

    const optGroupAlumni = document.createElement("optgroup");
    optGroupAlumni.label = "🎓 এসএসসি পাশের সাল (১৯৭৩ - ২০২৬)";

    for (let y = 2026; y >= 1973; y--) {
      const opt = document.createElement("option");
      opt.value = y.toString();
      opt.textContent = y === 1973 ? `${toBnNum(y)} সাল (প্রতিষ্ঠাতা ব্যাচ ১৯৭৩)` : `${toBnNum(y)} সাল (SSC ${y})`;
      optGroupAlumni.appendChild(opt);
    }
    visitorSscYearSelect.appendChild(optGroupAlumni);

    const optGroupOthers = document.createElement("optgroup");
    optGroupOthers.label = "🎒 শিক্ষার্থী / অভিভাবক / অন্যান্য";

    const othersList = [
      { val: "current_student", text: "বর্তমান অধ্যয়নরত শিক্ষার্থী (Current Student)" },
      { val: "guardian", text: "সম্মানিত অভিভাবকবৃন্দ (Guardian)" },
      { val: "teacher_staff", text: "শিক্ষক / কর্মকর্তা / শুভাকাঙ্ক্ষী" },
      { val: "guest_visitor", text: "সম্মানিত শুভানুধ্যায়ী / অতিথি" }
    ];

    othersList.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.val;
      opt.textContent = item.text;
      optGroupOthers.appendChild(opt);
    });
    visitorSscYearSelect.appendChild(optGroupOthers);
  };

  populateVisitorSscYears();

  // 2. Increment Total Page Views (Global counter)
  const incrementTotalPageViews = () => {
    try {
      let views = parseInt(localStorage.getItem("ghoshgaon_site_total_views") || "0", 10);
      views += 1;
      localStorage.setItem("ghoshgaon_site_total_views", views.toString());
      return views;
    } catch (e) {
      return 1;
    }
  };

  incrementTotalPageViews();

  // 3. Visitor Storage Helpers (Zero Dummy Data - Real Visitors Only)
  const getAllVisitorsLog = () => {
    try {
      const logs = JSON.parse(localStorage.getItem("ghoshgaon_all_visitors_log") || "[]");
      return logs.filter((item) => item && item.id && item.name && String(item.name).trim() !== "" && item.name !== "সম্মানিত অতিথি" && !item.id.startsWith("vis_sample_"));
    } catch (e) {
      return [];
    }
  };

  const saveVisitorsLog = (logArray) => {
    try {
      const cleanArray = (logArray || []).filter((item) => item && item.id && item.name && String(item.name).trim() !== "" && item.name !== "সম্মানিত অতিথি" && !item.id.startsWith("vis_sample_"));
      localStorage.setItem("ghoshgaon_all_visitors_log", JSON.stringify(cleanArray));
    } catch (e) {
      console.error("Error saving visitors log", e);
    }
  };

  // 4. Modal Open/Close Controls
  const openVisitorGatewayModal = () => {
    if (visitorEntryModal) {
      visitorEntryModal.classList.add("active");
      visitorEntryModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        visitorNameInput?.focus();
      }, 150);
    }
  };

  const closeVisitorGatewayModal = () => {
    if (visitorEntryModal) {
      visitorEntryModal.classList.remove("active");
      visitorEntryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  // Mandatory Entry Gate: Cannot dismiss or close by clicking backdrop until Name & SSC Batch are submitted
  visitorEntryModal?.addEventListener("click", (e) => {
    if (e.target === visitorEntryModal) {
      const savedProfile = localStorage.getItem("ghoshgaon_visitor_profile");
      if (!savedProfile) {
        const card = visitorEntryModal.querySelector(".visitor-gateway-container");
        if (card) {
          card.classList.remove("shake-animate");
          void card.offsetWidth;
          card.classList.add("shake-animate");
        }
      }
    }
  });

  // Check Repeat Visit or Trigger Mandatory Entry Gate on Load
  try {
    const savedProfile = JSON.parse(localStorage.getItem("ghoshgaon_visitor_profile") || "null");
    if (savedProfile && savedProfile.name) {
      // Repeat visit tracking for already identified visitors
      const lastVisitTime = savedProfile.lastRepeatVisit || 0;
      if (Date.now() - lastVisitTime > 15 * 60 * 1000) {
        savedProfile.lastRepeatVisit = Date.now();
        savedProfile.timestamp = Date.now();
        const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent);
        const now = new Date();
        const monthsBn = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
        savedProfile.dateFormatted = `${toBnNum(now.getDate())} ${monthsBn[now.getMonth()]} ${toBnNum(now.getFullYear())}, ${now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}`;
        savedProfile.device = isMobile ? "📱 মোবাইল" : "💻 কম্পিউটার/ল্যাপটপ";
        savedProfile.id = "vis_" + Date.now();

        if (window.SchoolDB && window.SchoolDB.addVisitorLog) {
          window.SchoolDB.addVisitorLog(savedProfile);
        } else {
          const current = getAllVisitorsLog();
          current.unshift(savedProfile);
          saveVisitorsLog(current);
        }
        localStorage.setItem("ghoshgaon_visitor_profile", JSON.stringify(savedProfile));

        // Sync repeat visit to cloud
        try {
          if (window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
            window.firebase.firestore().collection("visitors").doc(savedProfile.id).set(savedProfile).catch(() => {});
          }
        } catch (e) {}
      }
    } else {
      // Normal person viewing for the first time -> MUST fillup Name & SSC Batch before viewing!
      setTimeout(() => {
        openVisitorGatewayModal();
      }, 250);
    }
  } catch (e) {
    setTimeout(() => {
      openVisitorGatewayModal();
    }, 250);
  }

  const openAdminDashboardModal = () => {
    if (!isAdminLoggedIn()) {
      openAdminAuthModal(() => {
        openAdminDashboardModal();
      });
      return;
    }
    if (adminDashboardModal) {
      adminDashboardModal.classList.add("active");
      adminDashboardModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      renderAdminDashboard();
      updateTabBadges();
      populateCloudConfigTextarea();
    }
  };

  const closeAdminDashboardModal = () => {
    if (adminDashboardModal) {
      adminDashboardModal.classList.remove("active");
      adminDashboardModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  // 5. Render Admin Dashboard Data & Analytics
  const renderAdminDashboard = () => {
    const totalViews = parseInt(localStorage.getItem("ghoshgaon_site_total_views") || "0", 10);
    const logs = getAllVisitorsLog();

    const alumniCount = logs.filter(item => item.isAlumni).length;
    const othersCount = logs.length - alumniCount;

    if (dashStatTotalViews) dashStatTotalViews.textContent = toBnNum(totalViews);
    if (dashStatRegisteredCount) dashStatRegisteredCount.textContent = toBnNum(logs.length);
    if (dashStatAlumniCount) dashStatAlumniCount.textContent = toBnNum(alumniCount);
    if (dashStatOthersCount) dashStatOthersCount.textContent = toBnNum(othersCount);

    const searchQuery = (dashSearchInput?.value || "").trim().toLowerCase();
    const categoryFilter = dashCategoryFilter?.value || "all";

    const filteredLogs = logs.filter(item => {
      const matchesSearch = !searchQuery ||
        (item.name && item.name.toLowerCase().includes(searchQuery)) ||
        (item.sscYearLabel && item.sscYearLabel.toLowerCase().includes(searchQuery));

      let matchesCategory = true;
      if (categoryFilter === "alumni") {
        matchesCategory = item.isAlumni;
      } else if (categoryFilter === "current") {
        matchesCategory = !item.isAlumni;
      }

      return matchesSearch && matchesCategory;
    });

    if (!adminDashTableBody) return;

    if (filteredLogs.length === 0) {
      adminDashTableBody.innerHTML = "";
      if (adminDashEmptyState) adminDashEmptyState.style.display = "block";
      return;
    }

    if (adminDashEmptyState) adminDashEmptyState.style.display = "none";

    adminDashTableBody.innerHTML = filteredLogs.map((log, index) => {
      const badgeClass = log.isAlumni ? "badge-ssc-alumni" : "badge-visitor-other";
      const badgeIcon = log.isAlumni ? "🎓" : "🎒";
      return `
        <tr data-id="${log.id}">
          <td class="visitor-row-num">${toBnNum(index + 1)}</td>
          <td class="visitor-cell-name">
            <strong>👤 ${sanitizeHtml(log.name)}</strong>
          </td>
          <td>
            <span class="${badgeClass}">
              ${badgeIcon} ${sanitizeHtml(log.batch || log.sscYearLabel || (log.sscYear ? (toBnNum(log.sscYear) + ' ব্যাচ') : 'সাধারণ'))}
            </span>
          </td>
          <td class="visitor-cell-time">
            <span>📅 ${sanitizeHtml(log.dateFormatted || new Date(log.timestamp || Date.now()).toLocaleString("bn-BD"))}</span>
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn-delete-visitor-row" data-id="${log.id}" title="মুছে ফেলুন">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Attach row delete listener
    adminDashTableBody.querySelectorAll(".btn-delete-visitor-row").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("আপনি কি নিশ্চিতভাবে এই ভিজিটর রেকর্ডটি মুছে ফেলতে চান?")) {
          const updated = getAllVisitorsLog().filter(item => item.id !== id);
          saveVisitorsLog(updated);
          renderAdminDashboard();
          showToast("ভিজিটর রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।");
        }
      });
    });
  };

  // 6. CSV / Excel Export with UTF-8 BOM for Bengali Support
  const exportVisitorsToCSV = () => {
    const logs = getAllVisitorsLog();
    if (logs.length === 0) {
      showToast("ডাউনলোড করার মতো কোনো ভিজিটর রেকর্ড নেই।");
      return;
    }

    let csvContent = "\uFEFFক্রমিক নং,ভিজিটরের পূর্ণ নাম,এসএসসি সাল / পরিচয়,প্রবেশের তারিখ ও সময়\r\n";

    logs.forEach((item, index) => {
      const row = [
        index + 1,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.sscYearLabel || '').replace(/"/g, '""')}"`,
        `"${(item.dateFormatted || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Ghoshgaon_High_School_Visitors_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📥 এক্সেল (CSV) ফাইল সফলভাবে ডাউনলোড হয়েছে!");
  };

  // 7. Seed Sample Data Action (Zero Dummy Data Policy - Real Visitors Only)
  const seedSampleVisitors = () => {
    showToast("💡 কোনো ডামি ডাটা যোগ করা হবে না। শিক্ষার্থীরা ওয়েবসাইটে প্রবেশ করলেই আসল লাইভ ডাটা সংরক্ষিত হবে।");
  };

  // 8. Visitor Entry Form Submission
  const handleVisitorSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById("visitor-name");
    const sscSelect = document.getElementById("visitor-ssc-year");

    const name = nameInput ? nameInput.value.trim() : "";
    const sscVal = sscSelect ? sscSelect.value.trim() : "";
    const sscOption = sscSelect && sscSelect.selectedIndex >= 0 ? sscSelect.options[sscSelect.selectedIndex] : null;
    const sscLabel = (sscOption && sscOption.value !== "") ? sscOption.textContent.trim() : (sscVal ? `${toBnNum(sscVal)} সাল` : "সাধারণ ভিজিটর");

    if (!name || !sscVal) {
      alert("অনুগ্রহ করে আপনার নাম এবং এসএসসি পাশের সাল নির্বাচন করুন।");
      if (!name && nameInput) nameInput.focus();
      else if (sscSelect) sscSelect.focus();
      return;
    }

    const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent);
    const isAlumni = !isNaN(parseInt(sscVal, 10));

    const now = new Date();
    const monthsBn = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const dateFormatted = `${toBnNum(now.getDate())} ${monthsBn[now.getMonth()]} ${toBnNum(now.getFullYear())}, ${now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}`;

    const visitorRecord = {
      id: "vis_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: name,
      sscYear: sscVal,
      sscYearLabel: sscLabel,
      batch: isAlumni ? `${toBnNum(sscVal)} ব্যাচ` : sscLabel,
      isAlumni: isAlumni,
      timestamp: Date.now(),
      dateFormatted: dateFormatted,
      device: isMobile ? "📱 মোবাইল" : "💻 কম্পিউটার/ল্যাপটপ"
    };

    // Save profile locally for session recognition
    try {
      localStorage.setItem("ghoshgaon_visitor_profile", JSON.stringify(visitorRecord));
    } catch (err) {}

    // 1. Sync directly to central SchoolDB for Admin Dashboard
    if (window.SchoolDB && window.SchoolDB.addVisitorLog) {
      window.SchoolDB.addVisitorLog(visitorRecord);
    } else {
      const currentLogs = getAllVisitorsLog();
      currentLogs.unshift(visitorRecord);
      saveVisitorsLog(currentLogs);
    }

    // 2. BroadcastChannel for instant 0ms sync across all open tabs
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const syncChan = new BroadcastChannel("ghoshgaon_visitor_sync");
        syncChan.postMessage({ type: "NEW_VISITOR", record: visitorRecord });
      }
    } catch (err) {}

    // 3. Real-Time Cloud Firestore Sync (Multi-Device Sync)
    try {
      const activeDb = firestoreDb || (window.firebase && window.firebase.apps && window.firebase.apps.length > 0 ? window.firebase.firestore() : null);
      if (activeDb) {
        activeDb.collection("visitors").doc(visitorRecord.id).set(visitorRecord).catch((err) => {
          console.warn("Cloud visitor sync warning:", err);
        });
        activeDb.collection("analytics").doc("site_stats").set({
          totalViews: window.firebase.firestore.FieldValue.increment(1),
          lastUpdated: Date.now()
        }, { merge: true }).catch(() => {});
      }
    } catch (err) {
      console.warn("Cloud visitor sync error:", err);
    }

    closeVisitorGatewayModal();
    showToast(`🎉 স্বাগতম ${name}! ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়ে আপনাকে স্বাগতম।`);

    if (adminDashboardModal?.classList.contains("active")) {
      renderAdminDashboard();
    }
    updateTabBadges();
  };

  formVisitorEntry?.addEventListener("submit", handleVisitorSubmit);
  const btnSubmitVisitor = document.getElementById("btn-submit-visitor");
  btnSubmitVisitor?.addEventListener("click", (e) => {
    // If not triggered by form, handle directly
    if (formVisitorEntry && !formVisitorEntry.checkValidity()) {
      return;
    }
    handleVisitorSubmit(e);
  });

  // 9. Dashboard Event Handlers
  btnNavAdminDashboard?.addEventListener("click", () => openAdminDashboardModal());
  btnMobileAdminDashboard?.addEventListener("click", () => {
    closeDrawer();
    openAdminDashboardModal();
  });
  btnCloseAdminDashboard?.addEventListener("click", closeAdminDashboardModal);
  btnCloseDashboardBottom?.addEventListener("click", closeAdminDashboardModal);

  btnExportVisitorsCsv?.addEventListener("click", exportVisitorsToCSV);
  btnDashSeedSamples?.addEventListener("click", seedSampleVisitors);
  btnDashTestEntry?.addEventListener("click", () => {
    closeAdminDashboardModal();
    openVisitorGatewayModal();
  });

  btnDashClearData?.addEventListener("click", () => {
    if (confirm("⚠️ আপনি কি নিশ্চিতভাবে সকল ভিজিটর লগ মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা যাবে না।")) {
      saveVisitorsLog([]);
      renderAdminDashboard();
      showToast("সব ভিজিটর রেকর্ড সফলভাবে মুছে ফেলা হয়েছে।");
    }
  });

  dashSearchInput?.addEventListener("input", renderAdminDashboard);
  dashCategoryFilter?.addEventListener("change", renderAdminDashboard);

  adminDashboardModal?.addEventListener("click", (e) => {
    if (e.target === adminDashboardModal) closeAdminDashboardModal();
  });

  // =========================================================================
  // 9.5. GOOGLE FIREBASE FIRESTORE CLOUD INTEGRATION & REAL-TIME MULTI-DEVICE SYNC
  // =========================================================================
  const FIREBASE_CONFIG_STORAGE_KEY = "ghoshgaon_firebase_config_v1";

  // Official Ghoshgaon High School Firebase Cloud Configuration (school-landing-page-fcad1)
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyAo3af1pd_nN0bvmiK0z1Zs3eRfW7LOlNo",
    authDomain: "school-landing-page-fcad1.firebaseapp.com",
    projectId: "school-landing-page-fcad1",
    storageBucket: "school-landing-page-fcad1.firebasestorage.app",
    messagingSenderId: "514886238243",
    appId: "1:514886238243:web:6c730c01fca47280cfb196"
  };

  // State
  let firebaseApp = null;
  let firestoreDb = null;
  let isCloudActive = false;
  let unsubscribeVisitors = null;
  let unsubscribeFaculty = null;
  let unsubscribeMemories = null;
  let unsubscribeViews = null;

  // Cloud UI Elements
  const cloudStatusPill = document.getElementById("cloud-status-pill");
  const cloudStatusText = document.getElementById("cloud-status-text");
  const cloudMetaProject = document.getElementById("cloud-meta-project");
  const cloudMetaSync = document.getElementById("cloud-meta-sync");
  const cloudMetaTime = document.getElementById("cloud-meta-time");
  const firebaseConfigTextarea = document.getElementById("firebase-config-textarea");
  const btnSaveFirebaseConfig = document.getElementById("btn-save-firebase-config");
  const btnTestFirebaseConn = document.getElementById("btn-test-firebase-conn");
  const btnSyncAllToCloud = document.getElementById("btn-sync-all-to-cloud");
  const btnPullCloudData = document.getElementById("btn-pull-cloud-data");
  const dashCloudIndicator = document.getElementById("dash-cloud-indicator");

  const updateCloudStatusUI = (active, project = null, lastSync = null) => {
    isCloudActive = active;
    if (cloudStatusPill) {
      cloudStatusPill.className = `cloud-status-pill ${active ? "online" : "offline"}`;
    }
    if (cloudStatusText) {
      cloudStatusText.textContent = active ? "অনলাইন (ক্লাউড সক্রিয়)" : "অফলাইন (লোকাল মোড)";
    }
    if (dashCloudIndicator) {
      dashCloudIndicator.textContent = active ? "🟢" : "🟡";
    }
    if (cloudMetaSync) {
      cloudMetaSync.textContent = active ? "রিয়েল-টাইম সিঙ্ক সক্রিয়" : "অফলাইন মোড সক্রিয়";
    }
    if (project && cloudMetaProject) {
      cloudMetaProject.textContent = project;
    }
    if (lastSync && cloudMetaTime) {
      cloudMetaTime.textContent = lastSync;
    }
  };

  const populateCloudConfigTextarea = () => {
    if (!firebaseConfigTextarea) return;
    const stored = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (stored && !firebaseConfigTextarea.value) {
      try {
        firebaseConfigTextarea.value = JSON.stringify(JSON.parse(stored), null, 2);
      } catch (e) {
        firebaseConfigTextarea.value = stored;
      }
    }
  };

  const parseFirebaseConfig = (inputStr) => {
    if (!inputStr) return null;
    let cleaned = inputStr.trim();
    if (cleaned.includes("{") && cleaned.includes("}")) {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}") + 1;
      cleaned = cleaned.substring(start, end);
    }
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      try {
        const parseFn = new Function(`return (${cleaned});`);
        const result = parseFn();
        if (result && typeof result === "object") return result;
      } catch (err) {
        return null;
      }
    }
    return null;
  };

  const setupCloudRealtimeListeners = () => {
    if (!firestoreDb) return;

    // 1. Live Visitors Listener across all devices
    try {
      if (unsubscribeVisitors) unsubscribeVisitors();
      unsubscribeVisitors = firestoreDb.collection("visitors")
        .orderBy("timestamp", "desc")
        .limit(400)
        .onSnapshot((snapshot) => {
          if (snapshot && !snapshot.empty) {
            const cloudLogs = [];
            snapshot.forEach((doc) => {
              cloudLogs.push(doc.data());
            });
            localStorage.setItem("ghoshgaon_all_visitors_log", JSON.stringify(cloudLogs));
            if (cloudMetaTime) {
              cloudMetaTime.textContent = new Date().toLocaleTimeString("bn-BD");
            }
            renderAdminDashboard();
            updateTabBadges();
          }
        }, (err) => {
          console.warn("Visitors snapshot error:", err);
          const msg = (err && err.message) ? err.message.toLowerCase() : '';
          if (msg.includes('not been used') || msg.includes('disabled') || msg.includes('permission_denied')) {
            updateCloudStatusUI(false, "Firestore Database তৈরি করুন (Firebase Console)");
          }
        });
    } catch (e) {
      console.warn("Visitors listener attach failed:", e);
    }

    // 2. Global Views Listener
    try {
      if (unsubscribeViews) unsubscribeViews();
      unsubscribeViews = firestoreDb.collection("analytics").doc("site_stats")
        .onSnapshot((doc) => {
          if (doc && doc.exists && typeof doc.data()?.totalViews === "number") {
            const views = doc.data().totalViews;
            localStorage.setItem("ghoshgaon_site_total_views", views.toString());
            if (dashStatTotalViews) dashStatTotalViews.textContent = toBnNum(views);
          }
        }, (err) => console.warn("Analytics snapshot error:", err));
    } catch (e) {}

    // 3. Teachers & Faculty Listener
    try {
      if (unsubscribeFaculty) unsubscribeFaculty();
      unsubscribeFaculty = firestoreDb.collection("faculty")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          if (snapshot && !snapshot.empty) {
            const cloudFaculty = [];
            snapshot.forEach((doc) => {
              cloudFaculty.push(doc.data());
            });
            localStorage.setItem("ghoshgaon_custom_faculty_list", JSON.stringify(cloudFaculty));
            renderDashboardFacultyTable();
            if (typeof renderCustomTeachers === "function") {
              renderCustomTeachers();
            }
            updateTabBadges();
          }
        }, (err) => console.warn("Faculty snapshot error:", err));
    } catch (e) {}

    // 4. Student & Alumni Memories Listener
    try {
      if (unsubscribeMemories) unsubscribeMemories();
      unsubscribeMemories = firestoreDb.collection("memories")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          if (snapshot && !snapshot.empty) {
            const cloudMemories = [];
            snapshot.forEach((doc) => {
              cloudMemories.push(doc.data());
            });
            localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(cloudMemories));
            renderDashboardMemoriesTable();
            if (typeof renderMemories === "function") {
              renderMemories(currentDecadeFilter || "all");
            }
            updateTabBadges();
          }
        }, (err) => console.warn("Memories snapshot error:", err));
    } catch (e) {}
  };

  const initFirebase = (config, isUserAction = false) => {
    if (!config || !config.projectId || !config.apiKey) {
      updateCloudStatusUI(false);
      return false;
    }

    try {
      if (!window.firebase) {
        console.warn("Firebase SDK not yet loaded.");
        updateCloudStatusUI(false);
        return false;
      }

      if (window.firebase.apps && window.firebase.apps.length > 0) {
        firebaseApp = window.firebase.app();
      } else {
        firebaseApp = window.firebase.initializeApp(config);
      }

      firestoreDb = window.firebase.firestore();
      updateCloudStatusUI(true, config.projectId, new Date().toLocaleTimeString("bn-BD"));
      setupCloudRealtimeListeners();

      if (isUserAction) {
        showToast("🎉 Google Firebase ক্লাউড ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে!");
      }
      return true;
    } catch (err) {
      console.error("Firebase connection failed:", err);
      updateCloudStatusUI(false, "ত্রুটি: " + (err.message || "কানেক্ট করা যায়নি"));
      if (isUserAction) {
        showToast("❌ ফায়ারবেস কানেকশন ব্যর্থ হয়েছে: " + err.message);
      }
      return false;
    }
  };

  // Sync All Local Data to Firestore
  const syncAllLocalDataToCloud = async () => {
    if (!isCloudActive || !firestoreDb) {
      showToast("⚠️ ক্লাউড ডাটাবেজ এখনও কানেক্ট করা হয়নি! প্রথমে ওপরের বক্সে Firebase কনফিগ সেভ করুন।");
      return;
    }
    showToast("⏳ সকল লোকাল ডাটা ক্লাউডে আপলোড হচ্ছে...");
    try {
      const batch = firestoreDb.batch();

      // Visitors
      const visitors = getAllVisitorsLog();
      visitors.forEach((v) => {
        const docId = v.id || ("vis_" + v.timestamp);
        const ref = firestoreDb.collection("visitors").doc(docId);
        batch.set(ref, v, { merge: true });
      });

      // Faculty
      const faculty = getSavedFaculty();
      faculty.forEach((f) => {
        if (f.id) {
          const ref = firestoreDb.collection("faculty").doc(f.id);
          batch.set(ref, f, { merge: true });
        }
      });

      // Memories
      const memories = getStoredMemories();
      memories.forEach((m) => {
        const mId = m.id || ("mem_" + Date.now());
        const ref = firestoreDb.collection("memories").doc(mId);
        batch.set(ref, m, { merge: true });
      });

      // Site Views
      const totalViews = parseInt(localStorage.getItem("ghoshgaon_site_total_views") || "0", 10);
      const statsRef = firestoreDb.collection("analytics").doc("site_stats");
      batch.set(statsRef, { totalViews: totalViews, lastUpdated: Date.now() }, { merge: true });

      await batch.commit();
      showToast(`🎉 অভিনন্দন! মোট ${toBnNum(visitors.length)} জন ভিজিটর, ${toBnNum(faculty.length)} জন শিক্ষক ও ${toBnNum(memories.length)} টি স্মৃতিচারণ ক্লাউডে আপলোড হয়েছে!`);
      if (cloudMetaTime) {
        cloudMetaTime.textContent = new Date().toLocaleTimeString("bn-BD");
      }
    } catch (err) {
      console.error("Cloud push failed:", err);
      showToast("❌ ক্লাউডে আপলোড ব্যর্থ হয়েছে: " + err.message);
    }
  };

  // Pull fresh data from cloud
  const pullCloudData = async () => {
    if (!isCloudActive || !firestoreDb) {
      showToast("⚠️ ক্লাউড কানেক্ট সক্রিয় নেই।");
      return;
    }
    showToast("🔄 ক্লাউড থেকে ডাটা আনা হচ্ছে...");
    try {
      const vSnap = await firestoreDb.collection("visitors").orderBy("timestamp", "desc").get();
      if (!vSnap.empty) {
        const vList = [];
        vSnap.forEach((doc) => vList.push(doc.data()));
        localStorage.setItem("ghoshgaon_all_visitors_log", JSON.stringify(vList));
      }

      const fSnap = await firestoreDb.collection("faculty").orderBy("timestamp", "desc").get();
      if (!fSnap.empty) {
        const fList = [];
        fSnap.forEach((doc) => fList.push(doc.data()));
        localStorage.setItem("ghoshgaon_custom_faculty_list", JSON.stringify(fList));
      }

      const mSnap = await firestoreDb.collection("memories").orderBy("timestamp", "desc").get();
      if (!mSnap.empty) {
        const mList = [];
        mSnap.forEach((doc) => mList.push(doc.data()));
        localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(mList));
      }

      renderAdminDashboard();
      renderDashboardFacultyTable();
      renderDashboardMemoriesTable();
      updateTabBadges();
      showToast("✅ ক্লাউড ডাটা সফলভাবে রিফ্রেশ হয়েছে!");
    } catch (err) {
      showToast("❌ ডাটা আনতে ব্যর্থ: " + err.message);
    }
  };

  // Cloud Action Button Handlers
  btnSaveFirebaseConfig?.addEventListener("click", () => {
    const rawVal = firebaseConfigTextarea?.value || "";
    const parsed = parseFirebaseConfig(rawVal);
    if (!parsed || !parsed.projectId || !parsed.apiKey) {
      showToast("⚠️ সঠিক Firebase Config কোড পেস্ট করুন (কমপক্ষে apiKey ও projectId আবশ্যক)।");
      return;
    }
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(parsed, null, 2));
    const ok = initFirebase(parsed, true);
    if (ok) {
      setTimeout(() => {
        syncAllLocalDataToCloud();
      }, 600);
    }
  });

  btnTestFirebaseConn?.addEventListener("click", async () => {
    if (!isCloudActive || !firestoreDb) {
      showToast("⚠️ ক্লাউড ডাটাবেজ এখনো কানেক্ট করা হয়নি।");
      return;
    }
    try {
      await firestoreDb.collection("_healthcheck").doc("ping").set({ ping: Date.now() });
      showToast("⚡ Firebase ক্লাউড কানেকশন ১০০% সক্রিয় ও সঠিকভাবে কাজ করছে!");
    } catch (err) {
      showToast("❌ কানেকশন টেস্ট ব্যর্থ: " + err.message);
    }
  });

  btnSyncAllToCloud?.addEventListener("click", syncAllLocalDataToCloud);
  btnPullCloudData?.addEventListener("click", pullCloudData);

  // -------------------------------------------------------------------------
  // DASHBOARD TAB SWITCHING & MULTI-PART MANAGEMENT
  // -------------------------------------------------------------------------
  const dashTabBtns = document.querySelectorAll(".admin-dash-tab-btn");
  const dashTabPanes = document.querySelectorAll(".admin-dash-tab-pane");

  const switchDashboardTab = (tabName) => {
    dashTabBtns.forEach((btn) => {
      const match = btn.getAttribute("data-dash-tab") === tabName;
      btn.classList.toggle("active", match);
      btn.setAttribute("aria-selected", match ? "true" : "false");
    });

    dashTabPanes.forEach((pane) => {
      const isTarget = pane.id === `dash-pane-${tabName}`;
      pane.classList.toggle("active", isTarget);
      pane.style.display = isTarget ? "flex" : "none";
    });

    if (tabName === "faculty") renderDashboardFacultyTable();
    if (tabName === "memories") renderDashboardMemoriesTable();
    if (tabName === "admissions") renderDashboardAdmissionsTable();
    if (tabName === "visitors") renderAdminDashboard();
    if (tabName === "cloud") populateCloudConfigTextarea();
    updateTabBadges();
  };

  dashTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-dash-tab");
      if (target) switchDashboardTab(target);
    });
  });

  // Render Faculty List in Dashboard
  const renderDashboardFacultyTable = () => {
    const tbody = document.getElementById("admin-dash-faculty-tbody");
    const emptyState = document.getElementById("admin-dash-faculty-empty");
    if (!tbody) return;

    const list = getSavedFaculty();
    const searchQuery = (document.getElementById("dash-faculty-search")?.value || "").toLowerCase().trim();
    const typeFilter = document.getElementById("dash-faculty-type-filter")?.value || "all";

    const filtered = list.filter((item) => {
      const matchSearch = !searchQuery ||
        (item.name && item.name.toLowerCase().includes(searchQuery)) ||
        (item.designation && item.designation.toLowerCase().includes(searchQuery)) ||
        (item.subject && item.subject.toLowerCase().includes(searchQuery));
      let matchType = true;
      if (typeFilter === "present") matchType = item.type !== "retired";
      if (typeFilter === "retired") matchType = item.type === "retired";
      return matchSearch && matchType;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = "block";
    } else {
      if (emptyState) emptyState.style.display = "none";
      filtered.forEach((item, index) => {
        const tr = document.createElement("tr");
        const isRet = item.type === "retired";
        tr.innerHTML = `
          <td style="text-align: center; font-weight: 700; color: #94a3b8;">${toBnNum(index + 1)}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${item.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}" 
                alt="${item.name}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid #cbd5e1;">
              <div>
                <strong style="color: #0f172a; display: block;">${sanitizeHtml(item.name)}</strong>
                <span style="font-size: 0.76rem; color: #64748b;">${sanitizeHtml(item.subject || 'সাধারণ')}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-weight: 600; color: #1e293b; display: block;">${sanitizeHtml(item.designation)}</span>
            <span class="${isRet ? 'badge-ssc-alumni' : 'badge-visitor-other'}" style="margin-top: 3px;">
              ${isRet ? '📜 অবসরপ্রাপ্ত / প্রাক্তন' : '💼 কর্মরত শিক্ষক'}
            </span>
          </td>
          <td style="font-size: 0.82rem; color: #475569;">
            ${sanitizeHtml(item.qualification || 'বি.এ, বি.এড')}
          </td>
          <td style="font-size: 0.82rem; color: #64748b;">
            ${sanitizeHtml(item.years || 'ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়')}
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn-delete-visitor-row" data-delete-faculty-id="${item.id}" title="মুছে ফেলুন">
              🗑️
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll("[data-delete-faculty-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-delete-faculty-id");
          const teacher = list.find((t) => t.id === id);
          if (confirm(`আপনি কি "${teacher ? teacher.name : 'এই'}" শিক্ষকের তথ্য মুছে ফেলতে চান?`)) {
            const updated = list.filter((t) => t.id !== id);
            localStorage.setItem("ghoshgaon_custom_faculty_list", JSON.stringify(updated));
            if (isCloudActive && firestoreDb) {
              firestoreDb.collection("faculty").doc(id).delete().catch(console.warn);
            }
            renderDashboardFacultyTable();
            if (typeof renderCustomTeachers === "function") {
              renderCustomTeachers();
            }
            updateTabBadges();
            showToast("শিক্ষকের তথ্য তালিকা থেকে মুছে ফেলা হয়েছে।");
          }
        });
      });
    }
  };

  // Render Memories List in Dashboard
  const renderDashboardMemoriesTable = () => {
    const tbody = document.getElementById("admin-dash-memories-tbody");
    const emptyState = document.getElementById("admin-dash-memories-empty");
    if (!tbody) return;

    const list = getStoredMemories();
    const searchQuery = (document.getElementById("dash-memories-search")?.value || "").toLowerCase().trim();
    const batchFilter = document.getElementById("dash-memories-batch-filter")?.value || "all";

    const filtered = list.filter((m) => {
      const matchSearch = !searchQuery ||
        (m.name && m.name.toLowerCase().includes(searchQuery)) ||
        (m.favoriteTeacher && m.favoriteTeacher.toLowerCase().includes(searchQuery)) ||
        (m.note && m.note.toLowerCase().includes(searchQuery));
      const matchBatch = batchFilter === "all" || (m.batch && m.batch.toString() === batchFilter);
      return matchSearch && matchBatch;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = "block";
    } else {
      if (emptyState) emptyState.style.display = "none";
      filtered.forEach((m, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="text-align: center; font-weight: 700; color: #94a3b8;">${toBnNum(index + 1)}</td>
          <td>
            <img src="${m.image || 'hero-students.jpg'}" 
              alt="${sanitizeHtml(m.name)}" style="width: 50px; height: 38px; border-radius: 6px; object-fit: cover; border: 1px solid #cbd5e1;">
          </td>
          <td>
            <strong style="color: #0f172a; display: block;">${sanitizeHtml(m.name)}</strong>
            <span class="badge-ssc-alumni" style="margin-top: 3px;">🎓 ব্যাচ: ${toBanglaNum(m.batch)}</span>
          </td>
          <td>
            <strong style="color: #1e293b; font-size: 0.84rem; display: block;">প্রিয় শিক্ষক: ${sanitizeHtml(m.favoriteTeacher || 'সকল শিক্ষক')}</strong>
            <p style="margin: 0; font-size: 0.78rem; color: #64748b; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHtml(m.note)}</p>
          </td>
          <td style="font-size: 0.8rem; color: #64748b;">
            <span>${sanitizeHtml(m.postDate || 'সম্প্রতি')}</span>
            <div style="font-size: 0.75rem; color: #e11d48; margin-top: 2px;">❤️ ${toBanglaNum(m.likes || 0)} লাইক</div>
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn-delete-visitor-row" data-delete-memory-id="${m.id}" title="স্মৃতি মুছুন">
              🗑️
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll("[data-delete-memory-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-delete-memory-id");
          if (confirm("আপনি কি সত্যিই এই স্মৃতিচারণ পোস্টটি মুছে ফেলতে চান?")) {
            const updated = list.filter((m) => String(m.id) !== String(id));
            localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(updated));
            if (isCloudActive && firestoreDb) {
              firestoreDb.collection("memories").doc(id).delete().catch(console.warn);
            }
            renderDashboardMemoriesTable();
            if (typeof renderMemories === "function") {
              renderMemories(currentDecadeFilter || "all");
            }
            updateTabBadges();
            showToast("স্মৃতিচারণ পোস্টটি সফলভাবে অপসারিত হয়েছে।");
          }
        });
      });
    }
  };

  // Render Admissions & Messages in Dashboard Tab
  const renderDashboardAdmissionsTable = () => {
    const admTbody = document.getElementById("admin-dash-admissions-tbody");
    const admEmpty = document.getElementById("admin-dash-admissions-empty");
    const msgTbody = document.getElementById("admin-dash-messages-tbody");
    const msgEmpty = document.getElementById("admin-dash-messages-empty");
    const countAdmEl = document.getElementById("dash-admissions-count");
    const countMsgEl = document.getElementById("dash-messages-count");

    const admissions = window.SchoolDB && window.SchoolDB.getAdmissions ? window.SchoolDB.getAdmissions() : [];
    const messages = window.SchoolDB && window.SchoolDB.getMessages ? window.SchoolDB.getMessages() : [];

    if (countAdmEl) countAdmEl.textContent = toBnNum(admissions.length);
    if (countMsgEl) countMsgEl.textContent = toBnNum(messages.length);

    // 1. Render Admissions Table
    if (admTbody) {
      admTbody.innerHTML = "";
      if (admissions.length === 0) {
        if (admEmpty) admEmpty.style.display = "block";
      } else {
        if (admEmpty) admEmpty.style.display = "none";
        admissions.forEach((adm, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td style="text-align: center; font-weight: 700; color: #94a3b8;">${toBnNum(index + 1)}</td>
            <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem;">${sanitizeHtml(adm.id)}</code></td>
            <td><strong style="color: #0f172a;">${sanitizeHtml(adm.applicantName)}</strong></td>
            <td><span class="badge-status badge-review" style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; background: #e0f2fe; color: #0369a1;">${sanitizeHtml(adm.desiredClass)}</span></td>
            <td>
              <div style="font-size: 0.85rem; color: #334155;">${sanitizeHtml(adm.guardianName || 'অনির্ধারিত')}</div>
              <small style="color: #64748b;"><a href="tel:${sanitizeHtml(adm.guardianPhone)}">${sanitizeHtml(adm.guardianPhone)}</a></small>
            </td>
            <td style="font-size: 0.8rem; color: #64748b;">${sanitizeHtml(adm.submissionDate || 'আজ')}</td>
            <td><span class="badge-status badge-pending-status" style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; background: #fef3c7; color: #b45309;">${sanitizeHtml(adm.status || 'Pending')}</span></td>
          `;
          admTbody.appendChild(tr);
        });
      }
    }

    // 2. Render Messages Table
    if (msgTbody) {
      msgTbody.innerHTML = "";
      if (messages.length === 0) {
        if (msgEmpty) msgEmpty.style.display = "block";
      } else {
        if (msgEmpty) msgEmpty.style.display = "none";
        messages.forEach((msg, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td style="text-align: center; font-weight: 700; color: #94a3b8;">${toBnNum(index + 1)}</td>
            <td style="font-size: 0.8rem; color: #64748b;">${sanitizeHtml(msg.date || msg.timestamp || 'আজ')}</td>
            <td><strong style="color: #0f172a;">${sanitizeHtml(msg.name)}</strong></td>
            <td><a href="tel:${sanitizeHtml(msg.phone || '')}" style="color: #2563eb; font-size: 0.85rem;">${sanitizeHtml(msg.phone || 'অনির্ধারিত')}</a></td>
            <td>
              <strong style="font-size: 0.84rem; color: #1e293b; display: block;">${sanitizeHtml(msg.subject || 'অনুসন্ধান')}</strong>
              <p style="margin: 0; font-size: 0.78rem; color: #64748b; max-width: 320px; white-space: normal;">${sanitizeHtml(msg.message || '')}</p>
            </td>
            <td><span class="badge-status" style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; background: #fee2e2; color: #b91c1c;">${sanitizeHtml(msg.status || 'Unread')}</span></td>
          `;
          msgTbody.appendChild(tr);
        });
      }
    }
  };

  const updateTabBadges = () => {
    const vBadge = document.getElementById("tab-badge-visitors");
    const fBadge = document.getElementById("tab-badge-faculty");
    const mBadge = document.getElementById("tab-badge-memories");
    const aBadge = document.getElementById("tab-badge-admissions-modal");

    if (vBadge) vBadge.textContent = toBnNum(getAllVisitorsLog().length);
    if (fBadge) fBadge.textContent = toBnNum(getSavedFaculty().length);
    if (mBadge) mBadge.textContent = toBnNum(getStoredMemories().length);
    if (aBadge && window.SchoolDB) {
      const adms = window.SchoolDB.getAdmissions ? window.SchoolDB.getAdmissions() : [];
      const msgs = window.SchoolDB.getMessages ? window.SchoolDB.getMessages() : [];
      aBadge.textContent = toBnNum(adms.length + msgs.length);
    }
  };

  // Populate Batch Filter Dropdown for Dashboard Memories Tab
  const dashMemoriesBatchFilter = document.getElementById("dash-memories-batch-filter");
  if (dashMemoriesBatchFilter) {
    for (let yr = 2026; yr >= 1973; yr--) {
      const opt = document.createElement("option");
      opt.value = yr.toString();
      opt.textContent = `এসএসসি ব্যাচ: ${toBanglaNum(yr)}`;
      dashMemoriesBatchFilter.appendChild(opt);
    }
  }

  // Dashboard Toolbar Filters
  document.getElementById("dash-faculty-search")?.addEventListener("input", renderDashboardFacultyTable);
  document.getElementById("dash-faculty-type-filter")?.addEventListener("change", renderDashboardFacultyTable);
  document.getElementById("dash-memories-search")?.addEventListener("input", renderDashboardMemoriesTable);
  document.getElementById("dash-memories-batch-filter")?.addEventListener("change", renderDashboardMemoriesTable);

  // Quick action buttons in dashboard
  document.getElementById("btn-dash-add-faculty-quick")?.addEventListener("click", () => {
    closeAdminDashboardModal();
    if (typeof openExTeacherModal === "function") {
      openExTeacherModal();
    } else {
      document.getElementById("btn-open-teacher-modal")?.click();
    }
  });

  document.getElementById("btn-dash-open-memories-form")?.addEventListener("click", () => {
    closeAdminDashboardModal();
    if (typeof window.openMemoryModal === "function") {
      window.openMemoryModal();
    }
  });

  // Auto initialize cloud with default or stored config (Real-Time Cross-Device Sync)
  try {
    const savedConfigStr = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    const cfg = savedConfigStr ? (parseFirebaseConfig(savedConfigStr) || DEFAULT_FIREBASE_CONFIG) : DEFAULT_FIREBASE_CONFIG;
    if (cfg) {
      initFirebase(cfg, false);
    }
  } catch (e) {
    console.warn("Firebase auto-init error:", e);
  }

  // 10. Automatically trigger Entry Gateway for First-Time Normal Visitors
  if (!localStorage.getItem("ghoshgaon_visitor_profile") && !isAdminLoggedIn()) {
    setTimeout(() => {
      openVisitorGatewayModal();
    }, 700);
  }

  // Open / Close Hidden Faculty & Ex-Teachers Archive on Demand
  const btnOpenTeacherModal = document.getElementById("btn-open-teacher-modal");
  const btnToggleHiddenRoster = document.getElementById("btn-toggle-hidden-roster");
  const archivedFacultyWrapper = document.getElementById("archived-faculty-wrapper");
  const btnToggleHiddenRosterText = document.getElementById("btn-toggle-hidden-roster-text");

  btnOpenTeacherModal?.addEventListener("click", () => {
    if (isAdminLoggedIn()) {
      openExTeacherModal();
    } else {
      openAdminAuthModal(() => {
        openExTeacherModal();
      });
    }
  });

  btnToggleHiddenRoster?.addEventListener("click", () => {
    if (!archivedFacultyWrapper) return;
    const isHidden = archivedFacultyWrapper.style.display === "none";
    if (isHidden) {
      archivedFacultyWrapper.style.display = "block";
      btnToggleHiddenRoster.classList.add("active");
      btnToggleHiddenRoster.setAttribute("aria-expanded", "true");
      if (btnToggleHiddenRosterText) {
        btnToggleHiddenRosterText.textContent = "শিক্ষক তালিকা লুকান";
      }
      setTimeout(() => {
        archivedFacultyWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      archivedFacultyWrapper.style.display = "none";
      btnToggleHiddenRoster.classList.remove("active");
      btnToggleHiddenRoster.setAttribute("aria-expanded", "false");
      if (btnToggleHiddenRosterText) {
        btnToggleHiddenRosterText.textContent = "শিক্ষক তালিকা দেখুন";
      }
    }
  });

  // =========================================================================
  // 6b. Unified Teacher Addition Modal & LocalStorage Persistence System
  // =========================================================================
  const exTeacherModal = document.getElementById("ex-teacher-modal-overlay");
  const btnOpenExModal = document.getElementById("btn-open-ex-teacher-modal");
  const btnCloseExModal = document.getElementById("btn-close-ex-modal");
  const btnCancelExModal = document.getElementById("btn-cancel-ex-modal");
  const formAddExTeacher = document.getElementById("form-add-ex-teacher");
  const customFacultySection = document.getElementById("custom-faculty-section");
  const dynamicCustomFacultyGrid = document.getElementById("dynamic-custom-faculty-grid");

  const openExTeacherModal = () => {
    if (exTeacherModal) {
      exTeacherModal.classList.add("active");
      exTeacherModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.getElementById("ex-name")?.focus();
      }, 100);
    }
  };

  const closeExTeacherModal = () => {
    if (exTeacherModal) {
      exTeacherModal.classList.remove("active");
      exTeacherModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  btnOpenExModal?.addEventListener("click", () => {
    if (isAdminLoggedIn()) {
      openExTeacherModal();
    } else {
      openAdminAuthModal(() => {
        openExTeacherModal();
      });
    }
  });
  btnCloseExModal?.addEventListener("click", closeExTeacherModal);
  btnCancelExModal?.addEventListener("click", closeExTeacherModal);

  exTeacherModal?.addEventListener("click", (e) => {
    if (e.target === exTeacherModal) {
      closeExTeacherModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && exTeacherModal?.classList.contains("active")) {
      closeExTeacherModal();
    }
  });

  // LocalStorage handling for custom faculty list
  const getSavedFaculty = () => {
    try {
      const data = localStorage.getItem("ghoshgaon_custom_faculty_list");
      if (data) return JSON.parse(data);
      // Fallback check for old key
      const legacyData = localStorage.getItem("ghoshgaon_custom_ex_teachers");
      return legacyData ? JSON.parse(legacyData) : [];
    } catch (e) {
      return [];
    }
  };

  const saveCustomTeacher = (item) => {
    const list = getSavedFaculty();
    list.unshift(item);
    localStorage.setItem("ghoshgaon_custom_faculty_list", JSON.stringify(list));
    if (isCloudActive && firestoreDb && item.id) {
      firestoreDb.collection("faculty").doc(item.id).set(item).catch((err) => {
        console.warn("Firestore save teacher warning:", err);
      });
    }
    if (typeof renderDashboardFacultyTable === "function") {
      renderDashboardFacultyTable();
    }
    if (typeof updateTabBadges === "function") {
      updateTabBadges();
    }
  };

  const removeCustomTeacher = (id, cardElement, name) => {
    if (!isAdminLoggedIn()) {
      openAdminAuthModal(() => removeCustomTeacher(id, cardElement, name));
      return;
    }
    if (confirm(`আপনি কি সত্যিই "${name}" শিক্ষকের তথ্য তালিকা থেকে মুছে ফেলতে চান?`)) {
      const list = getSavedFaculty().filter((i) => i.id !== id);
      localStorage.setItem("ghoshgaon_custom_faculty_list", JSON.stringify(list));
      if (isCloudActive && firestoreDb) {
        firestoreDb.collection("faculty").doc(id).delete().catch(console.warn);
      }
      cardElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      cardElement.style.opacity = "0";
      cardElement.style.transform = "scale(0.9)";
      setTimeout(() => {
        cardElement.remove();
        if (list.length === 0 && customFacultySection) {
          customFacultySection.style.display = "none";
        }
      }, 300);
      if (typeof renderDashboardFacultyTable === "function") {
        renderDashboardFacultyTable();
      }
      if (typeof updateTabBadges === "function") {
        updateTabBadges();
      }
      showToast(`শিক্ষক ${name}-এর তথ্য তালিকা থেকে সফলভাবে অপসারিত হয়েছে।`);
    }
  };

  // Helper to build Card HTML for Custom Teacher
  const createCustomTeacherCardElement = (item) => {
    const card = document.createElement("article");
    card.className = "custom-teacher-card teacher-card";
    if (item.id) {
      card.setAttribute("data-id", item.id);
    }
    const teacherDept = item.dept || (item.designation && (item.designation.includes("বিজ্ঞান") || item.designation.includes("গণিত") || item.designation.includes("আইসিটি")) ? "science" : "arts");
    card.setAttribute("data-category", teacherDept);

    const photoSrc = item.photo && item.photo.trim() !== ""
      ? item.photo
      : "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80";

    const deptText = teacherDept === "science" ? "বিজ্ঞান বিভাগ" : "মানবিক বিভাগ";
    const badgeText = item.type ? `${item.type} • ${deptText}` : deptText;

    card.innerHTML = `
      <div class="custom-teacher-photo-wrap">
        <img src="${photoSrc}" alt="${item.name}" class="custom-teacher-photo" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'">
        <span class="custom-teacher-badge">${badgeText}</span>
      </div>
      <div class="custom-teacher-details">
        <h4 class="custom-teacher-name">${item.name}</h4>
        <div class="custom-teacher-role">${item.designation}</div>
        ${item.qualification ? `
          <div class="custom-teacher-qual">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span><strong>যোগ্যতা:</strong> ${item.qualification}</span>
          </div>
        ` : ''}
        ${item.tribute ? `<p class="custom-teacher-bio">${item.tribute}</p>` : ''}
        <div class="custom-teacher-footer">
          <span>${item.years || item.period ? `কার্যকাল: <strong>${item.years || item.period}</strong>` : 'ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়'}</span>
          <button type="button" class="btn-remove-teacher" title="তালিকায় থেকে সরান">মুছে ফেলুন</button>
        </div>
      </div>
    `;

    const removeBtn = card.querySelector(".btn-remove-teacher");
    removeBtn?.addEventListener("click", () => {
      removeCustomTeacher(item.id, card, item.name);
    });

    return card;
  };

  // Load custom teachers into grid on page start
  const loadCustomFaculty = () => {
    if (!dynamicCustomFacultyGrid) return;
    const list = getSavedFaculty();
    if (list.length > 0) {
      if (customFacultySection) {
        customFacultySection.style.display = "block";
      }
      dynamicCustomFacultyGrid.innerHTML = "";
      list.forEach((item) => {
        const cardEl = createCustomTeacherCardElement(item);
        dynamicCustomFacultyGrid.appendChild(cardEl);
      });
    }
  };

  loadCustomFaculty();

  // Form Submit Handler
  formAddExTeacher?.addEventListener("submit", (e) => {
    e.preventDefault();
    const deptVal = document.getElementById("ex-dept")?.value || "science";
    const typeVal = document.getElementById("ex-type")?.value || "সহকারী শিক্ষক (বর্তমান)";
    const nameVal = document.getElementById("ex-name")?.value.trim() || "";
    const designationVal = document.getElementById("ex-designation")?.value.trim() || "";
    const qualVal = document.getElementById("ex-qual")?.value.trim() || "";
    const yearsVal = document.getElementById("ex-years")?.value.trim() || "";
    const tributeVal = document.getElementById("ex-tribute")?.value.trim() || "";
    const photoUrlVal = document.getElementById("ex-photo")?.value.trim() || "";
    const photoFileInput = document.getElementById("teacher-photo-file");

    if (!nameVal || !designationVal) {
      showToast("অনুগ্রহ করে শিক্ষকের পূর্ণ নাম ও পদবি প্রদান করুন।");
      return;
    }

    const finalizeAndSave = (photoData) => {
      const newTeacher = {
        id: "tchr_" + Date.now(),
        type: typeVal,
        dept: deptVal,
        name: nameVal,
        designation: designationVal,
        qualification: qualVal,
        years: yearsVal,
        tribute: tributeVal,
        photo: photoData || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
      };

      saveCustomTeacher(newTeacher);

      if (customFacultySection) {
        customFacultySection.style.display = "block";
      }

      if (dynamicCustomFacultyGrid) {
        const newCard = createCustomTeacherCardElement(newTeacher);
        newCard.style.animation = "fadeIn 0.5s ease forwards";
        dynamicCustomFacultyGrid.prepend(newCard);
      }

      showToast(`ধন্যবাদ! শিক্ষক ${nameVal}-এর তথ্য সফলভাবে তালিকায় যুক্ত হয়েছে।`);
      formAddExTeacher.reset();
      closeExTeacherModal();

      setTimeout(() => {
        customFacultySection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    };

    if (photoFileInput?.files && photoFileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        finalizeAndSave(uploadEvent.target.result);
      };
      reader.readAsDataURL(photoFileInput.files[0]);
    } else {
      finalizeAndSave(photoUrlVal);
    }
  });

  const facultyBtns = document.querySelectorAll(".faculty-btn");

  facultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      facultyBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");
      const allTeacherCards = document.querySelectorAll(".teacher-card");
      allTeacherCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";
        const categories = category.split(/\s+/);
        if (filterVal === "all" || categories.includes(filterVal)) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.35s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // =========================================================================
  // 7. Campus Photo Gallery Filter & Fullscreen Lightbox
  // =========================================================================
  const galleryFilterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      galleryFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");
      galleryItems.forEach((item) => {
        const cat = item.getAttribute("data-category");
        if (filterVal === "all" || cat === filterVal) {
          item.style.display = "block";
          item.style.animation = "fadeIn 0.35s ease forwards";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Lightbox Functionality
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-main-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCategory = document.getElementById("lightbox-category");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const btnCloseLightbox = document.getElementById("btn-close-lightbox");
  const btnLightboxPrev = document.getElementById("btn-lightbox-prev");
  const btnLightboxNext = document.getElementById("btn-lightbox-next");

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter((item) => item.style.display !== "none");

  const openLightbox = (index) => {
    const visible = visibleGalleryItems();
    if (!visible.length) return;
    currentGalleryIndex = (index + visible.length) % visible.length;
    const item = visible[currentGalleryIndex];

    const imgSrc = item.getAttribute("data-src") || item.querySelector("img").src;
    const title = item.getAttribute("data-title") || item.querySelector("h4").textContent;
    const category = item.querySelector(".gallery-item-category")?.textContent || "ক্যাম্পাস জীবন";

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxCounter) lightboxCounter.textContent = `${toBanglaNum(currentGalleryIndex + 1)} / ${toBanglaNum(visible.length)}`;

    lightboxModal?.classList.add("active");
    lightboxModal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // lock scroll
  };

  const closeLightbox = () => {
    lightboxModal?.classList.remove("active");
    lightboxModal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // unlock scroll
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const visible = visibleGalleryItems();
      const visibleIdx = visible.indexOf(item);
      openLightbox(visibleIdx !== -1 ? visibleIdx : index);
    });
  });

  btnCloseLightbox?.addEventListener("click", closeLightbox);
  btnLightboxPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(currentGalleryIndex - 1);
  });
  btnLightboxNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(currentGalleryIndex + 1);
  });

  // Close lightbox on backdrop click
  lightboxModal?.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // =========================================================================
  // 8. Toast Notification System (Global helper)
  // =========================================================================
  const showToast = (message) => {
    const toast = document.getElementById("toast-notice");
    const toastText = document.getElementById("toast-text");
    if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 5000);
    }
  };

  // =========================================================================
  // 8.5. CLEAN LIGHT THEME SYSTEM (DARK MODE PERMANENTLY REMOVED)
  // =========================================================================
  document.documentElement.setAttribute("data-theme", "light");
  try {
    localStorage.removeItem("ghoshgaon_theme");
  } catch (e) {}

  // Lightbox helper for Memory Photos
  window.viewMemoryPhoto = (imgSrc, title, subtitle) => {
    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = subtitle;
    if (lightboxCounter) lightboxCounter.textContent = "শিক্ষার্থী স্মৃতিকথা";
    lightboxModal?.classList.add("active");
    lightboxModal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  // =========================================================================
  // 9. STUDENT & ALUMNI MEMORIES GALLERY (DYNAMIC SHARING & LOCALSTORAGE)
  // =========================================================================
  const defaultAlumniMemories = [
    {
      id: "mem-1",
      name: "মোঃ আসাদুজ্জামান খন্দকার",
      batch: 1995,
      favoriteTeacher: "মরহুম আব্দুল খালেক স্যার (প্রধান শিক্ষক ও গণিত)",
      note: "স্কুলের সামনের বিশাল খেলার মাঠ আর পুরনো বটগাছের নিচে বন্ধুদের সাথে আড্ডার স্মৃতি এখনও চোখে ভাসে। খালেক স্যারের কঠোর শাসন আর বাবার মতো স্নেহ আমাদের মানুষ করেছে। টিফিনের ঘণ্টায় একসাথে দৌড়াদৌড়ির সেই সোনালী দিনগুলো জীবনে আর কখনো ফিরে পাবো না!",
      image: "hero-students.jpg",
      postDate: "১৫ অক্টোবর, ২০২৬",
      likes: 48,
      likedByUser: false
    },
    {
      id: "mem-2",
      name: "ফারহানা ইয়াসমিন স্বর্ণা",
      batch: 2006,
      favoriteTeacher: "রুকসানা পারভীন ম্যাডাম (ইংরেজি)",
      note: "ইংরেজি গ্রামার আর আন্তঃস্কুল বিতর্ক প্রতিযোগিতার জন্য রুকসানা ম্যাডাম সর্বদা পরম মমতায় উৎসাহ দিতেন। বিদ্যালয়ের লাল ইটের বারান্দা, শহীদ দিবসের প্রভাতফেরি আর বন্ধুদের সাথে ভাগ করে খাওয়া টিফিনের মধুর মুহূর্ত সারাজীবন হৃদয়ে অমলিন থাকবে।",
      image: "hero-campus.jpg",
      postDate: "১২ অক্টোবর, ২০২৬",
      likes: 39,
      likedByUser: false
    },
    {
      id: "mem-3",
      name: "প্রকৌশলী তানভীর আহমেদ",
      batch: 2018,
      favoriteTeacher: "মোস্তাফিজুর রহমান স্যার (পদার্থবিজ্ঞান ও বিজ্ঞান ক্লাব)",
      note: "বিজ্ঞান মেলায় আমাদের প্রথম উদ্ভাবনী রোবোটিক্স প্রোজেক্ট তৈরির পেছনে মোস্তাফিজ স্যারের অনুপ্রেরণা ছিল অতুলনীয়। পদার্থবিজ্ঞান ল্যাবের পরীক্ষা-নিরীক্ষা আর স্কুল মাঠের স্মৃতিগুলো আজও চোখে ভাসে। এই বিদ্যাপীঠ আমাদের স্বপ্ন দেখতে শিখিয়েছে।",
      image: "hero-books.jpg",
      postDate: "১০ অক্টোবর, ২০২৬",
      likes: 31,
      likedByUser: false
    },
    {
      id: "mem-4",
      name: "নাজমুল হুদা সৈকত",
      batch: 2024,
      favoriteTeacher: "মাহবুব আলম স্যার (ক্রীড়া ও শরীরচর্চা শিক্ষক)",
      note: "বার্ষিক ক্রীড়া প্রতিযোগিতায় ১০০ মিটার স্প্রিন্টে প্রথম স্থান অর্জন করে স্যারের পা ছুঁয়ে সালাম করার মুহূর্তটা কখনও ভুলবো না। স্যার বলেছিলেন, 'জীবনে যত বড়ই হও, নিজের শিকড়কে ভুলবে না।' ঘোষগাঁও শেরে বাংলা বিদ্যালয় আমাদের আত্মবিশ্বাস দিয়েছে।",
      image: "hero-students.jpg",
      postDate: "০৫ অক্টোবর, ২০২৬",
      likes: 27,
      likedByUser: false
    },
    {
      id: "mem-5",
      name: "ডা. মাহমুদুল হাসান সৌরভ",
      batch: 1991,
      favoriteTeacher: "মরহুম আব্দুল কাদের স্যার (সহকারী প্রধান শিক্ষক ও বিজ্ঞান)",
      note: "আজ চিকিৎসক হয়ে মানুষের সেবা করার পেছনে কাদের স্যারের বিজ্ঞান ক্লাসের অবদান চিরস্মরণীয়। বিদ্যালয়ের লাল মাটির মাঠ, বৃষ্টিভেজা দিনে বারান্দা দিয়ে বাড়ি ফেরা আর শিক্ষকদের স্নেহমাখা শাসনের স্মৃতি আজও চোখে জল এনে দেয়।",
      image: "hero-campus.jpg",
      postDate: "০৩ অক্টোবর, ২০২৬",
      likes: 45,
      likedByUser: false
    },
    {
      id: "mem-6",
      name: "সাজিদা সুলতানা নিঝুম",
      batch: 2003,
      favoriteTeacher: "মো. আবুল কালাম স্যার (বাংলা ও সাহিত্য)",
      note: "কালাম স্যারের বাংলা সাহিত্যের ক্লাস আমাদের কবিতার প্রেমে ফেলেছিল। প্রতি বছর একুশে ফেব্রুয়ারির দেয়াল পত্রিকা বের করার জন্য রাতের পর রাত জেগে কাজ করার স্মৃতি আজও মনে পড়ে। প্রিয় শিক্ষাপ্রতিষ্ঠানের জয়গান চিরকাল গাইবো।",
      image: "hero-books.jpg",
      postDate: "২৮ সেপ্টেম্বর, ২০২৬",
      likes: 36,
      likedByUser: false
    },
    {
      id: "mem-7",
      name: "মেহেদী হাসান রাব্বি",
      batch: 2014,
      favoriteTeacher: "মোছা. ফরিদা খাতুন ম্যাডাম (আইসিটি ও সহকারী শিক্ষক)",
      note: "আইসিটি ল্যাবে ফরিদা ম্যাডামের হাত ধরেই আমাদের প্রথম কম্পিউটার মাউস ধরা এবং ইন্টারনেট সম্পর্কে শেখা। শিক্ষায় প্রযুক্তির এই মেলবন্ধন আজ আমাদের টেক ও ফ্রিল্যান্সিং ক্যারিয়ার গড়তে প্রধান ভিত হয়ে দাঁড়িয়েছে।",
      image: "hero-students.jpg",
      postDate: "২২ সেপ্টেম্বর, ২০২৬",
      likes: 42,
      likedByUser: false
    },
    {
      id: "mem-8",
      name: "ফাহমিদা আক্তার প্রিয়া",
      batch: 2020,
      favoriteTeacher: "শামীমা নাসরিন ম্যাডাম (ভূগোল ও পরিবেশ)",
      note: "করোনাকালের ঠিক আগে আমাদের এসএসসি পরীক্ষা ও বিদায় অনুষ্ঠানটি ছিল অত্যন্ত আবেগঘন। স্কুলের সবুজ বাগান, প্রাত্যহিক সমাবেশ আর বন্ধুদের সাথে জাতীয় সংগীত গাওয়ার অপূর্ব অনুভূতি পৃথিবীর আর কোথাও পাওয়া যাবে না।",
      image: "hero-campus.jpg",
      postDate: "১৭ সেপ্টেম্বর, ২০২৬",
      likes: 29,
      likedByUser: false
    },
    {
      id: "mem-9",
      name: "কামরুল আহসান তুহিন",
      batch: 1988,
      favoriteTeacher: "মরহুম শামসুল হুদা স্যার (প্রধান শিক্ষক)",
      note: "বিদ্যালয়ের প্রতিষ্ঠালগ্নের সেই টিনশেড ঘর থেকে আজকের আধুনিক বহুতল ভবন—এই রূপান্তর দেখে বুক গর্বে ভরে ওঠে। স্যারদের নৈতিক শিক্ষার আলোই আমার দীর্ঘ জীবনের প্রতিটি পদে সঠিক পথ দেখিয়েছে।",
      image: "hero-books.jpg",
      postDate: "১২ সেপ্টেম্বর, ২০২৬",
      likes: 53,
      likedByUser: false
    },
    {
      id: "mem-10",
      name: "তাসনিম জাহান তানহা",
      batch: 2025,
      favoriteTeacher: "মো. নজরুল ইসলাম স্যার (গণিত)",
      note: "গণিতের জটিল সূত্রগুলোকে নজরুল স্যার এতো সহজ করে বুঝিয়ে দিতেন যে অংক নিয়ে আমাদের ভীতি কেটে আনন্দের বিষয় হয়ে উঠেছিল। বন্ধুদের সাথে টিফিনে আড্ডা আর বার্ষিক সাংস্কৃতিক অনুষ্ঠানের স্মৃতি চিরকাল অমূল্য হয়ে থাকবে।",
      image: "hero-students.jpg",
      postDate: "০৮ সেপ্টেম্বর, ২০২৬",
      likes: 24,
      likedByUser: false
    }
  ];

  const MEMORIES_STORAGE_KEY = "ghoshgaon_shere_bangla_memories_v3";

  const getStoredMemories = () => {
    try {
      const saved = localStorage.getItem(MEMORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Storage read error:", err);
    }
    try {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(defaultAlumniMemories));
    } catch (e) { }
    return defaultAlumniMemories;
  };

  const saveStoredMemories = (memoriesList) => {
    try {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(memoriesList));
    } catch (err) {
      console.warn("Storage write error:", err);
    }
  };

  // Populate SSC Batch dropdown (2026 down to 1973)
  const batchSelect = document.getElementById("mem-ssc-year");
  if (batchSelect) {
    batchSelect.innerHTML = '<option value="" disabled selected>এসএসসি ব্যাচ নির্বাচন করুন (১৯৭৩ – ২০২৬)</option>';
    for (let yr = 2026; yr >= 1973; yr--) {
      const opt = document.createElement("option");
      opt.value = yr;
      opt.textContent = `এসএসসি ব্যাচ: ${toBanglaNum(yr)}`;
      batchSelect.appendChild(opt);
    }
  }

  // Helpers
  const getAuthorInitial = (name) => {
    if (!name) return "স্ম";
    const cleaned = name.replace(/^(মোঃ|মো\.|মোহাম্মদ|মোসাঃ|মোছাঃ)\s*/i, "").trim();
    return cleaned ? cleaned.charAt(0) : name.charAt(0);
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
  };

  const memoriesGrid = document.getElementById("alumni-memories-grid");
  const memoriesCountBadge = document.getElementById("memories-count-badge");
  let currentDecadeFilter = "all";

  // Render Memories
  const renderMemories = (decade = "all") => {
    if (!memoriesGrid) return;
    const allMemories = getStoredMemories();

    if (memoriesCountBadge) {
      memoriesCountBadge.textContent = toBanglaNum(allMemories.length);
    }

    const filtered = allMemories.filter((m) => {
      const b = parseInt(m.batch, 10);
      if (decade === "all") return true;
      if (decade === "1990") return b <= 1999;
      if (decade === "2000") return b >= 2000 && b <= 2009;
      if (decade === "2010") return b >= 2010 && b <= 2019;
      if (decade === "2020") return b >= 2020;
      return true;
    });

    if (filtered.length === 0) {
      memoriesGrid.innerHTML = `
        <div class="memory-empty-state">
          <span class="empty-icon">🌱</span>
          <h4>এই দশকে এখনও কোনো স্মৃতি শেয়ার করা হয়নি</h4>
          <p>আপনি কি এই সময়ের শিক্ষার্থী ছিলেন? আপনার স্মৃতি ও পুরনো ছবি শেয়ার করে প্রথম স্মৃতিচিহ্ন রেখে যান!</p>
          <button class="btn btn-primary" type="button" onclick="openMemoryModal()">
            <span>নিজের স্মৃতি শেয়ার করুন 📸</span>
          </button>
        </div>
      `;
      return;
    }

    memoriesGrid.innerHTML = filtered
      .map((item) => {
        const safeName = escapeHtml(item.name);
        const safeBatch = toBanglaNum(item.batch);
        const initial = getAuthorInitial(item.name);
        const likesBn = toBanglaNum(item.likes || 0);
        const isLiked = !!item.likedByUser;

        return `
          <div class="memory-card" id="memory-card-${item.id}" onclick="openMemoryDetailModal('${item.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); openMemoryDetailModal('${item.id}');}" title="${safeName}-এর স্মৃতিকথা বিস্তারিত দেখতে ক্লিক করুন">
            <div class="memory-card-photo-wrap">
              <img src="${item.image}" alt="${safeName}-এর ছবি" class="memory-card-img" loading="lazy">
              <div class="memory-batch-badge">
                <span>ব্যাচ: ${safeBatch}</span>
              </div>
              <div class="memory-zoom-hint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>স্মৃতিকথা</span>
              </div>
            </div>
            <div class="memory-card-body">
              <div class="memory-author-row-clean">
                <div class="memory-author-avatar">${initial}</div>
                <div class="memory-author-meta">
                  <h4 class="memory-author-name">${safeName}</h4>
                  <span class="memory-alumni-badge">সাবেক শিক্ষার্থী</span>
                </div>
              </div>
              <div class="memory-card-footer">
                <button type="button" class="memory-like-btn ${isLiked ? "liked" : ""}" data-id="${item.id}" onclick="event.stopPropagation(); toggleMemoryLike('${item.id}')" aria-label="স্মৃতি পছন্দ করুন">
                  <span class="like-heart">${isLiked ? "❤️" : "🤍"}</span>
                  <span class="like-count">${likesBn}</span>
                </button>
                <span class="memory-click-prompt">বিস্তারিত ➔</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    memoriesGrid.scrollLeft = 0;
    setTimeout(() => {
      if (typeof updateMemorySliderControls === "function") {
        updateMemorySliderControls();
      }
    }, 50);
  };

  // Active Memory detail ID
  let activeDetailMemoryId = null;

  // Like Toggle Function (Card & Modal)
  window.toggleMemoryLike = (memId) => {
    if (!memId) return;
    const allMemories = getStoredMemories();
    const target = allMemories.find((m) => String(m.id) === String(memId));
    if (target) {
      if (target.likedByUser) {
        target.likes = Math.max(0, (target.likes || 1) - 1);
        target.likedByUser = false;
      } else {
        target.likes = (target.likes || 0) + 1;
        target.likedByUser = true;
      }
      saveStoredMemories(allMemories);
      renderMemories(currentDecadeFilter);

      // Sync modal like button if open
      if (activeDetailMemoryId === target.id) {
        updateModalLikeUI(target);
      }
    }
  };

  window.toggleMemoryLikeFromModal = () => {
    if (activeDetailMemoryId) {
      window.toggleMemoryLike(activeDetailMemoryId);
    }
  };

  const updateModalLikeUI = (target) => {
    const modalLikeBtn = document.getElementById("mem-detail-like-btn");
    const modalLikeIcon = document.getElementById("mem-detail-like-icon");
    const modalLikeCount = document.getElementById("mem-detail-like-count");
    if (!modalLikeBtn) return;

    if (target.likedByUser) {
      modalLikeBtn.classList.add("liked");
      if (modalLikeIcon) modalLikeIcon.textContent = "❤️";
    } else {
      modalLikeBtn.classList.remove("liked");
      if (modalLikeIcon) modalLikeIcon.textContent = "🤍";
    }
    if (modalLikeCount) modalLikeCount.textContent = toBanglaNum(target.likes || 0);
  };

  // Memory Detail Modal Controls (Opens on card click)
  const memoryDetailModal = document.getElementById("memory-detail-modal");
  const memDetailImg = document.getElementById("mem-detail-img");
  const memDetailBatch = document.getElementById("mem-detail-batch");
  const memDetailName = document.getElementById("mem-detail-name");
  const memDetailDate = document.getElementById("mem-detail-date");
  const memDetailTeacher = document.getElementById("mem-detail-teacher");
  const memDetailNote = document.getElementById("mem-detail-note");

  window.openMemoryDetailModal = (memId) => {
    const allMemories = getStoredMemories();
    const target = allMemories.find((m) => String(m.id) === String(memId));
    if (!target) return;

    activeDetailMemoryId = target.id;

    if (memDetailImg) {
      memDetailImg.src = target.image || "hero-students.jpg";
      memDetailImg.alt = `${target.name}-এর ছবি`;
    }
    if (memDetailBatch) {
      memDetailBatch.textContent = `🎓 এসএসসি ব্যাচ: ${toBanglaNum(target.batch)}`;
    }
    if (memDetailName) {
      memDetailName.textContent = target.name;
    }
    if (memDetailDate) {
      memDetailDate.textContent = `📅 প্রকাশকাল: ${target.postDate || "সম্প্রতি"}`;
    }
    if (memDetailTeacher) {
      memDetailTeacher.textContent = target.favoriteTeacher || "বিদ্যালয়ের সকল শিক্ষক-শিক্ষিকা";
    }
    if (memDetailNote) {
      memDetailNote.textContent = target.note;
    }

    updateModalLikeUI(target);

    if (memoryDetailModal) {
      memoryDetailModal.classList.add("active");
      memoryDetailModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeMemoryDetailModal = () => {
    if (memoryDetailModal) {
      memoryDetailModal.classList.remove("active");
      memoryDetailModal.setAttribute("aria-hidden", "true");
      // Check if other modal open before restoring overflow
      const submitModalOpen = memoryModal?.classList.contains("active");
      const lightboxOpen = lightboxModal?.classList.contains("active");
      if (!submitModalOpen && !lightboxOpen) {
        document.body.style.overflow = "";
      }
    }
  };

  // Close Detail Modal on backdrop click
  memoryDetailModal?.addEventListener("click", (e) => {
    if (e.target === memoryDetailModal) {
      window.closeMemoryDetailModal();
    }
  });

  // Global Escape key support for all modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (memoryDetailModal?.classList.contains("active")) {
        window.closeMemoryDetailModal();
      } else if (memoryModal?.classList.contains("active")) {
        window.closeMemoryModal();
      } else if (lightboxModal?.classList.contains("active")) {
        closeLightbox();
      }
    }
  });

  // Decade Filter Buttons
  const decadeFilterBtns = document.querySelectorAll(".memory-filter-btn");
  decadeFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      decadeFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentDecadeFilter = btn.getAttribute("data-decade") || "all";
      renderMemories(currentDecadeFilter);
    });
  });



  // Memory Slider Navigation Functions (Desktop: 5 cards per view, smooth slide)
  const slideMemories = (direction) => {
    if (!memoriesGrid) return;
    const firstCard = memoriesGrid.querySelector(".memory-card");
    const gap = parseFloat(window.getComputedStyle(memoriesGrid).gap) || 16;
    const cardWidth = firstCard ? firstCard.offsetWidth : 220;
    // Slide by 2 cards on desktop, 1 on tablet/mobile
    const stepCount = window.innerWidth >= 1200 ? 2 : 1;
    const scrollStep = (cardWidth + gap) * stepCount;
    memoriesGrid.scrollBy({
      left: direction === "next" ? scrollStep : -scrollStep,
      behavior: "smooth"
    });
  };

  const updateMemorySliderControls = () => {
    if (!memoriesGrid) return;
    const prevBtn = document.getElementById("btn-memory-slider-prev");
    const nextBtn = document.getElementById("btn-memory-slider-next");
    const bottomPrev = document.getElementById("btn-memory-bottom-prev");
    const bottomNext = document.getElementById("btn-memory-bottom-next");
    const indicatorText = document.getElementById("memory-indicator-text");

    const cards = memoriesGrid.querySelectorAll(".memory-card");
    const total = cards.length;
    if (total === 0) {
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      if (bottomPrev) bottomPrev.disabled = true;
      if (bottomNext) bottomNext.disabled = true;
      if (indicatorText) indicatorText.textContent = "কোনো স্মৃতি পাওয়া যায়নি";
      return;
    }

    const sl = memoriesGrid.scrollLeft;
    const maxScroll = Math.max(0, memoriesGrid.scrollWidth - memoriesGrid.clientWidth);
    const atStart = sl <= 6;
    const atEnd = sl >= maxScroll - 6;

    if (prevBtn) prevBtn.disabled = atStart;
    if (bottomPrev) bottomPrev.disabled = atStart;
    if (nextBtn) nextBtn.disabled = atEnd;
    if (bottomNext) bottomNext.disabled = atEnd;

    if (indicatorText) {
      const cardWidth = cards[0] ? cards[0].offsetWidth : 220;
      const gap = parseFloat(window.getComputedStyle(memoriesGrid).gap) || 16;
      const step = cardWidth + gap;
      const visibleCount = Math.max(1, Math.round(memoriesGrid.clientWidth / step));
      const startIdx = Math.min(total, Math.max(1, Math.round(sl / step) + 1));
      const endIdx = Math.min(total, startIdx + visibleCount - 1);
      if (startIdx >= endIdx) {
        indicatorText.textContent = `স্মৃতি ${toBanglaNum(startIdx)} / মোট ${toBanglaNum(total)}টি (স্লাইড করুন)`;
      } else {
        indicatorText.textContent = `স্মৃতি ${toBanglaNum(startIdx)}–${toBanglaNum(endIdx)} / মোট ${toBanglaNum(total)}টি (স্লাইড করুন)`;
      }
    }
  };

  // Wire up slider arrow & bottom buttons
  document.getElementById("btn-memory-slider-prev")?.addEventListener("click", () => slideMemories("prev"));
  document.getElementById("btn-memory-slider-next")?.addEventListener("click", () => slideMemories("next"));
  document.getElementById("btn-memory-bottom-prev")?.addEventListener("click", () => slideMemories("prev"));
  document.getElementById("btn-memory-bottom-next")?.addEventListener("click", () => slideMemories("next"));

  memoriesGrid?.addEventListener("scroll", updateMemorySliderControls, { passive: true });
  window.addEventListener("resize", updateMemorySliderControls);

  // Setup Mouse Drag-to-Scroll on Alumni Memories Grid
  const setupMemoryDragToScroll = () => {
    if (!memoriesGrid) return;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let dragMoved = false;

    memoriesGrid.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      isDown = true;
      dragMoved = false;
      memoriesGrid.classList.add("is-dragging");
      startX = e.pageX - memoriesGrid.offsetLeft;
      scrollStart = memoriesGrid.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      memoriesGrid.classList.remove("is-dragging");
    });

    memoriesGrid.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - memoriesGrid.offsetLeft;
      const walk = (x - startX) * 1.35;
      if (Math.abs(walk) > 6) {
        dragMoved = true;
      }
      memoriesGrid.scrollLeft = scrollStart - walk;
    });

    memoriesGrid.addEventListener("click", (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);
  };

  setupMemoryDragToScroll();

  // Initial Memory Render
  renderMemories("all");

  // Memory Submission Modal Controls
  const memoryModal = document.getElementById("memory-submit-modal");
  const btnCloseMemoryModal = document.getElementById("btn-close-memory-modal");
  const btnOpenMemoryModal = document.getElementById("btn-open-memory-modal");

  window.openMemoryModal = () => {
    if (memoryModal) {
      memoryModal.classList.add("active");
      memoryModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.getElementById("mem-student-name")?.focus();
      }, 100);
    }
  };

  window.closeMemoryModal = () => {
    if (memoryModal) {
      memoryModal.classList.remove("active");
      memoryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  btnOpenMemoryModal?.addEventListener("click", () => window.openMemoryModal());
  btnCloseMemoryModal?.addEventListener("click", () => window.closeMemoryModal());
  memoryModal?.addEventListener("click", (e) => {
    if (e.target === memoryModal) {
      window.closeMemoryModal();
    }
  });

  // Populate SSC Batch Years (1973 to 2026)
  const memoryYearSelect = document.getElementById("mem-ssc-year");
  if (memoryYearSelect && memoryYearSelect.options.length <= 1) {
    for (let yr = 2026; yr >= 1973; yr--) {
      const opt = document.createElement("option");
      opt.value = yr;
      opt.textContent = `এসএসসি ব্যাচ ${toBanglaNum(yr)}`;
      memoryYearSelect.appendChild(opt);
    }
  }

  // Photo Upload & Preset Image Handling
  let selectedPhotoData = "";
  const uploadZone = document.getElementById("memory-upload-zone");
  const fileInput = document.getElementById("mem-photo-file");
  const uploadZonePrompt = document.getElementById("upload-zone-prompt");
  const uploadPreviewBox = document.getElementById("upload-preview-box");
  const uploadPreviewImg = document.getElementById("upload-preview-img");
  const previewFilename = document.getElementById("preview-filename");
  const btnChangePhoto = document.getElementById("btn-change-photo");
  const presetBtns = document.querySelectorAll(".preset-btn");

  uploadZone?.addEventListener("click", (e) => {
    if (e.target.closest("#btn-change-photo")) return;
    fileInput?.click();
  });

  uploadZone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone?.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("অনুগ্রহ করে একটি সঠিক ছবির ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedPhotoData = event.target.result;
      if (uploadPreviewImg) uploadPreviewImg.src = selectedPhotoData;
      if (previewFilename) previewFilename.textContent = `নির্বাচিত ছবি: ${file.name}`;
      if (uploadZonePrompt) uploadZonePrompt.style.display = "none";
      if (uploadPreviewBox) uploadPreviewBox.style.display = "flex";
      presetBtns.forEach((b) => b.classList.remove("selected"));
    };
    reader.readAsDataURL(file);
  };

  fileInput?.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  btnChangePhoto?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedPhotoData = "";
    if (fileInput) fileInput.value = "";
    if (uploadPreviewBox) uploadPreviewBox.style.display = "none";
    if (uploadZonePrompt) uploadZonePrompt.style.display = "flex";
    presetBtns.forEach((b) => b.classList.remove("selected"));
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedPhotoData = btn.getAttribute("data-src") || "hero-students.jpg";
      if (uploadPreviewImg) uploadPreviewImg.src = selectedPhotoData;
      const label = btn.querySelector("span")?.textContent || "নমুনা ছবি";
      if (previewFilename) previewFilename.textContent = `নমুনা ছবি বাছাইকৃত: ${label}`;
      if (uploadZonePrompt) uploadZonePrompt.style.display = "none";
      if (uploadPreviewBox) uploadPreviewBox.style.display = "flex";
      if (fileInput) fileInput.value = "";
    });
  });

  // Handle Form Submission
  const alumniMemoryForm = document.getElementById("alumni-memory-form");
  if (alumniMemoryForm) {
    alumniMemoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("mem-student-name");
      const yearSelect = document.getElementById("mem-ssc-year");
      const teacherInput = document.getElementById("mem-fav-teacher");
      const noteInput = document.getElementById("mem-school-note");

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const yearVal = yearSelect ? parseInt(yearSelect.value, 10) : 0;
      const teacherVal = teacherInput ? teacherInput.value.trim() : "";
      const noteVal = noteInput ? noteInput.value.trim() : "";

      if (!nameVal || !yearVal || !teacherVal || !noteVal) {
        showToast("অনুগ্রহ করে আপনার নাম, ব্যাচ, প্রিয় শিক্ষক এবং স্মৃতিকথা পূরণ করুন।");
        return;
      }

      const finalImage = selectedPhotoData || "hero-students.jpg";

      // Current Bengali Date
      const now = new Date();
      const monthsBn = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
      const formattedDate = `${toBanglaNum(now.getDate())} ${monthsBn[now.getMonth()]}, ${toBanglaNum(now.getFullYear())}`;

      const newEntry = {
        id: "mem-" + Date.now(),
        name: nameVal,
        batch: yearVal,
        favoriteTeacher: teacherVal,
        note: noteVal,
        image: finalImage,
        postDate: formattedDate,
        likes: 1,
        likedByUser: true
      };

      const all = getStoredMemories();
      all.unshift(newEntry);
      saveStoredMemories(all);

      if (isCloudActive && firestoreDb) {
        firestoreDb.collection("memories").doc(newEntry.id).set(newEntry).catch((err) => {
          console.warn("Cloud memories sync warning:", err);
        });
      }
      if (typeof renderDashboardMemoriesTable === "function") {
        renderDashboardMemoriesTable();
      }
      if (typeof updateTabBadges === "function") {
        updateTabBadges();
      }

      // Reset form
      alumniMemoryForm.reset();
      selectedPhotoData = "";
      if (uploadPreviewBox) uploadPreviewBox.style.display = "none";
      if (uploadZonePrompt) uploadZonePrompt.style.display = "flex";
      presetBtns.forEach((b) => b.classList.remove("selected"));

      // Reset filter to all and re-render
      currentDecadeFilter = "all";
      decadeFilterBtns.forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-decade") === "all");
      });

      renderMemories("all");
      window.closeMemoryModal();

      showToast(`অভিনন্দন ${nameVal}! আপনার সোনালী স্মৃতিকথা ও ছবি সফলভাবে গ্যালারিতে প্রকাশিত হয়েছে।`);

      // Scroll to newly added card
      setTimeout(() => {
        const newCard = document.getElementById(`memory-card-${newEntry.id}`);
        if (newCard) {
          newCard.scrollIntoView({ behavior: "smooth", block: "center" });
          newCard.style.outline = "3px solid var(--color-accent-gold)";
          newCard.style.boxShadow = "0 0 25px rgba(230, 169, 58, 0.5)";
          setTimeout(() => {
            newCard.style.outline = "";
            newCard.style.boxShadow = "";
          }, 3500);
        }
      }, 350);
    });
  }

  // =========================================================================
  // 10. Modal Utilities, Online Admissions & Keyboard Accessibility
  // =========================================================================
  const admissionModal = document.getElementById("admission-modal-overlay");
  const formAdmission = document.getElementById("form-online-admission");

  window.openAdmissionModal = () => {
    if (admissionModal) {
      admissionModal.classList.add("active");
      admissionModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.getElementById("adm-student-name")?.focus();
      }, 100);
    }
  };

  window.closeAdmissionModal = () => {
    if (admissionModal) {
      admissionModal.classList.remove("active");
      admissionModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  admissionModal?.addEventListener("click", (e) => {
    if (e.target === admissionModal) {
      window.closeAdmissionModal();
    }
  });

  // Admission form submit
  if (formAdmission) {
    formAdmission.addEventListener("submit", (e) => {
      e.preventDefault();
      const studentName = document.getElementById("adm-student-name")?.value.trim() || "";
      const desiredClass = document.getElementById("adm-desired-class")?.value || "";
      const dob = document.getElementById("adm-dob")?.value || "";
      const guardianName = document.getElementById("adm-guardian-name")?.value.trim() || "";
      const guardianPhone = document.getElementById("adm-guardian-phone")?.value.trim() || "";
      const prevSchool = document.getElementById("adm-prev-school")?.value.trim() || "";
      const address = document.getElementById("adm-address")?.value.trim() || "";
      const notes = document.getElementById("adm-notes")?.value.trim() || "";

      if (!studentName || !desiredClass || !guardianPhone) {
        showToast("অনুগ্রহ করে শিক্ষার্থীর নাম, শ্রেণি এবং অভিভাবকের ফোন নম্বর সঠিকভাবে পূরণ করুন।");
        return;
      }

      const appId = "ADM-" + Math.floor(100000 + Math.random() * 900000);
      const appRecord = {
        id: appId,
        applicantName: studentName,
        desiredClass: desiredClass,
        dob: dob,
        guardianName: guardianName,
        guardianPhone: guardianPhone,
        previousSchool: prevSchool,
        address: address,
        notes: notes,
        status: "Pending",
        submissionDate: new Date().toLocaleDateString("bn-BD"),
        timestamp: Date.now()
      };

      // 1. Save to Central Database Engine
      if (window.SchoolDB && window.SchoolDB.submitAdmission) {
        try {
          window.SchoolDB.submitAdmission(appRecord);
        } catch (err) {
          console.error("SchoolDB admission save error:", err);
        }
      }

      // 2. Broadcast to open Admin Dashboard tabs (0ms instant sync)
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const ch = new BroadcastChannel("ghoshgaon_visitor_sync");
          ch.postMessage({ type: "NEW_ADMISSION", record: appRecord });
        }
      } catch (err) {}

      // 3. Save to Firebase Firestore Cloud if active
      if (isCloudActive && firestoreDb) {
        firestoreDb.collection("admissions").doc(appRecord.id).set(appRecord).catch((err) => {
          console.warn("Firestore admission cloud error:", err);
        });
      }

      // 4. Update tab badges and admissions table if modal open
      updateTabBadges();
      renderDashboardAdmissionsTable();

      // 5. Reset & Close
      formAdmission.reset();
      window.closeAdmissionModal();

      // 6. Success notification
      showToast(`🎉 ভর্তি আবেদন সফলভাবে দাখিল হয়েছে! আবেদন নম্বর #${appId}। প্রশাসন দ্রুত আপনার সাথে যোগাযোগ করবে।`);
    });
  }

  // Keyboard accessibility: Escape to close all modals, Arrow keys for gallery
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      if (typeof window.closeMemoryModal === "function") {
        window.closeMemoryModal();
      }
      if (typeof window.closeAdmissionModal === "function") {
        window.closeAdmissionModal();
      }
    }
    if (lightboxModal?.classList.contains("active")) {
      if (e.key === "ArrowLeft") openLightbox(currentGalleryIndex - 1);
      if (e.key === "ArrowRight") openLightbox(currentGalleryIndex + 1);
    }
  });

  // Quick Inquiry Form Submission
  const inquiryForm = document.getElementById("contact-inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const parentName = document.getElementById("inq-parent-name")?.value || "অভিভাবক";
      const phone = document.getElementById("inq-phone")?.value || "";
      const message = document.getElementById("inq-message")?.value || "";

      const msgObj = {
        id: "MSG-" + Date.now().toString().slice(-6),
        name: parentName,
        phone: phone,
        subject: 'অভিযোগ বা ভর্তি নোট',
        message: message,
        timestamp: Date.now(),
        date: new Date().toLocaleString("bn-BD"),
        status: "Unread"
      };

      if (window.SchoolDB && window.SchoolDB.submitMessage) {
        try {
          window.SchoolDB.submitMessage(msgObj);
        } catch (err) {}
      }

      // Broadcast to open Admin Dashboard tabs (0ms instant sync)
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const ch = new BroadcastChannel("ghoshgaon_visitor_sync");
          ch.postMessage({ type: "NEW_MESSAGE", record: msgObj });
        }
      } catch (err) {}

      if (isCloudActive && firestoreDb) {
        firestoreDb.collection("messages").doc(msgObj.id).set(msgObj).catch((err) => {
          console.warn("Cloud message sync error:", err);
        });
      }

      updateTabBadges();
      renderDashboardAdmissionsTable();

      inquiryForm.reset();
      showToast(`আপনার নোট ও বার্তা জমা হয়েছে! ধন্যবাদ ${parentName}। প্রতিষ্ঠান প্রশাসন দ্রুত আপনার সাথে যোগাযোগ করবে।`);
    });
  }

  // Footer Newsletter Submission
  const newsletterForm = document.getElementById("footer-newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast("ধন্যবাদ! ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়ের শিক্ষাবার্তায় আপনার সাবস্ক্রিপশন সফল হয়েছে।");
    });
  }

  // =========================================================================
  // 17. KINETIC WORD-BY-WORD MORPHING TEXT ANIMATION
  // Words arrive sequentially -> form full name -> lock & golden shimmer ->
  // dissolve / scatter away ("benge jabe") -> rebuild in alternate styles!
  // =========================================================================
  const initBrandMorphAnimation = () => {
    const track = document.getElementById("brand-words-track");
    const container = document.getElementById("brand-morph-name");
    if (!track || !container) return;

    const words = Array.from(track.querySelectorAll(".brand-word"));
    if (words.length === 0) return;

    const styles = ["morph-style-1", "morph-style-2", "morph-style-3"];
    let currentStyleIndex = 0;
    let isRunning = true;
    let isHovered = false;

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      words.forEach((w) => {
        w.className = "brand-word word-visible";
      });
      return;
    }

    const runMorphCycle = async () => {
      if (!isRunning) return;

      const currentStyle = styles[currentStyleIndex];

      // Reset classes for current cycle style
      styles.forEach((s) => container.classList.remove(s));
      container.classList.remove("words-dissolving", "full-name-locked");
      container.classList.add(currentStyle);

      // 1. Reset all words to hidden state for new entrance
      words.forEach((word) => {
        word.className = "brand-word word-hidden";
        word.style.transitionDelay = "0ms";
      });

      // Brief breather
      await new Promise((r) => setTimeout(r, 160));

      // 2. Animate each word in sequentially ("akta akta word ashbe")
      const wordDelay = 260; // ms between consecutive words
      for (let i = 0; i < words.length; i++) {
        if (!isRunning) return;
        words[i].classList.remove("word-hidden");
        words[i].classList.add("word-visible");
        await new Promise((r) => setTimeout(r, wordDelay));
      }

      // 3. Full name is complete ("aisa full name hobe") -> Trigger Golden Beam Shimmer
      await new Promise((r) => setTimeout(r, 220));
      container.classList.add("full-name-locked");

      // 4. Hold full readable name proudly for 2.8 seconds
      let holdRemaining = 2800;
      while (holdRemaining > 0) {
        if (!isRunning) return;
        if (!isHovered) {
          holdRemaining -= 200;
        }
        await new Promise((r) => setTimeout(r, 200));
      }

      // 5. Dissolve / Disperse words ("abar benge jabe giea")
      container.classList.remove("full-name-locked");
      container.classList.add("words-dissolving");

      // Staggered dissolve wave across words
      words.forEach((word, index) => {
        word.style.transitionDelay = `${index * 55}ms`;
      });

      // Wait for dissolution transition to finish (680ms)
      await new Promise((r) => setTimeout(r, 680));

      // 6. Advance to the next style ("aste aste onno style e make hobe")
      currentStyleIndex = (currentStyleIndex + 1) % styles.length;

      // Small pause before new style assembles
      await new Promise((r) => setTimeout(r, 360));

      // Loop to next cycle!
      runMorphCycle();
    };

    // Pause hold time on hover so users can click/read comfortably
    container.addEventListener("mouseenter", () => {
      isHovered = true;
    });
    container.addEventListener("mouseleave", () => {
      isHovered = false;
    });

    // Pause when tab is inactive to prevent queue buildup
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isRunning = false;
      } else {
        if (!isRunning) {
          isRunning = true;
          runMorphCycle();
        }
      }
    });

    // Start kinetic cycle
    runMorphCycle();
  };

  initBrandMorphAnimation();

  // =========================================================================
  // 18. ABOUT SECTION VIDEO CONTROLLER (4:5 Muted Continuous Autoplay Loop)
  // Ensures 100% reliable muted autoplay on iOS, Android & Desktop browsers
  // without pause or sound controls, automatically looping endlessly
  // =========================================================================
  const initAboutVideoShowcase = () => {
    const video = document.getElementById("about-school-video");
    const frame = document.getElementById("about-video-frame");

    if (!video || !frame) return;

    // Strict browser compatibility flags for muted continuous autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.removeAttribute("controls");

    const attemptAutoplay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback on first user interaction if browser policy requires it
          const unlockAutoplay = () => {
            video.muted = true;
            video.play();
            window.removeEventListener("touchstart", unlockAutoplay);
            window.removeEventListener("click", unlockAutoplay);
            window.removeEventListener("scroll", unlockAutoplay);
          };
          window.addEventListener("touchstart", unlockAutoplay, { passive: true, once: true });
          window.addEventListener("click", unlockAutoplay, { passive: true, once: true });
          window.addEventListener("scroll", unlockAutoplay, { passive: true, once: true });
        });
      }
    };

    // Immediate attempt
    attemptAutoplay();

    // Auto-loop on ended event safeguard
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      attemptAutoplay();
    });

    // Auto-resume if browser paused it (e.g. tab switch or battery saver)
    video.addEventListener("pause", () => {
      if (!document.hidden) {
        setTimeout(attemptAutoplay, 150);
      }
    });

    // IntersectionObserver to ensure playback starts as soon as user scrolls towards section
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              attemptAutoplay();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(frame);
    }
  };

  initAboutVideoShowcase();

  // =========================================================================
  // 19. MOBILE TESTIMONIALS SLIDER (Manual One-by-One Navigation & Touch-Swipe)
  // Ensures testimonials slide one card at a time with Prev/Next buttons,
  // click dots, and native smooth snap-scroll. NO auto-timer ("click korle auto na abar").
  // =========================================================================
  const initMobileTestimonialsSlider = () => {
    const grid = document.getElementById("testimonials-grid");
    const prevBtn = document.getElementById("testimonial-prev-btn");
    const nextBtn = document.getElementById("testimonial-next-btn");
    const dotsContainer = document.getElementById("testimonial-slider-dots");

    if (!grid || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(grid.querySelectorAll(".testimonial-card"));
    const dots = Array.from(dotsContainer.querySelectorAll(".testimonial-dot"));
    if (cards.length === 0) return;

    let currentIndex = 0;

    // Smoothly scroll to target card index
    const scrollToCard = (index, smooth = true) => {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;
      currentIndex = index;

      const targetCard = cards[currentIndex];
      if (targetCard) {
        const targetLeft = targetCard.offsetLeft - grid.offsetLeft;
        grid.scrollTo({
          left: targetLeft,
          behavior: smooth ? "smooth" : "auto"
        });
      }

      updateControls();
    };

    const updateControls = () => {
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === cards.length - 1;
    };

    // Next button: strictly one card forward
    nextBtn.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        scrollToCard(currentIndex + 1);
      }
    });

    // Prev button: strictly one card backward
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        scrollToCard(currentIndex - 1);
      }
    });

    // Click dots: directly jump to specific card
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        scrollToCard(idx);
      });
    });

    // Real-time synchronization when user swipes or manually scrolls
    let scrollDebounce;
    grid.addEventListener("scroll", () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const scrollLeft = grid.scrollLeft;
        let closestIndex = 0;
        let minDiff = Infinity;

        cards.forEach((card, idx) => {
          const cardLeft = card.offsetLeft - grid.offsetLeft;
          const diff = Math.abs(scrollLeft - cardLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== currentIndex) {
          currentIndex = closestIndex;
          updateControls();
        }
      }, 50);
    }, { passive: true });

    // Keyboard navigation accessibility when focused
    grid.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) scrollToCard(currentIndex - 1);
      }
    });

    // Initialize controls state
    updateControls();
  };

  initMobileTestimonialsSlider();

  // ==========================================================================
  // YEARLY GOV. HOLIDAY LIST MODAL POPUP & EDUCATIONAL SHOWCASE
  // ==========================================================================
  const holidayEducationalData = {
    "mother-language-day": {
      id: "mother-language-day",
      name: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস",
      date: "📅 ২১ ফেব্রুয়ারি ২০২৬ (শনিবার)",
      duration: "১ দিন",
      type: "জাতীয় দিবস ও আন্তর্জাতিক স্বীকৃতি",
      icon: "🇧🇩",
      whatHappened: "১৯৫২ সালের ২১শে ফেব্রুয়ারি (৮ই ফাল্গুন ১৩৫৮) তৎকালীন পাকিস্তানি শাসকগোষ্ঠী উর্দুকে একমাত্র রাষ্ট্রভাষা করার ষড়যন্ত্রে লিপ্ত হলে বাংলার দামাল ছাত্র-জনতা ১৪৪ ধারা ভঙ্গ করে ঢাকা বিশ্ববিদ্যালয় এলাকা থেকে ঐতিহাসিক মিছিল বের করে। মেডিকেল কলেজের সামনে সেই শান্তিপূর্ণ মিছিলে পুলিশ নির্বিচারে গুলি বর্ষণ করে। এতে সালাম, বরকত, রফিক, জব্বার, শফিউর সহ নাম না জানা অনেকে বুকের তাজা রক্ত ঢেলে দিয়ে রাজপথ রঞ্জিত করেন। পৃথিবীর সমগ্র ইতিহাসে নিজের মাতৃভাষার মর্যাদা রক্ষায় রক্ত দেওয়ার এটিই প্রথম ও অনন্য ঘটনা।",
      whyCelebrated: "ভাষাশহীদদের অবিস্মরণীয় আত্মত্যাগের প্রতি বিনম্র শ্রদ্ধা জানাতে এবং রক্তের বিনিময়ে অর্জিত মায়ের ভাষা বাংলার মর্যাদা চিরউন্নত রাখতে প্রতি বছর গভীর শ্রদ্ধা ও ভালোবাসায় দিবসটি পালিত হয়। ১৯৯৯ সালের ১৭ নভেম্বর জাতিসংঘের অঙ্গসংস্থা ইউনেস্কো (UNESCO) এই দিনটিকে 'আন্তর্জাতিক মাতৃভাষা দিবস' হিসেবে স্বীকৃতি দেয়। ফলে আজ বিশ্বের ১৯৩টিরও বেশি দেশে সব জাতিগোষ্ঠীর নিজ নিজ মাতৃভাষা ও সাংস্কৃতিক বৈচিত্র্য সংরক্ষণের বৈশ্বিক প্রতীক হিসেবে এ দিনটি সগৌরবে উদযাপিত হয়।",
      studentMessage: "শহীদদের আত্মত্যাগ থেকে নিঃস্বার্থ দেশপ্রেম ও অন্যায়ের বিরুদ্ধে ন্যায়ের পক্ষে দাঁড়ানোর শিক্ষা নেওয়া। মাতৃভাষা বাংলাকে ভালোবাসা, শুদ্ধ উচ্চারণে কথা বলা ও লেখা এবং দেশের ইতিহাসকে শ্রদ্ধার সাথে স্মরণ করা প্রতিটি শিক্ষার্থীর পবিত্র দায়িত্ব।"
    },
    "independence-day": {
      id: "independence-day",
      name: "স্বাধীনতা ও জাতীয় দিবস",
      date: "📅 ২৬ মার্চ ২০২৬ (বৃহস্পতিবার)",
      duration: "১ দিন",
      type: "জাতীয় দিবস ও রাষ্ট্রীয় গৌরব",
      icon: "🇧🇩",
      whatHappened: "১৯৭১ সালের ২৫শে মার্চ কালরাতে পাকিস্তানি হানাদার বাহিনী তাদের বর্বর 'অপারেশন সার্চলাইট'-এর মাধ্যমে ঢাকাসহ সারা দেশে নিরস্ত্র বাঙালিদের ওপর বর্বরোচিত গণহত্যা শুরু করে। ২৬শে মার্চ প্রথম প্রহরে জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমান বাংলাদেশের স্বাধীনতা ঘোষণা করেন। এরপরই বীর বাঙালি দেশমাতৃকাকে শত্রুমুক্ত করতে সশস্ত্র মুক্তিযুদ্ধে ঝাঁপিয়ে পড়ে।",
      whyCelebrated: "দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের সূচনা এবং ৩০ লাখ শহীদ ও ২ লাখ মা-বোনের অসীম ত্যাগের বিনিময়ে অর্জিত স্বাধীন বাংলাদেশের আত্মপ্রকাশকে চিরস্মরণীয় করে রাখতে এ দিনটি পালিত হয়। মুক্ত স্বাধীন স্বদেশ গড়ার শপথ ও বীর মুক্তিযোদ্ধাদের প্রতি কৃতজ্ঞতা প্রকাশে পুরো জাতি এ দিনটি উদযাপন করে।",
      studentMessage: "স্বাধীনতার মূল্য বোঝা, মুক্তিযোদ্ধাদের অবদান শ্রদ্ধাভরে স্মরণ করা এবং সুশিক্ষায় শিক্ষিত হয়ে মেধা ও চরিত্র দিয়ে দেশ গড়ার কারিগর হওয়া।"
    },
    "victory-day": {
      id: "victory-day",
      name: "বিজয় দিবস, বড়দিন ও শীতকালীন অবকাশ",
      date: "📅 ১৬ ডিসেম্বর – ৩১ ডিসেম্বর ২০২৬",
      duration: "১৩ দিন",
      type: "জাতীয় দিবস ও দীর্ঘ অবকাশ",
      icon: "❄️",
      whatHappened: "১৯৭১ সালের ১৬ই ডিসেম্বর দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধ শেষে ঢাকার ঐতিহাসিক রেসকোর্স ময়দানে (বর্তমান সোহরাওয়ার্দী উদ্যান) পাকিস্তানি বাহিনীর ৯৩ হাজার সৈন্য মিত্র ও মুক্তিবাহিনীর যৌথ কমান্ডের কাছে নিঃশর্ত আত্মসমর্পণ করতে বাধ্য হয়। এর মাধ্যমে বিশ্বের মানচিত্রে লাল-সবুজের স্বাধীন সার্বভৌম বাংলাদেশের চূড়ান্ত বিজয় প্রতিষ্ঠিত হয়। একই সাথে ২৫শে ডিসেম্বর যিশু খ্রিস্টের শুভ জন্মদিন (বড়দিন) হিসেবেও উদযাপিত হয়।",
      whyCelebrated: "বাঙালি জাতির বীরত্বপূর্ণ সংগ্রাম ও বিজয়ের চিরস্মরণীয় অর্জনকে উদযাপন করতে এবং স্বাধীনতা যুদ্ধে আত্মোৎসর্গকারী বীর সেনানীদের প্রতি শ্রদ্ধা নিবেদনে এ দিবসটি উদযাপিত হয়। একই সাথে শীতকালীন অবকাশ ও বড়দিনের সর্বজনীন আনন্দের বার্তা নিয়ে দিনগুলো অতিবাহিত হয়।",
      studentMessage: "বিজয়ের ইতিহাস জানা, জাতীয় পতাকার মর্যাদা রক্ষা করা এবং অবকাশকালীন সময়ে পাঠ্যবইয়ের পাশাপাশি শিক্ষণীয় বই পড়ে জ্ঞানকে সমৃদ্ধ করা।"
    },
    "pahela-baishakh": {
      id: "pahela-baishakh",
      name: "বাংলা নববর্ষ (পহেলা বৈশাখ)",
      date: "📅 ১৪ এপ্রিল ২০২৬ (মঙ্গলবার)",
      duration: "১ দিন",
      type: "জাতীয় ও সর্বজনীন সাংস্কৃতিক উৎসব",
      icon: "🌾",
      whatHappened: "মোঘল সম্রাট আকবরের শাসনামলে ফসলি সন হিসেবে বাংলা সনের প্রবর্তন হয়। বৈশাখের প্রথম দিনে ব্যবসায়ীরা নতুন হিসাবের খাতা বা 'হালখাতা' খুলতেন এবং ক্রেতাদের মিষ্টিমুখ করাতেন। যুগ যুগ ধরে গ্রামবাংলায় মঙ্গল শোভাযাত্রা, লোকজ মেলা, পান্তা-ইলিশ ও সাংস্কৃতিক পরিবেশনার মাধ্যমে দিনটি পালিত হয়ে আসছে।",
      whyCelebrated: "বাঙালি জাতির হাজার বছরের ঐতিহ্য, সম্প্রীতি ও অহিংস সংস্কৃতির প্রতীক পহেলা বৈশাখ। জাতি, ধর্ম, বর্ণ নির্বিশেষে সবাইকে এক সূত্রে গেঁথে সব গ্লানি মুছে নতুন উদ্যমে বছর শুরু করার প্রত্যয়ে দিনটি অত্যন্ত আনন্দের সাথে পালিত হয়। ২০১৬ সালে মঙ্গল শোভাযাত্রা ইউনেস্কোর বিশ্ব সাংস্কৃতিক ঐতিহ্যের স্বীকৃতি পায়।",
      studentMessage: "নিজ সংস্কৃতি ও শেকড়কে ভালোবাসা, সাম্প্রদায়িক সম্প্রীতি বজায় রাখা এবং কুসংস্কারমুক্ত আধুনিক চিন্তাচেতনায় নিজেকে গড়ে তোলা।"
    },
    "ramadan-eid": {
      id: "ramadan-eid",
      name: "পবিত্র রমজান, শবে কদর ও ঈদুল ফিতর",
      date: "📅 ০১ মার্চ – ০১ এপ্রিল ২০২৬",
      duration: "২৬ দিন",
      type: "মুসলিম প্রধান ধর্মীয় উৎসব ও দীর্ঘ অবকাশ",
      icon: "🕌",
      whatHappened: "পবিত্র রমজান মাসে মানবজাতির হেদায়েতের জন্য মহাগ্রন্থ কুরআনুল কারিম নাজিল হয়। এক মাস ধরে মুসলিমগণ রোজা পালন করে আত্মসংযম ও তাকওয়ার প্রশিক্ষণ নেন। রমজানের শেষ দশকের লাইলাতুল কদর হাজার মাসের চেয়ে শ্রেষ্ঠ রাত হিসেবে পালিত হয়। এরপর শাওয়াল মাসের নতুন চাঁদ ওঠার সাথে সাথে মুসলিম উম্মাহ ঈদুল ফিতরের আনন্দে মেতে ওঠে।",
      whyCelebrated: "আল্লাহর সন্তুষ্টি অর্জন, আত্মশুদ্ধি, গরিব-অসহায় মানুষের ক্ষুধার কষ্ট উপলব্ধি করা এবং ফিতরা ও জাকাতের মাধ্যমে সমাজে ধনী-গরিবের বৈষম্য দূর করে ভ্রাতৃত্ব ও আনন্দের ভাগাভাগি করতে ঈদুল ফিতর পালিত হয়।",
      studentMessage: "সংযম, সততা, সহমর্মিতা ও গরিবের পাশে দাঁড়ানোর মহান শিক্ষা নিজের জীবনে বাস্তবায়ন করা।"
    },
    "eid-ul-adha": {
      id: "eid-ul-adha",
      name: "পবিত্র ঈদুল আজহা ও গ্রীষ্মকালীন অবকাশ",
      date: "📅 ২৬ মে – ১১ জুন ২০২৬",
      duration: "১৪ দিন",
      type: "মুসলিম ধর্মীয় উৎসব ও দীর্ঘ অবকাশ",
      icon: "☀️",
      whatHappened: "আল্লাহর আদেশে হযরত ইব্রাহিম (আ.) তাঁর প্রিয়তম পুত্র হযরত ইসমাইল (আ.)-কে কোরবানি দেওয়ার কঠিন পরীক্ষায় অবতীর্ণ হন। তাঁর পরম আনুগত্যে সন্তুষ্ট হয়ে আল্লাহ একটি দুম্বা কোরবানি হিসেবে গ্রহণ করেন। সেই অনন্য আত্মত্যাগের স্মরণে মুসলিম উম্মাহ প্রতি বছর পশু কোরবানি দিয়ে থাকে।",
      whyCelebrated: "নিজের ভেতরের অহংকার ও পাশবিকতাকে বিসর্জন দিয়ে আল্লাহর প্রতি পূর্ণ সমর্পণ এবং কোরবানির পশুর গোশত আত্মীয় ও দুস্থ মানুষদের মাঝে বিতরণের মাধ্যমে সামাজিক সাম্য প্রতিষ্ঠার লক্ষ্যে ঈদুল আজহা পালিত হয়।",
      studentMessage: "ত্যাগের মহিমা শেখা, অপরের মঙ্গলের জন্য নিজের স্বার্থ ত্যাগ করা এবং চারপাশের সুবিধাবঞ্চিত মানুষের মুখে হাসি ফোটানো।"
    },
    "durga-puja": {
      id: "durga-puja",
      name: "শ্রী শ্রী দুর্গাপূজা ও বিজয়া দশমী",
      date: "📅 ১৯ অক্টোবর – ২৪ অক্টোবর ২০২৬",
      duration: "৬ দিন",
      type: "সনাতন প্রধান ধর্মীয় উৎসব",
      icon: "🕉️",
      whatHappened: "পৌরাণিক কাহিনি অনুযায়ী, অত্যাচারী অসুর মহিষাসুরকে বধ করে বিশ্বব্রহ্মাণ্ডে শান্তি ও কল্যাণ ফিরিয়ে আনতে দেবী দুর্গার আবির্ভাব হয়েছিল। শরৎকালে অকালবোধন করে রামচন্দ্রও দুর্গোৎসব করেছিলেন। বিজয়া দশমীতে প্রতিমা বিসর্জনের মাধ্যমে এ পূজার সমাপ্তি ঘটে।",
      whyCelebrated: "অন্যায়ের ওপর ন্যায়ের, অসত্যের ওপর সত্যের এবং অন্ধকারের ওপর আলোর চিরন্তন বিজয়ের প্রতীক হলো দুর্গাপূজা। এটি সৌহার্দ্য, ভ্রাতৃত্ব ও সমাজে অপশক্তির বিরুদ্ধে ঐক্যবদ্ধ থাকার বার্তা নিয়ে আসে।",
      studentMessage: "সকল ধর্মের প্রতি শ্রদ্ধা রাখা, অশুভ ও অন্যায়ের বিরুদ্ধে ন্যায়ের পথে অবিচল থাকা এবং পারস্পরিক সম্প্রীতি রক্ষা করা।"
    },
    "shab-e-meraj": {
      id: "shab-e-meraj",
      name: "পবিত্র শবে মেরাজ",
      date: "📅 ২৯ জানুয়ারি ২০২৬ (বৃহস্পতিবার)",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব",
      icon: "🕌",
      whatHappened: "রজব মাসের ২৬ তারিখের রাতে মহানবী হযরত মুহাম্মদ (সা.) অলৌকিকভাবে মক্কার মসজিদুল হারাম থেকে বায়তুল মুকাদ্দাস (ইসরা) এবং সেখান থেকে সপ্তাকাশ অতিক্রম করে মহান আল্লাহর সান্নিধ্যে (মেরাজ) গমন করেন। এই রাতে মুসলিমদের জন্য দৈনিক পাঁচ ওয়াক্ত নামাজ উপহার হিসেবে ফরজ করা হয়।",
      whyCelebrated: "আল্লাহর কুদরত ও নামাজের সর্বোচ্চ গুরুত্ব স্মরণ করে আত্মশুদ্ধি, ইবাদত-বন্দেগি ও আল্লাহর নিকট ক্ষমা প্রার্থনার উদ্দেশ্যে রাতটি ভাবগাম্ভীর্যের সাথে পালন করা হয়।",
      studentMessage: "নিয়মিত নামাজ ও প্রার্থনার মাধ্যমে শৃঙ্খলা, পরিচ্ছন্নতা ও নৈতিক চরিত্র গঠনে মনোযোগী হওয়া।"
    },
    "saraswati-puja": {
      id: "saraswati-puja",
      name: "শ্রী শ্রী সরস্বতী পূজা",
      date: "📅 ০৩ ফেব্রুয়ারি ২০২৬ (মঙ্গলবার)",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় ও বিদ্যার উৎসব",
      icon: "🕉️",
      whatHappened: "শুক্লা পঞ্চমী তিথিতে জ্ঞান, বুদ্ধি, বিদ্যা ও ললিতকলার দেবী সরস্বতীর আরাধনা করা হয়। দেবীর হাতে থাকে বীণা ও পুস্তক, যা সুর ও জ্ঞানের সমন্বয়ের প্রতীক এবং তাঁর বাহন শ্বেতহংস, যা সত্য ও মিথ্যার পার্থক্য বোঝার নির্দেশ করে।",
      whyCelebrated: "অজ্ঞতার অন্ধকার দূর করে শিক্ষার্থীদের মাঝে জ্ঞানের আলো, শুদ্ধ মেধা ও বিনয় ছড়িয়ে দেওয়ার উদ্দেশ্যে বিশেষ করে সকল শিক্ষাপ্রতিষ্ঠানে এ পূজা উদযাপিত হয়।",
      studentMessage: "অধ্যবসায়, শ্রদ্ধা ও মনোযোগের সাথে জ্ঞান অর্জন করা এবং সেই জ্ঞানকে মানুষের কল্যাণে ব্যবহার করা।"
    },
    "shab-e-barat": {
      id: "shab-e-barat",
      name: "পবিত্র শবে বরাত (সৌভাগ্যের রজনী)",
      date: "📅 ১৫ ফেব্রুয়ারি ২০২৬ (রবিবার)",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব",
      icon: "🌙",
      whatHappened: "শাবান মাসের ১৪ তারিখ দিবাগত রাতটি মুসলিমদের নিকট 'লাইলাতুল বরাত' বা মুক্তির রজনী হিসেবে পরিচিত। এ রাতে মহান আল্লাহ তাঁর বান্দাদের ক্ষমার দুয়ার উন্মুক্ত করেন এবং তওবা কবুল করেন।",
      whyCelebrated: "অতীতের ভুলের জন্য ক্ষমা প্রার্থনা, নিজের ভবিষ্যৎ জীবনের কল্যাণ কামনা এবং নফল নামাজ ও কুরআন তিলাওয়াতের মাধ্যমে আল্লাহর সন্তুষ্টি লাভের জন্য রাতটি উদযাপিত হয়।",
      studentMessage: "ভুল থেকে শিক্ষা নিয়ে সৎ পথে চলার প্রতিজ্ঞা করা এবং সহপাঠী ও পরিবারের সদস্যদের সাথে উত্তম ব্যবহার করা।"
    },
    "doljatra": {
      id: "doljatra",
      name: "শুভ দোলযাত্রা",
      date: "📅 ০৪ মার্চ ২০২৬ (বুধবার)",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় পর্ব",
      icon: "🌸",
      whatHappened: "ফাল্গুনী পূর্ণিমায় বৈষ্ণব বিশ্বাসে শ্রীকৃষ্ণ ও রাধিকার প্রেমলীলাকে কেন্দ্র করে দোল উৎসবের সূচনা হয়। এদিন একে অপরের গায়ে আবির ও নানা রঙের গুলাব মেখে আনন্দ উল্লাস করা হয়।",
      whyCelebrated: "শীতের রুক্ষতা কাটিয়ে বসন্তের রঙিন আগমনে মানুষের মন থেকে হিংসা-বিদ্বেষ দূর করে ভালোবাসা, ভ্রাতৃত্ব ও সামাজিক সম্প্রীতি বৃদ্ধির লক্ষ্যে এ দিনটি উদযাপিত হয়।",
      studentMessage: "বৈচিত্র্যকে গ্রহণ করা, সহপাঠীদের সাথে আনন্দ ভাগ করে নেওয়া এবং পারস্পরিক বন্ধুত্বের বন্ধন দৃঢ় করা।"
    },
    "buddha-purnima": {
      id: "buddha-purnima",
      name: "বুদ্ধ পূর্ণিমা (বৈশাখী পূর্ণিমা)",
      date: "📅 ১২ মে ২০২৬ (মঙ্গলবার)",
      duration: "১ দিন",
      type: "বৌদ্ধ ধর্মীয় প্রধান উৎসব",
      icon: "☸️",
      whatHappened: "বৈশাখী পূর্ণিমার এই পুণ্য তিথিতে গৌতম বুদ্ধের জীবনে তিনটি অলৌকিক ঘটনা ঘটেছিল—তাঁর জন্ম, বোধিবৃক্ষের নিচে পরম জ্ঞানলাভ (বুদ্ধত্ব) এবং মহাপরিনির্বাণ। এজন্য একে 'ত্রিস্মৃতি বিজড়িত বৈশাখী পূর্ণিমা' বলা হয়।",
      whyCelebrated: "গৌতম বুদ্ধের অহিংসা, করুণা, মৈত্রী ও শান্তির বাণী সারাবিশ্বে ছড়িয়ে দিতে এ দিনটি উদযাপিত হয়। 'জগতের সকল প্রাণী সুখী হোক'—এটিই বুদ্ধের মূল বাণী।",
      studentMessage: "'অহিংসা পরম ধর্ম'—কাউকে শারীরিক বা মানসিক আঘাত না করা, জীবের প্রতি দয়া দেখানো এবং শান্ত শিষ্ট জীবনযাপন করা।"
    },
    "ashura": {
      id: "ashura",
      name: "পবিত্র আশুরা (মুহাররম)",
      date: "📅 ২৬ জুন ২০২৬ (শুক্রবার)",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব ও ঐতিহাসিক দিবস",
      icon: "🕊️",
      whatHappened: "হিজরি ৬১ সনের ১০ই মহররম ইরাকের কারবালার প্রান্তরে অন্যায় ও স্বৈরশাসনের বিরুদ্ধে মাথা নত না করে মহানবী (সা.)-এর দৌহিত্র হযরত ইমাম হোসাইন (রা.) এবং তাঁর ৭২ জন সঙ্গী শাহাদাত বরণ করেন। এছাড়া এই দিনে হযরত মুসা (আ.) ও তাঁর অনুসারীরা ফেরাউনের অত্যাচার থেকে অলৌকিকভাবে মুক্তি পেয়েছিলেন।",
      whyCelebrated: "অন্যায়, জুলুম ও অসত্যের কাছে নতি স্বীকার না করে সত্য, ন্যায় ও ন্যায়ের পক্ষে জীবন দেওয়ার অমর শিক্ষাকে শ্রদ্ধাভরে স্মরণ করতে এ দিনটি শোক ও ইবাদতের মাধ্যমে পালিত হয়।",
      studentMessage: "কখনও অন্যায়কে সমর্থন না করা, সত্য ও ন্যায়ের পক্ষে দৃঢ় থাকা এবং কঠিন পরিস্থিতিতেও ধৈর্য ধারণ করা।"
    },
    "janmashtami": {
      id: "janmashtami",
      name: "শুভ জন্মাষ্টমী",
      date: "📅 ০৪ সেপ্টেম্বর ২০২৬ (শুক্রবার)",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় উৎসব",
      icon: "🕉️",
      whatHappened: "ভাদ্র মাসের কৃষ্ণপক্ষের অষ্টমী তিথিতে ঘোর অন্ধকার রাতে অত্যাচারী রাজা কংসকে দমন ও পৃথিবীতে ধর্ম রক্ষার উদ্দেশ্যে মথুরায় ভগবান শ্রীকৃষ্ণের শুভ আবির্ভাব ঘটেছিল।",
      whyCelebrated: "'যদা যদা হি ধর্মস্য গ্লানির্ভবতি ভারত...'—শ্রীমদ্ভগবদ্গীতার এই বাণী অনুযায়ী অন্যায়ের বিনাশ ও সৎ মানুষের সুরক্ষার বার্তা নিয়ে সনাতন ধর্মাবলম্বীরা শ্রীকৃষ্ণের জন্মদিন উদযাপন করেন।",
      studentMessage: "অন্যায়কে প্রতিহত করা, সত্যের পথে অবিচল থাকা এবং দুর্বল মানুষের পাশে দাঁড়ানো।"
    },
    "eid-e-miladunnabi": {
      id: "eid-e-miladunnabi",
      name: "পবিত্র ঈদে মিলাদুন্নবী (সা.)",
      date: "📅 ০৫ সেপ্টেম্বর ২০২৬ (শনিবার)",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব ও বিশ্ব শান্তির দিন",
      icon: "🕌",
      whatHappened: "৫৭০ খ্রিস্টাব্দের ১২ই রবিউল আউয়াল পবিত্র মক্কার কুরাইশ বংশে বিশ্বনবী হযরত মুহাম্মদ (সা.) জন্মগ্রহণ করেন এবং ৬৩২ খ্রিস্টাব্দের একই দিনে তিনি ওফাত লাভ করেন। তাঁর মাধ্যমে পৃথিবীতে আইয়ামে জাহেলিয়াতের (অজ্ঞতার যুগ) অবসান ঘটে।",
      whyCelebrated: "সমগ্র মানবজাতির মুক্তির দূত 'রাহমাতুল্লিল আলামিন' (বিশ্বজগতের জন্য শান্তি ও রহমত)-এর শুভাগমন এবং তাঁর আদর্শ, চরিত্র ও অহিংসার শিক্ষাকে শ্রদ্ধাভরে স্মরণ করতে দিনটি উদযাপিত হয়।",
      studentMessage: "সকলের সাথে সুন্দর ব্যবহার করা, সত্যবাদী হওয়া এবং মহানবীর ক্ষমা ও ভালোবাসার আদর্শ নিজের জীবনে অনুসরণ করা।"
    },
    "intellectuals-day": {
      id: "intellectuals-day",
      name: "শহীদ বুদ্ধিজীবী দিবস",
      date: "📅 ১৪ ডিসেম্বর ২০২৬ (সোমবার)",
      duration: "১ দিন",
      type: "জাতীয় শোক দিবস",
      icon: "🇧🇩",
      whatHappened: "১৯৭১ সালের মুক্তিযুদ্ধে চূড়ান্ত বিজয়ের মাত্র দুই দিন আগে ১৪ই ডিসেম্বর পাকিস্তানি হানাদার বাহিনী তাদের দোসরদের সহায়তায় বাঙালি জাতিকে মেধাশূন্য করতে ঢাকা বিশ্ববিদ্যালয় ও বিভিন্ন প্রতিষ্ঠানের সেরা শিক্ষক, সাংবাদিক, সাহিত্যিক, চিকিৎসক ও বুদ্ধিজীবীদের বাসা থেকে ধরে নিয়ে রায়েরবাজার ও মিরপুর বধ্যভূমিতে নির্মমভাবে হত্যা করে। শহীদ হন ড. গোবিন্দ চন্দ্র দেব, অধ্যাপক মুনীর চৌধুরী, অধ্যাপক জ্যোতির্ময় গুহঠাকুরতা, শহীদুল্লা কায়সার, ডা. আলীম চৌধুরী প্রমুখ।",
      whyCelebrated: "দেশমাতৃকার স্বাধীনতার জন্য আত্মোৎসর্গকারী জাতির সূর্যসন্তান বুদ্ধিজীবীদের চিরস্মরণীয় অবদান ও ত্যাগকে বিনম্র শ্রদ্ধায় স্মরণ করতে পুরো জাতি গভীর শোক ও শ্রদ্ধার সাথে এ দিবসটি পালন করে।",
      studentMessage: "জ্ঞান ও মেধার গুরুত্ব উপলব্ধি করা, দেশের সেরা চিন্তাবিদ ও শিক্ষকদের শ্রদ্ধা করা এবং নিজের মেধা দিয়ে দেশ গঠনে অবদান রাখা।"
    }
  };

  const holidayKeys = [
    "shab-e-meraj",
    "saraswati-puja",
    "shab-e-barat",
    "mother-language-day",
    "doljatra",
    "ramadan-eid",
    "independence-day",
    "pahela-baishakh",
    "buddha-purnima",
    "eid-ul-adha",
    "ashura",
    "janmashtami",
    "eid-e-miladunnabi",
    "durga-puja",
    "intellectuals-day",
    "victory-day"
  ];

  let currentHolidayIndex = 0;

  // Modal DOM Elements
  const btnOpenHolidayModal = document.getElementById("btn-open-holiday-modal") || document.getElementById("btn-toggle-holiday");
  const holidayModalOverlay = document.getElementById("holiday-modal-overlay");
  const btnCloseHolidayModal = document.getElementById("btn-close-holiday-modal");
  const btnFooterCloseHoliday = document.getElementById("btn-footer-close-holiday");

  // Views inside Modal
  const holidayListView = document.getElementById("holiday-modal-list-view");
  const holidayDetailView = document.getElementById("holiday-modal-detail-view");
  const holidayModalBody = document.querySelector(".holiday-modal-body");

  // Detail View Elements
  const detailIcon = document.getElementById("holiday-detail-icon");
  const detailName = document.getElementById("holiday-detail-name");
  const detailDate = document.getElementById("holiday-detail-date");
  const detailDuration = document.getElementById("holiday-detail-duration");
  const detailType = document.getElementById("holiday-detail-type");
  const detailWhat = document.getElementById("holiday-detail-what");
  const detailWhy = document.getElementById("holiday-detail-why");
  const detailMessage = document.getElementById("holiday-detail-message");

  // Navigation Buttons
  const btnHolidayBack = document.getElementById("btn-holiday-back");
  const btnHolidayReturnList = document.getElementById("btn-holiday-return-list");
  const btnHolidayPrev = document.getElementById("btn-holiday-prev");
  const btnHolidayNext = document.getElementById("btn-holiday-next");

  const showHolidayList = () => {
    if (holidayDetailView) holidayDetailView.style.display = "none";
    if (holidayListView) holidayListView.style.display = "block";
    if (holidayModalBody) holidayModalBody.scrollTop = 0;
  };

  const showHolidayDetail = (holidayId) => {
    const data = holidayEducationalData[holidayId] || holidayEducationalData["mother-language-day"];
    if (!data) return;

    currentHolidayIndex = holidayKeys.indexOf(holidayId);
    if (currentHolidayIndex === -1) currentHolidayIndex = 0;

    if (detailIcon) detailIcon.textContent = data.icon || "🏛️";
    if (detailName) detailName.textContent = data.name;
    if (detailDate) detailDate.textContent = data.date;
    if (detailDuration) detailDuration.textContent = data.duration;
    if (detailType) detailType.textContent = data.type;
    if (detailWhat) detailWhat.textContent = data.whatHappened;
    if (detailWhy) detailWhy.textContent = data.whyCelebrated;
    if (detailMessage) detailMessage.textContent = data.studentMessage;

    if (holidayListView) holidayListView.style.display = "none";
    if (holidayDetailView) {
      holidayDetailView.style.display = "block";
      // restart animation
      holidayDetailView.style.animation = "none";
      void holidayDetailView.offsetWidth;
      holidayDetailView.style.animation = "";
    }
    if (holidayModalBody) holidayModalBody.scrollTop = 0;
  };

  const navigateHoliday = (direction) => {
    currentHolidayIndex = (currentHolidayIndex + direction + holidayKeys.length) % holidayKeys.length;
    const nextHolidayId = holidayKeys[currentHolidayIndex];
    showHolidayDetail(nextHolidayId);
  };

  // Wire Card Clicks
  const holidayCards = document.querySelectorAll(".holiday-card[data-holiday-id]");
  holidayCards.forEach((card) => {
    const hId = card.getAttribute("data-holiday-id");
    card.addEventListener("click", () => {
      showHolidayDetail(hId);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showHolidayDetail(hId);
      }
    });
  });

  // Wire Detail Navigation
  btnHolidayBack?.addEventListener("click", showHolidayList);
  btnHolidayReturnList?.addEventListener("click", showHolidayList);
  btnHolidayPrev?.addEventListener("click", () => navigateHoliday(-1));
  btnHolidayNext?.addEventListener("click", () => navigateHoliday(1));

  // Modal Open / Close
  const openHolidayModal = (holidayId) => {
    if (holidayModalOverlay) {
      if (holidayId) {
        showHolidayDetail(holidayId);
      } else {
        showHolidayList();
      }
      holidayModalOverlay.classList.add("active");
      holidayModalOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnOpenHolidayModal?.setAttribute("aria-expanded", "true");
      setTimeout(() => {
        btnCloseHolidayModal?.focus();
      }, 100);
    }
  };

  const closeHolidayModal = () => {
    if (holidayModalOverlay) {
      holidayModalOverlay.classList.remove("active");
      holidayModalOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      btnOpenHolidayModal?.setAttribute("aria-expanded", "false");
      btnOpenHolidayModal?.focus();
      setTimeout(showHolidayList, 300);
    }
  };

  btnOpenHolidayModal?.addEventListener("click", () => openHolidayModal());
  btnCloseHolidayModal?.addEventListener("click", closeHolidayModal);
  btnFooterCloseHoliday?.addEventListener("click", closeHolidayModal);

  // Close when clicking backdrop
  holidayModalOverlay?.addEventListener("click", (e) => {
    if (e.target === holidayModalOverlay) {
      closeHolidayModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && holidayModalOverlay?.classList.contains("active")) {
      closeHolidayModal();
    }
  });

  // =========================================================================
  // 17. LIVE REAL-TIME CLOCK WIDGET (Time, Month, Sec, Year)
  // =========================================================================
  const clockDayEl = document.getElementById("clock-live-day");
  const clockMonthEl = document.getElementById("clock-live-month");
  const clockYearEl = document.getElementById("clock-live-year");
  const clockTimeEl = document.getElementById("clock-live-time");
  const clockSecEl = document.getElementById("clock-live-sec");
  const clockAmpmEl = document.getElementById("clock-live-ampm");

  const bnDigitList = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBnDigits = (val) => String(val).replace(/[0-9]/g, (d) => bnDigitList[Number(d)]);

  const bnMonthNames = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const updateLiveClock = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const ampm = hours >= 12 ? "অপরাহ্ন" : "পূর্বাহ্ন";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const formattedHour = String(hours).padStart(2, "0");
    const formattedMin = String(minutes).padStart(2, "0");
    const formattedSec = String(seconds).padStart(2, "0");

    if (clockDayEl) clockDayEl.textContent = toBnDigits(day);
    if (clockMonthEl) clockMonthEl.textContent = bnMonthNames[month];
    if (clockYearEl) clockYearEl.textContent = toBnDigits(year);
    if (clockTimeEl) clockTimeEl.textContent = `${toBnDigits(formattedHour)}:${toBnDigits(formattedMin)}`;
    if (clockSecEl) clockSecEl.textContent = toBnDigits(formattedSec);
    if (clockAmpmEl) clockAmpmEl.textContent = ampm;
  };

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // =========================================================================
  // 18. AUTOMATED UPCOMING HOLIDAY ENGINE & ANNOUNCEMENTS
  // =========================================================================
  const calendarHolidaysList = [
    {
      id: "shab-e-meraj",
      name: "পবিত্র শবে মেরাজ",
      date: "২৯ জানুয়ারি ২০২৬ (বৃহস্পতিবার)",
      startDate: "2026-01-29",
      endDate: "2026-01-29",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব",
      icon: "🕌"
    },
    {
      id: "saraswati-puja",
      name: "শ্রী শ্রী সরস্বতী পূজা",
      date: "০৩ ফেব্রুয়ারি ২০২৬ (মঙ্গলবার)",
      startDate: "2026-02-03",
      endDate: "2026-02-03",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় ও বিদ্যার উৎসব",
      icon: "🕉️"
    },
    {
      id: "shab-e-barat",
      name: "পবিত্র শবে বরাত (সৌভাগ্যের রজনী)",
      date: "১৫ ফেব্রুয়ারি ২০২৬ (রবিবার)",
      startDate: "2026-02-15",
      endDate: "2026-02-15",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব",
      icon: "🌙"
    },
    {
      id: "mother-language-day",
      name: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস",
      date: "২১ ফেব্রুয়ারি ২০২৬ (শনিবার)",
      startDate: "2026-02-21",
      endDate: "2026-02-21",
      duration: "১ দিন",
      type: "জাতীয় দিবস ও আন্তর্জাতিক স্বীকৃতি",
      icon: "🇧🇩"
    },
    {
      id: "ramadan-eid",
      name: "পবিত্র রমজান, শবে কদর ও ঈদুল ফিতর",
      date: "০১ মার্চ – ০১ এপ্রিল ২০২৬",
      startDate: "2026-03-01",
      endDate: "2026-04-01",
      duration: "২৬ দিন",
      type: "মুসলিম প্রধান ধর্মীয় উৎসব ও দীর্ঘ অবকাশ",
      icon: "🕌"
    },
    {
      id: "doljatra",
      name: "শুভ দোলযাত্রা",
      date: "০৪ মার্চ ২০২৬ (বুধবার)",
      startDate: "2026-03-04",
      endDate: "2026-03-04",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় পর্ব",
      icon: "🌸"
    },
    {
      id: "independence-day",
      name: "স্বাধীনতা ও জাতীয় দিবস",
      date: "২৬ মার্চ ২০২৬ (বৃহস্পতিবার)",
      startDate: "2026-03-26",
      endDate: "2026-03-26",
      duration: "১ দিন",
      type: "জাতীয় দিবস ও রাষ্ট্রীয় গৌরব",
      icon: "🇧🇩"
    },
    {
      id: "pahela-baishakh",
      name: "বাংলা নববর্ষ (পহেলা বৈশাখ)",
      date: "১৪ এপ্রিল ২০২৬ (মঙ্গলবার)",
      startDate: "2026-04-14",
      endDate: "2026-04-14",
      duration: "১ দিন",
      type: "জাতীয় ও সর্বজনীন সাংস্কৃতিক উৎসব",
      icon: "🌾"
    },
    {
      id: "buddha-purnima",
      name: "বুদ্ধ পূর্ণিমা (বৈশাখী পূর্ণিমা)",
      date: "১২ মে ২০২৬ (মঙ্গলবার)",
      startDate: "2026-05-12",
      endDate: "2026-05-12",
      duration: "১ দিন",
      type: "বৌদ্ধ ধর্মীয় প্রধান উৎসব",
      icon: "☸️"
    },
    {
      id: "eid-ul-adha",
      name: "পবিত্র ঈদুল আজহা ও গ্রীষ্মকালীন অবকাশ",
      date: "২৬ মে – ১১ জুন ২০২৬",
      startDate: "2026-05-26",
      endDate: "2026-06-11",
      duration: "১৪ দিন",
      type: "মুসলিম ধর্মীয় উৎসব ও দীর্ঘ অবকাশ",
      icon: "☀️"
    },
    {
      id: "ashura",
      name: "পবিত্র আশুরা (মুহাররম)",
      date: "২৬ জুন ২০২৬ (শুক্রবার)",
      startDate: "2026-06-26",
      endDate: "2026-06-26",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব ও ঐতিহাসিক দিবস",
      icon: "🕊️"
    },
    {
      id: "janmashtami",
      name: "শুভ জন্মাষ্টমী",
      date: "০৪ সেপ্টেম্বর ২০২৬ (শুক্রবার)",
      startDate: "2026-09-04",
      endDate: "2026-09-04",
      duration: "১ দিন",
      type: "সনাতন ধর্মীয় উৎসব",
      icon: "🕉️"
    },
    {
      id: "eid-e-miladunnabi",
      name: "পবিত্র ঈদে মিলাদুন্নবী (সা.)",
      date: "০৫ সেপ্টেম্বর ২০২৬ (শনিবার)",
      startDate: "2026-09-05",
      endDate: "2026-09-05",
      duration: "১ দিন",
      type: "মুসলিম ধর্মীয় পর্ব ও বিশ্ব শান্তির দিন",
      icon: "🕌"
    },
    {
      id: "durga-puja",
      name: "শ্রী শ্রী দুর্গাপূজা ও বিজয়া দশমী",
      date: "১৯ অক্টোবর – ২৪ অক্টোবর ২০২৬",
      startDate: "2026-10-19",
      endDate: "2026-10-24",
      duration: "৬ দিন",
      type: "সনাতন প্রধান ধর্মীয় উৎসব",
      icon: "🕉️"
    },
    {
      id: "intellectuals-day",
      name: "শহীদ বুদ্ধিজীবী দিবস",
      date: "১৪ ডিসেম্বর ২০২৬ (সোমবার)",
      startDate: "2026-12-14",
      endDate: "2026-12-14",
      duration: "১ দিন",
      type: "জাতীয় শোক দিবস",
      icon: "🇧🇩"
    },
    {
      id: "victory-day",
      name: "বিজয় দিবস, বড়দিন ও শীতকালীন অবকাশ",
      date: "১৬ ডিসেম্বর – ৩১ ডিসেম্বর ২০২৬",
      startDate: "2026-12-16",
      endDate: "2026-12-31",
      duration: "১৩ দিন",
      type: "জাতীয় দিবস ও দীর্ঘ অবকাশ",
      icon: "❄️"
    }
  ];

  const getUpcomingHoliday = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    let match = null;
    for (const h of calendarHolidaysList) {
      if (h.endDate >= todayStr) {
        match = h;
        break;
      }
    }
    if (!match) match = calendarHolidaysList[0];

    const isOngoing = (todayStr >= match.startDate && todayStr <= match.endDate);
    return { ...match, isOngoing };
  };

  const setupUpcomingHolidayAnnouncement = () => {
    const upcoming = getUpcomingHoliday();
    if (!upcoming) return;

    const marqueeTextEl = document.getElementById("topbar-marquee-text");
    const statusTitle = upcoming.isOngoing ? "চলমান ছুটি:" : "আসন্ন ছুটি:";

    if (marqueeTextEl) {
      const announcementHtml = `📢 <strong>${statusTitle}</strong> <span style="color: var(--color-accent-gold); font-weight: 700;">${upcoming.name}</span> — ${upcoming.date} (${upcoming.duration}) ★ বাৎসরিক সরকারি মোট ছুটি ৭৬ দিন • ইআইআইএন: ১১১৩৬৮ • এমপিও কোড: 4002071301 • স্থাপিত: ১৯৭৩ খ্রিঃ • ময়মনসিংহ শিক্ষা বোর্ড • বিভাগ: বিজ্ঞান ও মানবিক (Science & Arts) • ঘোষগাঁও, ধোবাউড়া, ময়মনসিংহ ★`;
      marqueeTextEl.innerHTML = announcementHtml;
      const cloneEl = document.getElementById("topbar-marquee-text-clone");
      if (cloneEl) {
        cloneEl.innerHTML = announcementHtml;
      }
    }

    // Prepend to activeNotices for the Notice Board rotation
    if (typeof activeNotices !== "undefined" && Array.isArray(activeNotices)) {
      activeNotices.unshift({
        date: upcoming.date.split("(")[0].replace("📅", "").trim(),
        title: `[${statusTitle.replace(":", "")}] ${upcoming.name} উপলক্ষে শ্রেণি কার্যক্রম বন্ধ থাকবে (${upcoming.duration})`,
        link: "#holiday-modal-overlay",
        isHoliday: true,
        holidayId: upcoming.id
      });
      if (typeof updateNotice === "function") {
        updateNotice(0);
      }
    }
  };

  setupUpcomingHolidayAnnouncement();

  // If notice title is clicked and it's a holiday bulletin, open holiday modal
  noticeTitleEl?.addEventListener("click", (e) => {
    const currentItem = activeNotices[currentNoticeIndex];
    if (currentItem && currentItem.isHoliday) {
      e.preventDefault();
      openHolidayModal(currentItem.holidayId);
    }
  });

  // =========================================================================
  // 19. DOWNLOAD OFFICIAL HOLIDAY CALENDAR AS PDF (Vanilla / Client-Side)
  // =========================================================================
  const generateHolidayPdfMarkup = () => {
    let rowsHtml = "";
    calendarHolidaysList.forEach((item, idx) => {
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background-color: #faf8f5;' : ''}">
          <td style="padding: 4.5px 6px; text-align: center; font-weight: bold; color: #761026;">${toBnDigits(idx + 1)}</td>
          <td style="padding: 4.5px 8px; font-weight: 600; color: #1e293b;">${item.name}</td>
          <td style="padding: 4.5px 8px; color: #334155;">${item.date.replace('📅', '').trim()}</td>
          <td style="padding: 4.5px 6px; text-align: center; font-weight: bold; color: #b88628;">${item.duration}</td>
          <td style="padding: 4.5px 8px; font-size: 10.5px; color: #64748b;">${item.type}</td>
        </tr>
      `;
    });

    return `
      <div id="pdf-render-sheet" style="width: 750px; background: #ffffff; padding: 16px 20px; box-sizing: border-box; font-family: 'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', 'Anek Bangla', sans-serif; color: #1e293b; margin: 0 auto;">
        <!-- Top Institutional Header -->
        <div style="text-align: center; border-bottom: 2px solid #761026; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="font-size: 10.5px; font-weight: bold; color: #b88628; letter-spacing: 0.04em;">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার ও শিক্ষা মন্ত্রণালয় অনুমোদিত শিক্ষাপঞ্জি
          </div>
          <h1 style="font-size: 19px; font-weight: 800; color: #520919; margin: 3px 0; font-family: 'Noto Serif Bengali', serif;">
            ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়
          </h1>
          <div style="font-size: 11px; color: #475569; font-weight: 600;">
            ডাকঘর: ঘোষগাঁও, উপজেলা: ধোবাউড়া, জেলা: ময়মনসিংহ • শিক্ষা বোর্ড: ময়মনসিংহ
          </div>
          <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">
            ইআইআইএন: <strong style="color: #761026;">১১১৩৬৮</strong> | এমপিও কোড: <strong style="color: #761026;">4002071301</strong> | স্থাপিত: <strong style="color: #761026;">১৯৭৩ খ্রিঃ</strong>
          </div>
          <div style="display: inline-block; background: #761026; color: #ffffff; font-size: 11.5px; font-weight: bold; padding: 2px 14px; border-radius: 12px; margin-top: 5px;">
            বাৎসরিক সরকারি ও প্রাতিষ্ঠানিক ছুটির তালিকা — ২০২৬ (মোট ৭৬ দিন)
          </div>
        </div>

        <!-- Holidays Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; border: 1px solid #cbd5e1; margin-bottom: 6px;">
          <thead>
            <tr style="background: #761026; color: #ffffff;">
              <th style="padding: 5px 6px; width: 6%; text-align: center;">নং</th>
              <th style="padding: 5px 8px; text-align: left; width: 34%;">পর্ব বা ছুটির নাম</th>
              <th style="padding: 5px 8px; text-align: left; width: 34%;">তারিখ ও বার</th>
              <th style="padding: 5px 6px; width: 12%; text-align: center;">দিন</th>
              <th style="padding: 5px 8px; text-align: left; width: 14%;">ধরন</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #faf3e5; font-weight: bold; border-top: 2px solid #b88628;">
              <td colspan="3" style="padding: 5px 8px; text-align: right; color: #520919;">বাৎসরিক অনুমোদিত সর্বমোট ছুটি:</td>
              <td style="padding: 5px 6px; text-align: center; color: #761026; font-size: 11.5px;">৭৬ দিন</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <!-- Notes & Guidelines -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px 10px; margin-top: 6px; font-size: 9.5px; color: #475569; line-height: 1.38;">
          <strong>বিশেষ দ্রষ্টব্য:</strong> চাঁদ দেখার ওপর নির্ভরশীল মুসলিম ধর্মীয় পর্বসমূহের ছুটি চাঁদ দেখার ওপর কার্যকর হবে। জাতীয় গুরুত্বপূর্ণ দিবসসমূহ সুবিধাজনক সময়ে যথারীতি যথাযোগ্য মর্যাদায় প্রতিষ্ঠানে উদযাপন করা হবে।
        </div>

        <!-- Official Seal & Signature Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; margin-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 10.5px; color: #334155;">
          <div style="text-align: center; width: 170px;">
            <div style="height: 18px;"></div>
            <div style="border-top: 1px solid #475569; padding-top: 2px; font-weight: bold;">
              প্রধান শিক্ষক
            </div>
            <div style="font-size: 9px; color: #64748b;">ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়</div>
          </div>

          <div style="text-align: center; width: 120px;">
            <div style="display: inline-block; width: 44px; height: 44px; border: 1.5px dashed #b88628; border-radius: 50%; line-height: 44px; color: #b88628; font-size: 8px; font-weight: bold;">
              প্রাতিষ্ঠানিক সিল
            </div>
          </div>

          <div style="text-align: center; width: 170px;">
            <div style="height: 18px;"></div>
            <div style="border-top: 1px solid #475569; padding-top: 2px; font-weight: bold;">
              সভাপতি
            </div>
            <div style="font-size: 9px; color: #64748b;">ম্যানেজিং কমিটি / গভর্নিং বডি</div>
          </div>
        </div>
      </div>
    `;
  };

  const downloadHolidayPDF = () => {
    // Avoid multiple simultaneous downloads
    if (document.getElementById("pdf-download-overlay")) return;

    const btnHeader = document.getElementById("btn-download-holiday-pdf");
    const btnFooter = document.getElementById("btn-footer-download-pdf");
    const buttons = [btnHeader, btnFooter].filter(Boolean);

    // Update buttons to loading state
    buttons.forEach((btn) => {
      btn.classList.add("is-downloading");
      btn.innerHTML = `<span class="holiday-download-spinner"></span> <span>PDF তৈরি হচ্ছে...</span>`;
    });

    // Create visible overlay modal containing the progress card and rendered document
    const overlay = document.createElement("div");
    overlay.id = "pdf-download-overlay";
    overlay.className = "pdf-download-overlay";
    overlay.innerHTML = `
      <div class="pdf-download-card">
        <div class="pdf-progress-spinner-ring"></div>
        <div class="pdf-download-status">অফিসিয়াল বাৎসরিক ছুটির ক্যালেন্ডার PDF প্রস্তুত হচ্ছে...</div>
        <div class="pdf-download-hint">অনুগ্রহ করে ২-৩ সেকেন্ড অপেক্ষা করুন, ডাউনলোডটি স্বয়ংক্রিয়ভাবে শুরু হবে।</div>
      </div>
      <div class="pdf-render-sheet-wrap">
        ${generateHolidayPdfMarkup()}
      </div>
    `;
    document.body.appendChild(overlay);

    const sheetElement = document.getElementById("pdf-render-sheet");

    const resetButtonState = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      buttons.forEach((btn) => {
        btn.classList.remove("is-downloading");
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>PDF ডাউনলোড</span>
        `;
      });
    };

    if (window.html2pdf && sheetElement) {
      const opt = {
        margin: [5, 5, 5, 5],
        filename: "ghoshgaon-high-school-holiday-calendar-2026.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 760
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: "avoid-all" }
      };

      setTimeout(() => {
        window.html2pdf()
          .set(opt)
          .from(sheetElement)
          .save()
          .then(() => {
            resetButtonState();
            if (typeof showToast === "function") {
              showToast("বাৎসরিক ছুটির ক্যালেন্ডার PDF সফলভাবে ডাউনলোড হয়েছে!");
            }
          })
          .catch((err) => {
            console.error("PDF generation error:", err);
            resetButtonState();
            window.print();
          });
      }, 150);
    } else {
      resetButtonState();
      window.print();
    }
  };

  const btnDownloadHeader = document.getElementById("btn-download-holiday-pdf");
  const btnDownloadFooter = document.getElementById("btn-footer-download-pdf");
  btnDownloadHeader?.addEventListener("click", downloadHolidayPDF);
  btnDownloadFooter?.addEventListener("click", downloadHolidayPDF);

  // =========================================================================
  // DHOBAURA UPAZILA: GHOSHGAON & DAKSHIN MAIJPARA UNIONS LIVE MAP SWITCHER
  // =========================================================================
  const initUnionsLiveMap = () => {
    const tabButtons = document.querySelectorAll(".union-tab-btn");
    const mapIframe = document.getElementById("unions-live-iframe");
    const mapActiveBadge = document.getElementById("map-active-badge");
    const mapFullscreenBtn = document.getElementById("map-fullscreen-btn");
    const infoBadge = document.getElementById("union-info-badge");
    const infoTitle = document.getElementById("union-info-title");
    const infoLead = document.getElementById("union-info-lead");
    const plusCodeVal = document.getElementById("union-pluscode-val");
    const kpiUpazila = document.getElementById("kpi-upazila");
    const kpiDistrict = document.getElementById("kpi-district");
    const kpiUnionNo = document.getElementById("kpi-union-no");
    const kpiCenter = document.getElementById("kpi-center");
    const tagsContainer = document.getElementById("union-tags-container");
    const travelDesc = document.getElementById("union-travel-desc");
    const dirBtn = document.getElementById("union-dir-btn");
    const gmapsLink = document.getElementById("union-gmaps-link");

    if (!tabButtons.length || !mapIframe) return;

    const unionData = {
      ghoshgaon: {
        badgeText: "৬নং ঘোষগাঁও ইউনিয়ন",
        fullBadgeText: "৬নং ঘোষগাঁও ইউনিয়ন পরিষদ",
        title: "ঘোষগাঁও ইউনিয়ন ও বিদ্যালয় ক্যাম্পাস",
        plusCode: "4GX9+C78 (ঘোষগাঁও-ধোবাউড়া রোড, ঘোষগাঁও)",
        lead: "ঐতিহ্যবাহী ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয় ধোবাউড়া উপজেলার ৬নং ঘোষগাঁও ইউনিয়নে ঘোষগাঁও-ধোবাউড়া রোডে অবস্থিত। এটি উপজেলা সদর ও পার্শ্ববর্তী অঞ্চলগুলোর সাথে সুপরিচিত সড়ক যোগাযোগ ব্যবস্থা রয়েছে।",
        upazila: "ধোবাউড়া",
        district: "ময়মনসিংহ",
        unionNo: "৬নং ইউনিয়ন",
        center: "ঘোষগাঁও বাজার",
        iframeSrc: "https://maps.google.com/maps?q=4GX9%2BC78%2C+Ghoshgaon-Dhobaura+Road%2C+Ghoshgaon%2C+Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed",
        extUrl: "https://www.google.com/maps/search/?api=1&query=4GX9%2BC78%2C+Ghoshgaon-Dhobaura+Road%2C+Ghoshgaon%2C+Bangladesh",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=4GX9%2BC78%2C+Ghoshgaon-Dhobaura+Road%2C+Ghoshgaon%2C+Bangladesh",
        tags: [
          { text: "🏫 ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়", isSchool: true },
          { text: "📍 4GX9+C78 প্লাস কোড পয়েন্ট", isSchool: true },
          { text: "🏪 ঘোষগাঁও বাজার", isSchool: false },
          { text: "🏛️ ৬নং ঘোষগাঁও ইউপি ভবন", isSchool: false },
          { text: "🌊 নিতাই নদী তীরবর্তী জনপদ", isSchool: false },
          { text: "🛣️ ঘোষগাঁও-ধোবাউড়া রোড", isSchool: false },
          { text: "🏥 ঘোষগাঁও উপ-স্বাস্থ্য কেন্দ্র", isSchool: false },
          { text: "🌾 বহরভিটা ও সংলগ্ন গ্রামসমূহ", isSchool: false }
        ],
        travel: "ধোবাউড়া উপজেলা সদর বা হালুয়াঘাট দিক থেকে ঘোষগাঁও-ধোবাউড়া রোড হয়ে সরাসরি পাকা সড়কে খুব সহজেই সিএনজি, অটো বা বাসে করে বিদ্যালয়ে পৌঁছানো যায়। বিদ্যালয়টি ঘোষগাঁও বাজারের প্রাণকেন্দ্রে অবস্থিত।"
      },
      maijpara: {
        badgeText: "১নং দক্ষিণ মাইজপাড়া ইউনিয়ন",
        fullBadgeText: "১নং দক্ষিণ মাইজপাড়া ইউনিয়ন পরিষদ",
        title: "১নং দক্ষিণ মাইজপাড়া ইউনিয়ন ও সংলগ্ন অঞ্চল",
        plusCode: "7MQG5H38+J7 (১নং দক্ষিণ মাইজপাড়া, ধোবাউড়া)",
        lead: "ধোবাউড়া উপজেলার উত্তরের সীমান্তবর্তী ১নং দক্ষিণ মাইজপাড়া ইউনিয়ন প্রাকৃতিক সৌন্দর্য ও কংস-নিতাই নদী অববাহিকায় বিস্তৃত। ঘোষগাঁও ইউনিয়নের শিক্ষার্থীদের একটি বড় অংশ এই ইউনিয়ন থেকে প্রতিদিন বিদ্যালয়ে যাতায়াত করে।",
        upazila: "ধোবাউড়া",
        district: "ময়মনসিংহ",
        unionNo: "১নং ইউনিয়ন",
        center: "মাইজপাড়া বাজার",
        iframeSrc: "https://maps.google.com/maps?q=7MQG5H38%2BJ7%2C+Dakshin+Maij+Para%2C+Dhobaura%2C+Mymensingh%2C+Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed",
        extUrl: "https://www.google.com/maps/search/?api=1&query=7MQG5H38%2BJ7%2C+Dakshin+Maij+Para%2C+Dhobaura%2C+Mymensingh%2C+Bangladesh",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&origin=7MQG5H38%2BJ7%2C+Dakshin+Maij+Para%2C+Dhobaura&destination=4GX9%2BC78%2C+Ghoshgaon-Dhobaura+Road%2C+Ghoshgaon%2C+Bangladesh",
        tags: [
          { text: "🏛️ ১নং দক্ষিণ মাইজপাড়া ইউপি ভবন", isSchool: false },
          { text: "📍 7MQG5H38+J7 প্লাস কোড পয়েন্ট", isSchool: false },
          { text: "🏪 মাইজপাড়া বাজার", isSchool: false },
          { text: "🌳 ঘিলাগড়া ও মুন্সীরহাট", isSchool: false },
          { text: "🌾 সোহাগীপাড়া ও বোয়ালমারী", isSchool: false },
          { text: "🏞️ সীমান্তবর্তী পাহাড়ি জনপদ", isSchool: false },
          { text: "🛣️ মাইজপাড়া-ঘোষগাঁও সংযোগ সড়ক", isSchool: false },
          { text: "🏫 ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয় (সংলগ্ন শিক্ষাকেন্দ্র)", isSchool: true }
        ],
        travel: "দক্ষিণ মাইজপাড়া থেকে সংযোগ সড়ক ও সীমান্ত সড়ক হয়ে সরাসরি অটো, মোটরসাইকেল বা সাইকেলে ১৫-২৫ মিনিটে ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়ে যাতায়াত করা যায়।"
      },
      dhobaura: {
        badgeText: "ধোবাউড়া উপজেলা সদর",
        fullBadgeText: "ধোবাউড়া উপজেলা (সার্বিক মানচিত্র)",
        title: "ধোবাউড়া উপজেলা সার্বিক মানচিত্র",
        plusCode: "3PRM+98 (উপজেলা পরিষদ চত্বর, ধোবাউড়া)",
        lead: "ময়মনসিংহ জেলার সীমান্তবর্তী ধোবাউড়া উপজেলার অধীনে ৭টি ইউনিয়ন রয়েছে, যার মধ্যে ৬নং ঘোষগাঁও এবং ১নং দক্ষিণ মাইজপাড়া অন্যতম প্রধান ও সংলগ্ন দুটি ইউনিয়ন।",
        upazila: "ধোবাউড়া উপজেলা",
        district: "ময়মনসিংহ",
        unionNo: "৭টি ইউনিয়ন পরিষদ",
        center: "উপজেলা পরিষদ চত্বর",
        iframeSrc: "https://maps.google.com/maps?q=Dhobaura+Upazila+Complex%2C+Dhobaura%2C+Mymensingh%2C+Bangladesh&t=&z=12&ie=UTF8&iwloc=&output=embed",
        extUrl: "https://www.google.com/maps/search/?api=1&query=Dhobaura+Upazila+Complex%2C+Dhobaura%2C+Mymensingh%2C+Bangladesh",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&origin=Dhobaura+Upazila+Complex%2C+Dhobaura&destination=4GX9%2BC78%2C+Ghoshgaon-Dhobaura+Road%2C+Ghoshgaon%2C+Bangladesh",
        tags: [
          { text: "🏛️ ধোবাউড়া উপজেলা পরিষদ", isSchool: false },
          { text: "🏫 ৬নং ঘোষগাঁও ইউনিয়ন (বিদ্যালয় ক্যাম্পাস)", isSchool: true },
          { text: "📍 ১নং দক্ষিণ মাইজপাড়া ইউনিয়ন", isSchool: false },
          { text: "🏥 উপজেলা স্বাস্থ্য কমপ্লেক্স", isSchool: false },
          { text: "👮 ধোবাউড়া থানা", isSchool: false },
          { text: "🌉 কংস ও নিতাই নদী অববাহিকা", isSchool: false }
        ],
        travel: "উপজেলা সদর ধোবাউড়া থেকে ঘোষগাঁও উচ্চ বিদ্যালয়ের দূরত্ব আনুমানিক ৮-১০ কি.মি., যা পাকা সড়ক পথে নিয়মিত সিএনজি ও অটোরিকশায় অনায়াসেই যাতায়াত করা যায়।"
      }
    };

    const renderUnion = (key) => {
      const data = unionData[key];
      if (!data) return;

      // Update Tabs UI
      tabButtons.forEach((btn) => {
        const isCurrent = btn.getAttribute("data-union") === key;
        btn.classList.toggle("active", isCurrent);
        btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });

      // Update Map Iframe smoothly
      if (mapIframe.src !== data.iframeSrc) {
        mapIframe.src = data.iframeSrc;
      }

      // Update Labels & Badges
      if (mapActiveBadge) mapActiveBadge.textContent = data.badgeText;
      if (mapFullscreenBtn) mapFullscreenBtn.href = data.extUrl;
      if (infoBadge) infoBadge.textContent = data.fullBadgeText;
      if (infoTitle) infoTitle.textContent = data.title;
      if (infoLead) infoLead.textContent = data.lead;
      if (plusCodeVal && data.plusCode) plusCodeVal.textContent = data.plusCode;

      // Update KPIs
      if (kpiUpazila) kpiUpazila.textContent = data.upazila;
      if (kpiDistrict) kpiDistrict.textContent = data.district;
      if (kpiUnionNo) kpiUnionNo.textContent = data.unionNo;
      if (kpiCenter) kpiCenter.textContent = data.center;

      // Update Travel info
      if (travelDesc) travelDesc.textContent = data.travel;
      if (dirBtn) dirBtn.href = data.directionsUrl;
      if (gmapsLink) gmapsLink.href = data.extUrl;

      // Update Tags
      if (tagsContainer) {
        tagsContainer.innerHTML = data.tags
          .map((t) => `<span class="union-tag-pill${t.isSchool ? " active-school" : ""}">${t.text}</span>`)
          .join("");
      }
    };

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const unionKey = btn.getAttribute("data-union");
        if (unionKey) {
          renderUnion(unionKey);
        }
      });
    });
  };

  initUnionsLiveMap();
});


