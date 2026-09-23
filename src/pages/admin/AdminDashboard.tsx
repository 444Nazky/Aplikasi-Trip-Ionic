import { useState } from 'react'
import { Truck, Lock, LayoutGrid, Table2, Users, BarChart2, Bell, Settings, LogOut, Plus, Pencil, Trash2, Download, ChevronLeft, Camera, ArrowRight, X, Check, Save } from 'lucide-react'
import { tariffData as initialTariffData, officerList as initialOfficerList, allTrips } from '../data'
import type { AdminTab } from '../types'

interface TariffRow { golongan: string; type: string; loaded: string; loadedNum: number; empty: string; emptyNum: number; desc: string }
interface Officer { id: number; name: string; initials: string; region: string; pin: string; status: string; device: string; trips: number; lastActive: string; joined: string }

interface AdminDashboardProps { onLogout: () => void }

const showToast = (setter: any) => { setter({ msg: 'Berhasil disimpan', type: 'success' }); setTimeout(() => setter(null), 3000) }

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOfficer, setFilterOfficer] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  // Tariff CRUD
  const [tariffs, setTariffs] = useState<TariffRow[]>(initialTariffData)
  const [editTariffIdx, setEditTariffIdx] = useState<number | null>(null)
  const [editTariffForm, setEditTariffForm] = useState<TariffRow>({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })
  const [showAddTariff, setShowAddTariff] = useState(false)
  const [newTariffForm, setNewTariffForm] = useState<TariffRow>({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })

  // Officer CRUD
  const [officers, setOfficers] = useState<Officer[]>(initialOfficerList)
  const [showOfficerForm, setShowOfficerForm] = useState(false)
  const [editingOfficerIdx, setEditingOfficerIdx] = useState<number | null>(null)
  const [editingOfficerForm, setEditingOfficerForm] = useState<Officer | null>(null)
  const [newOfficerForm, setNewOfficerForm] = useState({ name: '', region: 'BADAU', pin: '', device: '' })

  const filteredTrips = allTrips.filter(t => (!filterStatus || t.load === filterStatus) && (!filterOfficer || t.officer === filterOfficer))
  const totalRevenue = allTrips.reduce((s, t) => s + (parseInt(t.revenue.replace(/\D/g, '') || '0'), 10)

  const navItems: { key: AdminTab; label: string; Icon: any }[] = [
    { key: 'overview', label: 'Overview', Icon: LayoutGrid },
    { key: 'tariff', label: 'Master Tarif', Icon: Table2 },
    { key: 'officers', label: 'Petugas & Wilayah', Icon: Users },
    { key: 'reports', label: 'Laporan & Ekspor', Icon: BarChart2 },
    { key: 'settings', label: 'Pengaturan', Icon: Settings },
  ]

  // Tariff CRUD functions
  const handleAddTariff = () => {
    if (!newTariffForm.type || !newTariffForm.golongan) return
    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
    const newItem = { ...newTariffForm, loaded: fmt(newTariffForm.loadedNum), empty: fmt(newTariffForm.emptyNum) }
    setTariffs([...tariffs, newItem])
    setNewTariffForm({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })
    setShowAddTariff(false)
    setToast({ msg: 'Tarif berhasil ditambahkan', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateTariff = (idx: number) => {
    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
    const updated = { ...editTariffForm, loaded: fmt(editTariffForm.loadedNum), empty: fmt(editTariffForm.emptyNum) }
    const newTariffs = [...tariffs]
    newTariffs[idx] = updated
    setTariffs(newTariffs)
    setEditTariffIdx(null)
    setToast({ msg: 'Tarif berhasil diupdate', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDeleteTariff = (idx: number) => {
    if (!confirm('Hapus golongan ini?')) return
    setTariffs(tariffs.filter((_, i) => i !== idx))
    setToast({ msg: 'Tarif berhasil dihapus', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  // Officer CRUD functions
  const handleAddOfficer = () => {
    if (!newOfficerForm.name || !newOfficerForm.pin) return
    const initials = newOfficerForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const newOfficer: Officer = { id: Date.now(), name: newOfficerForm.name, initials, region: newOfficerForm.region, pin: newOfficerForm.pin, status: 'Aktif', device: newOfficerForm.device || '-', trips: 0, lastActive: '-', joined: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }
    setOfficers([...officers, newOfficer])
    setNewOfficerForm({ name: '', region: 'BADAU', pin: '', device: '' })
    setShowOfficerForm(false)
    setToast({ msg: 'Petugas berhasil ditambahkan', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateOfficer = (idx: number) => {
    if (!editingOfficerForm) return
    const initials = editingOfficerForm.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    const updated = { ...editingOfficerForm, initials }
    const newOfficers = [...officers]
    newOfficers[idx] = updated
    setOfficers(newOfficers)
    setEditingOfficerIdx(null)
    setEditingOfficerForm(null)
    setToast({ msg: 'Petugas berhasil diupdate', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDeleteOfficer = (idx: number) => {
    if (!confirm('Hapus petugas ini?')) return
    setOfficers(officers.filter((_, i) => i !== idx))
    setToast({ msg: 'Petugas berhasil dihapus', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const toggleOfficerStatus = (idx: number) => {
    const newOfficers = [...officers]
    newOfficers[idx] = { ...newOfficers[idx], status: newOfficers[idx].status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
    setOfficers(newOfficers)
    setToast({ msg: `Status diubah menjadi ${newOfficers[idx].status}`, type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <Check size={16} />
          {toast.msg}
        </div>
      )}
      {/* Sidebar */}
      <div className="w-60 bg-[#0F172A] min-h-screen flex flex-col shrink-0 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
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
            <button key={key} onClick={() => { setTab(key); setEditTariffIdx(null); setShowAddTariff(false); setShowOfficerForm(false); setEditingOfficerIdx(null) }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-[13px] transition-all ${tab === key ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Icon size={16} strokeWidth={tab === key ? 2.5 : 1.8} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <div className="flex items-center gap-3 px-3.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-[11px] font-black text-white">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-bold truncate">Admin Utama</p>
              <p className="text-slate-500 text-[10px]">Super Admin</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-[12px] font-semibold">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-60 overflow-auto bg-slate-100 min-h-screen">
        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-black text-slate-900 text-[17px]">
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'tariff' && (editTariffIdx !== null ? 'Edit Golongan' : showAddTariff ? 'Tambah Golongan' : 'Master Tarif Kendaraan')}
              {tab === 'officers' && (editingOfficerIdx !== null ? 'Edit Petugas' : showOfficerForm ? 'Tambah Petugas Baru' : 'Manajemen Petugas')}
              {tab === 'reports' && 'Laporan & Ekspor Data'}
              {tab === 'settings' && 'Pengaturan Sistem'}
            </h1>
            <p className="text-slate-400 text-[11px] mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={16} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 rounded-full text-[8px] text-white flex items-center justify-center font-black">{allTrips.length}</span>
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
                  { label: 'Trip Hari Ini', val: '3', sub: 'Harian', color: 'emerald', Icon: BarChart2 },
                  { label: 'Total Petugas', val: officers.length.toString(), sub: 'Terdaftar', color: 'amber', Icon: Users },
                  { label: 'Pendapatan', val: 'Rp ' + (totalRevenue / 1000).toFixed(0) + 'rb', sub: 'Akumulasi', color: 'purple', Icon: Download },
                ].map(({ label, val, sub, color, Icon }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color === 'blue' ? 'bg-blue-100' : color === 'emerald' ? 'bg-emerald-100' : color === 'amber' ? 'bg-amber-100' : 'bg-purple-100'}`}>
                      <Icon size={18} className={color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-purple-600'} />
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Trip Terbaru</h3>
                  <button onClick={() => setTab('reports')} className="text-emerald-600 text-[12px] font-bold hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={13} /></button>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {allTrips.slice(0, 5).map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
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
          {/* ─── Tariff CRUD ─── */}
          {tab === 'tariff' && (
            <div className="animate-fade-in">
              {!editTariffIdx && !showAddTariff && (
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <button onClick={() => setShowAddTariff(true)} className="flex items-center gap-2 bg-emerald-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm">
                      <Plus size={14} /> Tambah Golongan
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                      <thead><tr className="bg-slate-50/70">{['Gol.', 'Jenis', 'Deskripsi', 'Tarif Muatan', 'Tarif Kosong', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-slate-50">
                        {tariffs.map((row, idx) => (
                          <tr key={row.golongan} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4"><span className="w-8 h-8 rounded-lg bg-emerald-100 font-mono font-black text-[13px] flex items-center justify-center text-emerald-700">{row.golongan}</span></td>
                            <td className="px-6 py-4 text-[13px] font-bold text-slate-800">{row.type}</td>
                            <td className="px-6 py-4 text-[12px] text-slate-500">{row.desc}</td>
                            <td className="px-6 py-4 text-[13px] font-bold text-emerald-700">{row.loaded}</td>
                            <td className="px-6 py-4 text-[13px] text-slate-500">{row.empty}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <button onClick={() => { setEditTariffIdx(idx); setEditTariffForm(row) }} className="text-[12px] text-emerald-600 font-bold hover:underline flex items-center gap-1"><Pencil size={12} />Edit</button>
                                <button onClick={() => handleDeleteTariff(idx)} className="text-[12px] text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={12} />Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {showAddTariff && (
                <div className="max-w-lg">
                  <button onClick={() => setShowAddTariff(false)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
                    <ChevronLeft size={16} /> Kembali
                  </button>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Golongan</label><input value={newTariffForm.golongan} onChange={e => setNewTariffForm({...newTariffForm, golongan: e.target.value})} placeholder="I, II, III..." className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Jenis Kendaraan</label><input value={newTariffForm.type} onChange={e => setNewTariffForm({...newTariffForm, type: e.target.value})} placeholder="Truck Besar" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    </div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Deskripsi</label><input value={newTariffForm.desc} onChange={e => setNewTariffForm({...newTariffForm, desc: e.target.value})} placeholder="Keterangan" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Tarif Muatan (Rp)</label><input type="number" value={newTariffForm.loadedNum || ''} onChange={e => setNewTariffForm({...newTariffForm, loadedNum: parseInt(e.target.value) || 0})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Tarif Kosong (Rp)</label><input type="number" value={newTariffForm.emptyNum || ''} onChange={e => setNewTariffForm({...newTariffForm, emptyNum: parseInt(e.target.value) || 0})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowAddTariff(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                      <button onClick={handleAddTariff} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 flex items-center justify-center gap-2"><Check size={16} />Simpan</button>
                    </div>
                  </div>
                </div>
              )}

              {editTariffIdx !== null && (
                <div className="max-w-lg">
                  <button onClick={() => setEditTariffIdx(null)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
                    <ChevronLeft size={16} /> Kembali
                  </button>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Golongan</label><input value={editTariffForm.golongan} onChange={e => setEditTariffForm({...editTariffForm, golongan: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Jenis</label><input value={editTariffForm.type} onChange={e => setEditTariffForm({...editTariffForm, type: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    </div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Deskripsi</label><input value={editTariffForm.desc} onChange={e => setEditTariffForm({...editTariffForm, desc: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Tarif Muatan</label><input type="number" value={editTariffForm.loadedNum || ''} onChange={e => setEditTariffForm({...editTariffForm, loadedNum: parseInt(e.target.value) || 0})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Tarif Kosong</label><input type="number" value={editTariffForm.emptyNum || ''} onChange={e => setEditTariffForm({...editTariffForm, emptyNum: parseInt(e.target.value) || 0})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setEditTariffIdx(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                      <button onClick={() => handleUpdateTariff(editTariffIdx)} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 flex items-center justify-center gap-2"><Check size={16} />Update</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ─── Officers CRUD ─── */}
          {tab === 'officers' && (
            <div className="animate-fade-in">
              {!showOfficerForm && editingOfficerIdx === null && (
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <button onClick={() => setShowOfficerForm(true)} className="flex items-center gap-2 bg-emerald-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm">
                      <Plus size={14} /> Tambah Petugas
                    </button>
                  </div>
                  {['BADAU', 'ENTIKONG'].map(region => (
                    <div key={region} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="px-6 py-4 bg-[#0F172A] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Lock size={15} className="text-emerald-400" />
                          <span className="text-white font-bold text-[14px]">Wilayah {region}</span>
                          <span className="text-slate-500 text-[12px]">({officers.filter(o => o.region === region).length} petugas)</span>
                        </div>
                      </div>
                      <table className="w-full">
                        <thead><tr className="bg-slate-50/70">{['Petugas', 'PIN', 'Device', 'Trip', 'Status', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-50">
                          {officers.filter(o => o.region === region).map((o, origIdx) => {
                            const globalIdx = officers.findIndex(x => x.id === o.id)
                            return (
                              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-[11px] font-black text-white">{o.initials}</div>
                                    <div><p className="text-[13px] font-bold text-slate-800">{o.name}</p><p className="text-[10px] text-slate-400">Bergabung {o.joined}</p></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-[13px] text-slate-400">{'*'.repeat(6)}</td>
                                <td className="px-6 py-4 text-[13px] text-slate-500">{o.device}</td>
                                <td className="px-6 py-4 text-[13px] font-black text-slate-800">{o.trips}</td>
                                <td className="px-6 py-4"><span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${o.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{o.status}</span></td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-2 text-[12px]">
                                    <button onClick={() => { setEditingOfficerIdx(globalIdx); setEditingOfficerForm(o) }} className="text-emerald-600 font-bold hover:underline flex items-center gap-1"><Pencil size={12} />Edit</button>
                                    <button onClick={() => toggleOfficerStatus(globalIdx)} className={`font-bold hover:underline ${o.status === 'Aktif' ? 'text-amber-500' : 'text-emerald-500'}`}>{o.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                                    <button onClick={() => handleDeleteOfficer(globalIdx)} className="text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={12} />Hapus</button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {showOfficerForm && (
                <div className="max-w-lg">
                  <button onClick={() => setShowOfficerForm(false)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
                    <ChevronLeft size={16} /> Kembali
                  </button>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Nama Lengkap</label><input value={newOfficerForm.name} onChange={e => setNewOfficerForm({...newOfficerForm, name: e.target.value})} placeholder="Nama petugas" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Wilayah</label>
                        <select value={newOfficerForm.region} onChange={e => setNewOfficerForm({...newOfficerForm, region: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500">
                          <option value="BADAU">BADAU</option><option value="ENTIKONG">ENTIKONG</option>
                        </select>
                      </div>
                    </div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">PIN (6 digit)</label><input type="password" maxLength={6} value={newOfficerForm.pin} onChange={e => setNewOfficerForm({...newOfficerForm, pin: e.target.value})} placeholder="******" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-emerald-500" /></div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Perangkat (opsional)</label><input value={newOfficerForm.device} onChange={e => setNewOfficerForm({...newOfficerForm, device: e.target.value})} placeholder="Samsung A54" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowOfficerForm(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                      <button onClick={handleAddOfficer} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 flex items-center justify-center gap-2"><Check size={16} />Simpan</button>
                    </div>
                  </div>
                </div>
              )}

              {editingOfficerIdx !== null && editingOfficerForm && (
                <div className="max-w-lg">
                  <button onClick={() => { setEditingOfficerIdx(null); setEditingOfficerForm(null) }} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
                    <ChevronLeft size={16} /> Kembali
                  </button>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Nama Lengkap</label><input value={editingOfficerForm.name} onChange={e => setEditingOfficerForm({...editingOfficerForm, name: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                      <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Wilayah</label>
                        <select value={editingOfficerForm.region} onChange={e => setEditingOfficerForm({...editingOfficerForm, region: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500">
                          <option value="BADAU">BADAU</option><option value="ENTIKONG">ENTIKONG</option>
                        </select>
                      </div>
                    </div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">PIN Baru (opsional)</label><input type="password" maxLength={6} value={editingOfficerForm.pin} onChange={e => setEditingOfficerForm({...editingOfficerForm, pin: e.target.value})} placeholder="******" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-emerald-500" /></div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase">Perangkat</label><input value={editingOfficerForm.device} onChange={e => setEditingOfficerForm({...editingOfficerForm, device: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-emerald-500" /></div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => { setEditingOfficerIdx(null); setEditingOfficerForm(null) }} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                      <button onClick={() => handleUpdateOfficer(editingOfficerIdx)} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 flex items-center justify-center gap-2"><Check size={16} />Update</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ─── Reports ─── */}
          {tab === 'reports' && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Trip', val: allTrips.length.toString() },
                  { label: 'Ada Muatan', val: allTrips.filter(t => t.load === 'Ada Muatan').length.toString() },
                  { label: 'Total Pendapatan', val: 'Rp ' + (totalRevenue / 1000).toFixed(0) + 'rb' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-emerald-500">
                    <option value="">Semua</option><option value="Ada Muatan">Ada Muatan</option><option value="Kosong">Kosong</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Petugas</label>
                  <select value={filterOfficer} onChange={e => setFilterOfficer(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-emerald-500">
                    <option value="">Semua</option>
                    {[...new Set(allTrips.map(t => t.officer))].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => { setFilterStatus(''); setFilterOfficer('') }} className="text-[12px] text-slate-500 font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 border border-slate-200">Reset</button>
                  <button className="flex items-center gap-2 bg-emerald-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm">
                    <Download size={13} /> Ekspor
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Data Trip ({filteredTrips.length} hasil)</h3>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID', 'Tanggal', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTrips.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{t.id}</td>
                        <td className="px-6 py-3.5 text-[12px] text-slate-500">{t.date} {t.time}</td>
                        <td className="px-6 py-3.5 text-[13px] font-bold text-slate-800">{t.route}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.officer}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.type}</td>
                        <td className="px-6 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="px-6 py-3.5 text-[13px] font-black text-slate-900">{t.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTrips.length === 0 && <div className="py-12 text-center text-slate-400 text-[13px]">Tidak ada data</div>}
              </div>
            </div>
          )}

          {/* ─── Settings ─── */}
          {tab === 'settings' && (
            <div className="animate-fade-in max-w-2xl space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                  <h3 className="font-black text-slate-700 text-[13px] uppercase">Pengaturan Wilayah</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div><p className="text-[13px] font-semibold text-slate-800">Wilayah Aktif</p><p className="text-[11px] text-slate-400 mt-0.5">Region utama yang terdaftar</p></div>
                    <input defaultValue="BADAU" className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] w-24 text-right focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div><p className="text-[13px] font-semibold text-slate-800">GPS Fence Radius</p><p className="text-[11px] text-slate-400 mt-0.5">Radius batas wilayah (km)</p></div>
                    <input type="number" defaultValue="25" className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] w-20 text-right focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                  <h3 className="font-black text-slate-700 text-[13px] uppercase">Pengaturan Trip</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div><p className="text-[13px] font-semibold text-slate-800">Wajib Foto Bukti</p><p className="text-[11px] text-slate-400 mt-0.5">Petugas wajib foto untuk trip bermuatan</p></div>
                    <div className="w-11 h-6 rounded-full bg-emerald-600 relative cursor-pointer"><div className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white shadow" /></div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div><p className="text-[13px] font-semibold text-slate-800">Kendaraan Maks</p><p className="text-[11px] text-slate-400 mt-0.5">Jumlah maks. kendaraan per trip</p></div>
                    <input type="number" defaultValue="5" className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] w-20 text-right focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-all text-[13px] shadow-sm flex items-center justify-center gap-2"><Save size={16} />Simpan Pengaturan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
