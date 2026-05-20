const API_BASE = "http://localhost:5001/api";

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const info = document.getElementById("info");
const toastEl = document.getElementById("toast");

let token = localStorage.getItem("token");
let currentUser = JSON.parse(localStorage.getItem("user"));
let authScreen = "login";
let toastTimer = null;
let editingAppointmentId = null;

const EMPTY_MSG = "Bu alan boş bırakılamaz.";

const SERVICES = [
  "Saç Kesimi",
  "Saç Boyama",
  "Fön ve Şekillendirme",
  "Manikür",
  "Pedikür",
  "Kaş Dizayn",
  "Kirpik Lifting",
  "Cilt Bakımı",
  "Makyaj",
  "Gelin Saçı"
];

const EMPLOYEES = [
  "Ayşe Yılmaz",
  "Zeynep Kaya",
  "Elif Demir",
  "Merve Arslan",
  "Selin Öztürk"
];

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden", "toast--error");
  if (isError) toastEl.classList.add("toast--error");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 3200);
}

function clearFieldErrors(scope) {
  scope.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
    el.classList.add("hidden");
  });
  scope.querySelectorAll(".field input, .field select").forEach((el) => {
    el.classList.remove("input--error");
  });
}

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return false;

  const field = input.closest(".field");
  const errEl = field.querySelector(".field-error");

  input.classList.add("input--error");
  errEl.textContent = message;
  errEl.classList.remove("hidden");
  return true;
}

function requireField(value, inputId, label) {
  if (!value || !String(value).trim()) {
    setFieldError(inputId, `${label}: ${EMPTY_MSG}`);
    return false;
  }
  return true;
}

function statusLabel(status) {
  const map = {
    planned: "Planlandı",
    completed: "Tamamlandı",
    cancelled: "İptal"
  };

  return map[status] || status;
}

function fieldHtml(id, label, type, placeholder, autocomplete) {
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}" />
      <span class="field-error hidden" role="alert"></span>
    </div>
  `;
}

function selectFieldHtml(id, label, options, placeholder = "Seçiniz") {
  const opts = [`<option value="">${escapeHtml(placeholder)}</option>`]
    .concat(options.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`))
    .join("");

  return `
    <div class="field">
      <label for="${id}">${label} <span class="required">*</span></label>
      <select id="${id}">${opts}</select>
      <span class="field-error hidden" role="alert"></span>
    </div>
  `;
}

function selectFieldHtmlWithValue(id, label, options, selected, placeholder = "Seçiniz") {
  const opts = [`<option value="">${escapeHtml(placeholder)}</option>`]
    .concat(
      options.map((o) => {
        const sel = o === selected ? " selected" : "";
        return `<option value="${escapeHtml(o)}"${sel}>${escapeHtml(o)}</option>`;
      })
    )
    .join("");

  return `
    <div class="field">
      <label for="${id}">${label} <span class="required">*</span></label>
      <select id="${id}">${opts}</select>
      <span class="field-error hidden" role="alert"></span>
    </div>
  `;
}

function statusSelectHtml(id, selected) {
  const statuses = [
    { value: "planned", label: "Planlandı" },
    { value: "completed", label: "Tamamlandı" },
    { value: "cancelled", label: "İptal" }
  ];

  const opts = statuses
    .map((s) => {
      const sel = s.value === selected ? " selected" : "";
      return `<option value="${s.value}"${sel}>${s.label}</option>`;
    })
    .join("");

  return `
    <div class="field">
      <label for="${id}">Durum <span class="required">*</span></label>
      <select id="${id}">${opts}</select>
      <span class="field-error hidden" role="alert"></span>
    </div>
  `;
}

function toDatetimeLocal(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function validateLoginForm() {
  clearFieldErrors(authSection);

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let ok = true;

  if (!requireField(email, "loginEmail", "E-posta")) ok = false;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("loginEmail", "Geçerli bir e-posta adresi girin.");
    ok = false;
  }

  if (!requireField(password, "loginPassword", "Şifre")) ok = false;

  return ok ? { email, password } : null;
}

function validateRegisterForm() {
  clearFieldErrors(authSection);

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  let ok = true;

  if (!requireField(name, "regName", "Ad Soyad")) ok = false;
  else if (name.length < 2) {
    setFieldError("regName", "Ad soyad en az 2 karakter olmalı.");
    ok = false;
  }

  if (!requireField(email, "regEmail", "E-posta")) ok = false;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("regEmail", "Geçerli bir e-posta adresi girin.");
    ok = false;
  }

  if (!requireField(password, "regPassword", "Şifre")) ok = false;
  else if (password.length < 6) {
    setFieldError("regPassword", "Şifre en az 6 karakter olmalı.");
    ok = false;
  }

  return ok ? { name, email, password } : null;
}

