// ─── OCR Service ──────────────────────────────────────────────────────────────
// Baca nomor plat dari foto memakai tesseract.js (jalan di browser).

import { createWorker } from 'tesseract.js'

// Plat Indonesia umum: "B 1234 XY", "DK 1234 A", "B 1234" (tanpa suffix)
const PLATE_RE = /^[A-Z]{1,2} ?\d{1,4}( ?[A-Z]{1,3})?$/

function cleanLine(line: string): string {
  return line
    .toUpperCase()
    // OCR sering salah baca karakter umum → normalisasi wajar dulu
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Ambil kandidat plat paling meyakinkan dari teks hasil OCR. */
export function extractPlate(rawText: string): string {
  const lines = rawText.split(/\n/).map(cleanLine).filter(Boolean)

  for (const line of lines) {
    if (PLATE_RE.test(line)) return line
    // Coba kombinasi 2–3 kata berurutan (OCR bisa memecah "B 1234 XY")
    const words = line.split(' ')
    for (let i = 0; i < words.length; i++) {
      for (let n = 2; n <= 3; n++) {
        const combo = words.slice(i, i + n).join(' ')
        if (words.slice(i, i + n).length === n && PLATE_RE.test(combo)) return combo
      }
    }
  }

  // Fallback: baris pertama yang mengandung angka
  return lines.find(l => /\d/.test(l)) ?? ''
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'))
    reader.readAsDataURL(blob)
  })
}

/**
 * OCR satu gambar → kandidat nomor plat.
 * Melempar error kalau worker OCR gagal (mis. data bahasa belum terunduh).
 */
export async function readPlateFromImage(image: Blob | string): Promise<string> {
  const src = typeof image === 'string' ? image : await blobToDataUrl(image)
  const worker = await createWorker('eng')
  try {
    const { data } = await worker.recognize(src)
    return extractPlate(data.text)
  } finally {
    await worker.terminate()
  }
}
