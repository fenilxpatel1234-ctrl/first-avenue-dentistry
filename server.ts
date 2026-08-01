import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { createServer as createViteServer } from 'vite';
import { AppointmentRequest, PatientMessage, AdminUser, ResetToken } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Live Visitor Tracking ---
const visitorHits = new Map<string, number>();
const VISITOR_TIMEOUT_MS = 1 * 60 * 1000;
app.use((req, _res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const key = `${ip}|${ua}`;
  visitorHits.set(key, Date.now());
  next();
});
setInterval(() => {
  const now = Date.now();
  for (const [ip, time] of visitorHits) {
    if (now - time > VISITOR_TIMEOUT_MS) visitorHits.delete(ip);
  }
}, 60_000);
function getActiveVisitorCount(): number {
  const now = Date.now();
  let count = 0;
  for (const time of visitorHits.values()) {
    if (now - time <= VISITOR_TIMEOUT_MS) count++;
  }
  return count;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadJSON<T>(filePath: string, fallback: T[]): T[] {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {}
  return fallback;
}

function saveJSON<T>(filePath: string, data: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1', name: 'Dr. Sarah Jenkins', email: 'admin@firstavenuedentistry.com', username: 'admin', password: 'AdminPassword2026!', role: 'Super Admin', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString()
};

let appointmentDatabase: AppointmentRequest[] = loadJSON(APPOINTMENTS_FILE, []);
let messageDatabase: PatientMessage[] = loadJSON(MESSAGES_FILE, []);

// Load admins from file; if missing, seed from defaults + env
let adminDatabase: AdminUser[] = loadJSON(ADMINS_FILE, []);
if (adminDatabase.length === 0) {
  adminDatabase = [DEFAULT_ADMIN];
  // Seed extra admins from environment variable (JSON array)
  try {
    const seed = process.env.ADMIN_SEED;
    if (seed) {
      const extra: AdminUser[] = JSON.parse(seed);
      for (const a of extra) {
        if (!adminDatabase.find(x => x.email === a.email)) adminDatabase.push(a);
      }
    }
  } catch {}
  saveJSON(ADMINS_FILE, adminDatabase);
} else {
  // Ensure default admin exists even if file was carried over without it
  if (!adminDatabase.find(a => a.email === DEFAULT_ADMIN.email)) {
    adminDatabase.unshift(DEFAULT_ADMIN);
    saveJSON(ADMINS_FILE, adminDatabase);
  }
}

function persistAppointments() { saveJSON(APPOINTMENTS_FILE, appointmentDatabase); }
function persistMessages() { saveJSON(MESSAGES_FILE, messageDatabase); }
function persistAdmins() { saveJSON(ADMINS_FILE, adminDatabase); }

// Simple auth helper (accepts email or username)
function authenticateAdmin(login: string, password: string): AdminUser | null {
  return adminDatabase.find(a => (a.email === login || a.username === login) && a.password === password) || null;
}

// Email delivery: SendGrid > Gmail SMTP > File log
const EMAIL_USER = 'fenilxpatel2642@gmail.com';
const EMAIL_PASS = 'skww dpsl hobz stiz';
const EMAIL_LOG_FILE = path.join(DATA_DIR, 'email_log.json');
const SENDGRID_KEY = process.env.SENDGRID_API_KEY || '';

let sendGridReady = false;

if (SENDGRID_KEY) {
  sgMail.setApiKey(SENDGRID_KEY);
  sendGridReady = true;
  console.log('SendGrid API key configured');
} else {
  console.log('No SENDGRID_API_KEY set - will try Gmail SMTP, then fall back to file log');
}

// Gmail SMTP fallback
let smtpTransporter: nodemailer.Transporter | null = null;
let smtpReady = false;

(async () => {
  try {
    smtpTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 465, secure: true,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
    await smtpTransporter.verify();
    smtpReady = true;
    console.log('Gmail SMTP ready (465)');
  } catch {
    try {
      smtpTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', port: 587, secure: false, requireTLS: true,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
      });
      await smtpTransporter.verify();
      smtpReady = true;
      console.log('Gmail SMTP ready (587)');
    } catch {
      console.log('Gmail SMTP unavailable - will use SendGrid or file log');
    }
  }
})();

