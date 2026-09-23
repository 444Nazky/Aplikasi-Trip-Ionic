// ─── Auth Service ─────────────────────────────────────────────────────────────
// Handles authentication with backend API

import { api, type LoginResponse } from './api'

const OFFICER_KEY = 'trip.auth.officer.v1'

// Demo PIN shared by all seeded officers (same as PinVerifyScreen demo mode)
export const DEMO_PIN = '123456'

// Officer the app *wants* to be authenticated as, even while offline
let activeOfficerId: number | null = null

export interface StoredOfficer {
  id: number
  name: string
  regionId: number
  regionName: string
  regionCode: string
}

export function getStoredOfficer(): StoredOfficer | null {
  try {
    const raw = localStorage.getItem(OFFICER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveOfficer(officer: StoredOfficer) {
  try {
    localStorage.setItem(OFFICER_KEY, JSON.stringify(officer))
  } catch { /* quota */ }
}

function clearOfficer() {
  try {
    localStorage.removeItem(OFFICER_KEY)
  } catch { /* quota */ }
}

export async function loginWithPin(officerId: number, pin: string): Promise<{ success: boolean; error?: string }> {
  const result = await api.post<LoginResponse>('/auth/login', { officerId, pin })

  if (!result.ok || !result.data) {
    return { success: false, error: result.error?.message || 'Login failed' }
  }

  api.setToken(result.data.token)
  saveOfficer(result.data.officer)

  return { success: true }
}

export function logout() {
  api.setToken(null)
  clearOfficer()
}

export function isLoggedIn(): boolean {
  return api.isAuthenticated && !!getStoredOfficer()
}

/**
 * Make sure we hold a valid backend JWT for the given (or last known) officer.
 *
 * The username/password login screen is local-only and never talks to the
 * backend, so without this the sync queue would POST /trips with no token
 * (401 forever). Safe to call repeatedly: it is a no-op when a token already
 * exists, and it fails soft when the backend is unreachable.
 */
export async function ensureBackendSession(officerId?: number): Promise<boolean> {
  if (officerId != null) {
    activeOfficerId = officerId
    // A token belonging to a different officer must not be reused
    const stored = getStoredOfficer()
    if (stored && Number(stored.id) !== Number(officerId)) {
      api.setToken(null)
    }
  }

  if (api.isAuthenticated) return true

  const id = officerId ?? activeOfficerId ?? getStoredOfficer()?.id
  if (id == null) return false

  const result = await loginWithPin(Number(id), DEMO_PIN)
  return result.success
}
