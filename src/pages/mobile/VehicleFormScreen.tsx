import { useState } from 'react'
import { ChevronLeft, Check, Camera } from 'lucide-react'
import { tariffFor, useApp } from '../store'
import { tariffData } from '../data'
import type { MobileScreen } from '../types'

// ─── Vehicle Form Screen ───────────────────────────────────────────────────────
interface VehicleFormScreenProps {
  go: (s: MobileScreen) => void
}

export default function VehicleFormScreen({ go }: VehicleFormScreenProps) {
  const { draft, patchDraft, addVehicle, tariffs } = useApp()
  const [showModal, setShowModal] = useState(false)
  const { plate, type: vehicleType, category } = draft.vehicleForm
  const photoTaken = draft.photo

  // Vehicle types come from the admin-managed master tariff so the selected
  // type always maps 1:1 to a tariff row (e.g. Truck Besar ≠ Truck Sedang).
  const vehicleTypes = tariffs.length > 0 ? tariffs.map(t => t.type) : tariffData.map(t => t.type)
  const emojiFor = (t: string) => /motor/i.test(t) ? '🏍️' : /mobil/i.test(t) ? '🚗' : '🚛'

  // Form fields live in the store draft so they survive navigation to the
  // camera screen and back (component unmounts while off-screen).
  const setField = (p: Partial<{ plate: string; type: string; category: string }>) =>
    patchDraft({ vehicleForm: { ...draft.vehicleForm, ...p } })
  const setPlate = (v: string) => setField({ plate: v })
  const setVehicleType = (v: string) => setField({ type: v })
  const setCategory = (v: string) => setField({ category: v })

  const pushVehicle = () => {
    addVehicle({ plate, type: vehicleType, category, tariff: tariffFor(vehicleType).loadedNum })
    patchDraft({ vehicleForm: { plate: '', type: '', category: '' }, photo: false })
  }

  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('trip-condition')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Data Kendaraan</h2>
      <p className="text-slate-500 text-[13px] mb-4">Lengkapi informasi kendaraan yang dibawa</p>

      {/* Steps */}
      <div className="flex items-center gap-1.5 mb-5">
        {['Rute', 'Kondisi', 'Kendaraan', 'Selesai'].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i <= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {i < 2 ? <Check size={12} strokeWidth={3} /> : i + 1}
            </div>
            {i < 3 && <div className={`flex-1 h-[2px] rounded-full ${i < 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {/* Kategori */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Kategori Kendaraan</label>
          <div className="space-y-2">
            {[
              { key: 'Internal', badge: 'Internal', color: 'bg-slate-800 text-white' },
              { key: 'Eksternal (Berganji)', badge: 'Ekst. Berganji', color: 'bg-amber-500 text-white' },
              { key: 'Eksternal (Tanpa Garansi)', badge: 'Ekst. Tanpa Garansi', color: 'bg-rose-500 text-white' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`w-full rounded-xl px-4 py-3 text-left flex items-center justify-between border-2 transition-all ${category === cat.key ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <span className="text-[13px] font-medium text-slate-700">{cat.key}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* No. Polisi */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">No. Polisi</label>
          <input
            value={plate}
            onChange={e => setPlate(e.target.value.toUpperCase())}
            placeholder="Contoh: B 1234 XY"
            className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Jenis Kendaraan */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Jenis Kendaraan</label>
          <div className="grid grid-cols-3 gap-2">
            {vehicleTypes.map(vt => (
              <button
                key={vt}
                onClick={() => setVehicleType(vt)}
                className={`py-3.5 rounded-xl text-[11px] font-bold border-2 flex flex-col items-center gap-1.5 transition-all ${vehicleType === vt ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
              >
                <span className="text-xl">{emojiFor(vt)}</span>{vt}
              </button>
            ))}
          </div>
        </div>

        {/* Foto Bukti */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Foto Bukti Muatan</label>
          <button
            onClick={() => go('camera')}
            className={`w-full rounded-2xl border-2 border-dashed py-6 flex flex-col items-center gap-2 transition-all ${photoTaken ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}
          >
            {photoTaken ? (
              <><span className="text-3xl">✅</span><span className="text-[12px] font-bold text-emerald-600">Foto berhasil diambil</span><span className="text-[10px] text-emerald-500">Ketuk untuk ulang</span></>
            ) : (
              <><Camera size={28} className="text-slate-400" /><span className="text-[12px] font-semibold text-slate-500">Ambil Foto Selfie + Muatan</span><span className="text-[10px] text-slate-400">Pastikan kendaraan & muatan terlihat</span></>
            )}
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!photoTaken || !plate || !vehicleType || !category}
          className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-2xl text-[13px] disabled:opacity-40 hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Simpan Data Kendaraan
        </button>
      </div>

      {/* Modal Tambah Kendaraan */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end z-20">
          <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-slate-900 font-bold text-[17px] text-center mb-1">Tambah Kendaraan?</h3>
            <p className="text-slate-500 text-[13px] text-center mb-5">Input kendaraan tambahan untuk trip yang sama?</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-5">
              <div className="flex justify-between text-[12px] mb-1.5"><span className="text-slate-500">No. Polisi</span><span className="font-bold font-mono text-slate-800">{plate}</span></div>
              <div className="flex justify-between text-[12px] mb-1.5"><span className="text-slate-500">Jenis</span><span className="font-semibold text-slate-700">{vehicleType}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-slate-500">Kategori</span><span className="font-semibold text-slate-700">{category}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { pushVehicle(); go('trip-summary') }} className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Tidak, Lanjutkan</button>
              <button onClick={() => { pushVehicle(); setShowModal(false) }} className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Ya, Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