function logEmailToFile(to: string, subject: string, body: string): void {
  try {
    const logs = loadJSON(EMAIL_LOG_FILE, []);
    logs.push({ to, subject, body, timestamp: new Date().toISOString() });
    saveJSON(EMAIL_LOG_FILE, logs);
  } catch {}
}

async function deliverEmail(to: string, subject: string, body: string): Promise<void> {
  console.log(`Delivering email to ${to}: [${subject}]`);
  logEmailToFile(to, subject, body);

  // Try SendGrid first (works over HTTPS, port 443)
  if (sendGridReady) {
    try {
      await sgMail.send({
        to,
        from: { email: EMAIL_USER, name: 'First Avenue Dentistry' },
        subject,
        text: body
      });
      console.log('Email sent via SendGrid');
      return;
    } catch (err: any) {
      console.error('SendGrid failed:', err.message);
    }
  }

  // Fallback to Gmail SMTP
  if (smtpReady && smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"First Avenue Dentistry" <${EMAIL_USER}>`,
        to, subject, text: body
      });
      console.log('Email sent via Gmail SMTP:', info.messageId);
      return;
    } catch (err: any) {
      console.error('Gmail SMTP failed:', err.message);
    }
  }

  console.log('Email saved to log file only (no delivery method available)');
}

function sendStatusEmail(apt: AppointmentRequest, newStatus: string): void {
  const patientName = `${apt.firstName} ${apt.lastName}`;
  const clinicName = 'First Avenue Dentistry';
  const clinicPhone = '(519) 207-6890';
  const clinicAddress = '308 Wellington Street, St.Thomas, ON N5R 2S9';

  let subject = '';
  let body = '';

  if (newStatus === 'Approved') {
    subject = `Your Appointment at ${clinicName} is Confirmed!`;
    body = `Dear ${patientName},\n\nYour appointment at ${clinicName} has been CONFIRMED!\n\nDate: ${apt.confirmedDate || apt.preferredDate}\nTime: ${apt.confirmedTime || apt.preferredTimeSlot}\nDoctor: ${apt.assignedDoctor || apt.doctorPreference}\nService: ${apt.serviceName}\n\nLocation: ${clinicAddress}\nPhone: ${clinicPhone}\n\nPlease arrive 10 minutes early. If you need to reschedule, please contact us at least 24 hours in advance.\n\nWe look forward to seeing you!\n\nBest regards,\n${clinicName} Team`;
  } else if (newStatus === 'Rejected') {
    subject = `Update on Your ${clinicName} Appointment Request`;
    body = `Dear ${patientName},\n\nUnfortunately, we are unable to accommodate your appointment request for ${apt.serviceName} on ${apt.preferredDate} at ${apt.preferredTimeSlot}.\n\n${apt.adminNotes ? `Notes from our team: ${apt.adminNotes}\n\n` : ''}Please feel free to book another appointment through our website or call us at ${clinicPhone}.\n\nBest regards,\n${clinicName} Team`;
  } else if (newStatus === 'Rescheduled') {
    subject = `Your ${clinicName} Appointment Has Been Rescheduled`;
    body = `Dear ${patientName},\n\nYour appointment has been RESCHEDULED.\n\nNew Date: ${apt.confirmedDate || apt.preferredDate}\nNew Time: ${apt.confirmedTime || apt.preferredTimeSlot}\nDoctor: ${apt.assignedDoctor || apt.doctorPreference}\nService: ${apt.serviceName}\n\n${apt.adminNotes ? `Notes: ${apt.adminNotes}\n\n` : ''}If this new time doesn't work for you, please call us at ${clinicPhone}.\n\nBest regards,\n${clinicName} Team`;
  } else {
    return;
  }

  deliverEmail(apt.email, subject, body);
}

