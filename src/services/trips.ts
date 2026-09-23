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
  /** Joined from officers table (present on GET /trips) */
  officer_name?: string | null
  region_code?: string | null
}

export async function fetchTrips(): Promise<BackendTrip[] | null> {
  const result = await api.get<BackendTrip[]>('/trips')
  if (!result.ok || !result.data) {
    return null
  }
  return result.data
}

// ─── Admin report: trips with full vehicle detail ─────────────────────────────

export interface ReportVehicle {
  no_polisi: string
  vehicle_type: string
  /** Kategori: 'Internal' | 'Eksternal (Berganji)' | 'Eksternal (Tanpa Garansi)' (legacy rows may hold a golongan roman numeral) */
  golongan: string
  has_load: number
  tariff_amount: number
}

export interface ReportTrip {
  id: string
  no_trip: string
  route_from: string | null
  route_to: string | null
  status_muatan: 'muatan' | 'kosong'
  keterangan: string | null
  created_at: string
  officer_name?: string | null
  region_name?: string | null
  vehicle_count: number
  trip_revenue: number | null
  vehicles: ReportVehicle[]
}

/** Admin-only (GET /reports/trips). Returns null on failure. */
export async function fetchTripReports(): Promise<ReportTrip[] | null> {
  const result = await api.get<ReportTrip[]>('/reports/trips')
  if (!result.ok || !result.data) return null
  return result.data
}

export async function fetchTripDetail(id: string): Promise<BackendTrip | null> {
  const result = await api.get<BackendTrip>(`/trips/${id}`)
  if (!result.ok || !result.data) {
    return null
  }
  return result.data
}
