export type PageView = 
  | 'home' 
  | 'services'
  | 'service-detail'
  | 'book-online'
  | 'emergency'
  | 'our-team'
  | 'contact-us'
  | 'blog'
  | 'legal'
  | 'admin';

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  image2?: string;
  benefits: string[];
  procedure: string;
  recoveryTime: string;
}

export interface SiteSettings {
  clinicName: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  googleMapsEmbedUrl: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AppointmentRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot: string;
  serviceId: string;
  serviceName: string;
  doctorPreference: string;
  insuranceProvider: string;
  isNewPatient: boolean;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rescheduled' | 'Rejected' | 'Completed' | 'Cancelled';
  assignedDoctor?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  adminNotes?: string;
  createdAt: string;
  isEmergency?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  password: string;
  role: 'Super Admin' | 'Admin' | 'Viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface ResetToken {
  token: string;
  email: string;
  expiresAt: string;
}

export interface PatientMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}
