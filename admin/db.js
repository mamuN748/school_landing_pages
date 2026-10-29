/**
 * Ghoshgaon Shere Bangla High School - Central Database Engine
 * Persistent Multi-Collection Schema with Real CRUD, Seed Data & Audit Logs
 */
(function (global) {
  "use strict";

  const DB_STORAGE_KEY = "ghoshgaon_school_erp_db_v2";

  // Initial High Quality Seed Data
  const INITIAL_DB = {
    settings: {
      schoolNameBn: "ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়",
      schoolNameEn: "Ghoshgaon Shere Bangla High School",
      eiin: "111812",
      estYear: "1968",
      motto: "জ্ঞান, শৃঙ্খলা, চরিত্র ও সেবা",
      phone: "+880 1712-345678",
      email: "info@ghoshgaon-school.edu.bd",
      addressBn: "গ্রাম ও ডাকঘর: ঘোষগাঁও, উপজেলা: ধোবাউড়া, জেলা: ময়মনসিংহ",
      principalName: "মো. রফিকুল ইসলাম",
      globalDarkModeEnabled: true,
      admissionOpen: true,
      academicYear: "২০২৬",
      maintenanceMode: false
    },
    students: [
      {
        id: "ST-2026-601",
        nameBn: "মাহিন হাসান",
        nameEn: "Mahin Hasan",
        classVal: "6",
        section: "ক",
        roll: "১",
        year: "২০২৬",
        gender: "ছাত্র",
        guardianName: "মো. কামরুল হাসান",
        guardianPhone: "01711223344",
        bloodGroup: "A+",
        address: "ঘোষগাঁও, ধোবাউড়া",
        status: "Active"
      },
      {
        id: "ST-2026-701",
        nameBn: "ফাতেমা জান্নাত",
        nameEn: "Fatema Jannat",
        classVal: "7",
        section: "খ",
        roll: "২",
        year: "২০২৬",
        gender: "ছাত্রী",
        guardianName: "আব্দুল জলিল",
        guardianPhone: "01822334455",
        bloodGroup: "B+",
        address: "মুন্সীরহাট, ধোবাউড়া",
        status: "Active"
      },
      {
        id: "ST-2026-801",
        nameBn: "তানভীর আহমেদ",
        nameEn: "Tanvir Ahmed",
        classVal: "8",
        section: "ক",
        roll: "৩",
        year: "২০২৬",
        gender: "ছাত্র",
        guardianName: "মোখলেছুর রহমান",
        guardianPhone: "01933445566",
        bloodGroup: "O+",
        address: "ঘোষগাঁও বাজার, ধোবাউড়া",
        status: "Active"
      },
      {
        id: "ST-2026-901",
        nameBn: "সুমাইয়া আক্তার",
        nameEn: "Sumaiya Akter",
        classVal: "9",
        section: "ক",
        roll: "৪",
        year: "২০২৬",
        gender: "ছাত্রী",
        guardianName: "রফিকুল ইসলাম",
        guardianPhone: "01755667788",
        bloodGroup: "AB+",
        address: "পোড়াকান্দুলিয়া, ধোবাউড়া",
        status: "Active"
      },
      {
        id: "ST-2026-101",
        nameBn: "আব্দুল্লাহ আল মামুন",
        nameEn: "Abdullah Al Mamun",
        classVal: "10",
        section: "ক",
        roll: "৫",
        year: "২০২৬",
        gender: "ছাত্র",
        guardianName: "নুরুল ইসলাম",
        guardianPhone: "01788990011",
        bloodGroup: "O+",
        address: "ঘোষগাঁও, ধোবাউড়া",
        status: "Active"
      }
    ],
    teachers: [
      {
        id: "TCH-001",
        nameBn: "মাওলানা মো. শামসুল হুদা",
        nameEn: "Md. Shamsul Huda",
        designation: "প্রধান শিক্ষক (অব.)",
        dept: "সাধারণ ও প্রশাসন",
        subject: "ইসলাম শিক্ষা ও মানবিক",
        qualification: "এম.এ, বি.এড",
        phone: "01711002233",
        email: "headmaster@ghoshgaon-school.edu.bd",
        type: "retired",
        publicVisible: true,
        photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "TCH-002",
        nameBn: "ফরিদা খাতুন",
        nameEn: "Farida Khatoon",
        designation: "সহকারী প্রধান শিক্ষক",
        dept: "বিজ্ঞান",
        subject: "গণিত ও উচ্চতর গণিত",
        qualification: "এম.এসসি (গণিত), বি.এড",
        phone: "01811223344",
        email: "farida@ghoshgaon-school.edu.bd",
        type: "present",
        publicVisible: true,
        photo: "teacher-farida-khatoon.jpg"
      },
      {
        id: "TCH-003",
        nameBn: "মো. আনিসুর রহমান",
        nameEn: "Md. Anisur Rahman",
        designation: "সিনিয়র সহকারী শিক্ষক",
        dept: "বিজ্ঞান",
        subject: "পদার্থবিজ্ঞান ও রসায়ন",
        qualification: "এম.এসসি (পদার্থবিজ্ঞান)",
        phone: "01911334455",
        email: "anis@ghoshgaon-school.edu.bd",
        type: "present",
        publicVisible: true,
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "TCH-004",
        nameBn: "মো. মাহমুদুল হাসান",
        nameEn: "Md. Mahmudul Hasan",
        designation: "সহকারী শিক্ষক (আইসিটি)",
        dept: "বিজ্ঞান",
        subject: "তথ্য ও যোগাযোগ প্রযুক্তি",
        qualification: "বি.এসসি ইন সিএসই",
        phone: "01711445566",
        email: "ict@ghoshgaon-school.edu.bd",
        type: "present",
        publicVisible: true,
        photo: "teacher-ict.jpg"
      }
    ],
    classes: [
      { id: "CLS-6", name: "ষষ্ঠ শ্রেণি (Class 6)", sections: "ক, খ", classTeacher: "মো. আনিসুর রহমান", studentsCount: 140 },
      { id: "CLS-7", name: "সপ্তম শ্রেণি (Class 7)", sections: "ক, খ", classTeacher: "ফরিদা খাতুন", studentsCount: 135 },
      { id: "CLS-8", name: "অষ্টম শ্রেণি (Class 8)", sections: "ক, খ", classTeacher: "মো. মাহমুদুল হাসান", studentsCount: 128 },
      { id: "CLS-9", name: "নবম শ্রেণি (Class 9)", sections: "ক (বিজ্ঞান), খ (মানবিক)", classTeacher: "মো. আনিসুর রহমান", studentsCount: 115 },
      { id: "CLS-10", name: "দশম শ্রেণি (Class 10)", sections: "ক (বিজ্ঞান), খ (মানবিক)", classTeacher: "ফরিদা খাতুন", studentsCount: 110 }
    ],
    admissions: [
      {
        id: "ADM-2026-101",
        applicantName: "রাকিবুল হাসান",
        desiredClass: "6",
        previousSchool: "ঘোষগাঁও সরকারি প্রাথমিক বিদ্যালয়",
        gpa: "৫.০০",
        guardianName: "মো. দেলোয়ার হোসেন",
        guardianPhone: "01712987654",
        dob: "2013-05-12",
        gender: "ছাত্র",
        address: "ঘোষগাঁও, ধোবাউড়া",
        status: "Pending", // Pending, Under Review, Approved, Rejected
        submissionDate: "২৫ অক্টোবর, ২০২৬",
        adminNotes: "সনদপত্র যাচাই সম্পন্ন।"
      },
      {
        id: "ADM-2026-102",
        applicantName: "আফরোজা সুলতানা",
        desiredClass: "6",
        previousSchool: "মুন্সীরহাট মডেল একাডেমি",
        gpa: "৪.৮৩",
        guardianName: "শাহ আলম",
        guardianPhone: "01819876543",
        dob: "2013-08-20",
        gender: "ছাত্রী",
        address: "মুন্সীরহাট, ধোবাউড়া",
        status: "Approved",
        submissionDate: "২৬ অক্টোবর, ২০২৬",
        adminNotes: "ভর্তি ফি পরিশোধিত ও রোল নিশ্চিত।"
      }
    ],
    notices: [
      {
        id: "NOT-001",
        title: "২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তি আবেদন সংক্রান্ত জরুরি বিজ্ঞপ্তি",
        category: "ভর্তি",
        publishDate: "২৪ অক্টোবর, ২০২৬",
        expiryDate: "১৫ নভেম্বর, ২০২৬",
        description: "ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়ে ২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ হতে ৯ম শ্রেণিতে নতুন শিক্ষার্থী ভর্তির জন্য অনলাইনে আবেদন আহ্বান করা যাচ্ছে। আগ্রহী শিক্ষার্থী ও অভিভাবকবৃন্দ নির্ধারিত ফরম পূরণ করে আবেদন সম্পন্ন করুন।",
        priority: "pinned",
        attachmentUrl: "",
        status: "published"
      },
      {
        id: "NOT-002",
        title: "অর্ধবার্ষিক মূল্যায়ন পরীক্ষার সময়সূচি ও প্রবেশপত্র বিতরণ",
        category: "পরীক্ষা",
        publishDate: "২০ অক্টোবর, ২০২৬",
        expiryDate: "১০ নভেম্বর, ২০২৬",
        description: "সকল শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে আগামী ১০ নভেম্বর থেকে সকল শ্রেণির অর্ধবার্ষিক মূল্যায়ন পরীক্ষা শুরু হবে। অফিস থেকে নির্ধারিত সময়ের মধ্যে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া হলো।",
        priority: "normal",
        attachmentUrl: "",
        status: "published"
      },
      {
        id: "NOT-003",
        title: "জাতীয় শোক দিবস ও আন্তঃস্কুল রচনা প্রতিযোগিতা ২০২৬",
        category: "একাডেমিক",
        publishDate: "১৫ আগস্ট, ২০২৬",
        expiryDate: "৩০ আগস্ট, ২০২৬",
        description: "বিদ্যালয়ের মিলনায়তনে অনুষ্ঠিত হতে যাচ্ছে শোক দিবস উপলক্ষে কুইজ ও রচনা প্রতিযোগিতা। আগ্রহীদের শ্রেণি শিক্ষকের কাছে নাম তালিকাভুক্ত করার আহ্বান জানানো হলো।",
        priority: "normal",
        attachmentUrl: "",
        status: "published"
      }
    ],
    results: [
      {
        id: "RES-2026-1001",
        studentName: "আব্দুল্লাহ আল মামুন",
        roll: "১",
        regNo: "18123456",
        classVal: "10",
        examType: "বার্ষিক পরীক্ষা ২০২৬",
        gpa: "৫.০০",
        status: "কৃতকার্য (A+)",
        subjects: [
          { name: "বাংলা", mark: 85, grade: "A+" },
          { name: "ইংরেজি", mark: 82, grade: "A+" },
          { name: "গণিত", mark: 94, grade: "A+" },
          { name: "বিজ্ঞান", mark: 88, grade: "A+" },
          { name: "আইসিটি", mark: 48, grade: "A+" }
        ]
      },
      {
        id: "RES-2026-1002",
        studentName: "মাহমুদ হাসান",
        roll: "২",
        regNo: "18123457",
        classVal: "10",
        examType: "বার্ষিক পরীক্ষা ২০২৬",
        gpa: "৪.৮৫",
        status: "কৃতকার্য (A)",
        subjects: [
          { name: "বাংলা", mark: 78, grade: "A" },
          { name: "ইংরেজি", mark: 75, grade: "A" },
          { name: "গণিত", mark: 89, grade: "A+" },
          { name: "বিজ্ঞান", mark: 80, grade: "A+" },
          { name: "আইসিটি", mark: 45, grade: "A" }
        ]
      }
    ],
    gallery: [
      {
        id: "GAL-01",
        title: "বিদ্যালয়ের সুবিশাল ক্যাম্পাস ও সবুজ খেলার মাঠ",
        category: "ক্যাম্পাস",
        url: "hero-campus.jpg",
        date: "২০২৬"
      },
      {
        id: "GAL-02",
        title: "শ্রেণিকক্ষে আনন্দঘন পাঠদান মুহূর্ত",
        category: "ক্লাসরুম",
        url: "hero-students.jpg",
        date: "২০২৬"
      },
      {
        id: "GAL-03",
        title: "সুসজ্জিত পাঠাগার ও বিজ্ঞান গবেষণাগার",
        category: "সুযোগ-সুবিধা",
        url: "hero-books.jpg",
        date: "২০২৬"
      }
    ],
    messages: [
      {
        id: "MSG-001",
        senderName: "মো. আলমগীর হোসেন",
        senderPhone: "01712-998877",
        senderEmail: "alamgir@gmail.com",
        subject: "ভর্তি ফি ও হোস্টেল সুবিধা সংক্রান্ত তথ্য জানতে চাই",
        message: "আসসালামু আলাইকুম। আমার ছেলেকে ৬ষ্ঠ শ্রেণিতে ভর্তি করাতে চাই। বিদ্যালয়ের আবাসিক হোস্টেল সুবিধা এবং মাসিক ফি সম্পর্কে জানালে উপকৃত হতাম।",
        date: "২৮ অক্টোবর, ২০২৬",
        read: false
      }
    ],
    auditLogs: [
      {
        id: "LOG-001",
        timestamp: Date.now(),
        dateFormatted: "২৯ অক্টোবর, ২০২৬",
        user: "Mamun190a",
        action: "সিস্টেম ইনিশিয়ালাইজেশন ও সিকিউরিটি কনফিগারেশন সফল।"
      }
    ]
  };

  // Database Management Class
  class SchoolDatabase {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(DB_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Merge with initial db to ensure missing fields exist
          return {
            settings: { ...INITIAL_DB.settings, ...(parsed.settings || {}) },
            students: Array.isArray(parsed.students) ? parsed.students : INITIAL_DB.students,
            teachers: Array.isArray(parsed.teachers) ? parsed.teachers : INITIAL_DB.teachers,
            classes: Array.isArray(parsed.classes) ? parsed.classes : INITIAL_DB.classes,
            admissions: Array.isArray(parsed.admissions) ? parsed.admissions : INITIAL_DB.admissions,
            notices: Array.isArray(parsed.notices) ? parsed.notices : INITIAL_DB.notices,
            results: Array.isArray(parsed.results) ? parsed.results : INITIAL_DB.results,
            gallery: Array.isArray(parsed.gallery) ? parsed.gallery : INITIAL_DB.gallery,
            messages: Array.isArray(parsed.messages) ? parsed.messages : INITIAL_DB.messages,
            auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : INITIAL_DB.auditLogs
          };
        }
      } catch (e) {
        console.warn("Error loading database, resetting to seed data:", e);
      }
      this.save(INITIAL_DB);
      return JSON.parse(JSON.stringify(INITIAL_DB));
    }

    save(dataToSave = null) {
      if (dataToSave) {
        this.data = dataToSave;
      }
      try {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error("Storage save error:", e);
      }
    }

    logAudit(action, user = "Mamun190a") {
      const logEntry = {
        id: "LOG-" + Date.now(),
        timestamp: Date.now(),
        dateFormatted: new Date().toLocaleString("bn-BD"),
        user: user,
        action: action
      };
      if (!this.data.auditLogs) this.data.auditLogs = [];
      this.data.auditLogs.unshift(logEntry);
      if (this.data.auditLogs.length > 100) {
        this.data.auditLogs.pop();
      }
      this.save();
    }

    // --- Settings ---
    getSettings() {
      return this.data.settings;
    }
    updateSettings(newSettings, user = "Mamun190a") {
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.save();
      this.logAudit("ওয়েবসাইট ও গ্লোবাল সেটিংস আপডেট করা হয়েছে", user);
      return this.data.settings;
    }

    // --- Students ---
    getStudents() {
      return this.data.students || [];
    }
    addStudent(student, user = "Mamun190a") {
      if (!student.id) {
        student.id = "ST-" + Date.now();
      }
      this.data.students.unshift(student);
      this.save();
      this.logAudit(`নতুন শিক্ষার্থী যুক্ত: ${student.nameBn} (রোল: ${student.roll})`, user);
      return student;
    }
    updateStudent(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        this.data.students[idx] = { ...this.data.students[idx], ...updatedFields };
        this.save();
        this.logAudit(`শিক্ষার্থী তথ্য সংশোধন: ${this.data.students[idx].nameBn}`, user);
        return this.data.students[idx];
      }
      return null;
    }
    deleteStudent(id, user = "Mamun190a") {
      const target = this.data.students.find(s => s.id === id);
      this.data.students = this.data.students.filter(s => s.id !== id);
      this.save();
      if (target) {
        this.logAudit(`শিক্ষার্থী রেকর্ড অপসারিত: ${target.nameBn}`, user);
      }
      return true;
    }

    // --- Teachers ---
    getTeachers() {
      return this.data.teachers || [];
    }
    addTeacher(teacher, user = "Mamun190a") {
      if (!teacher.id) {
        teacher.id = "TCH-" + Date.now();
      }
      this.data.teachers.unshift(teacher);
      this.save();
      this.logAudit(`নতুন শিক্ষক তথ্য যুক্ত: ${teacher.nameBn} (${teacher.designation})`, user);
      return teacher;
    }
    updateTeacher(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.teachers.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.data.teachers[idx] = { ...this.data.teachers[idx], ...updatedFields };
        this.save();
        this.logAudit(`শিক্ষক তথ্য সংশোধন: ${this.data.teachers[idx].nameBn}`, user);
        return this.data.teachers[idx];
      }
      return null;
    }
    deleteTeacher(id, user = "Mamun190a") {
      const target = this.data.teachers.find(t => t.id === id);
      this.data.teachers = this.data.teachers.filter(t => t.id !== id);
      this.save();
      if (target) {
        this.logAudit(`শিক্ষক রেকর্ড অপসারিত: ${target.nameBn}`, user);
      }
      return true;
    }

    // --- Admissions ---
    getAdmissions() {
      return this.data.admissions || [];
    }
    submitAdmission(application) {
      if (!application.id) {
        application.id = "ADM-" + Date.now().toString().slice(-6);
      }
      if (!application.submissionDate) {
        const d = new Date();
        application.submissionDate = d.toLocaleDateString("bn-BD");
      }
      if (!application.status) {
        application.status = "Pending";
      }
      this.data.admissions.unshift(application);
      this.save();
      this.logAudit(`নতুন অনলাইন ভর্তি আবেদন দাখিল: ${application.applicantName} (শ্রেণি: ${application.desiredClass})`, "Public");
      return application;
    }
    updateAdmissionStatus(id, newStatus, adminNotes = "", user = "Mamun190a") {
      const app = this.data.admissions.find(a => a.id === id);
      if (app) {
        app.status = newStatus;
        if (adminNotes) app.adminNotes = adminNotes;
        this.save();
        this.logAudit(`ভর্তি আবেদন স্ট্যাটাস পরিবর্তন: ${app.applicantName} -> ${newStatus}`, user);
        return app;
      }
      return null;
    }
    deleteAdmission(id, user = "Mamun190a") {
      this.data.admissions = this.data.admissions.filter(a => a.id !== id);
      this.save();
      this.logAudit(`ভর্তি আবেদন অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Notices ---
    getNotices() {
      return this.data.notices || [];
    }
    addNotice(notice, user = "Mamun190a") {
      if (!notice.id) {
        notice.id = "NOT-" + Date.now().toString().slice(-6);
      }
      if (!notice.publishDate) {
        notice.publishDate = new Date().toLocaleDateString("bn-BD");
      }
      this.data.notices.unshift(notice);
      this.save();
      this.logAudit(`নতুন নোটিশ প্রকাশিত: "${notice.title.slice(0, 30)}..."`, user);
      return notice;
    }
    updateNotice(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.notices.findIndex(n => n.id === id);
      if (idx !== -1) {
        this.data.notices[idx] = { ...this.data.notices[idx], ...updatedFields };
        this.save();
        this.logAudit(`নোটিশ সংশোধন: "${this.data.notices[idx].title.slice(0, 30)}..."`, user);
        return this.data.notices[idx];
      }
      return null;
    }
    deleteNotice(id, user = "Mamun190a") {
      this.data.notices = this.data.notices.filter(n => n.id !== id);
      this.save();
      this.logAudit(`নোটিশ অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Results ---
    getResults() {
      return this.data.results || [];
    }
    searchResult(classVal, examType, roll) {
      return (this.data.results || []).find(r => 
        String(r.classVal).trim() === String(classVal).trim() &&
        String(r.roll).trim() === String(roll).trim()
      );
    }
    addResult(resultItem, user = "Mamun190a") {
      if (!resultItem.id) {
        resultItem.id = "RES-" + Date.now();
      }
      this.data.results.unshift(resultItem);
      this.save();
      this.logAudit(`ফলাফল আপলোড: ${resultItem.studentName} (রোল: ${resultItem.roll})`, user);
      return resultItem;
    }
    deleteResult(id, user = "Mamun190a") {
      this.data.results = this.data.results.filter(r => r.id !== id);
      this.save();
      this.logAudit(`ফলাফল রেকর্ড অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Messages ---
    getMessages() {
      return this.data.messages || [];
    }
    submitMessage(msg) {
      if (!msg.id) {
        msg.id = "MSG-" + Date.now().toString().slice(-6);
      }
      msg.date = new Date().toLocaleDateString("bn-BD");
      msg.read = false;
      this.data.messages.unshift(msg);
      this.save();
      this.logAudit(`নতুন ওয়েবসাইট বার্তা: ${msg.senderName} (${msg.subject})`, "Public");
      return msg;
    }
    markMessageRead(id, user = "Mamun190a") {
      const msg = this.data.messages.find(m => m.id === id);
      if (msg) {
        msg.read = true;
        this.save();
        return msg;
      }
      return null;
    }
    deleteMessage(id, user = "Mamun190a") {
      this.data.messages = this.data.messages.filter(m => m.id !== id);
      this.save();
      this.logAudit(`বার্তা অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Gallery ---
    getGallery() {
      return this.data.gallery || [];
    }
    addGalleryItem(item, user = "Mamun190a") {
      if (!item.id) {
        item.id = "GAL-" + Date.now().toString().slice(-6);
      }
      this.data.gallery.unshift(item);
      this.save();
      this.logAudit(`গ্যালারিতে নতুন ছবি যুক্ত: ${item.title}`, user);
      return item;
    }
    deleteGalleryItem(id, user = "Mamun190a") {
      this.data.gallery = this.data.gallery.filter(g => g.id !== id);
      this.save();
      this.logAudit(`গ্যালারি ছবি অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Backup & Restore ---
    exportJSON() {
      return JSON.stringify(this.data, null, 2);
    }
    importJSON(jsonString, user = "Mamun190a") {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.settings && Array.isArray(parsed.students)) {
          this.data = parsed;
          this.save();
          this.logAudit("ব্যাকআপ থেকে সম্পূর্ণ ডাটাবেজ রিস্টোর করা হয়েছে", user);
          return { success: true };
        }
        return { success: false, error: "ভুল ফাইল ফরম্যাট" };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    resetToDefault(user = "Mamun190a") {
      this.data = JSON.parse(JSON.stringify(INITIAL_DB));
      this.save();
      this.logAudit("ডাটাবেজ ফ্যাক্টরি রিসেট করা হয়েছে", user);
      return true;
    }
  }

  // Instantiate singleton
  global.SchoolDB = new SchoolDatabase();

})(typeof window !== "undefined" ? window : this);
