const els = {
  searchInput: document.querySelector("#searchInput"),
  clearBtn: document.querySelector("#clearBtn"),
  resetFiltersBtn: document.querySelector("#resetFiltersBtn"),
  departmentSelect: document.querySelector("#departmentSelect"),
  provinceSelect: document.querySelector("#provinceSelect"),
  districtSelect: document.querySelector("#districtSelect"),
  resultCount: document.querySelector("#resultCount"),
  resultText: document.querySelector("#resultText"),
  currentScope: document.querySelector("#currentScope"),
  limitNote: document.querySelector("#limitNote"),
  results: document.querySelector("#results"),
  baseTotal: document.querySelector("#baseTotal"),
  detailEmpty: document.querySelector("#detailEmpty"),
  detailContent: document.querySelector("#detailContent"),
  detailTitle: document.querySelector("#detailTitle"),
  detailDepartment: document.querySelector("#detailDepartment"),
  detailProvince: document.querySelector("#detailProvince"),
  detailDistrict: document.querySelector("#detailDistrict"),
  detailUbigeo: document.querySelector("#detailUbigeo"),
  detailCode: document.querySelector("#detailCode"),
  copyBtn: document.querySelector("#copyBtn"),
  copyCodeBtn: document.querySelector("#copyCodeBtn"),
  toast: document.querySelector("#toast")
};

const state = {
  data: [],
  selected: null,
  department: "",
  province: "",
  district: "",
  query: ""
};

const normalize = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const unique = (arr) => [...new Set(arr.filter(Boolean))];

function label(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/(^|\s|\(|-|\/)[a-záéíóúñ]/g, s => s.toUpperCase());
}

function buildSearchText(item) {
  return normalize([
    item.ubigeo,
    item.custom_code,
    item.departamento,
    item.provincia,
    item.distrito
  ].join(" "));
}

async function init() {
  const res = await fetch("data/districts.json");
  state.data = await res.json();
  state.data = state.data.map(item => ({
    ...item,
    departamento_label: label(item.departamento),
    provincia_label: label(item.provincia),
    distrito_label: label(item.distrito),
    search: buildSearchText(item)
  }));

  els.baseTotal.textContent = state.data.length.toLocaleString("es-PE");
  fillDepartments();
  bindExamples();
  update();
}

function fillSelect(select, values, placeholder) {
  select.innerHTML = "";

  const option = document.createElement("option");
  option.value = "";
  option.textContent = placeholder;
  select.appendChild(option);

  values.forEach(value => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label(value);
    select.appendChild(opt);
  });
}

function fillDepartments() {
  const departments = unique(state.data.map(d => d.departamento))
    .sort((a, b) => label(a).localeCompare(label(b), "es"));
  fillSelect(els.departmentSelect, departments, "Todos los departamentos");
}

function fillProvinces() {
  const rows = state.department
    ? state.data.filter(d => d.departamento === state.department)
    : state.data;

  const provinces = unique(rows.map(d => d.provincia))
    .sort((a, b) => label(a).localeCompare(label(b), "es"));

  fillSelect(els.provinceSelect, provinces, "Todas las provincias");
  els.provinceSelect.value = state.province;
}

function fillDistricts() {
  const rows = state.data.filter(d => {
    const dep = !state.department || d.departamento === state.department;
    const prov = !state.province || d.provincia === state.province;
    return dep && prov;
  });

  const districts = unique(rows.map(d => d.distrito))
    .sort((a, b) => label(a).localeCompare(label(b), "es"));

  fillSelect(els.districtSelect, districts, "Todos los distritos");
  els.districtSelect.value = state.district;
}

function getFiltered() {
  const q = normalize(state.query);

  return state.data.filter(item => {
    const byQuery = !q || item.search.includes(q);
    const byDepartment = !state.department || item.departamento === state.department;
    const byProvince = !state.province || item.provincia === state.province;
    const byDistrict = !state.district || item.distrito === state.district;

    return byQuery && byDepartment && byProvince && byDistrict;
  });
}

function updateScope() {
  const parts = [];
  if (state.department) parts.push(label(state.department));
  if (state.province) parts.push(label(state.province));
  if (state.district) parts.push(label(state.district));
  els.currentScope.textContent = parts.length ? parts.join(" / ") : "Todo el Perú";
}