function sendNewAppointmentNotification(apt: AppointmentRequest): void {
  const body = `Dear ${apt.firstName},\n\nThank you for requesting an appointment at First Avenue Dentistry!\n\nWe have received your request and our team will review it shortly.\n\nRequest Summary:\n• Name: ${apt.firstName} ${apt.lastName}\n• Email: ${apt.email}\n• Phone: ${apt.phone}\n• Preferred Date: ${apt.preferredDate}\n• Preferred Time: ${apt.preferredTimeSlot}\n• Service: ${apt.serviceName}\n${apt.notes ? `• Notes: ${apt.notes}` : ''}\n\nYou will receive another email once your appointment is confirmed.\n\nIf you have any questions, please call us at (519) 207-6890.\n\nBest regards,\nFirst Avenue Dentistry Team`;

  deliverEmail(apt.email, `We Received Your First Avenue Dentistry Appointment Request`, body);
}

// --- SEO ---
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://firstavenuedentistry.com/sitemap.xml');
});
app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://firstavenuedentistry.com/</loc><priority>1.0</priority></url>
  <url><loc>https://firstavenuedentistry.com/#home</loc><priority>0.9</priority></url>
  <url><loc>https://firstavenuedentistry.com/#book-online</loc><priority>0.8</priority></url>
  <url><loc>https://firstavenuedentistry.com/#emergency</loc><priority>0.8</priority></url>
  <url><loc>https://firstavenuedentistry.com/#our-team</loc><priority>0.7</priority></url>
  <url><loc>https://firstavenuedentistry.com/#contact-us</loc><priority>0.7</priority></url>
  <url><loc>https://firstavenuedentistry.com/#blog</loc><priority>0.6</priority></url>
  <url><loc>https://firstavenuedentistry.com/#legal</loc><priority>0.5</priority></url>
</urlset>`);
});

// --- API ENDPOINTS ---

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Live Visitor Count
app.get('/api/analytics/visitors', (req: Request, res: Response) => {
  res.json({ count: getActiveVisitorCount(), timestamp: new Date().toISOString() });
});

// Submit Appointment Request
app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      preferredDate,
      preferredTimeSlot,
      serviceId,
      serviceName,
      doctorPreference,
      insuranceProvider,
      isNewPatient,
      notes,
      isEmergency
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required contact details.' });
    }

    const newAppointment: AppointmentRequest = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      firstName,
      lastName,
      email,
      phone,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: preferredTimeSlot || '09:00 AM',
      serviceId: serviceId || 'general-consult',
      serviceName: serviceName || 'General Consultation & Smile Evaluation',
      doctorPreference: doctorPreference || 'Any Available Specialist',
      insuranceProvider: insuranceProvider || 'Self-Pay / Membership Plan',
      isNewPatient: Boolean(isNewPatient),
      notes: notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isEmergency: Boolean(isEmergency)
    };

    appointmentDatabase.unshift(newAppointment);
    persistAppointments();

    sendNewAppointmentNotification(newAppointment);

    return res.status(201).json({
      success: true,
      message: 'Appointment request received successfully!',
      appointment: newAppointment
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process appointment booking.' });
  }
});

// Admin: Get all appointments
app.get('/api/appointments', (req: Request, res: Response) => {
  res.json(appointmentDatabase);
});

// Admin: Update appointment status / reschedule / notes
app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedDoctor, confirmedDate, confirmedTime, adminNotes } = req.body;

  const aptIndex = appointmentDatabase.findIndex(a => a.id === id);
  if (aptIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const existing = appointmentDatabase[aptIndex];
  const oldStatus = existing.status;
  appointmentDatabase[aptIndex] = {
    ...existing,
    ...(status && { status }),
    ...(assignedDoctor !== undefined && { assignedDoctor }),
    ...(confirmedDate !== undefined && { confirmedDate }),
    ...(confirmedTime !== undefined && { confirmedTime }),
    ...(adminNotes !== undefined && { adminNotes })
  };
  persistAppointments();

  // Send email on status change
  if (status && status !== oldStatus) {
    sendStatusEmail(appointmentDatabase[aptIndex], status);
  }

  return res.json({
    success: true,
    message: `Appointment ${id} updated to ${status}.`,
    appointment: appointmentDatabase[aptIndex]
  });
});

// Admin: Delete appointment
app.delete('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  appointmentDatabase = appointmentDatabase.filter(a => a.id !== id);
  persistAppointments();
  return res.json({ success: true, message: 'Appointment record removed.' });
});

// Export CSV Endpoint
app.get('/api/admin/export-csv', (req: Request, res: Response) => {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Date', 'Time Slot', 'Service', 'Doctor', 'Status', 'Insurance'];
  const rows = appointmentDatabase.map(a => [
    a.id,
    `"${a.firstName}"`,
    `"${a.lastName}"`,
    `"${a.email}"`,
    `"${a.phone}"`,
    a.confirmedDate || a.preferredDate,
    a.confirmedTime || a.preferredTimeSlot,
    `"${a.serviceName}"`,
    `"${a.assignedDoctor || a.doctorPreference}"`,
    a.status,
    `"${a.insuranceProvider}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="first_avenue_dentistry_appointments.csv"');
  res.send(csvContent);
});

