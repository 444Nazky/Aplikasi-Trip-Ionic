// ─── Auth Service ─────────────────────────────────────────────────────────────
// Handles authentication with backend API

import { api, type LoginResponse } from './api'

const OFFICER_KEY = 'trip.auth.officer.v1'

// Demo PIN shared by all seeded officers
export const DEMO_PIN = '123456'

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

// Login with username/password (local login) and obtain backend JWT
export async function memberLogin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const result = await api.post<LoginResponse>('/auth/member-login', { username, password })

  if (!result.ok || !result.data) {
    // Backend unreachable or auth failed - fallback to demo mode
    return { success: false, error: result.error?.message || 'Backend unreachable' }
  }

  api.setToken(result.data.token)
  saveOfficer(result.data.officer)

  return { success: true }
}

// Login with PIN (for officer switching)
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
 * Ensure we have a valid backend JWT for the current officer.
 * Safe to call repeatedly: no-op if token exists, fails soft if backend unreachable.
 */
export async function ensureBackendSession(): Promise<boolean> {
  if (api.isAuthenticated) return true

  const stored = getStoredOfficer()
  if (!stored) return false

  // Try PIN login with demo PIN
  const result = await loginWithPin(stored.id, DEMO_PIN)
  return result.success
}