function validateAppointmentFields(scope, ids, defaultStatus = "planned") {
  clearFieldErrors(scope);

  const serviceName = document.getElementById(ids.service).value.trim();
  const employeeName = document.getElementById(ids.employee).value.trim();
  const dateVal = document.getElementById(ids.date).value;
  const statusEl = ids.status ? document.getElementById(ids.status) : null;
  const status = statusEl ? statusEl.value : defaultStatus;

  let ok = true;

  if (!requireField(serviceName, ids.service, "Hizmet")) ok = false;
  if (!requireField(employeeName, ids.employee, "Uzman")) ok = false;

  if (!requireField(dateVal, ids.date, "Tarih ve saat")) ok = false;
  else if (Number.isNaN(Date.parse(dateVal))) {
    setFieldError(ids.date, "Geçerli bir tarih ve saat seçin.");
    ok = false;
  }

  if (ids.status && !requireField(status, ids.status, "Durum")) ok = false;

  if (!ok) return null;

  return {
    serviceName,
    employeeName,
    appointmentDate: new Date(dateVal).toISOString(),
    note: document.getElementById(ids.note).value.trim(),
    status
  };
}

function validateAppointmentForm(scope) {
  return validateAppointmentFields(scope, {
    service: "serviceName",
    employee: "employeeName",
    date: "appointmentDate",
    note: "note"
  });
}