// Generate ICS File Download
app.get('/api/ics/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const apt = appointmentDatabase.find(a => a.id === id);
  
  const title = apt ? `Dental Visit - ${apt.serviceName} at First Avenue Family Dentistry` : 'First Avenue Dentistry Visit';
  const description = 'Please arrive 10 minutes early. Contact (555) 123-SMILE for questions.';
  const location = '1420 First Avenue, Suite 300, New York, NY 10021';

  const dateStr = (apt?.confirmedDate || apt?.preferredDate || '20260801').replace(/-/g, '');
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//First Avenue Family Dentistry//Appointment Calendar//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${dateStr}T140000Z`,
    `DTEND:${dateStr}T150000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', `attachment; filename="appointment-${id}.ics"`);
  res.send(icsContent);
});

// Contact Messages Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const newMsg: PatientMessage = {
    id: `msg-${Date.now().toString().slice(-6)}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    date: new Date().toISOString(),
    read: false
  };

  messageDatabase.unshift(newMsg);
  persistMessages();
  return res.json({ success: true, message: 'Your message has been sent to our concierge team.' });
});

app.get('/api/contact', (req: Request, res: Response) => {
  res.json(messageDatabase);
});

// Admin Auth Endpoint (accepts email or username)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const login = email || username || '';
  const admin = authenticateAdmin(login, password);
  if (admin) {
    admin.lastLogin = new Date().toISOString();
    persistAdmins();
    return res.json({
      success: true,
      token: `jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: { email: admin.email, username: admin.username, role: admin.role, name: admin.name, gender: admin.gender }
    });
  }
  return res.status(401).json({ error: 'Invalid credentials.' });
});

// Admin: Get all admin accounts
app.get('/api/admin/accounts', (req: Request, res: Response) => {
  const safe = adminDatabase.map(({ password, ...rest }) => rest);
  res.json(safe);
});

// Admin: Create admin account
app.post('/api/admin/accounts', (req: Request, res: Response) => {
  const { name, email, username, password, role, gender } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required.' });
  if (adminDatabase.find(a => a.email === email)) return res.status(400).json({ error: 'Email already exists.' });
  if (username && adminDatabase.find(a => a.username === username)) return res.status(400).json({ error: 'Username already exists.' });
  const newAdmin: AdminUser = {
    id: `admin-${Date.now().toString(36)}`,
    name, email, username, password,
    role: role || 'Admin',
    gender: gender || undefined,
    createdAt: new Date().toISOString()
  };
  adminDatabase.push(newAdmin);
  persistAdmins();
  const { password: _, ...safe } = newAdmin;
  res.json({ success: true, admin: safe });
});

// Admin: Update admin account
app.patch('/api/admin/accounts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = adminDatabase.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Admin not found.' });
  const { name, email, username, password, role, gender } = req.body;
  if (name) adminDatabase[idx].name = name;
  if (email) adminDatabase[idx].email = email;
  if (username !== undefined) adminDatabase[idx].username = username;
  if (password) adminDatabase[idx].password = password;
  if (role) adminDatabase[idx].role = role;
  if (gender !== undefined) adminDatabase[idx].gender = gender;
  persistAdmins();
  const { password: _, ...safe } = adminDatabase[idx];
  res.json({ success: true, admin: safe });
});

// Admin: Delete admin account
app.delete('/api/admin/accounts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  adminDatabase = adminDatabase.filter(a => a.id !== id);
  persistAdmins();
  res.json({ success: true });
});

// Admin: Update own profile
app.patch('/api/admin/profile', (req: Request, res: Response) => {
  const { name, email, username, gender, currentPassword, newPassword } = req.body;
  const admin = adminDatabase[0];
  if (!admin) return res.status(404).json({ error: 'No admin found.' });
  if (currentPassword && admin.password !== currentPassword) return res.status(401).json({ error: 'Current password is incorrect.' });
  if (name) admin.name = name;
  if (email) admin.email = email;
  if (username !== undefined) admin.username = username;
  if (gender !== undefined) admin.gender = gender;
  if (newPassword) admin.password = newPassword;
  persistAdmins();
  res.json({ success: true });
});

// Forgot password - generate 6-digit code and email
const RESET_TOKENS_FILE = path.join(DATA_DIR, 'reset_tokens.json');
let resetTokens: ResetToken[] = loadJSON(RESET_TOKENS_FILE, []);
function persistResetTokens() { saveJSON(RESET_TOKENS_FILE, resetTokens); }
setInterval(() => {
  const now = Date.now();
  resetTokens = resetTokens.filter(t => new Date(t.expiresAt).getTime() > now);
  persistResetTokens();
}, 300_000);

function generateResetCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

app.post('/api/admin/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    const admin = adminDatabase.find(a => a.email === email);
    if (!admin) return res.status(404).json({ error: 'No account found with that email.' });

    // Clean up expired tokens
    const now = Date.now();
    resetTokens = resetTokens.filter(t => new Date(t.expiresAt).getTime() > now);

    // Remove any existing code for this email
    resetTokens = resetTokens.filter(t => t.email !== email);

    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    resetTokens.push({ email, code, expiresAt });
    persistResetTokens();

    const resetLink = 'https://firstavenuedentistry.com/#reset-password';
    const subject = 'Your Password Reset Code - First Avenue Dentistry Admin';
    const body = `You requested a password reset for your First Avenue Dentistry admin account.\n\nYour 6-digit reset code is: ${code}\n\nThis code expires in 15 minutes.\n\nGo to ${resetLink} and enter this code along with your new password.\n\nIf you did not request this, please ignore this email.\n\n- First Avenue Dentistry Team`;

    await deliverEmail(email, subject, body);

    return res.json({ success: true, message: 'A 6-digit reset code has been sent to your email.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send reset code.' });
  }
});

// Reset password with 6-digit code
app.post('/api/admin/reset-password', (req: Request, res: Response) => {
  try {
    const { code, newPassword } = req.body;
    if (!code || !newPassword) return res.status(400).json({ error: 'Reset code and new password are required.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const now = Date.now();
    resetTokens = resetTokens.filter(t => new Date(t.expiresAt).getTime() > now);
    persistResetTokens();

    const stored = resetTokens.find(t => t.code === code);
    if (!stored) return res.status(400).json({ error: 'Invalid or expired reset code.' });

    const admin = adminDatabase.find(a => a.email === stored.email);
    if (!admin) return res.status(404).json({ error: 'Admin account not found.' });

    admin.password = newPassword;
    persistAdmins();

    resetTokens = resetTokens.filter(t => t.code !== code);
    persistResetTokens();

    return res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Email log endpoint
app.get('/api/admin/email-log', (req: Request, res: Response) => {
  const logs = loadJSON(EMAIL_LOG_FILE, []);
  res.json(logs);
});

// Email status endpoint
app.get('/api/admin/email-status', (req: Request, res: Response) => {
  res.json({
    sendGridReady,
    smtpReady,
    hasSendGridKey: !!SENDGRID_KEY,
    logFile: fs.existsSync(EMAIL_LOG_FILE) ? fs.statSync(EMAIL_LOG_FILE).size : 0
  });
});

// Test email endpoint
app.post('/api/admin/test-email', (req: Request, res: Response) => {
  const { to } = req.body;
  const target = to || 'fenilxpatel2642@gmail.com';
  deliverEmail(target, 'Test Email from First Avenue Dentistry', 'This is a test email to verify the email system is working.\n\nIf you received this, emails are being delivered successfully!\n\n- First Avenue Dentistry Server');
  res.json({ success: true, message: `Email queued for ${target}.`, sendGridReady, smtpReady });
});

// Local FAQ responses (works without API key)
const FAQ_RESPONSES: Record<string, string> = {
  'services': 'We offer a full range of dental services including: General Checkups & Cleanings, Bespoke Porcelain Veneers, 3D Guided Dental Implants, Invisalign Clear Aligners, Professional Zoom Teeth Whitening, Root Canal Therapy, Crowns & Bridges, Full & Partial Dentures, Pediatric Dentistry, Gum Disease Treatment, Oral Surgery & Extractions, and Sedation Dentistry.',
  'hours': 'Our office hours are: Monday – Friday 8:00 AM – 5:00 PM, Saturday 9:00 AM – 2:00 PM, and Sunday Closed.',
  'new patient': 'Yes, we are accepting new patients! You can book your first visit online or give us a call.',
  'insurance': 'We accept most major dental insurance plans including Delta Dental, Cigna, and more. We also offer flexible payment plans for self-pay patients.',
  'whitening': 'Our Professional Zoom Teeth Whitening treatment can brighten your smile in about one hour. Results last 6-12 months with proper care.',
  'implant': 'Our 3D Guided Dental Implants use advanced digital imaging for precise, comfortable placement. The process typically takes 3-6 months from start to finish.',
  'invisalign': 'Invisalign clear aligners straighten your teeth discreetly. Treatment time varies from 6-18 months depending on your case.',
  'veneers': 'Bespoke Porcelain Veneers are custom-crafted shells that cover the front of your teeth. They can fix gaps, chips, stains, and misalignment in just 2-3 visits.',
  'cost': 'Treatment costs vary based on your specific needs. We provide detailed estimates during your consultation and offer payment plans.',
  'emergency': 'If you have a dental emergency, please call us immediately. For severe pain, swelling, or trauma, we offer same-day emergency appointments.',
};

// AI Dental Concierge Endpoint
app.post('/api/ai/dental-assistant', async (req: Request, res: Response) => {
  try {
    const { message, prompt } = req.body;
    const input = message || prompt;
    if (!input) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const lower = input.toLowerCase();

    // Check for booking intent
    const bookingKeywords = ['book', 'schedule', 'appointment', 'make an appointment', 'book an appointment', 'schedule a visit', 'want to book', 'booking'];
    const isBookingIntent = bookingKeywords.some(k => lower.includes(k));

    if (isBookingIntent || lower.includes('book') || lower.includes('schedule')) {
      return res.json({
        answer: "I'd be happy to help you book an appointment! Let me guide you through it.\n\nFirst, what's your first name?",
        action: 'booking_start'
      });
    }

    // Try local FAQ match first
    for (const [keyword, answer] of Object.entries(FAQ_RESPONSES)) {
      if (lower.includes(keyword)) {
        return res.json({ answer: answer + ' Would you like to schedule a consultation? I can help you book an appointment right now.' });
      }
    }

    // Default fallback
    return res.json({
      answer: "Thank you for your question! At First Avenue Dentistry, we're here to help with all your dental needs. Please give us a call at (519) 207-6890 or book an appointment online and our team will be happy to assist you!"
    });
  } catch (err: any) {
    return res.json({
      answer: "Thank you for your question. Please call us at (519) 207-6890 for immediate assistance or book an appointment online!"
    });
  }
});

// Start Server or mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`First Avenue Family Dentistry Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
