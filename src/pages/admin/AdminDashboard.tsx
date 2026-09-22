import { useState } from 'react'
import {
  Truck, Lock, LayoutGrid, Table2, Users, BarChart2, Bell,
  Map, Settings, LogOut, Plus, Pencil, Trash2, Download,
  ChevronLeft, Camera, ArrowRight,
} from 'lucide-react'
import { allTrips, tariffData, officerList } from '../data'
import type { AdminTab } from '../types'

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOfficer, setFilterOfficer] = useState('')
  const [editTariff, setEditTariff] = useState<typeof tariffData[0] | null>(null)
  const [showOfficerForm, setShowOfficerForm] = useState(false)
  const [selectedReport, setSelectedReport] = useState<typeof allTrips[0] | null>(null)

  const filteredTrips = allTrips.filter(t =>
    (!filterStatus || t.load === filterStatus) &&
    (!filterOfficer || t.officer === filterOfficer)
  )
  const totalRevenue = allTrips.reduce((s, t) => s + (parseInt(t.revenue.replace(/\D/g, '')) || 0), 0)

  const navItems: { key: AdminTab; label: string; Icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', Icon: LayoutGrid },
    { key: 'tariff', label: 'Master Tarif', Icon: Table2 },
    { key: 'officers', label: 'Petugas & Wilayah', Icon: Users },
    { key: 'reports', label: 'Laporan & Ekspor', Icon: BarChart2 },
    { key: 'settings', label: 'Pengaturan', Icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-[#0F172A] min-h-screen flex flex-col shrink-0 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Truck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[13px] leading-tight">Trip Angkutan</p>
              <p className="text-slate-500 text-[10px]">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelectedReport(null); setEditTariff(null); setShowOfficerForm(false) }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-[13px] transition-all ${tab === key ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Icon size={16} strokeWidth={tab === key ? 2.5 : 1.8} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <div className="flex items-center gap-3 px-3.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-[11px] font-black text-white">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-bold truncate">Admin Utama</p>
              <p className="text-slate-500 text-[10px]">Super Admin · BADAU</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-[12px] font-semibold"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-60 overflow-auto bg-[#F1F5F9] min-h-screen">
        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-black text-slate-900 text-[17px]">
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'tariff' && (editTariff ? 'Edit Golongan Tarif' : 'Master Tarif Kendaraan')}
              {tab === 'officers' && (showOfficerForm ? 'Tambah Petugas Baru' : 'Manajemen Petugas & Wilayah')}
              {tab === 'reports' && (selectedReport ? 'Detail Trip' : 'Laporan & Ekspor Data')}
              {tab === 'settings' && 'Pengaturan Sistem'}
            </h1>
            <p className="text-slate-400 text-[11px] mt-0.5">Senin, 21 September 2026 · Region: BADAU</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={16} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full text-[8px] text-white flex items-center justify-center font-black">3</span>
            </div>
          </div>
        </div>

        <div className="p-8">

          {/* ─── Overview ─── */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Trip', val: allTrips.length.toString(), sub: 'Semua waktu', color: 'blue', Icon: Truck },
                  { label: 'Trip Hari Ini', val: '3', sub: '↑ +1 dari kemarin', color: 'emerald', Icon: BarChart2 },
                  { label: 'Kendaraan Hari Ini', val: '5', sub: '2 jenis berbeda', color: 'amber', Icon: LayoutGrid },
                  { label: 'Pendapatan Bulan Ini', val: `Rp ${(totalRevenue / 1000).toFixed(0)}rb`, sub: 'September 2026', color: 'slate', Icon: Download },
                ].map(({ label, val, sub, color, Icon }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color === 'blue' ? 'bg-blue-100' : color === 'emerald' ? 'bg-emerald-100' : color === 'amber' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                      <Icon size={18} className={color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-600'} />
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-800">Trip per Hari (Sep 2026)</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Minggu ini</span>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[2, 4, 3, 5, 3, 4, 3].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full rounded-t-lg bg-blue-500 hover:bg-blue-600 transition-colors" style={{ height: `${v / 5 * 100}%` }} />
                        <span className="text-[9px] text-slate-400 font-medium">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-800 mb-4">Distribusi Muatan</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="67 33" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[17px] font-black text-slate-900">67%</span>
                        <span className="text-[9px] text-slate-400">Muatan</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Ada Muatan</span><span className="font-bold">67%</span></div>
                    <div className="flex justify-between text-[12px]"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />Kosong</span><span className="font-bold">33%</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Trip Terbaru</h3>
                  <button onClick={() => setTab('reports')} className="text-blue-600 text-[12px] font-bold hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={13} /></button>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID Trip', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {allTrips.slice(0, 5).map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedReport(t); setTab('reports') }}>
                        <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{t.id}</td>
                        <td className="px-6 py-3.5 text-[13px] font-bold text-slate-800">{t.route}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.officer}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.type}</td>
                        <td className="px-6 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="px-6 py-3.5 text-[13px] font-black text-slate-900">{t.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Tariff ─── */}
          {tab === 'tariff' && !editTariff && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Golongan', val: tariffData.length.toString(), color: 'blue' },
                  { label: 'Tarif Tertinggi', val: 'Rp 450.000', color: 'emerald' },
                  { label: 'Tarif Terendah', val: 'Rp 8.000', color: 'slate' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
                    <p className={`font-black text-[24px] ${color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Tabel Tarif Kendaraan</h3>
                  <button onClick={() => setEditTariff({ golongan: 'VI', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })} className="flex items-center gap-2 bg-blue-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20">
                    <Plus size={14} /> Tambah Golongan
                  </button>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['Gol.', 'Jenis Kendaraan', 'Deskripsi', 'Tarif Muatan', 'Tarif Kosong', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {tariffData.map(row => (
                      <tr key={row.golongan} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><span className="w-8 h-8 rounded-lg bg-slate-100 font-mono font-black text-[13px] flex items-center justify-center text-slate-700">{row.golongan}</span></td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-800">{row.type}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-500">{row.desc}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-emerald-700">{row.loaded}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-500">{row.empty}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => setEditTariff(row)} className="text-[12px] text-blue-600 font-bold hover:underline flex items-center gap-1"><Pencil size={12} />Edit</button>
                            <button className="text-[12px] text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={12} />Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'tariff' && editTariff && (
            <div className="animate-fade-in max-w-xl">
              <button onClick={() => setEditTariff(null)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Tabel Tarif
              </button>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Golongan</label><input defaultValue={editTariff.golongan} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Jenis Kendaraan</label><input defaultValue={editTariff.type} placeholder="cth: Truck Besar" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                </div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Deskripsi</label><input defaultValue={editTariff.desc} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Tarif Muatan (Rp)</label><input defaultValue={editTariff.loadedNum || ''} type="number" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Tarif Kosong (Rp)</label><input defaultValue={editTariff.emptyNum || ''} type="number" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditTariff(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                  <button onClick={() => setEditTariff(null)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Simpan Perubahan</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Officers ─── */}
          {tab === 'officers' && !showOfficerForm && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Petugas', val: '5', color: 'blue' },
                  { label: 'Aktif Hari Ini', val: '4', color: 'emerald' },
                  { label: 'Nonaktif', val: '1', color: 'slate' },
                  { label: 'Total Wilayah', val: '2', color: 'amber' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-[11px] mb-0.5">{label}</p>
                    <p className={`font-black text-[24px] ${color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>

              {['BADAU', 'ENTIKONG'].map(region => (
                <div key={region} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 bg-[#0F172A] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock size={15} className="text-amber-400" />
                      <span className="text-white font-bold text-[14px]">Wilayah {region}</span>
                      <span className="text-slate-500 text-[12px]">· {officerList.filter(o => o.region === region).length} petugas</span>
                    </div>
                    <button onClick={() => setShowOfficerForm(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                      <Plus size={13} /> Tambah
                    </button>
                  </div>
                  <table className="w-full">
                    <thead><tr className="bg-slate-50/70">{['Petugas', 'PIN', 'Perangkat', 'Trip Total', 'Terakhir Aktif', 'Status', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {officerList.filter(o => o.region === region).map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src="/assets/guest-profile.jpeg" alt={o.name} className="w-9 h-9 rounded-xl object-cover" />
                              <div><p className="text-[13px] font-bold text-slate-800">{o.name}</p><p className="text-[10px] text-slate-400">Bergabung {o.joined}</p></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[13px] text-slate-400">••••••</td>
                          <td className="px-6 py-4 text-[13px] text-slate-500">{o.device}</td>
                          <td className="px-6 py-4 text-[13px] font-black text-slate-800">{o.trips}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-500">{o.lastActive}</td>
                          <td className="px-6 py-4"><span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${o.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{o.status}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 text-[12px]">
                              <button className="text-blue-600 font-bold hover:underline">Edit PIN</button>
                              <span className="text-slate-200">|</span>
                              <button className={`font-bold hover:underline ${o.status === 'Aktif' ? 'text-amber-500' : 'text-emerald-600'}`}>{o.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {tab === 'officers' && showOfficerForm && (
            <div className="animate-fade-in max-w-xl">
              <button onClick={() => setShowOfficerForm(false)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Daftar Petugas
              </button>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Nama Lengkap</label><input placeholder="Nama petugas" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Wilayah</label>
                    <select className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors">
                      <option>BADAU</option><option>ENTIKONG</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">PIN (6 digit)</label><input type="password" maxLength={6} placeholder="••••••" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Konfirmasi PIN</label><input type="password" maxLength={6} placeholder="••••••" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Perangkat (opsional)</label><input placeholder="cth: Samsung A54" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Lock size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  <div><p className="text-[12px] font-black text-amber-700 mb-0.5">Region Lock Aktif</p><p className="text-[11px] text-amber-600">Petugas ini hanya dapat login pada perangkat yang terdaftar di wilayahnya.</p></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowOfficerForm(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                  <button onClick={() => setShowOfficerForm(false)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Simpan Petugas</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Reports ─── */}
          {tab === 'reports' && !selectedReport && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Trip', val: allTrips.length.toString(), sub: 'Semua data' },
                  { label: 'Ada Muatan', val: allTrips.filter(t => t.load === 'Ada Muatan').length.toString(), sub: 'trip bermuatan' },
                  { label: 'Total Pendapatan', val: `Rp ${(totalRevenue / 1000).toFixed(0)}rb`, sub: 'akumulasi' },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="">Semua</option><option value="Ada Muatan">Ada Muatan</option><option value="Kosong">Kosong</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Petugas</label>
                  <select value={filterOfficer} onChange={e => setFilterOfficer(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="">Semua</option>
                    {[...new Set(allTrips.map(t => t.officer))].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => { setFilterStatus(''); setFilterOfficer('') }} className="text-[12px] text-slate-500 font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 border border-slate-200">Reset</button>
                  <button className="flex items-center gap-2 bg-emerald-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm">
                    <Download size={13} /> Ekspor Excel
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Data Trip <span className="text-slate-400 font-normal text-[13px]">({filteredTrips.length} hasil)</span></h3>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID Trip', 'Tanggal', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan', ''].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTrips.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedReport(t)}>
                        <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{t.id}</td>
                        <td className="px-6 py-3.5 text-[12px] text-slate-500">{t.date} {t.time}</td>
                        <td className="px-6 py-3.5 text-[13px] font-bold text-slate-800">{t.route}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.officer}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.type}</td>
                        <td className="px-6 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="px-6 py-3.5 text-[13px] font-black text-slate-900">{t.revenue}</td>
                        <td className="px-6 py-3.5"><button className="text-[12px] text-blue-600 font-bold hover:underline">Detail →</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTrips.length === 0 && <div className="py-12 text-center text-slate-400 text-[13px]">Tidak ada data yang sesuai filter</div>}
              </div>
            </div>
          )}

          {tab === 'reports' && selectedReport && (
            <div className="animate-fade-in max-w-2xl">
              <button onClick={() => setSelectedReport(null)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Laporan
              </button>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-mono text-[12px] text-slate-400">{selectedReport.id}</p>
                  <h2 className="font-black text-slate-900 text-[22px]">{selectedReport.route}</h2>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl text-[13px]">{selectedReport.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-[#0F172A] rounded-2xl p-5">
                  <p className="text-slate-400 text-[11px] mb-3 uppercase tracking-wide font-bold">Info Trip</p>
                  <div className="space-y-2.5">
                    {[['Tanggal', selectedReport.date], ['Jam', selectedReport.time], ['Durasi', selectedReport.duration], ['Petugas', selectedReport.officer]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-500 text-[12px]">{k}</span><span className="text-white text-[12px] font-semibold">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-slate-400 text-[11px] mb-3 uppercase tracking-wide font-bold">Info Kendaraan</p>
                  <div className="space-y-2.5">
                    {[['No. Polisi', selectedReport.vehicle], ['Jenis', selectedReport.type], ['Kategori', selectedReport.category], ['Status', selectedReport.load]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-400 text-[12px]">{k}</span><span className="text-slate-800 text-[12px] font-bold">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4 flex justify-between items-center">
                <p className="text-slate-500 text-[13px]">Total Pendapatan Trip</p>
                <p className="text-[24px] font-black text-slate-900">{selectedReport.revenue}</p>
              </div>
              {selectedReport.photo && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-[11px] font-black text-slate-500 mb-3 uppercase tracking-wide">Foto Bukti Muatan</p>
                  <div className="bg-slate-100 rounded-xl h-40 flex items-center justify-center">
                    <div className="text-center"><Camera size={36} className="text-slate-300 mx-auto" /><p className="text-[12px] text-slate-400 mt-2">Foto tersimpan di server</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Settings ─── */}
          {tab === 'settings' && (
            <div className="animate-fade-in max-w-2xl space-y-5">
              {[
                {
                  title: 'Pengaturan Wilayah',
                  items: [
                    { label: 'Wilayah Aktif', desc: 'Region saat ini yang terdaftar', type: 'text', val: 'BADAU' },
                    { label: 'Multi-Region', desc: 'Izinkan petugas lintas wilayah', type: 'toggle', val: false },
                    { label: 'GPS Fence Radius', desc: 'Radius batas wilayah (km)', type: 'number', val: '25' },
                  ]
                },
                {
                  title: 'Pengaturan Trip',
                  items: [
                    { label: 'Auto-sync Data', desc: 'Sinkronisasi otomatis saat koneksi tersedia', type: 'toggle', val: true },
                    { label: 'Wajib Foto Bukti', desc: 'Petugas wajib foto untuk trip bermuatan', type: 'toggle', val: true },
                    { label: 'Tambah Kendaraan Maks.', desc: 'Jumlah maks. kendaraan per trip', type: 'number', val: '5' },
                  ]
                },
                {
                  title: 'Keamanan',
                  items: [
                    { label: 'PIN Expiry', desc: 'Masa berlaku PIN (hari, 0 = tidak kedaluwarsa)', type: 'number', val: '90' },
                    { label: 'Auto-logout', desc: 'Logout otomatis setelah tidak aktif (menit)', type: 'number', val: '30' },
                    { label: 'Device Lock', desc: 'Kunci akun ke satu perangkat saja', type: 'toggle', val: true },
                  ]
                },
              ].map(section => (
                <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                    <h3 className="font-black text-slate-700 text-[13px] uppercase tracking-wide">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.items.map(item => (
                      <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{item.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        {item.type === 'toggle' ? (
                          <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.val ? 'bg-blue-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.val ? 'left-6' : 'left-1'}`} />
                          </div>
                        ) : item.type === 'number' ? (
                          <input defaultValue={item.val as string} type="number" className="w-20 text-right border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500 font-mono" />
                        ) : (
                          <input defaultValue={item.val as string} className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="bg-blue-600 text-white font-black px-8 py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-[13px] shadow-sm shadow-blue-600/20">Simpan Semua Pengaturan</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
