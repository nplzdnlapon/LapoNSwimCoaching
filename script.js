// Nomor WhatsApp bisnis (format internasional, tanpa + dan tanpa 0 di depan)
const WA_NUMBER = "6285770012133";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ===== Scroll: progress bar, navbar, tombol ke atas =====
const navbar = $("#navbar");
const progress = $("#progress");
const toTop = $("#toTop");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  navbar.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 700);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

// ===== Menu mobile =====
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  hamburger.classList.toggle("active", open);
  hamburger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
}
hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
$$("a", navLinks).forEach((link, i) => {
  link.style.setProperty("--i", i);
  link.addEventListener("click", () => setMenu(false));
});

// ===== Menu aktif mengikuti section yang sedang dilihat =====
const navItems = $$(".nav-link");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("section[id]").forEach((s) => spy.observe(s));

// ===== Animasi muncul saat discroll (berurutan dalam satu grup) =====
$$(".stagger").forEach((group) => {
  $$(".reveal", group).forEach((el, i) => el.style.setProperty("--i", i));
});

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
$$(".reveal").forEach((el) => revealObs.observe(el));

// ===== Angka statistik menghitung naik =====
function animateCount(el) {
  const to = Number(el.dataset.count);
  const from = Number(el.dataset.from || 0);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(from + (to - from) * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (!reduceMotion) {
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  });
  $$(".count").forEach((el) => countObs.observe(el));
}

// ===== Efek mengetik di hero =====
const typed = $("#typed");
if (typed && !reduceMotion) {
  const words = JSON.parse(typed.dataset.words);
  let w = 0;
  let c = words[0].length;
  let deleting = true;

  function typeLoop() {
    if (deleting) {
      c--;
      typed.textContent = words[w].slice(0, c);
      if (c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
      }
      setTimeout(typeLoop, 45);
    } else {
      c++;
      typed.textContent = words[w].slice(0, c);
      if (c === words[w].length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
      } else {
        setTimeout(typeLoop, 85);
      }
    }
  }
  setTimeout(typeLoop, 2400);
}

// ===== Teks berjalan: gandakan isi supaya loop mulus =====
$$(".marquee-track").forEach((track) => {
  track.innerHTML = track.innerHTML.repeat(4);
});

// ===== Kartu paket miring 3D mengikuti kursor =====
const canHover = window.matchMedia("(hover: hover)").matches;
if (!reduceMotion && canHover) {
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${x * 10}deg`);
      card.style.setProperty("--rx", `${-y * 10}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

// ===== Sorotan cahaya mengikuti kursor di kartu keunggulan =====
$$(".spot").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// ===== Efek riak saat tombol diklik =====
$$(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - r.left - size / 2}px`;
    ripple.style.top = `${e.clientY - r.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ===== Tombol "Pilih Paket" otomatis memilih paket di form =====
$$(".pick-paket").forEach((btn) => {
  btn.addEventListener("click", () => {
    const radio = document.getElementById(btn.dataset.target);
    if (radio) radio.checked = true;
  });
});

// ===== Peta: ganti area sesuai kecamatan yang dipilih =====
const mapFrame = $("#mapFrame");
const mapLink = $("#mapLink");
const mapLabel = $("#mapLabel");
const chips = $$("#areaChips .chip");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const area = chip.dataset.area;
    const q = encodeURIComponent(`kolam renang ${area}`);
    const zoom = area === "Balikpapan" ? 12 : 14;
    mapFrame.src = `https://maps.google.com/maps?q=${q}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    mapLink.href = `https://www.google.com/maps/search/${q}`;
    mapLabel.textContent = area === "Balikpapan" ? "Semua area Balikpapan" : area;
  });
});

