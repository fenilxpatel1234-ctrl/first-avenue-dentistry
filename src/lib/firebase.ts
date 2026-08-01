import admin, { cert } from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import type { ServiceAccount } from 'firebase-admin';

// Optional Firebase Realtime Database persistence.
// If FIREBASE_DATABASE_URL + FIREBASE_SERVICE_ACCOUNT are set, all clinic data
// (doctors, appointments, messages, admins) is stored in Firebase so it survives
// Render redeploys/restarts (Render free-tier disk is ephemeral).
// If not configured, the app falls back to local JSON files (dev mode).

let app: admin.App | null = null;

function parseCredentials(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const json = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf-8');
    return JSON.parse(json) as ServiceAccount;
  } catch {
    console.error('[firebase] FIREBASE_SERVICE_ACCOUNT is not valid JSON. Firebase persistence disabled.');
    return null;
  }
}

export function initFirebase(): boolean {
  const url = process.env.FIREBASE_DATABASE_URL;
  const credentials = parseCredentials();
  if (!url || !credentials) return false;
  try {
    if (!app) {
      app = admin.initializeApp({
        credential: cert(credentials),
        databaseURL: url
      });
    }
    console.log('[firebase] Realtime Database connected:', url);
    return true;
  } catch (err: any) {
    console.error('[firebase] init failed:', err.message);
    return false;
  }
}

export function isFirebaseReady(): boolean {
  return app !== null;
}

export async function fbGet<T>(path: string): Promise<T | null> {
  if (!app) return null;
  try {
    const snap = await getDatabase(app).ref(path).once('value');
    return snap.val() as T | null;
  } catch (err: any) {
    console.error('[firebase] read failed:', path, err.message);
    return null;
  }
}

export async function fbSet(path: string, value: unknown): Promise<void> {
  if (!app) return;
  try {
    await getDatabase(app).ref(path).set(value);
  } catch (err: any) {
    console.error('[firebase] write failed:', path, err.message);
  }
}