function renderResults(rows) {
  els.resultCount.textContent = rows.length.toLocaleString("es-PE");
  els.resultText.textContent = rows.length === 1 ? "distrito encontrado" : "distritos encontrados";
  els.limitNote.textContent = rows.length > 300 ? "Mostrando 300 primeros" : "";

  els.results.innerHTML = "";

  if (!rows.length) {
    els.results.innerHTML = `<div class="empty">No se encontraron distritos con esos filtros.</div>`;
    return;
  }

  rows.slice(0, 300).forEach(item => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "result";
    if (state.selected?.ubigeo === item.ubigeo) el.classList.add("is-selected");

    el.innerHTML = `
      <div>
        <div class="result-title">${item.distrito_label}</div>
        <div class="result-place">${item.provincia_label} · ${item.departamento_label}</div>
      </div>
      <div class="result-footer">
        <span class="ubigeo-badge">${item.ubigeo}</span>
        <span class="badge">${item.custom_code || "Sin código"}</span>
      </div>
    `;

    el.addEventListener("click", () => selectDistrict(item));
    els.results.appendChild(el);
  });
}

function selectDistrict(item) {
  state.selected = item;

  els.detailEmpty.hidden = true;
  els.detailEmpty.setAttribute("aria-hidden", "true");
  els.detailContent.hidden = false;
  els.detailContent.removeAttribute("aria-hidden");

  els.detailTitle.textContent = item.distrito_label;
  els.detailDepartment.textContent = item.departamento_label;
  els.detailProvince.textContent = item.provincia_label;
  els.detailDistrict.textContent = item.distrito_label;
  els.detailUbigeo.textContent = item.ubigeo;
  els.detailCode.textContent = item.custom_code || "—";
  els.copyBtn.disabled = false;
  els.copyCodeBtn.disabled = !item.custom_code;

  renderResults(getFiltered());

  if (window.innerWidth < 880) {
    document.querySelector("#detailCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function update() {
  fillProvinces();
  fillDistricts();
  updateScope();
  renderResults(getFiltered());
}

function clearAll() {
  state.query = "";
  state.department = "";
  state.province = "";
  state.district = "";
  state.selected = null;

  els.searchInput.value = "";
  els.departmentSelect.value = "";

  fillDepartments();
  update();

  els.detailEmpty.hidden = false;
  els.detailEmpty.removeAttribute("aria-hidden");
  els.detailContent.hidden = true;
  els.detailContent.setAttribute("aria-hidden", "true");
  els.copyBtn.disabled = true;
  els.copyCodeBtn.disabled = true;
}

function clearFiltersOnly() {
  state.department = "";
  state.province = "";
  state.district = "";
  els.departmentSelect.value = "";
  update();
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 1500);
}

async function copyText(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(success);
  } catch {
    showToast("No se pudo copiar");
  }
}

function bindExamples() {
  document.querySelectorAll("[data-example]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.query = btn.dataset.example;
      els.searchInput.value = state.query;
      renderResults(getFiltered());
      els.searchInput.focus();
    });
  });
}

els.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderResults(getFiltered());
  updateScope();
});

els.clearBtn.addEventListener("click", clearAll);
els.resetFiltersBtn.addEventListener("click", clearFiltersOnly);

els.departmentSelect.addEventListener("change", event => {
  state.department = event.target.value;
  state.province = "";
  state.district = "";
  update();
});

els.provinceSelect.addEventListener("change", event => {
  state.province = event.target.value;
  state.district = "";
  update();
});

els.districtSelect.addEventListener("change", event => {
  state.district = event.target.value;
  update();

  const match = getFiltered()[0];
  if (match && state.district) selectDistrict(match);
});

els.copyBtn.addEventListener("click", () => {
  if (!state.selected) return;
  copyText(state.selected.ubigeo, `UBIGEO ${state.selected.ubigeo} copiado`);
});

els.copyCodeBtn.addEventListener("click", () => {
  if (!state.selected?.custom_code) return;
  copyText(state.selected.custom_code, "Código copiado");
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    els.searchInput.focus();
    els.searchInput.select();
  }

  if (event.key === "Escape") {
    els.searchInput.blur();
  }
});

init();