// ===== FAQ accordion =====
$$(".faq-item").forEach((item) => {
  const question = $(".faq-q", item);
  const answer = $(".faq-a", item);

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    $$(".faq-item.open").forEach((other) => {
      other.classList.remove("open");
      $(".faq-q", other).setAttribute("aria-expanded", false);
      $(".faq-a", other).style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", true);
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

// ===== Form pendaftaran -> WhatsApp =====
const form = $("#formDaftar");
const formError = $("#formError");
const pesertaList = $("#pesertaList");

function createParticipantRow(index) {
  const row = document.createElement("div");
  row.className = "participant-row";
  row.dataset.index = index;

  const nameField = document.createElement("label");
  nameField.className = "field";
  const nameLabel = document.createElement("span");
  nameLabel.textContent = `Nama Peserta ${index}`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = `peserta_nama_${index}`;
  nameInput.placeholder = index === 1 ? "Contoh: Budi Santoso" : `Nama peserta ${index}`;
  nameInput.autocomplete = index === 1 ? "name" : "off";
  nameInput.required = true;
  nameField.append(nameLabel, nameInput);

  const ageField = document.createElement("label");
  ageField.className = "field";
  const ageLabel = document.createElement("span");
  ageLabel.textContent = `Usia Peserta ${index}`;
  const ageInput = document.createElement("input");
  ageInput.type = "number";
  ageInput.name = `peserta_usia_${index}`;
  ageInput.min = "5";
  ageInput.max = "99";
  ageInput.placeholder = "Contoh: 10";
  ageInput.required = true;
  ageField.append(ageLabel, ageInput);

  row.append(nameField, ageField);
  return row;
}

function syncParticipantRows(count) {
  while (pesertaList.children.length < count) {
    pesertaList.appendChild(createParticipantRow(pesertaList.children.length + 1));
  }
  [...pesertaList.children].forEach((row, index) => {
    const visible = index < count;
    row.hidden = !visible;
    $$("input", row).forEach((input) => {
      input.disabled = !visible;
      input.required = visible;
    });
  });
}

$$('input[name="jumlah"]', form).forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) syncParticipantRows(Number(input.value));
  });
});
syncParticipantRows(Number($('input[name="jumlah"]:checked', form).value));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const rows = $$(".participant-row", pesertaList).filter((row) => !row.hidden);
  const participants = [];
  let errorMessage = "";
  let firstInvalid = null;

  rows.forEach((row, index) => {
    const nameInput = $('input[name^="peserta_nama_"]', row);
    const ageInput = $('input[name^="peserta_usia_"]', row);
    const nama = nameInput.value.trim();
    const usia = ageInput.value.trim();
    const usiaValid = usia && Number(usia) >= 5;

    nameInput.classList.toggle("invalid", !nama);
    ageInput.classList.toggle("invalid", !usiaValid);

    if (!errorMessage) {
      if (!nama) {
        errorMessage = rows.length > 1 ? `Nama peserta ${index + 1} wajib diisi.` : "Nama peserta wajib diisi.";
        firstInvalid = nameInput;
      } else if (!usiaValid) {
        errorMessage = rows.length > 1 ? `Usia peserta ${index + 1} minimal 5 tahun.` : "Usia peserta minimal 5 tahun.";
        firstInvalid = ageInput;
      }
    }

    participants.push({ nama, usia });
  });

  if (errorMessage) {
    formError.textContent = errorMessage;
    firstInvalid.focus();
    return;
  }
  formError.textContent = "";

  const catatan = (data.get("catatan") || "").trim();
  const jumlah = participants.length;
  const participantLines = participants.map((peserta, index) =>
    jumlah > 1
      ? `*Peserta ${index + 1}:* ${peserta.nama} (${peserta.usia} tahun)`
      : `*Nama:* ${peserta.nama}\n*Usia:* ${peserta.usia} tahun`
  );

  const pesan = [
    "Halo Coach, saya mau daftar les renang privat/semi privat di *LapoN Swimming Coaching*",
    "",
    `*Jumlah Peserta:* ${jumlah} orang`,
    ...participantLines,
    `*Paket:* ${data.get("paket")}`,
    `*Kemampuan:* ${data.get("level")}`,
    `*Area:* ${data.get("area")}`,
    `*Hari:* ${data.get("hari")}`,
    `*Kolam:* ${data.get("kolam")}`,
    catatan ? `*Catatan:* ${catatan}` : "",
    "",
    "Mohon info jadwal yang tersedia. Terima kasih.",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
});

// Hapus tanda merah saat pengguna mulai mengetik
form.addEventListener("input", (e) => {
  if (e.target.matches("input")) e.target.classList.remove("invalid");
});

// ===== Tahun otomatis di footer =====
$("#year").textContent = new Date().getFullYear();
