import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { AppointmentRequest, PatientMessage, AdminUser, ResetToken, Doctor } from './src/types';

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
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');

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
let doctorDatabase: Doctor[] = loadJSON(DOCTORS_FILE, []);

if (doctorDatabase.length === 0) {
  doctorDatabase = [
    { id: 'dr-1', name: 'Dr. Sarah Jenkins', title: 'Lead Dentist', credentials: 'DDS', bio: 'Founder of First Avenue Dentistry with over 15 years of experience in family and cosmetic dentistry.', createdAt: new Date().toISOString() }
  ];
  saveJSON(DOCTORS_FILE, doctorDatabase);
}

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
function persistDoctors() { saveJSON(DOCTORS_FILE, doctorDatabase); }

// Simple auth helper (accepts email or username)
function authenticateAdmin(login: string, password: string): AdminUser | null {
  return adminDatabase.find(a => (a.email === login || a.username === login) && a.password === password) || null;
}

// Email delivery: built into the server code (SMTP via nodemailer) with file-log fallback.
// No third-party email services are used - emails are composed and sent by our own code.
// SMTP settings come from env vars so any mail server can be used:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
// (Gmail works locally but blocks Render's IPs - use your own domain mailbox on production.)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER || 'fenilxpatel2642@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'skww dpsl hobz stiz';
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const EMAIL_LOG_FILE = path.join(DATA_DIR, 'email_log.json');

let smtpTransporter: nodemailer.Transporter | null = null;
let smtpReady = false;
let smtpError = 'Not connected yet';

(async () => {
  const configs = [
    { host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465, requireTLS: false },
    { host: SMTP_HOST, port: SMTP_PORT === 465 ? 587 : SMTP_PORT, secure: false, requireTLS: true }
  ];
  for (const cfg of configs) {
    try {
      smtpTransporter = nodemailer.createTransport({
        host: cfg.host, port: cfg.port, secure: cfg.secure, requireTLS: cfg.requireTLS,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000
      });
      await smtpTransporter.verify();
      smtpReady = true;
      smtpError = '';
      console.log(`SMTP ready (${cfg.host}:${cfg.port})`);
      return;
    } catch (err: any) {
      smtpError = err.message || 'Unknown SMTP error';
      console.log(`SMTP ${cfg.host}:${cfg.port} failed: ${smtpError}`);
    }
  }
  console.log('SMTP unavailable - will use file log');
})();

function logEmailToFile(to: string, subject: string, html: string): void {
  try {
    const logs = loadJSON(EMAIL_LOG_FILE, []);
    logs.push({ to, subject, body: html, timestamp: new Date().toISOString() });
    saveJSON(EMAIL_LOG_FILE, logs);
  } catch {}
}

// --- Designed HTML email template (branded, interactive, no third-party tools) ---
const CLINIC_NAME = 'First Avenue Dentistry';
const CLINIC_PHONE = '(519) 207-6890';
const CLINIC_ADDRESS = '308 Wellington Street, St. Thomas, ON N5R 2S9';