function openEditModal(item) {
  editingAppointmentId = item.id;

  const editForm = document.getElementById("editForm");

  editForm.innerHTML = `
    ${selectFieldHtmlWithValue("editServiceName", "Hizmet", SERVICES, item.serviceName, "Hizmet seçin")}
    ${selectFieldHtmlWithValue("editEmployeeName", "Uzman", EMPLOYEES, item.employeeName, "Uzman seçin")}

    <div class="field">
      <label for="editAppointmentDate">Tarih & saat <span class="required">*</span></label>
      <input id="editAppointmentDate" type="datetime-local" />
      <span class="field-error hidden" role="alert"></span>
    </div>

    ${statusSelectHtml("editStatus", item.status || "planned")}

    <div class="field">
      <label for="editNote">Not</label>
      <input id="editNote" placeholder="Ek notlarınız" />
      <span class="field-error hidden" role="alert"></span>
    </div>
  `;

  document.getElementById("editAppointmentDate").value = toDatetimeLocal(item.appointmentDate);
  document.getElementById("editNote").value = item.note || "";

  const modal = document.getElementById("editModal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeEditModal() {
  editingAppointmentId = null;

  const modal = document.getElementById("editModal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function renderAuth() {
  const isLogin = authScreen === "login";

  authSection.innerHTML = `
    <div class="auth-screen">
      <div class="auth-tabs">
        <button type="button" class="auth-tab ${isLogin ? "auth-tab--active" : ""}" data-screen="login">Giriş</button>
        <button type="button" class="auth-tab ${!isLogin ? "auth-tab--active" : ""}" data-screen="register">Kayıt</button>
      </div>

      <div class="auth-panel ${isLogin ? "" : "hidden"}" id="loginPanel">
        <h2 class="auth-panel__title">Hoş geldiniz</h2>
        <p class="auth-panel__subtitle">Hesabınıza giriş yapın</p>

        ${fieldHtml("loginEmail", "E-posta", "email", "ornek@email.com", "email")}
        ${fieldHtml("loginPassword", "Şifre", "password", "••••••••", "current-password")}

        <button type="button" id="loginBtn" class="btn btn--primary">Giriş Yap</button>

        <p class="auth-switch">
          Hesabınız yok mu?
          <button type="button" class="auth-link" data-go="register">Kayıt olun</button>
        </p>
      </div>

      <div class="auth-panel ${!isLogin ? "" : "hidden"}" id="registerPanel">
        <h2 class="auth-panel__title">Yeni hesap</h2>
        <p class="auth-panel__subtitle">BeautyBook'a katılın</p>

        ${fieldHtml("regName", "Ad Soyad", "text", "Adınız Soyadınız", "name")}
        ${fieldHtml("regEmail", "E-posta", "email", "ornek@email.com", "email")}
        ${fieldHtml("regPassword", "Şifre", "password", "En az 6 karakter", "new-password")}

        <button type="button" id="registerBtn" class="btn btn--primary">Hesap Oluştur</button>

        <p class="auth-switch">
          Zaten hesabınız var mı?
          <button type="button" class="auth-link" data-go="login">Giriş yapın</button>
        </p>
      </div>
    </div>
  `;

  authSection.querySelectorAll("[data-screen]").forEach((btn) => {
    btn.onclick = () => {
      authScreen = btn.dataset.screen;
      renderAuth();
    };
  });

  authSection.querySelectorAll("[data-go]").forEach((btn) => {
    btn.onclick = () => {
      authScreen = btn.dataset.go;
      renderAuth();
    };
  });

  document.getElementById("loginBtn").onclick = async () => {
    const data = validateLoginForm();
    if (!data) return showToast("Lütfen zorunlu alanları doldurun.", true);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const body = await res.json();

    if (!res.ok) return showToast(body.message || "Giriş başarısız", true);

    token = body.token;
    currentUser = body.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(body.user));

    showToast(`Hoş geldin, ${body.user.name}`);
    render();
  };

  document.getElementById("registerBtn").onclick = async () => {
    const data = validateRegisterForm();
    if (!data) return showToast("Lütfen zorunlu alanları doldurun.", true);

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const body = await res.json();

    if (!res.ok) return showToast(body.message || "Kayıt başarısız", true);

    showToast("Kayıt tamamlandı. Şimdi giriş yapabilirsiniz.");
    authScreen = "login";
    renderAuth();
  };
}

async function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

function setupSearchSuggestions(rows) {
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestionsBox");

  if (!searchInput || !suggestionsBox) return;

  function showSuggestions(value) {
    const keyword = value.toLowerCase().trim();

    if (!keyword) {
      suggestionsBox.classList.add("hidden");
      suggestionsBox.innerHTML = "";
      return;
    }

    const suggestions = [];

    rows.forEach((item) => {
      if (item.serviceName && item.serviceName.toLowerCase().includes(keyword)) {
        suggestions.push(item.serviceName);
      }

      if (item.employeeName && item.employeeName.toLowerCase().includes(keyword)) {
        suggestions.push(item.employeeName);
      }

      if (item.note && item.note.toLowerCase().includes(keyword)) {
        suggestions.push(item.note);
      }

      if (item.status && statusLabel(item.status).toLowerCase().includes(keyword)) {
        suggestions.push(statusLabel(item.status));
      }
    });

    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 6);

    if (!uniqueSuggestions.length) {
      suggestionsBox.innerHTML = `<div class="suggestion-empty">Sonuç bulunamadı</div>`;
      suggestionsBox.classList.remove("hidden");
      return;
    }

    suggestionsBox.innerHTML = uniqueSuggestions
      .map((text) => `<button type="button" class="suggestion-item">${escapeHtml(text)}</button>`)
      .join("");

    suggestionsBox.classList.remove("hidden");

    suggestionsBox.querySelectorAll(".suggestion-item").forEach((btn) => {
      btn.onclick = () => {
        searchInput.value = btn.textContent;
        suggestionsBox.classList.add("hidden");
        renderAppointments(btn.textContent.trim());
      };
    });
  }

  searchInput.addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      suggestionsBox.classList.add("hidden");
      renderAppointments(e.target.value.trim());
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      suggestionsBox.classList.add("hidden");
    }
  });
}

