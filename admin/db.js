/**
 * ============================================================================
 * GHOSHGAON SHERE BANGLA HIGH SCHOOL - CENTRAL DATABASE ENGINE (v3.0)
 * Clean Persistent Storage (No Dummy Data), Real-Time Visitor Logging,
 * Full CRUD, and Audit Logs
 * ============================================================================
 */
(function (global) {
  "use strict";

  const DB_STORAGE_KEY = "ghoshgaon_school_erp_db_v2";
  const VISITOR_STORAGE_KEY = "ghoshgaon_all_visitors_log";
  const TOTAL_VIEWS_KEY = "ghoshgaon_site_total_views";

  // Clean Initial State (ZERO dummy records - user adds real data)
  const INITIAL_DB = {
    settings: {
      adminUsername: "Mamun190a",
      adminPin: "112292",
      schoolName: "ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়",
      schoolNameBn: "ঘোষগাঁও শেরে বাংলা উচ্চ বিদ্যালয়",
      schoolNameEn: "Ghoshgaon Shere Bangla High School",
      eiin: "111812",
      estYear: "1968",
      motto: "জ্ঞান, শৃঙ্খলা, চরিত্র ও সেবা",
      phone: "+880 1712-345678",
      email: "info@ghoshgaon-school.edu.bd",
      address: "গ্রাম ও ডাকঘর: ঘোষগাঁও, উপজেলা: ধোবাউড়া, জেলা: ময়মনসিংহ",
      addressBn: "গ্রাম ও ডাকঘর: ঘোষগাঁও, উপজেলা: ধোবাউড়া, জেলা: ময়মনসিংহ",
      principalName: "মো. রফিকুল ইসলাম",
      globalDarkModeEnabled: true,
      admissionOpen: true,
      academicYear: "২০২৬",
      maintenanceMode: false
    },
    students: [],
    teachers: [],
    classes: [
      { id: "CLS-6", name: "Class 6", nameBn: "ষষ্ঠ শ্রেণি (Class 6)", section: "ক", sections: "ক, খ", classTeacher: "নির্ধারিত নয়", roomNo: "১০১", studentsCount: 0 },
      { id: "CLS-7", name: "Class 7", nameBn: "সপ্তম শ্রেণি (Class 7)", section: "ক", sections: "ক, খ", classTeacher: "নির্ধারিত নয়", roomNo: "১০২", studentsCount: 0 },
      { id: "CLS-8", name: "Class 8", nameBn: "অষ্টম শ্রেণি (Class 8)", section: "ক", sections: "ক, খ", classTeacher: "নির্ধারিত নয়", roomNo: "১০৩", studentsCount: 0 },
      { id: "CLS-9", name: "Class 9", nameBn: "নবম শ্রেণি (Class 9)", section: "ক (বিজ্ঞান), খ (মানবিক)", sections: "ক (বিজ্ঞান), খ (মানবিক)", classTeacher: "নির্ধারিত নয়", roomNo: "২০১", studentsCount: 0 },
      { id: "CLS-10", name: "Class 10", nameBn: "দশম শ্রেণি (Class 10)", section: "ক (বিজ্ঞান), খ (মানবিক)", sections: "ক (বিজ্ঞান), খ (মানবিক)", classTeacher: "নির্ধারিত নয়", roomNo: "২০২", studentsCount: 0 }
    ],
    admissions: [],
    notices: [],
    results: [],
    messages: [],
    gallery: [],
    visitorLogs: [],
    auditLogs: []
  };

  class SchoolDatabase {
    constructor() {
      this.data = this.load();
    }

    normalizeData(db) {
      if (!db || typeof db !== "object") return INITIAL_DB;

      // Settings
      db.settings = { ...INITIAL_DB.settings, ...(db.settings || {}) };
      if (!db.settings.adminUsername) db.settings.adminUsername = "Mamun190a";
      if (!db.settings.adminPin) db.settings.adminPin = "112292";

      // Collections
      if (!Array.isArray(db.students)) db.students = [];
      if (!Array.isArray(db.teachers)) db.teachers = [];
      if (!Array.isArray(db.classes) || db.classes.length === 0) db.classes = INITIAL_DB.classes;
      if (!Array.isArray(db.admissions)) db.admissions = [];
      if (!Array.isArray(db.notices)) db.notices = [];
      if (!Array.isArray(db.results)) db.results = [];
      if (!Array.isArray(db.messages)) db.messages = [];
      if (!Array.isArray(db.gallery)) db.gallery = [];
      if (!Array.isArray(db.visitorLogs)) db.visitorLogs = [];
      if (!Array.isArray(db.auditLogs)) db.auditLogs = [];

      // Filter out any previous dummy items if any exist
      db.students = db.students.filter(s => !s.id || !s.id.startsWith("ST-2026-"));
      db.teachers = db.teachers.filter(t => !t.id || !t.id.startsWith("TCH-00"));
      db.notices = db.notices.filter(n => !n.id || !n.id.startsWith("NOT-00"));
      db.admissions = db.admissions.filter(a => !a.id || !a.id.startsWith("ADM-2026-"));
      db.results = db.results.filter(r => !r.id || !r.id.startsWith("RES-2026-"));
      db.messages = db.messages.filter(m => !m.id || !m.id.startsWith("MSG-00"));
      db.gallery = db.gallery.filter(g => !g.id || !g.id.startsWith("GAL-00"));

      return db;
    }

    load() {
      try {
        const raw = localStorage.getItem(DB_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const normalized = this.normalizeData(parsed);
          this.save(normalized);
          return normalized;
        }
      } catch (e) {
        console.warn("Error loading database, resetting to clean state:", e);
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

    // --- Audit Logs ---
    addAuditLog(action, details = "", user = "Mamun190a") {
      const now = new Date();
      const logEntry = {
        id: "LOG-" + Date.now(),
        timestamp: now.toLocaleTimeString("bn-BD"),
        dateFormatted: now.toLocaleString("bn-BD"),
        action: action,
        details: details || action,
        user: user || "Mamun190a"
      };
      if (!this.data.auditLogs) this.data.auditLogs = [];
      this.data.auditLogs.unshift(logEntry);
      if (this.data.auditLogs.length > 100) {
        this.data.auditLogs.pop();
      }
      this.save();
      return logEntry;
    }

    logAudit(action, user = "Mamun190a") {
      return this.addAuditLog(action, action, user);
    }

    getAuditLogs() {
      return this.data.auditLogs || [];
    }

    // --- Settings ---
    getSettings() {
      if (!this.data.settings) {
        this.data.settings = { ...INITIAL_DB.settings };
      }
      if (!this.data.settings.adminUsername) {
        this.data.settings.adminUsername = "Mamun190a";
      }
      if (!this.data.settings.adminPin) {
        this.data.settings.adminPin = "112292";
      }
      return this.data.settings;
    }

    updateSettings(newSettings, user = "Mamun190a") {
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.save();
      this.addAuditLog("SETTINGS_UPDATE", "ওয়েবসাইট ও গ্লোবাল সেটিংস আপডেট করা হয়েছে", user);
      return this.data.settings;
    }

    // --- Students ---
    getStudents() {
      return this.data.students || [];
    }

    getStudentById(id) {
      return (this.data.students || []).find((s) => s.id === id) || null;
    }

    addStudent(student, user = "Mamun190a") {
      if (!student.id) {
        student.id = "STU-" + Date.now().toString().slice(-6);
      }
      student.nameBn = student.nameBn || student.name;
      student.name = student.name || student.nameBn;
      this.data.students.unshift(student);
      this.save();
      this.addAuditLog("STUDENT_ADD", `নতুন শিক্ষার্থী যুক্ত: ${student.name} (রোল: ${student.roll})`, user);
      return student;
    }

    updateStudent(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.students.findIndex((s) => s.id === id);
      if (idx !== -1) {
        this.data.students[idx] = { ...this.data.students[idx], ...updatedFields };
        this.save();
        this.addAuditLog("STUDENT_UPDATE", `শিক্ষার্থী তথ্য সংশোধন: ${this.data.students[idx].name}`, user);
        return this.data.students[idx];
      }
      return null;
    }

    deleteStudent(id, user = "Mamun190a") {
      const target = this.data.students.find((s) => s.id === id);
      this.data.students = this.data.students.filter((s) => s.id !== id);
      this.save();
      if (target) {
        this.addAuditLog("STUDENT_DELETE", `শিক্ষার্থী রেকর্ড অপসারিত: ${target.name}`, user);
      }
      return true;
    }

    // --- Teachers ---
    getTeachers() {
      return this.data.teachers || [];
    }

    addTeacher(teacher, user = "Mamun190a") {
      if (!teacher.id) {
        teacher.id = "TCH-" + Date.now().toString().slice(-4);
      }
      teacher.nameBn = teacher.nameBn || teacher.name;
      teacher.name = teacher.name || teacher.nameBn;
      this.data.teachers.unshift(teacher);
      this.save();
      this.addAuditLog("TEACHER_ADD", `নতুন শিক্ষক তথ্য যুক্ত: ${teacher.name} (${teacher.designation})`, user);
      return teacher;
    }

    updateTeacher(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.teachers.findIndex((t) => t.id === id);
      if (idx !== -1) {
        this.data.teachers[idx] = { ...this.data.teachers[idx], ...updatedFields };
        this.save();
        this.addAuditLog("TEACHER_UPDATE", `শিক্ষক তথ্য সংশোধন: ${this.data.teachers[idx].name}`, user);
        return this.data.teachers[idx];
      }
      return null;
    }

    deleteTeacher(id, user = "Mamun190a") {
      const target = this.data.teachers.find((t) => t.id === id);
      this.data.teachers = this.data.teachers.filter((t) => t.id !== id);
      this.save();
      if (target) {
        this.addAuditLog("TEACHER_DELETE", `শিক্ষক রেকর্ড অপসারিত: ${target.name}`, user);
      }
      return true;
    }

    // --- Classes ---
    getClasses() {
      return this.data.classes || [];
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
      this.addAuditLog("ADMISSION_SUBMIT", `নতুন অনলাইন ভর্তি আবেদন দাখিল: ${application.applicantName}`, "Public");
      return application;
    }

    updateAdmissionStatus(id, newStatus, adminNotes = "", user = "Mamun190a") {
      const app = this.data.admissions.find((a) => a.id === id);
      if (app) {
        app.status = newStatus;
        if (adminNotes) app.adminNotes = adminNotes;
        this.save();
        this.addAuditLog("ADMISSION_UPDATE", `ভর্তি আবেদন স্ট্যাটাস পরিবর্তন: ${app.applicantName} -> ${newStatus}`, user);
        return app;
      }
      return null;
    }

    deleteAdmission(id, user = "Mamun190a") {
      this.data.admissions = this.data.admissions.filter((a) => a.id !== id);
      this.save();
      this.addAuditLog("ADMISSION_DELETE", `ভর্তি আবেদন অপসারিত: ID ${id}`, user);
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
      if (!notice.date) {
        notice.date = new Date().toLocaleDateString("bn-BD");
      }
      notice.publishDate = notice.date;
      notice.status = notice.isPublished ? "published" : "draft";
      this.data.notices.unshift(notice);
      this.save();
      this.addAuditLog("NOTICE_ADD", `নতুন নোটিশ প্রকাশিত: "${notice.title.slice(0, 30)}..."`, user);
      return notice;
    }

    updateNotice(id, updatedFields, user = "Mamun190a") {
      const idx = this.data.notices.findIndex((n) => n.id === id);
      if (idx !== -1) {
        this.data.notices[idx] = { ...this.data.notices[idx], ...updatedFields };
        this.save();
        this.addAuditLog("NOTICE_UPDATE", `নোটিশ সংশোধন: "${this.data.notices[idx].title.slice(0, 30)}..."`, user);
        return this.data.notices[idx];
      }
      return null;
    }

    deleteNotice(id, user = "Mamun190a") {
      this.data.notices = this.data.notices.filter((n) => n.id !== id);
      this.save();
      this.addAuditLog("NOTICE_DELETE", `নোটিশ অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- Results ---
    getResults() {
      return this.data.results || [];
    }

    searchResult(classVal, examType, roll) {
      return (this.data.results || []).find((r) =>
        String(r.class || r.classVal).trim() === String(classVal).trim() &&
        String(r.roll).trim() === String(roll).trim()
      );
    }

    addResult(resultItem, user = "Mamun190a") {
      if (!resultItem.id) {
        resultItem.id = "RES-" + Date.now().toString().slice(-6);
      }
      this.data.results.unshift(resultItem);
      this.save();
      this.addAuditLog("RESULT_ADD", `ফলাফল আপলোড: ${resultItem.studentName} (রোল: ${resultItem.roll})`, user);
      return resultItem;
    }

    deleteResult(id, user = "Mamun190a") {
      this.data.results = this.data.results.filter((r) => r.id !== id);
      this.save();
      this.addAuditLog("RESULT_DELETE", `ফলাফল রেকর্ড অপসারিত: ID ${id}`, user);
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
      msg.timestamp = new Date().toLocaleString("bn-BD");
      msg.date = msg.timestamp;
      msg.status = msg.status || "Unread";
      msg.read = msg.status === "Read";
      msg.name = msg.name || msg.senderName || "অভিভাবক";
      this.data.messages.unshift(msg);
      this.save();
      this.addAuditLog("MESSAGE_SUBMIT", `নতুন ওয়েবসাইট বার্তা: ${msg.name} (${msg.subject})`, "Public");
      return msg;
    }

    updateMessageStatus(id, status = "Read", user = "Mamun190a") {
      const msg = this.data.messages.find((m) => m.id === id);
      if (msg) {
        msg.status = status;
        msg.read = status === "Read";
        this.save();
        return msg;
      }
      return null;
    }

    markMessageRead(id, user = "Mamun190a") {
      return this.updateMessageStatus(id, "Read", user);
    }

    deleteMessage(id, user = "Mamun190a") {
      this.data.messages = this.data.messages.filter((m) => m.id !== id);
      this.save();
      this.addAuditLog("MESSAGE_DELETE", `বার্তা অপসারিত: ID ${id}`, user);
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
      this.addAuditLog("GALLERY_ADD", `গ্যালারিতে নতুন ছবি যুক্ত: ${item.title}`, user);
      return item;
    }

    deleteGalleryItem(id, user = "Mamun190a") {
      this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
      this.save();
      this.addAuditLog("GALLERY_DELETE", `গ্যালারি ছবি অপসারিত: ID ${id}`, user);
      return true;
    }

    // --- REAL-TIME VISITOR / STUDENT ACCESS TRACKING ---
    getVisitorLogs() {
      // Pull real visitor logs from shared localStorage
      let logs = [];
      try {
        const raw = localStorage.getItem(VISITOR_STORAGE_KEY);
        if (raw) {
          logs = JSON.parse(raw);
        }
      } catch (e) {}

      // Combine with database visitorLogs without duplicates
      const dbLogs = this.data.visitorLogs || [];
      const combinedMap = new Map();

      logs.forEach(l => { if (l && l.id) combinedMap.set(l.id, l); });
      dbLogs.forEach(l => { if (l && l.id) combinedMap.set(l.id, l); });

      const sorted = Array.from(combinedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      return sorted;
    }

    addVisitorLog(visitorRecord) {
      if (!visitorRecord.id) {
        visitorRecord.id = "vis_" + Date.now();
      }
      if (!this.data.visitorLogs) this.data.visitorLogs = [];
      this.data.visitorLogs.unshift(visitorRecord);
      this.save();

      // Also sync to shared VISITOR_STORAGE_KEY
      try {
        const existing = JSON.parse(localStorage.getItem(VISITOR_STORAGE_KEY) || "[]");
        existing.unshift(visitorRecord);
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(existing));
      } catch (e) {}

      return visitorRecord;
    }

    deleteVisitorLog(id) {
      this.data.visitorLogs = (this.data.visitorLogs || []).filter(l => l.id !== id);
      this.save();

      try {
        const existing = JSON.parse(localStorage.getItem(VISITOR_STORAGE_KEY) || "[]");
        const updated = existing.filter(l => l.id !== id);
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      return true;
    }

    clearVisitorLogs() {
      this.data.visitorLogs = [];
      this.save();
      try {
        localStorage.removeItem(VISITOR_STORAGE_KEY);
      } catch (e) {}
      return true;
    }

    getTotalSiteViews() {
      try {
        return parseInt(localStorage.getItem(TOTAL_VIEWS_KEY) || "0", 10);
      } catch (e) {
        return 0;
      }
    }

    // --- Backup & Restore ---
    exportDatabaseJSON() {
      const fullExport = {
        ...this.data,
        visitorLogs: this.getVisitorLogs(),
        totalViews: this.getTotalSiteViews()
      };
      return JSON.stringify(fullExport, null, 2);
    }

    exportJSON() {
      return this.exportDatabaseJSON();
    }

    restoreDatabase(jsonString, user = "Mamun190a") {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed && typeof parsed === "object") {
          this.data = this.normalizeData(parsed);
          this.save();
          if (Array.isArray(parsed.visitorLogs)) {
            try {
              localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(parsed.visitorLogs));
            } catch (e) {}
          }
          this.addAuditLog("RESTORE", "ব্যাকআপ থেকে সম্পূর্ণ ডাটাবেজ রিস্টোর করা হয়েছে", user);
          return true;
        }
      } catch (err) {
        console.error("Restore error:", err);
      }
      return false;
    }

    importJSON(jsonString, user = "Mamun190a") {
      const ok = this.restoreDatabase(jsonString, user);
      return { success: ok, error: ok ? null : "ভুল ফাইল ফরম্যাট" };
    }

    resetToDefault(user = "Mamun190a") {
      this.data = JSON.parse(JSON.stringify(INITIAL_DB));
      this.save();
      this.addAuditLog("RESET", "ডাটাবেজ ফ্যাক্টরি রিসেট করা হয়েছে", user);
      return true;
    }
  }

  // Instantiate singleton
  global.SchoolDB = new SchoolDatabase();

})(typeof window !== "undefined" ? window : this);