function emailShell(innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${CLINIC_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:1px;">FIRST AVENUE<br>DENTISTRY</div>
              <div style="font-size:12px;color:#e0f2fe;margin-top:6px;letter-spacing:2px;">ST. THOMAS &bull; ONTARIO</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;color:#1e293b;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <div style="font-size:12px;color:#475569;line-height:1.8;">
                <strong>${CLINIC_NAME}</strong><br>
                ${CLINIC_ADDRESS}<br>
                <a href="tel:+15192076890" style="color:#2563eb;text-decoration:none;font-weight:bold;">${CLINIC_PHONE}</a> &nbsp;|&nbsp;
                <a href="mailto:firstavenuedentistry@gmail.com" style="color:#2563eb;text-decoration:none;">firstavenuedentistry@gmail.com</a><br>
                Mon &ndash; Fri: 9am &ndash; 6pm &nbsp;|&nbsp; Sat: 9am &ndash; 5pm
              </div>
              <div style="font-size:10px;color:#94a3b8;margin-top:12px;">&copy; ${new Date().getFullYear()} ${CLINIC_NAME}. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:bold;color:#64748b;width:40%;border-radius:8px 0 0 8px;">${label}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;font-weight:600;">${value}</td>
  </tr>`;
}

function summaryTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;margin:20px 0;">${rows}</table>`;
}

function ctaButton(text: string, href: string, bg = '#2563eb'): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td align="center" style="background:${bg};border-radius:9999px;padding:13px 36px;">
        <a href="${href}" style="display:inline-block;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;letter-spacing:0.5px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function heading(text: string, sub?: string): string {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">${text}</h1>
  ${sub ? `<p style="margin:0 0 24px;font-size:14px;color:#64748b;">${sub}</p>` : ''}`;
}

// --- Email builders ---
function appointmentReceivedEmail(apt: AppointmentRequest): { subject: string; html: string } {
  const subject = `We Received Your Appointment Request - ${CLINIC_NAME}`;
  const html = emailShell(`
    ${heading('Thank you, ' + apt.firstName + '!', 'Your appointment request has been received and is being reviewed by our team.')}
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 4px;">Here is a summary of your request:</p>
    ${summaryTable(
      detailRow('Patient', apt.firstName + ' ' + apt.lastName) +
      detailRow('Service', apt.serviceName) +
      detailRow('Preferred Date', apt.preferredDate) +
      detailRow('Preferred Time', apt.preferredTimeSlot) +
      detailRow('Phone', apt.phone) +
      detailRow('Email', apt.email)
    )}
    <p style="font-size:13px;color:#64748b;line-height:1.7;">You will receive a confirmation email once your appointment is confirmed. If you have any questions, feel free to call us anytime.</p>
    ${ctaButton('Call Us Now', 'tel:+15192076890')}
  `);
  return { subject, html };
}

function appointmentStatusEmail(apt: AppointmentRequest, newStatus: string): { subject: string; html: string } | null {
  const patientName = `${apt.firstName} ${apt.lastName}`;
  const date = apt.confirmedDate || apt.preferredDate;
  const time = apt.confirmedTime || apt.preferredTimeSlot;
  const doctor = apt.assignedDoctor || apt.doctorPreference;

  if (newStatus === 'Approved') {
    return {
      subject: `Your Appointment is Confirmed! - ${CLINIC_NAME}`,
      html: emailShell(`
        ${heading('Appointment Confirmed!', 'Dear ' + patientName + ', your appointment has been confirmed.')}
        <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:800;color:#047857;">&#10003; Confirmed</div>
        </div>
        ${summaryTable(
          detailRow('Date', date) +
          detailRow('Time', time) +
          detailRow('Doctor', doctor) +
          detailRow('Service', apt.serviceName) +
          detailRow('Location', CLINIC_ADDRESS)
        )}
        <p style="font-size:13px;color:#64748b;line-height:1.7;">Please arrive 10 minutes early. If you need to reschedule, kindly contact us at least 24 hours in advance.</p>
        ${ctaButton('Add to Calendar', 'https://firstavenuedentistry.com/#book-online', '#059669')}
        ${ctaButton('Call Our Office', 'tel:+15192076890')}
      `)
    };
  }
  if (newStatus === 'Rescheduled') {
    return {
      subject: `Your Appointment Has Been Rescheduled - ${CLINIC_NAME}`,
      html: emailShell(`
        ${heading('Appointment Rescheduled', 'Dear ' + patientName + ', here are your updated appointment details.')}
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:800;color:#b45309;">&#128259; Rescheduled</div>
        </div>
        ${summaryTable(
          detailRow('New Date', date) +
          detailRow('New Time', time) +
          detailRow('Doctor', doctor) +
          detailRow('Service', apt.serviceName) +
          (apt.adminNotes ? detailRow('Notes', apt.adminNotes) : '')
        )}
        <p style="font-size:13px;color:#64748b;line-height:1.7;">If this new time doesn't work for you, please call us and we will be happy to help.</p>
        ${ctaButton('Call Our Office', 'tel:+15192076890')}
      `)
    };
  }
  if (newStatus === 'Rejected') {
    return {
      subject: `Update on Your Appointment Request - ${CLINIC_NAME}`,
      html: emailShell(`
        ${heading('Appointment Request Update', 'Dear ' + patientName + ', we are unable to accommodate your request at this time.')}
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:800;color:#b91c1c;">&#10060; Not Available</div>
        </div>
        ${apt.adminNotes ? summaryTable(detailRow('Notes from our team', apt.adminNotes)) : ''}
        <p style="font-size:13px;color:#64748b;line-height:1.7;">Please feel free to book another appointment through our website, or call us and we will find a time that works for you.</p>
        ${ctaButton('Book Another Appointment', 'https://firstavenuedentistry.com/#book-online', '#b91c1c')}
        ${ctaButton('Call Our Office', 'tel:+15192076890')}
      `)
    };
  }
  return null;
}

function contactMessageEmail(msg: PatientMessage): { subject: string; html: string } {
  const subject = `New Contact Message from ${msg.name} - ${CLINIC_NAME}`;
  const html = emailShell(`
    ${heading('New Contact Form Message', 'Someone just sent a message through the website contact form.')}
    ${summaryTable(
      detailRow('Name', msg.name) +
      detailRow('Email', msg.email) +
      detailRow('Phone', msg.phone || 'Not provided') +
      detailRow('Subject', msg.subject)
    )}
    <p style="font-size:14px;color:#0f172a;font-weight:600;margin:16px 0 4px;">Message:</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;font-size:13px;color:#334155;line-height:1.7;">${msg.message.replace(/\n/g, '<br>')}</div>
    ${ctaButton('Reply by Email', 'mailto:' + msg.email)}
  `);
  return { subject, html };
}

function resetCodeEmail(code: string): { subject: string; html: string } {
  const subject = `Your Password Reset Code - ${CLINIC_NAME} Admin`;
  const html = emailShell(`
    ${heading('Password Reset Code', 'You requested a password reset for your admin account.')}
    <p style="font-size:14px;color:#475569;line-height:1.7;">Use the code below to reset your password. It expires in <strong>15 minutes</strong>.</p>
    <div style="background:#eff6ff;border:2px dashed #2563eb;border-radius:12px;padding:24px;text-align:center;margin:20px 0;">
      <div style="font-size:36px;font-weight:800;color:#2563eb;letter-spacing:12px;">${code}</div>
    </div>
    ${ctaButton('Reset Your Password', 'https://firstavenuedentistry.com/#reset-password')}
    <p style="font-size:12px;color:#94a3b8;line-height:1.6;">If you did not request this, you can safely ignore this email.</p>
  `);
  return { subject, html };
}

async function deliverEmail(to: string, subject: string, html: string): Promise<void> {
  console.log(`Delivering email to ${to}: [${subject}]`);
  logEmailToFile(to, subject, html);

  if (smtpReady && smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${CLINIC_NAME}" <${EMAIL_FROM}>`,
        to, subject, html, text: 'Please view this email in an HTML-enabled client.'
      });
      console.log('Email sent via SMTP:', info.messageId);
      return;
    } catch (err: any) {
      console.error('SMTP failed:', err.message);
    }
  }

  console.log('Email saved to log file only (no delivery method available)');
}

