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
  // 1. NATIVE BENGALI NOTICES & NUMERAL UTILITIES
  // =========================================================================
  const activeNotices = [
    { date: "১৪ অক্টোবর, ২০২৬", title: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ১০ম শ্রেণিতে ভর্তি বিজ্ঞপ্তি: বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা বিভাগ", link: "#notice" },
    { date: "১৮ অক্টোবর, ২০২৬", title: "ময়মনসিংহ শিক্ষা বোর্ডের অধীনে বার্ষিক মূল্যায়ন ও অভিভাবক-শিক্ষক মতবিনিময় সভা", link: "#notice" },
    { date: "২২ অক্টোবর, ২০২৬", title: "ধোবাউড়া উপজেলা আন্তঃস্কুল ক্রীড়া ও বিজ্ঞান অলিম্পিয়াড প্রস্তুতি সভা", link: "#teachers" },
    { date: "০২ নভেম্বর, ২০২৬", title: "বিদ্যালয়ের সুবিশাল ২০০ শতাংশ খেলার মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক উৎসব", link: "#gallery" }
  ];

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
  const teachersRosterWrapper = document.getElementById("teachers-roster-wrapper");
  const teacherBtnStatus = document.getElementById("teacher-btn-status");
  const headmasterCard = document.getElementById("headmaster-showcase-card");

  if (btnToggleTeachers && teachersRosterWrapper) {
    const openTeachersRoster = (shouldScroll = true) => {
      teachersRosterWrapper.classList.add("is-open");
      btnToggleTeachers.classList.add("active");
      btnToggleTeachers.setAttribute("aria-expanded", "true");
      if (teacherBtnStatus) {
        teacherBtnStatus.textContent = "তালিকা প্রদর্শিত";
      }
      if (shouldScroll && headmasterCard) {
        setTimeout(() => {
          headmasterCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    };

    const closeTeachersRoster = () => {
      teachersRosterWrapper.classList.remove("is-open");
      btnToggleTeachers.classList.remove("active");
      btnToggleTeachers.setAttribute("aria-expanded", "false");
      if (teacherBtnStatus) {
        teacherBtnStatus.textContent = "ক্লিক করে দেখুন";
      }
    };

    btnToggleTeachers.addEventListener("click", () => {
      if (teachersRosterWrapper.classList.contains("is-open")) {
        closeTeachersRoster();
      } else {
        openTeachersRoster(true);
      }
    });

    // Auto-open if navigating via navbar link #teachers
    document.querySelectorAll('a[href="#teachers"]').forEach((navLink) => {
      navLink.addEventListener("click", () => {
        openTeachersRoster(false);
      });
    });

    if (window.location.hash === "#teachers") {
      openTeachersRoster(false);
    }
  }

  const facultyBtns = document.querySelectorAll(".faculty-btn");
  const teacherCards = document.querySelectorAll(".teacher-card");

  facultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      facultyBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");
      teacherCards.forEach((card) => {
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
    }
  ];

  const MEMORIES_STORAGE_KEY = "ghoshgaon_shere_bangla_memories_v2";

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
    } catch (e) {}
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
  // 10. Modal Utilities & Keyboard Accessibility
  // =========================================================================
  window.openAdmissionModal = () => {};

  // Keyboard accessibility: Escape to close all modals, Arrow keys for gallery
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      if (typeof window.closeMemoryModal === "function") {
        window.closeMemoryModal();
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
      inquiryForm.reset();
      showToast(`বার্তা প্রেরিত হয়েছে! ধন্যবাদ ${parentName}। আমাদের ভর্তি উপদেষ্টাগণ দ্রুত আপনার সাথে যোগাযোগ করবেন।`);
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
});


