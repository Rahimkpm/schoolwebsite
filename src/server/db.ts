import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface SchoolSettings {
  schoolName: string;
  shortName: string;
  tagline: string;
  heroDescription: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  state: string;
  phone: string;
  displayPhone: string;
  whatsappNumber: string;
  email: string;
  workingHours: string;
  announcement: string;
  announcementActive: boolean;
  principalMessage: string;
  principalTitle: string;
  schoolHistory: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Admission' | 'Holiday' | 'Examination' | 'Event' | 'Circular';
  date: string;
  description: string;
  isPinned: boolean;
  isPublished: boolean;
  downloadUrl?: string;
}

export interface AdmissionEnquiry {
  id: string;
  parentName: string;
  studentName: string;
  applyingClass: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'admitted' | 'archived';
  notes?: string;
  createdAt: string;
}

export interface AcademicStage {
  id: string;
  stage: string;
  classes: string[];
  ageGroup: string;
  summary: string;
  subjects: string[];
  focus: string[];
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  highlight: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  description: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminUser: string;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  name: string;
  role: 'superadmin' | 'admin' | 'staff';
}

export interface DatabaseSchema {
  settings: SchoolSettings;
  notices: Notice[];
  enquiries: AdmissionEnquiry[];
  academics: AcademicStage[];
  facilities: Facility[];
  gallery: GalleryItem[];
  auditLogs: AuditLog[];
  adminUsers: AdminUser[];
}

const DB_PATH = path.resolve(process.cwd(), 'data/school-database.json');
const BACKUP_PATH = path.resolve(process.cwd(), 'data/school-database.backup.json');

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

export class Database {
  private static instance: Database;
  private data: DatabaseSchema;
  private sessions: Map<string, { username: string; expiresAt: number; role: string }> = new Map();

  private constructor() {
    this.data = this.loadData();
    // Ensure default admin password hash is set for 'ideal2026'
    const defaultHash = hashPassword('ideal2026');
    const adminUser = this.data.adminUsers.find(u => u.username === 'admin');
    if (adminUser && adminUser.passwordHash !== defaultHash && adminUser.passwordHash.length !== 64) {
      adminUser.passwordHash = defaultHash;
      this.saveData();
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading primary DB file, attempting backup...', err);
      if (fs.existsSync(BACKUP_PATH)) {
        const raw = fs.readFileSync(BACKUP_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    }

    throw new Error('Database file could not be read or does not exist at ' + DB_PATH);
  }

  public saveData(): void {
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_PATH, serialized, 'utf-8');
      // Create backup copy for durable reliability
      fs.writeFileSync(BACKUP_PATH, serialized, 'utf-8');
    } catch (err) {
      console.error('Critical: Failed to save database file', err);
    }
  }

  // Auth & Sessions
  public authenticate(username: string, plainPass: string): { token: string; user: { username: string; name: string; role: string } } | null {
    const user = this.data.adminUsers.find(u => u.username === username.trim());
    if (!user) return null;

    const hash = hashPassword(plainPass);
    if (user.passwordHash !== hash) return null;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.sessions.set(token, { username: user.username, expiresAt, role: user.role });

    this.logAudit('ADMIN_LOGIN', `Admin user ${user.username} successfully signed in.`, user.username);
    return { token, user: { username: user.username, name: user.name, role: user.role } };
  }