function sendStatusEmail(apt: AppointmentRequest, newStatus: string): void {
  const email = appointmentStatusEmail(apt, newStatus);
  if (!email) return;
  deliverEmail(apt.email, email.subject, email.html);
}

function sendNewAppointmentNotification(apt: AppointmentRequest): void {
  const email = appointmentReceivedEmail(apt);
  deliverEmail(apt.email, email.subject, email.html);
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

  const notif = contactMessageEmail(newMsg);
  deliverEmail('firstavenuedentistry@gmail.com', notif.subject, notif.html);
  deliverEmail(newMsg.email, 'We Received Your Message - First Avenue Dentistry', emailShell(`
    ${heading('Thank you, ' + newMsg.name.split(' ')[0] + '!', 'We received your message and our team will get back to you shortly.')}
    <p style="font-size:13px;color:#64748b;line-height:1.7;">For anything urgent, please call us directly at <a href="tel:+15192076890" style="color:#2563eb;font-weight:bold;">(519) 207-6890</a>.</p>
    ${ctaButton('Visit Our Website', 'https://firstavenuedentistry.com')}
  `));

  return res.json({ success: true, message: 'Your message has been sent to our concierge team.' });
});

app.get('/api/contact', (req: Request, res: Response) => {
  res.json(messageDatabase);
});

