// Taupada Akademia — panel page logic
// Migrated from the Wix HTML block to GitHub Pages.

const SETTINGS_KEY = "astea-01-settings";
const DEFAULT_LIGHT_PANEL_CONFIG = {
  totalTime: 150,
  requiredCorrect: 16,
  allowRetry: true,
  shuffleQuestions: false
};

let toastTimer = null;

const elements = {
  toast: document.getElementById("toast"),
  openSettings: document.getElementById("open-settings"),
  openHelp: document.getElementById("open-help"),
  settingsModal: document.getElementById("settings-modal"),
  helpModal: document.getElementById("help-modal"),
  modalCloseButtons: document.querySelectorAll("[data-close-modal]"),
  settingTotalTime: document.getElementById("setting-total-time"),
  settingRequiredCorrect: document.getElementById("setting-required-correct"),
  settingAllowRetry: document.getElementById("setting-allow-retry"),
  settingShuffle: document.getElementById("setting-shuffle"),
  saveSettings: document.getElementById("save-settings"),
  restoreSettings: document.getElementById("restore-settings")
};

function clampNumber(value, min, max, fallback) { 
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return fallback;
  return Math.min(Math.max(numberValue, min), max);
}

function getSavedSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return { ...DEFAULT_LIGHT_PANEL_CONFIG };

  try {
    return { ...DEFAULT_LIGHT_PANEL_CONFIG, ...JSON.parse(saved) };
  } catch (error) {
    console.warn("Panelaren ezarpenak ezin igo.", error);
    return { ...DEFAULT_LIGHT_PANEL_CONFIG };
  }
}

function normalizeSettings(settings) {
  return {
    totalTime: clampNumber(settings.totalTime, 60, 300, DEFAULT_LIGHT_PANEL_CONFIG.totalTime),
    requiredCorrect: clampNumber(settings.requiredCorrect, 8, 20, DEFAULT_LIGHT_PANEL_CONFIG.requiredCorrect),
    allowRetry: Boolean(settings.allowRetry),
    shuffleQuestions: Boolean(settings.shuffleQuestions)
  };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
}

function updateSettingsForm(settings = getSavedSettings()) {
  const normalized = normalizeSettings(settings);
  elements.settingTotalTime.value = String(normalized.totalTime);
  elements.settingRequiredCorrect.value = String(normalized.requiredCorrect);
  elements.settingAllowRetry.checked = normalized.allowRetry;
  elements.settingShuffle.checked = normalized.shuffleQuestions;
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("show");
}

function closeModals() {
  elements.settingsModal.classList.remove("show");
  elements.helpModal.classList.remove("show");
}

function saveSettingsFromForm() {
  saveSettings({
    totalTime: elements.settingTotalTime.value,
    requiredCorrect: elements.settingRequiredCorrect.value,
    allowRetry: elements.settingAllowRetry.checked,
    shuffleQuestions: elements.settingShuffle.checked
  });
  closeModals();
}

function restoreDefaultSettings() {
  saveSettings(DEFAULT_LIGHT_PANEL_CONFIG);
  updateSettingsForm(DEFAULT_LIGHT_PANEL_CONFIG);
}

function showLockedMessage() {
  if (!elements.toast) return;

  elements.toast.classList.add("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(function() {
    elements.toast.classList.remove("show");
  }, 3200);
}

function bindEvents() {
  elements.openSettings.addEventListener("click", () => openModal(elements.settingsModal));
  elements.openHelp.addEventListener("click", () => openModal(elements.helpModal));
  elements.saveSettings.addEventListener("click", saveSettingsFromForm);
  elements.restoreSettings.addEventListener("click", restoreDefaultSettings);

  elements.modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  [elements.settingsModal, elements.helpModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModals();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModals();
  });
}

function initPanelControls() {
  updateSettingsForm();
  bindEvents();
}

initPanelControls();