async function renderAppointments(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await authFetch(`${API_BASE}/appointments${query}`);
  const rows = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      token = null;
      currentUser = null;

      render();
      return;
    }

    info.textContent = rows.message || "Randevular alınamadı";
    return;
  }

  appSection.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2>Randevularım</h2>

        <p class="user-info">
          Giriş yapan kullanıcı:
          <strong>${escapeHtml(currentUser?.name || "Kullanıcı")}</strong>
          - ${escapeHtml(currentUser?.email || "")}
        </p>
      </div>

      <button type="button" id="logoutBtn" class="btn btn--ghost btn--sm">Çıkış Yap</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span>Toplam</span>
        <strong>${rows.length}</strong>
      </div>

      <div class="stat-card">
        <span>Planlanan</span>
        <strong>${rows.filter((r) => r.status === "planned").length}</strong>
      </div>

      <div class="stat-card">
        <span>Tamamlanan</span>
        <strong>${rows.filter((r) => r.status === "completed").length}</strong>
      </div>

      <div class="stat-card">
        <span>İptal</span>
        <strong>${rows.filter((r) => r.status === "cancelled").length}</strong>
      </div>
    </div>

    <div class="form-block" id="appointmentForm">
      <h3>Yeni randevu</h3>

      <div class="form-row">
        ${selectFieldHtml("serviceName", "Hizmet", SERVICES, "Hizmet seçin")}
        ${selectFieldHtml("employeeName", "Uzman", EMPLOYEES, "Uzman seçin")}

        <div class="field">
          <label for="appointmentDate">Tarih & saat <span class="required">*</span></label>
          <input id="appointmentDate" type="datetime-local" />
          <span class="field-error hidden" role="alert"></span>
        </div>

        <div class="field">
          <label for="note">Not</label>
          <input id="note" placeholder="Ek notlarınız" />
          <span class="field-error hidden" role="alert"></span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" id="createBtn" class="btn btn--primary">Randevu Ekle</button>
      </div>
    </div>

    <div class="search-wrapper">
      <div class="search-bar">
        <input
          id="searchInput"
          type="search"
          placeholder="Örn: Saç Kesimi, Zeynep veya kısa kesim"
          value="${escapeHtml(search)}"
          autocomplete="off"
        />
        <button type="button" id="searchBtn" class="btn btn--ghost">Ara</button>
      </div>

      <div id="suggestionsBox" class="suggestions hidden"></div>
    </div>

    <div id="list" class="appointment-list"></div>
  `;

  const formScope = document.getElementById("appointmentForm");

  document.getElementById("createBtn").onclick = async () => {
    const payload = validateAppointmentForm(formScope);
    if (!payload) return showToast("Zorunlu alanları doldurun.", true);

    const createRes = await authFetch(`${API_BASE}/appointments`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!createRes.ok) {
      const data = await createRes.json();
      return showToast(data.message || "Randevu eklenemedi", true);
    }

    showToast("Randevu eklendi");
    renderAppointments();
  };

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    token = null;
    currentUser = null;

    showToast("Çıkış yapıldı");
    render();
  };

  document.getElementById("searchBtn").onclick = () => {
    renderAppointments(document.getElementById("searchInput").value.trim());
  };

  setupSearchSuggestions(rows);

  const list = document.getElementById("list");

  if (!rows.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">♡</div>
        <p>Henüz randevu yok veya arama sonucunda kayıt bulunamadı.</p>
      </div>
    `;
    return;
  }

  rows.forEach((item) => {
    const card = document.createElement("article");
    card.className = "appointment-card";

    const dateStr = new Date(item.appointmentDate).toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const statusClass = `badge badge--${item.status || "planned"}`;

    card.innerHTML = `
      <div>
        <h4 class="appointment-card__title">${escapeHtml(item.serviceName)}</h4>
        <p class="appointment-card__meta">Uzman: ${escapeHtml(item.employeeName)}</p>
        <p class="appointment-card__meta">${escapeHtml(dateStr)}</p>
        <p class="appointment-card__meta">Not: ${escapeHtml(item.note || "—")}</p>
      </div>

      <div class="appointment-card__actions">
        <span class="${statusClass}">${escapeHtml(statusLabel(item.status))}</span>

        <div class="card-btns">
          <button type="button" data-action="edit" class="btn btn--ghost btn--sm">Düzenle</button>
          <button type="button" data-action="delete" class="btn btn--danger btn--sm">Sil</button>
        </div>
      </div>
    `;

    card.querySelector('[data-action="edit"]').onclick = () => openEditModal(item);

    card.querySelector('[data-action="delete"]').onclick = async () => {
      if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;

      const del = await authFetch(`${API_BASE}/appointments/${item.id}`, {
        method: "DELETE"
      });

      if (!del.ok) return showToast("Silinemedi", true);

      showToast("Randevu silindi");
      renderAppointments(search);
    };

    list.appendChild(card);
  });
}

function render() {
  renderAuth();

  if (token) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    info.textContent = "";
    renderAppointments();
  } else {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    info.textContent = "";
  }
}

document.getElementById("editCancelBtn").onclick = closeEditModal;
document.getElementById("editModalBackdrop").onclick = closeEditModal;

document.getElementById("editSaveBtn").onclick = async () => {
  if (!editingAppointmentId) return;

  const editForm = document.getElementById("editForm");

  const payload = validateAppointmentFields(editForm, {
    service: "editServiceName",
    employee: "editEmployeeName",
    date: "editAppointmentDate",
    note: "editNote",
    status: "editStatus"
  });

  if (!payload) return showToast("Zorunlu alanları doldurun.", true);

  const res = await authFetch(`${API_BASE}/appointments/${editingAppointmentId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json();
    return showToast(data.message || "Güncellenemedi", true);
  }

  showToast("Randevu güncellendi");
  closeEditModal();

  const searchVal = document.getElementById("searchInput")?.value.trim() || "";
  renderAppointments(searchVal);
};

render();