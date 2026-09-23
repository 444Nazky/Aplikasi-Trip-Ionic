// ─── Tariff API Service ────────────────────────────────────────────────────────
// Server-backed Master Tarif for the admin dashboard. All endpoints require
// an admin JWT (see ensureAdminBackendSession in auth.ts).

import { api } from './api'
import { formatRp, type TariffRow } from '../pages/store'

interface ServerTariff {
  id: string
  golongan: string
  vehicle_type: string
  loaded_tariff: number
  empty_tariff: number
  description?: string
  is_active: number
}

function toRow(s: ServerTariff): TariffRow {
  return {
    id: s.id,
    golongan: s.golongan,
    type: s.vehicle_type,
    loadedNum: s.loaded_tariff,
    loaded: formatRp(s.loaded_tariff),
    emptyNum: s.empty_tariff,
    empty: formatRp(s.empty_tariff),
    desc: s.description ?? '',
  }
}

function toPayload(row: TariffRow) {
  return {
    golongan: row.golongan,
    vehicleType: row.type,
    loadedTariff: row.loadedNum,
    emptyTariff: row.emptyNum,
    description: row.desc,
  }
}

/** Returns null when the server is unreachable or rejects the token. */
export async function fetchTariffs(): Promise<TariffRow[] | null> {
  const res = await api.get<ServerTariff[]>('/tariffs')
  if (res.ok && res.data) return res.data.map(toRow)
  return null
}

/** Returns the new server id, or null on failure. */
export async function createTariff(row: TariffRow): Promise<string | null> {
  const res = await api.post<{ id: string }>('/tariffs', toPayload(row))
  if (res.ok && res.data) return res.data.id
  return null
}

/** True when the server accepted the update. Rows without a server id return false. */
export async function updateTariff(row: TariffRow): Promise<boolean> {
  if (!row.id) return false
  const res = await api.put(`/tariffs/${row.id}`, { ...toPayload(row), isActive: true })
  return res.ok
}

/** True when the server accepted the delete. Rows without a server id return false. */
export async function deleteTariff(row: TariffRow): Promise<boolean> {
  if (!row.id) return false
  const res = await api.delete(`/tariffs/${row.id}`)
  return res.ok
}
