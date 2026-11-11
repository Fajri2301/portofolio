# DESIGN.md: Arah Visual Portofolio Fajri Khaerullah

## Design Read
Reading this as: Personal programmer portfolio for Fajri Khaerullah, in a bold mixed-typography editorial showcase style (electric blue `#2B3BFF`, cutout hero layering, and stacked serif skill pills based on user-supplied visual reference), dial `ENERGY 3 / RHYTHM 3 / MOTION 2`.

## Alasan Satu Baris untuk Setiap Keputusan Desain (R-31)
- **Mengapa palet warna ini?**: Kombinasi putih bersih (`#FFFFFF`), biru elektrik (`#2B3BFF`, rasio kontras `6.62:1`), dan hitam (`#111111`, rasio kontras `18.88:1`) mengikuti referensi visual pengguna sekaligus melampaui standar aksesibilitas WCAG AA.
- **Mengapa tipografi campuran ini?**: Perpaduan huruf kapital sans-serif tebal (`Plus Jakarta Sans` 800) dengan serif italic elegan (`Instrument Serif`) menciptakan kontras karakter visual antara ketegasan teknis (`PROGRAMMER`, `ALL YOUR`, `SELECTED`) dan sentuhan editorial (*`I'm`*, *`skills`*, *`projects`*).
- **Mengapa susunan z-index pada Hero?**: Menempatkan teks raksasa (`z-index: 1`) di belakang potret PNG transparan (`z-index: 2`) dan tombol CTA di lapisan terdepan (`z-index: 3`) menghadirkan kedalaman spasial sesuai referensi gambar.
- **Mengapa tumpukan pill dengan rotasi pada bagian Skills?**: Deretan tag pill putih yang bertumpuk di dasar blok biru dengan efek *wiggle* ringan memberikan fokus visual yang hidup (`ENERGY 3`) dan membedakan komposisi bagian kedua dari bagian pertama dan ketiga (`RHYTHM 3`).
- **Mengapa kartu proyek bersudut `16px`?**: Membedakan kontainer kartu proyek (`16px`) dari tombol dan tag berbentuk *pill* (`999px`) agar bentuk *pill* tetap berfungsi sebagai penanda elemen aksi dan tag keahlian (R-11).
