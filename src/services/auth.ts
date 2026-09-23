// ─── Auth Service ─────────────────────────────────────────────────────────────
// Handles authentication with backend API

import { api, type LoginResponse } from './api'

const OFFICER_KEY = 'trip.auth.officer.v1'

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
