#!/bin/bash
# Script startup untuk Railway - copy APK dari repo ke volume jika kosong

APK_DIR="${APK_DIR:-/data/apks}"
SRC_DIR="backend/apks"
mkdir -p "$APK_DIR"

echo "[startup] APK_DIR: $APK_DIR"
echo "[startup] Files in APK_DIR: $(ls -la "$APK_DIR" 2>/dev/null | wc -l || echo 0)"

if [ ! -f "$APK_DIR/app-1.0.4.apk" ] || [ ! -s "$APK_DIR/app-1.0.4.apk" ]; then
    echo "[startup] APK tidak ada atau kosong, menyalin dari repo..."
    mkdir -p "$SRC_DIR"
    if [ -f "$SRC_DIR/app-1.0.4.apk" ]; then
        cp "$SRC_DIR/app-1.0.4.apk" "$APK_DIR/"
        echo "[startup] APK berhasil disalin ke $APK_DIR"
    else
        echo "[startup] APK sumber tidak ditemukan di $SRC_DIR"
    fi
else
    echo "[startup] APK sudah ada: $(ls -lh "$APK_DIR"/*.apk 2>/dev/null | head -5)"
fi

echo "[startup] Isi folder APK: $(ls -la "$APK_DIR" 2>/dev/null)"
node src/index.js
