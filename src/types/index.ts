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