  public validateToken(token?: string): { username: string; role: string } | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return null;
    }
    return { username: session.username, role: session.role };
  }

  public logout(token: string): void {
    this.sessions.delete(token);
  }

  public changePassword(username: string, oldPass: string, newPass: string): boolean {
    const user = this.data.adminUsers.find(u => u.username === username);
    if (!user) return false;
    if (user.passwordHash !== hashPassword(oldPass)) return false;

    user.passwordHash = hashPassword(newPass);
    this.saveData();
    this.logAudit('PASSWORD_CHANGED', `Password was updated for user ${username}`, username);
    return true;
  }

  // Audit Logs
  public logAudit(action: string, details: string, adminUser: string): void {
    const entry: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      adminUser
    };
    this.data.auditLogs.unshift(entry);
    // Keep last 100 logs
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
    this.saveData();
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // Settings
  public getSettings(): SchoolSettings {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<SchoolSettings>, adminUser: string): SchoolSettings {
    this.data.settings = { ...this.data.settings, ...partial };
    this.saveData();
    this.logAudit('SETTINGS_UPDATED', `Updated school configuration / website settings`, adminUser);
    return this.data.settings;
  }

  // Notices
  public getNotices(onlyPublished = true): Notice[] {
    if (onlyPublished) {
      return this.data.notices.filter(n => n.isPublished);
    }
    return this.data.notices;
  }

  public addNotice(notice: Omit<Notice, 'id'>, adminUser: string): Notice {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`
    };
    this.data.notices.unshift(newNotice);
    this.saveData();
    this.logAudit('NOTICE_CREATED', `Published notice: "${newNotice.title}" (${newNotice.category})`, adminUser);
    return newNotice;
  }

  public updateNotice(id: string, updates: Partial<Notice>, adminUser: string): Notice | null {
    const index = this.data.notices.findIndex(n => n.id === id);
    if (index === -1) return null;
    this.data.notices[index] = { ...this.data.notices[index], ...updates };
    this.saveData();
    this.logAudit('NOTICE_UPDATED', `Updated notice: "${this.data.notices[index].title}"`, adminUser);
    return this.data.notices[index];
  }

  public deleteNotice(id: string, adminUser: string): boolean {
    const index = this.data.notices.findIndex(n => n.id === id);
    if (index === -1) return false;
    const title = this.data.notices[index].title;
    this.data.notices.splice(index, 1);
    this.saveData();
    this.logAudit('NOTICE_DELETED', `Deleted notice: "${title}"`, adminUser);
    return true;
  }

  // Admission Enquiries
  public getEnquiries(): AdmissionEnquiry[] {
    return this.data.enquiries;
  }

  public addEnquiry(enquiry: Omit<AdmissionEnquiry, 'id' | 'status' | 'createdAt'>): AdmissionEnquiry {
    const newEnquiry: AdmissionEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'pending',
      notes: '',
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.saveData();
    return newEnquiry;
  }

  public updateEnquiry(id: string, updates: Partial<AdmissionEnquiry>, adminUser: string): AdmissionEnquiry | null {
    const index = this.data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.enquiries[index] = { ...this.data.enquiries[index], ...updates };
    this.saveData();
    this.logAudit('ENQUIRY_UPDATED', `Updated admission enquiry for student ${this.data.enquiries[index].studentName} (Status: ${this.data.enquiries[index].status})`, adminUser);
    return this.data.enquiries[index];
  }

  public deleteEnquiry(id: string, adminUser: string): boolean {
    const index = this.data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return false;
    const student = this.data.enquiries[index].studentName;
    this.data.enquiries.splice(index, 1);
    this.saveData();
    this.logAudit('ENQUIRY_DELETED', `Deleted admission enquiry of ${student}`, adminUser);
    return true;
  }

  // Academics
  public getAcademics(): AcademicStage[] {
    return this.data.academics;
  }

  public updateAcademicStage(id: string, updates: Partial<AcademicStage>, adminUser: string): AcademicStage | null {
    const index = this.data.academics.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.data.academics[index] = { ...this.data.academics[index], ...updates };
    this.saveData();
    this.logAudit('ACADEMICS_UPDATED', `Updated syllabus details for ${this.data.academics[index].stage}`, adminUser);
    return this.data.academics[index];
  }

  // Facilities
  public getFacilities(): Facility[] {
    return this.data.facilities;
  }

  public addFacility(facility: Omit<Facility, 'id'>, adminUser: string): Facility {
    const newFacility: Facility = {
      ...facility,
      id: `fac-${Date.now()}`
    };
    this.data.facilities.push(newFacility);
    this.saveData();
    this.logAudit('FACILITY_ADDED', `Added campus facility: ${newFacility.name}`, adminUser);
    return newFacility;
  }

  public updateFacility(id: string, updates: Partial<Facility>, adminUser: string): Facility | null {
    const index = this.data.facilities.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.data.facilities[index] = { ...this.data.facilities[index], ...updates };
    this.saveData();
    this.logAudit('FACILITY_UPDATED', `Updated facility: ${this.data.facilities[index].name}`, adminUser);
    return this.data.facilities[index];
  }

  public deleteFacility(id: string, adminUser: string): boolean {
    const index = this.data.facilities.findIndex(f => f.id === id);
    if (index === -1) return false;
    const name = this.data.facilities[index].name;
    this.data.facilities.splice(index, 1);
    this.saveData();
    this.logAudit('FACILITY_DELETED', `Deleted facility: ${name}`, adminUser);
    return true;
  }

  // Gallery
  public getGallery(): GalleryItem[] {
    return this.data.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id'>, adminUser: string): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    this.data.gallery.unshift(newItem);
    this.saveData();
    this.logAudit('GALLERY_ADDED', `Added photo to gallery: ${newItem.title} (${newItem.category})`, adminUser);
    return newItem;
  }

  public deleteGalleryItem(id: string, adminUser: string): boolean {
    const index = this.data.gallery.findIndex(g => g.id === id);
    if (index === -1) return false;
    const title = this.data.gallery[index].title;
    this.data.gallery.splice(index, 1);
    this.saveData();
    this.logAudit('GALLERY_DELETED', `Removed photo: ${title}`, adminUser);
    return true;
  }

  // Dashboard Stats
  public getAdminStats() {
    const totalEnquiries = this.data.enquiries.length;
    const pendingEnquiries = this.data.enquiries.filter(e => e.status === 'pending').length;
    const contactedEnquiries = this.data.enquiries.filter(e => e.status === 'contacted').length;
    const admittedCount = this.data.enquiries.filter(e => e.status === 'admitted').length;
    const totalNotices = this.data.notices.length;
    const publishedNotices = this.data.notices.filter(n => n.isPublished).length;
    const totalGallery = this.data.gallery.length;
    const totalFacilities = this.data.facilities.length;

    return {
      totalEnquiries,
      pendingEnquiries,
      contactedEnquiries,
      admittedCount,
      totalNotices,
      publishedNotices,
      totalGallery,
      totalFacilities,
      latestEnquiries: this.data.enquiries.slice(0, 5),
      recentLogs: this.data.auditLogs.slice(0, 8)
    };
  }
}
