import { useState } from 'react'
import { Truck, Lock, LayoutGrid, Table2, Users, BarChart2, Settings, LogOut, Plus, Pencil, Trash2, Download, ChevronLeft, Check, X } from 'lucide-react'
import { useApp } from '../store'
import type { AdminTab } from '../types'

interface TariffRow { golongan: string; type: string; loaded: string; loadedNum: number; empty: string; emptyNum: number; desc: string }
interface Officer { id: number; name: string; initials: string; region: string; pin: string; status: string; device: string; trips: number; lastActive: string; joined: string }
interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [toast, setToast] = useState<Toast | null>(null)

  const { trips, tariffs, saveTariffs, officers, saveOfficers } = useApp()
  const [editTarIdx, setEditTarIdx] = useState<number | null>(null)
  const [addTar, setAddTar] = useState(false)
  const [tarForm, setTarForm] = useState({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })
  const [editTar, setEditTar] = useState({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })

  const [addOff, setAddOff] = useState(false)
  const [editOffIdx, setEditOffIdx] = useState<number | null>(null)
  const [offForm, setOffForm] = useState({ name: '', region: 'BADAU', pin: '', device: '' })
  const [editOff, setEditOff] = useState<Officer | null>(null)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

  // Tariff CRUD
  const handleAddTar = () => {
    if (!tarForm.type || !tarForm.golongan) return showToast('Lengkapi form!', 'error')
    const row: TariffRow = { ...tarForm, loaded: fmtRp(tarForm.loadedNum), empty: fmtRp(tarForm.emptyNum) }
    saveTariffs([...tariffs, row])
    setTarForm({ golongan: '', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })
    setAddTar(false)
    showToast('Tarif ditambahkan')
  }

  const handleUpdTar = () => {
    const row: TariffRow = { ...editTar, loaded: fmtRp(editTar.loadedNum), empty: fmtRp(editTar.emptyNum) }
    const ns = [...tariffs]
    if (editTarIdx !== null) { ns[editTarIdx] = row; saveTariffs(ns) }
    setEditTarIdx(null)
    showToast('Tarif diupdate')
  }

  const handleDelTar = (i: number) => {
    if (!confirm('Hapus?')) return
    saveTariffs(tariffs.filter((_, idx) => idx !== i))
    // Keep the open edit form pointing at the right row after deletion
    if (editTarIdx === i) setEditTarIdx(null)
    else if (editTarIdx !== null && editTarIdx > i) setEditTarIdx(editTarIdx - 1)
    showToast('Tarif dihapus')
  }

  // Officer CRUD
  const handleAddOff = () => {
    if (!offForm.name || !offForm.pin) return showToast('Lengkapi form!', 'error')
    const initials = offForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const row: Officer = { id: Date.now(), name: offForm.name, initials, region: offForm.region, pin: offForm.pin, status: 'Aktif', device: offForm.device || '-', trips: 0, lastActive: '-', joined: new Date().toLocaleDateString('id-ID') }
    saveOfficers([...officers, row])
    setOffForm({ name: '', region: 'BADAU', pin: '', device: '' })
    setAddOff(false)
    showToast('Petugas ditambahkan')
  }

  const handleUpdOff = () => {
    if (!editOff) return
    const initials = editOff.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const ns = [...officers]
    if (editOffIdx !== null) ns[editOffIdx] = { ...editOff, initials }
    saveOfficers(ns)
    setEditOffIdx(null)
    setEditOff(null)
    showToast('Petugas diupdate')
  }

  const handleDelOff = (i: number) => {
    if (!confirm('Hapus?')) return
    saveOfficers(officers.filter((_, idx) => idx !== i))
    // Keep the open edit form pointing at the right row after deletion
    if (editOffIdx === i) { setEditOffIdx(null); setEditOff(null) }
    else if (editOffIdx !== null && editOffIdx > i) setEditOffIdx(editOffIdx - 1)
    showToast('Petugas dihapus')
  }

  const toggleOffStatus = (i: number) => {
    const ns = [...officers]
    ns[i] = { ...ns[i], status: ns[i].status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
    saveOfficers(ns)
    showToast('Status diubah')
  }

  const navItems: { key: AdminTab; label: string; Icon: any }[] = [
    { key: 'overview', label: 'Dashboard', Icon: LayoutGrid },
    { key: 'tariff', label: 'Master Tarif', Icon: Table2 },
    { key: 'officers', label: 'Petugas', Icon: Users },
    { key: 'reports', label: 'Laporan', Icon: BarChart2 },
    { key: 'settings', label: 'Pengaturan', Icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="w-60 bg-[#0F172A] min-h-screen flex flex-col shrink-0 fixed left-0 top-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center"><Truck size={18} className="text-white" /></div>
            <div><p className="text-white font-black text-[13px]">Trip Angkutan</p><p className="text-slate-500 text-[10px]">Admin</p></div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => { setTab(key); setEditTarIdx(null); setAddTar(false); setEditOffIdx(null); setAddOff(false) }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-[13px] ${tab === key ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-[12px] font-semibold">
            <LogOut size={14} />Logout
          </button>
        </div>
      </div>

      <div className="flex-1 ml-60 bg-slate-100 min-h-screen">
        <div className="p-8">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Trip', val: trips.length, color: 'bg-blue-100 text-blue-600' },
                  { label: 'Total Petugas', val: officers.length, color: 'bg-amber-100 text-amber-600' },
                  { label: 'Total Tarif', val: tariffs.length, color: 'bg-purple-100 text-purple-600' },
                  { label: 'Pendapatan Trip', val: `Rp ${trips.reduce((s, t) => s + t.revenueNum, 0).toLocaleString('id-ID')}`, color: 'bg-emerald-100 text-emerald-600' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-slate-500 text-[11px] mb-1">{label}</p>
                    <p className="text-3xl font-black">{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">Trip Terbaru</div>
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase">
                    <tr><th className="text-left p-4">ID</th><th className="text-left p-4">Rute</th><th className="text-left p-4">Petugas</th><th className="text-left p-4">Kendaraan</th><th className="text-left p-4">Status</th><th className="text-left p-4">Pendapatan</th><th className="text-left p-4">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {trips.slice(0, 5).map(t => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono text-slate-400">{t.id}</td>
                        <td className="p-4 font-bold">{t.route}</td>
                        <td className="p-4">{t.officer}</td>
                        <td className="p-4">{t.type}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="p-4 font-bold text-emerald-600">{t.revenue}</td>
                        <td className="p-4"><button onClick={() => setTab('tariff')} className="text-blue-600 font-bold text-sm">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'tariff' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setAddTar(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                  <Plus size={14} />Tambah Golongan
                </button>
              </div>

              {addTar && (
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
                  <h3 className="font-bold mb-4">Tambah Golongan</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Golongan</label><input value={tarForm.golongan} onChange={e => setTarForm({...tarForm, golongan: e.target.value})} placeholder="I, II, III" className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Jenis</label><input value={tarForm.type} onChange={e => setTarForm({...tarForm, type: e.target.value})} placeholder="Truck Besar" className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  </div>
                  <div className="mb-4"><label className="text-[11px] text-slate-500 block mb-1">Deskripsi</label><input value={tarForm.desc} onChange={e => setTarForm({...tarForm, desc: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Muatan (Rp)</label><input type="number" value={tarForm.loadedNum || ''} onChange={e => setTarForm({...tarForm, loadedNum: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Kosong (Rp)</label><input type="number" value={tarForm.emptyNum || ''} onChange={e => setTarForm({...tarForm, emptyNum: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setAddTar(false)} className="flex-1 py-3 rounded-xl border text-slate-700 font-semibold">Batal</button>
                    <button onClick={handleAddTar} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
                  </div>
                </div>
              )}

              {editTarIdx !== null && (
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
                  <h3 className="font-bold mb-4">Edit Golongan</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Golongan</label><input value={editTar.golongan} onChange={e => setEditTar({...editTar, golongan: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Jenis</label><input value={editTar.type} onChange={e => setEditTar({...editTar, type: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  </div>
                  <div className="mb-4"><label className="text-[11px] text-slate-500 block mb-1">Deskripsi</label><input value={editTar.desc} onChange={e => setEditTar({...editTar, desc: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Muatan</label><input type="number" value={editTar.loadedNum || ''} onChange={e => setEditTar({...editTar, loadedNum: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Kosong</label><input type="number" value={editTar.emptyNum || ''} onChange={e => setEditTar({...editTar, emptyNum: parseInt(e.target.value) || 0})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditTarIdx(null)} className="flex-1 py-3 rounded-xl border text-slate-700 font-semibold">Batal</button>
                    <button onClick={handleUpdTar} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Update</button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase">
                    <tr><th className="text-left p-4">Gol</th><th className="text-left p-4">Jenis</th><th className="text-left p-4">Muatan</th><th className="text-left p-4">Kosong</th><th className="text-left p-4">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {tariffs.map((t, i) => (
                      <tr key={`${t.golongan}-${i}`} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold">{t.golongan}</td>
                        <td className="p-4 font-bold">{t.type}</td>
                        <td className="p-4 text-blue-700 font-bold">{t.loaded}</td>
                        <td className="p-4 text-slate-500">{t.empty}</td>
                        <td className="p-4">
                          <button onClick={() => { setEditTarIdx(i); setEditTar(t) }} className="text-blue-600 font-bold text-sm mr-4">Edit</button>
                          <button onClick={() => handleDelTar(i)} className="text-red-500 font-bold text-sm">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'officers' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setAddOff(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                  <Plus size={14} />Tambah Petugas
                </button>
              </div>

              {addOff && (
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
                  <h3 className="font-bold mb-4">Tambah Petugas</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Nama</label><input value={offForm.name} onChange={e => setOffForm({...offForm, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Wilayah</label>
                      <select value={offForm.region} onChange={e => setOffForm({...offForm, region: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm">
                        <option value="BADAU">BADAU</option><option value="ENTIKONG">ENTIKONG</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4"><label className="text-[11px] text-slate-500 block mb-1">PIN</label><input type="password" maxLength={6} value={offForm.pin} onChange={e => setOffForm({...offForm, pin: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div className="flex gap-3">
                    <button onClick={() => setAddOff(false)} className="flex-1 py-3 rounded-xl border text-slate-700 font-semibold">Batal</button>
                    <button onClick={handleAddOff} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
                  </div>
                </div>
              )}

              {editOffIdx !== null && editOff && (
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
                  <h3 className="font-bold mb-4">Edit Petugas</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[11px] text-slate-500 block mb-1">Nama</label><input value={editOff.name} onChange={e => setEditOff({...editOff, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                    <div><label className="text-[11px] text-slate-500 block mb-1">Wilayah</label>
                      <select value={editOff.region} onChange={e => setEditOff({...editOff, region: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm">
                        <option value="BADAU">BADAU</option><option value="ENTIKONG">ENTIKONG</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4"><label className="text-[11px] text-slate-500 block mb-1">PIN Baru</label><input type="password" maxLength={6} value={editOff.pin} onChange={e => setEditOff({...editOff, pin: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div className="flex gap-3">
                    <button onClick={() => { setEditOffIdx(null); setEditOff(null) }} className="flex-1 py-3 rounded-xl border text-slate-700 font-semibold">Batal</button>
                    <button onClick={handleUpdOff} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Update</button>
                  </div>
                </div>
              )}

              {['BADAU', 'ENTIKONG'].map(region => (
                <div key={region} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-3 bg-[#0F172A] text-white font-bold flex items-center gap-2"><Lock size={14} className="text-blue-400" />{region} ({officers.filter(o => o.region === region).length} petugas)</div>
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase">
                      <tr><th className="text-left p-4">Nama</th><th className="text-left p-4">Status</th><th className="text-left p-4">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {officers.filter(o => o.region === region).map((o, _, arr) => {
                        const i = officers.indexOf(o)
                        return (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold">{o.name}</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{o.status}</span></td>
                            <td className="p-4">
                              <button onClick={() => { setEditOffIdx(i); setEditOff(o) }} className="text-blue-600 font-bold text-sm mr-3">Edit</button>
                              <button onClick={() => toggleOffStatus(i)} className="text-amber-500 font-bold text-sm mr-3">{o.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                              <button onClick={() => handleDelOff(i)} className="text-red-500 font-bold text-sm">Hapus</button>
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

          {tab === 'reports' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold">Laporan</h3>
              <p className="text-slate-500 mt-2">Fitur dalam development</p>
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold">Pengaturan</h3>
              <p className="text-slate-500 mt-2">Fitur dalam development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
