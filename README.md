# Portofolio Pribadi Fajri Khaerullah

Website portofolio statis untuk **Fajri Khaerullah (Full-Stack Developer & Creative Technologist)** yang dibangun menggunakan HTML5, CSS3, dan JavaScript murni tanpa framework, tanpa npm, dan tanpa proses *build*. Seluruh tautan menggunakan jalur relatif sehingga langsung berjalan di **GitHub Pages** (baik pada domain utama `fajri2301.github.io` maupun subfolder repositori `fajri2301.github.io/portofolio/`).

## Struktur Folder

```text
portofolio/
├── index.html
├── DESIGN.md
├── README.md
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── project.css
├── js/
│   ├── main.js
│   ├── theme.js
│   ├── menu.js
│   └── tags.js
├── projects/
│   ├── project-1.html
│   ├── project-2.html
│   └── project-3.html
└── assets/
    └── img/
        ├── fajri-cutout.png
        ├── project-1.png
        ├── project-1-real.png
        ├── project-2.png
        ├── project-2-real.png
        ├── project-3.png
        └── project-3-real.png
```

## Langkah Deploy ke GitHub Pages

### 1. Buat Repositori Baru di GitHub
1. Buka [https://github.com/new](https://github.com/new) dan login menggunakan akun **Fajri2301**.
2. Isi **Repository name**, misalnya `portofolio` (alamat web nanti menjadi `https://fajri2301.github.io/portofolio/`).
3. Pilih **Public**, kosongkan centang *Add a README file*, lalu klik **Create repository**.

### 2. Push Kode dari Terminal Ubuntu Anda
Buka terminal, lalu jalankan perintah berikut satu per satu:

```bash
cd /home/fajri-khaerullah/Documents/coding/portofolio

git init
git add .
git commit -m "Initial commit: Portofolio Fajri Khaerullah"
git branch -M main
git remote add origin https://github.com/Fajri2301/portofolio.git
git push -u origin main
```

### 3. Aktifkan GitHub Pages
1. Buka halaman repositori `https://github.com/Fajri2301/portofolio` di browser.
2. Klik tab **Settings** (ikon roda gigi di bagian atas).
3. Di menu sebelah kiri, klik **Pages** (di bawah bagian *Code and automation*).
4. Pada bagian **Build and deployment**:
   - **Source**: pilih **Deploy from a branch**
   - **Branch**: pilih **main** dan folder **/ (root)**
   - Klik tombol **Save**.
5. Tunggu sekitar 1 hingga 2 menit, lalu segarkan (*refresh*) halaman **Settings > Pages**. Tautan aktif website Anda akan muncul di bagian atas:
   `https://fajri2301.github.io/portofolio/`

### Cara Update Konten di Kemudian Hari
Jika Anda mengubah teks atau gambar di folder `/home/fajri-khaerullah/Documents/coding/portofolio`, cukup jalankan 3 perintah berikut di terminal:

```bash
git add .
git commit -m "Update konten portofolio"
git push
```
GitHub Pages akan memperbarui tampilan website secara otomatis dalam 1 menit.