// --- Doctors CRUD ---
app.get('/api/doctors', (req: Request, res: Response) => {
  res.json(doctorDatabase);
});

app.post('/api/doctors', (req: Request, res: Response) => {
  const { name, title, credentials, bio, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Doctor name is required.' });
  const newDoctor: Doctor = {
    id: `dr-${Date.now().toString(36)}`,
    name,
    title: title || 'Dentist',
    credentials: credentials || '',
    bio: bio || '',
    image: image || '',
    createdAt: new Date().toISOString()
  };
  doctorDatabase.push(newDoctor);
  persistDoctors();
  res.json({ success: true, doctor: newDoctor });
});

app.patch('/api/doctors/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = doctorDatabase.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found.' });
  const { name, title, credentials, bio, image } = req.body;
  if (name) doctorDatabase[idx].name = name;
  if (title !== undefined) doctorDatabase[idx].title = title;
  if (credentials !== undefined) doctorDatabase[idx].credentials = credentials;
  if (bio !== undefined) doctorDatabase[idx].bio = bio;
  if (image !== undefined) doctorDatabase[idx].image = image;
  persistDoctors();
  res.json({ success: true, doctor: doctorDatabase[idx] });
});

app.delete('/api/doctors/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  doctorDatabase = doctorDatabase.filter(d => d.id !== id);
  persistDoctors();
  res.json({ success: true, message: 'Doctor removed.' });
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
      user: { id: admin.id, email: admin.email, username: admin.username, role: admin.role, name: admin.name, gender: admin.gender }
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
  const { id, name, email, username, gender, currentPassword, newPassword } = req.body;
  const admin = adminDatabase.find(a => a.id === id);
  if (!admin) return res.status(404).json({ error: 'No admin found.' });
  if (currentPassword && admin.password !== currentPassword) return res.status(401).json({ error: 'Current password is incorrect.' });
  if (name) admin.name = name;
  if (email) admin.email = email;
  if (username !== undefined) admin.username = username;
  if (gender !== undefined) admin.gender = gender;
  if (newPassword) admin.password = newPassword;
  persistAdmins();
  const { password: _, ...safe } = admin;
  res.json({ success: true, user: safe });
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

    const mail = resetCodeEmail(code);
    await deliverEmail(email, mail.subject, mail.html);

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
    smtpReady,
    smtpError,
    smtpHost: SMTP_HOST,
    smtpPort: SMTP_PORT,
    from: EMAIL_FROM,
    logFile: fs.existsSync(EMAIL_LOG_FILE) ? fs.statSync(EMAIL_LOG_FILE).size : 0
  });
});

// Test email endpoint
app.post('/api/admin/test-email', (req: Request, res: Response) => {
  const { to } = req.body;
  const target = to || 'fenilxpatel2642@gmail.com';
  const email = emailShell(`
    ${heading('Test Email', 'This is a test to verify the email system is working.')}
    <p style="font-size:14px;color:#475569;line-height:1.7;">If you received this email, the First Avenue Dentistry email system is delivering messages correctly.</p>
    ${ctaButton('Visit Our Website', 'https://firstavenuedentistry.com')}
  `);
  deliverEmail(target, 'Test Email from First Avenue Dentistry', email);
  res.json({ success: true, message: `Email queued for ${target}.`, smtpReady });
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
