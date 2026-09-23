import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { allTrips, officerList, tariffData } from './data'
import { addToSyncQueue } from '../services/sync'

export interface VehicleEntry {
  plate: string
  type: string
  category: string
  tariff: number
}

export interface Trip {
  id: string
  route: string
  status: string
  time: string
  date: string
  load: 'Ada Muatan' | 'Kosong'
  vehicle: string
  type: string
  category: string
  revenue: string
  revenueNum: number
  officer: string
  duration: string
  photo: boolean
  vehicles?: VehicleEntry[]
  synced?: boolean
}

export interface Draft {
  routeCode: string | null
  condition: 'kosong' | 'muatan' | null
  vehicles: VehicleEntry[]
  vehicleForm: { plate: string; type: string; category: string }
  photo: boolean
  startedAt: number | null
}

type Officer = (typeof officerList)[number]
export type TariffRow = (typeof tariffData)[number]
export type VerifyIntent = 'switch' | 'security'

interface StoreValue {
  loggedIn: boolean
  login: (userType: 'admin' | 'member') => void
  logout: () => void
  userType: 'admin' | 'member'
  officer: Officer
  setOfficerId: (id: number) => void
  trips: Trip[]
  commitTrip: (t: Trip) => void
  tariffs: TariffRow[]
  saveTariffs: (rows: TariffRow[]) => void
  draft: Draft
  resetDraft: () => void
  patchDraft: (p: Partial<Draft>) => void
  addVehicle: (v: VehicleEntry) => void
  startTrip: () => void
  detailTripId: string | null
  setDetailTripId: (id: string | null) => void
  pendingOfficerId: number | null
  verifyIntent: VerifyIntent
  beginVerify: (opts: { pendingOfficerId: number | null; intent: VerifyIntent }) => void
  clearVerify: () => void
}

const emptyDraft: Draft = {
  routeCode: null,
  condition: null,
  vehicles: [],
  vehicleForm: { plate: '', type: '', category: '' },
  photo: false,
  startedAt: null,
}

const StoreCtx = createContext<StoreValue | null>(null)

const LS = {
  trips: 'trip.trips.v1',
  officer: 'trip.officerId.v1',
  session: 'trip.session.v1',
  tariffs: 'trip.tariffs.v1',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function parseRp(s: string): number {
  const digits = s.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : 0
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

export function compactRp(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')}jt`
  if (n >= 1_000) return `${Math.round(n / 1_000)}rb`
  return String(n)
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export function fmtDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`
}

export function fmtTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function fmtClock(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function durationToSeconds(s: string): number {
  const h = /(\d+)j/.exec(s)
  const m = /(\d+)m/.exec(s)
  return ((h ? parseInt(h[1], 10) : 0) * 60 + (m ? parseInt(m[1], 10) : 0)) * 60
}

export function kmNumber(s: string): number {
  return parseInt(s, 10) || 0
}

export function fmtElapsed(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}j ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m`
  return `${s}dtk`
}

export function tariffFor(vehicleType: string) {
  const list = load(LS.tariffs, tariffData)
  return (
    list.find(t => t.type === vehicleType) ??
    list.find(t => t.type === 'Truck Sedang') ??
    tariffData[0]
  )
}

export function nextTripId(trips: Trip[]): string {
  let max = 0
  for (const t of trips) {
    const m = /TRP-(\d{4})-(\d{4})/.exec(t.id)
    if (m) max = Math.max(max, parseInt(m[2], 10))
  }
  return `TRP-${new Date().getFullYear()}-${String(max + 1).padStart(4, '0')}`
}

const seedTrips: Trip[] = allTrips.map(t => ({
  ...t,
  load: t.load as Trip['load'],
  revenueNum: parseRp(t.revenue),
}))

export function AppProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => load(LS.session, false))
  const [userType, setUserType] = useState<'admin' | 'member'>(() => load('trip.userType', 'member'))
  const [officerId, setOfficerIdState] = useState<number>(() => load(LS.officer, officerList[0].id))
  const [trips, setTrips] = useState<Trip[]>(() => load(LS.trips, seedTrips))
  const [tariffs, setTariffs] = useState<TariffRow[]>(() => load(LS.tariffs, tariffData))
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [detailTripId, setDetailTripId] = useState<string | null>(null)
  const [pendingOfficerId, setPendingOfficerId] = useState<number | null>(null)
  const [verifyIntent, setVerifyIntent] = useState<VerifyIntent>('security')

  useEffect(() => {
    try { localStorage.setItem(LS.trips, JSON.stringify(trips)) } catch { /* quota */ }
  }, [trips])
  useEffect(() => {
    try { localStorage.setItem(LS.tariffs, JSON.stringify(tariffs)) } catch { /* quota */ }
  }, [tariffs])
  useEffect(() => {
    try { localStorage.setItem(LS.officer, JSON.stringify(officerId)) } catch { /* quota */ }
  }, [officerId])
  useEffect(() => {
    try { localStorage.setItem(LS.session, JSON.stringify(loggedIn)) } catch { /* quota */ }
  }, [loggedIn])
  useEffect(() => {
    try { localStorage.setItem('trip.userType', userType) } catch { /* quota */ }
  }, [userType])

  const officer = useMemo(
    () => officerList.find(o => o.id === officerId) ?? officerList[0],
    [officerId],
  )

  const login = useCallback((type: 'admin' | 'member') => {
    setUserType(type)
    setLoggedIn(true)
  }, [])
  const logout = useCallback(() => {
    setLoggedIn(false)
    setUserType('member')
  }, [])
  const setOfficerId = useCallback((id: number) => setOfficerIdState(id), [])
  const resetDraft = useCallback(() => setDraft(emptyDraft), [])
  const patchDraft = useCallback((p: Partial<Draft>) => setDraft(d => ({ ...d, ...p })), [])
  const addVehicle = useCallback(
    (v: VehicleEntry) => setDraft(d => ({ ...d, vehicles: [...d.vehicles, v] })),
    [],
  )
  const startTrip = useCallback(() => setDraft(d => ({ ...d, startedAt: d.startedAt ?? Date.now() })), [])
  const commitTrip = useCallback((t: Trip) => {
    const tripWithSync = { ...t, synced: false }
    setTrips(prev => [tripWithSync, ...prev])
    setDetailTripId(t.id)
    setDraft(emptyDraft)
    // Add to sync queue for background upload
    addToSyncQueue(tripWithSync)
  }, [])
  const beginVerify = useCallback((opts: { pendingOfficerId: number | null; intent: VerifyIntent }) => {
    setPendingOfficerId(opts.pendingOfficerId)
    setVerifyIntent(opts.intent)
  }, [])
  const clearVerify = useCallback(() => setPendingOfficerId(null), [])
  const saveTariffs = useCallback((rows: TariffRow[]) => setTariffs(rows), [])

  const value = useMemo<StoreValue>(() => ({
    loggedIn, login, logout, userType,
    officer, setOfficerId,
    trips, commitTrip,
    tariffs, saveTariffs,
    draft, resetDraft, patchDraft, addVehicle, startTrip,
    detailTripId, setDetailTripId,
    pendingOfficerId, verifyIntent, beginVerify, clearVerify,
  }), [loggedIn, login, logout, userType, officer, setOfficerId, trips, commitTrip, tariffs, saveTariffs, draft, resetDraft, patchDraft,
    addVehicle, startTrip, detailTripId, pendingOfficerId, verifyIntent, beginVerify, clearVerify])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useApp(): StoreValue {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
