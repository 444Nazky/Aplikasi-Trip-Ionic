// ─── Trips API Service ─────────────────────────────────────────────────────────
// Fetch trips from backend for admin dashboard

import { api } from './api'

export interface BackendTrip {
  id: string
  no_trip: string
  officer_id: string
  region_id: string
  status_muatan: 'muatan' | 'kosong'
  route_from: string
  route_to: string
  keterangan: string | null
  foto_kosong_path: string | null
  is_synced: number
  created_at: string
  vehicle_count: number
}

export async function fetchTrips(): Promise<BackendTrip[] | null> {
  const result = await api.get<BackendTrip[]>('/trips')
  if (!result.ok || !result.data) {
    return null
  }
  return result.data
}

export async function fetchTripDetail(id: string): Promise<BackendTrip | null> {
  const result = await api.get<BackendTrip>(`/trips/${id}`)
  if (!result.ok || !result.data) {
    return null
  }
  return result.data
}
