// Memetakan bahasa utama repositori GitHub ke kategori filter katalog agar filter tetap berfungsi pada data live.
function inferCategoryFromLanguage(language) {
  const lang = (language || "").toLowerCase();
  if (["html", "css", "javascript", "typescript", "vue", "svelte", "dart"].includes(lang)) {
    return { category: "web", categoryLabel: "Aplikasi Web" };
  }
  if (["go", "rust", "java", "kotlin", "c#", "php", "ruby", "sql"].includes(lang)) {
    return { category: "api", categoryLabel: "Sistem & API" };
  }
  return { category: "cli", categoryLabel: "Otomasi & CLI" };
}

window.GitHubPortfolioService = {
  async fetchUserRepositories(username) {
    const cleanUser = (username || "").trim();
    if (!cleanUser) {
      throw new Error("Nama pengguna GitHub belum diisi. Masukkan username GitHub yang valid terlebih dahulu.");
    }

    const endpoint = `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=12`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (response.status === 404) {
      throw new Error(`Akun GitHub "${cleanUser}" tidak ditemukan. Periksa kembali ejaan username Anda.`);
    }

    if (response.status === 403) {
      throw new Error("Batas permintaan tanpa autentikasi GitHub API telah tercapai. Tunggu beberapa menit atau gunakan data kurasi lokal.");
    }

    if (!response.ok) {
      throw new Error(`Gagal menghubungi server GitHub (Kode status: ${response.status}).`);
    }

    const repos = await response.json();
    if (!Array.isArray(repos)) {
      return [];
    }

    const nonForkRepos = repos.filter((repo) => !repo.fork);
    const sourceList = nonForkRepos.length > 0 ? nonForkRepos : repos;

    return sourceList.map((repo, idx) => {
      const catInfo = inferCategoryFromLanguage(repo.language);
      const updatedDate = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
        : "Baru diperbarui";

      const stackList = [];
      if (repo.language) {
        stackList.push(repo.language);
      }
      if (Array.isArray(repo.topics) && repo.topics.length > 0) {
        stackList.push(...repo.topics.slice(0, 4));
      }
      if (stackList.length === 0) {
        stackList.push("Git Repository");
      }

      return {
        id: `gh-${repo.id}`,
        index: String(idx + 1).padStart(2, "0"),
        isWide: idx === 0 || idx === 3,
        category: catInfo.category,
        categoryLabel: catInfo.categoryLabel,
        title: repo.name,
        summary: repo.description || "Repositori publik GitHub (belum memiliki teks deskripsi pada pengaturan repositori).",
        architectureNote: `Cabang utama: ${repo.default_branch || "main"} | Diperbarui: ${updatedDate} | Lisensi: ${repo.license ? repo.license.spdx_id : "Tidak ditentukan"}`,
        problemStatement: `Repositori publik milik @${cleanUser} yang dikelola melalui GitHub.`,
        solutionDetail: repo.description
          ? `Deskripsi repositori: ${repo.description}. Anda dapat meninjau kode sumber lengkap langsung di GitHub.`
          : "Tambahkan deskripsi pada halaman pengaturan repositori GitHub Anda agar penjelasannya tampil otomatis di sini.",
        stack: stackList,
        repoUrl: repo.html_url,
        liveUrl: repo.homepage && repo.homepage.trim() !== "" ? repo.homepage : repo.html_url,
        statusLabel: "Data Live GitHub"
      };
    });
  }
};
