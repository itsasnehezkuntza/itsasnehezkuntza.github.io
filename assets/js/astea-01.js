const STORAGE_KEY = "astea-01-progress";
const LIGHT_PANEL_CONFIG = {
  totalTime: 150,
  requiredCorrect: 16,
  allowRetry: true,
  shuffleQuestions: false
};

const LIGHT_PANEL_QUESTIONS = [
  { expression: "-7 + 12", answer: 5 },
  { expression: "8 - 15", answer: -7 },
  { expression: "-6 - 9", answer: -15 },
  { expression: "-4 + 4", answer: 0 },
  { expression: "-3 · 5", answer: -15 },
  { expression: "-4 · (-6)", answer: 24 },
  { expression: "18 : (-3)", answer: -6 },
  { expression: "-24 : (-6)", answer: 4 },
  { expression: "5 - (8 - 12)", answer: 9 },
  { expression: "-3 + (7 - 10)", answer: -6 },
  { expression: "2 · (4 - 9)", answer: -10 },
  { expression: "-5 · (3 - 7)", answer: 20 },
  { expression: "6 + 2 · 5", answer: 16 },
  { expression: "18 - 12 : 3", answer: 14 },
  { expression: "-4 + 3 · (-2)", answer: -10 },
  { expression: "20 : (-5) + 7", answer: 3 },
  { expression: "-6 + 2 · (5 - 8)", answer: -12 },
  { expression: "14 - 3 · (2 - 7)", answer: 29 },
  { expression: "-2 · (-3 + 8)", answer: -10 },
  { expression: "30 : (-5) + (-2) · (-4)", answer: 2 }
];

const state = {
  progress: {
    connected: false,
    roomExplored: false,
    firstCode: false,
    lightsSynced: false,
    finalCode: false
  },
  currentLightIndex: 0,
  correctLights: 0,
  timeLeft: LIGHT_PANEL_CONFIG.totalTime,
  timerId: null,
  lightQuestions: [...LIGHT_PANEL_QUESTIONS]
};

const elements = {
  connectCard: document.getElementById("connect-card"),
  enterRoomButton: document.getElementById("enter-room"),
  roomSceneCard: document.getElementById("room-scene-card"),
  inspectRoomButton: document.getElementById("inspect-room"),
  inspectionCard: document.getElementById("inspection-card"),
  inspectionComplete: document.getElementById("inspection-complete"),
  openWorksheetArea: document.getElementById("open-worksheet-area"),
  openWorksheetButton: document.getElementById("open-worksheet"),
  worksheetCard: document.getElementById("worksheet-card"),
  firstCodeInput: document.getElementById("first-code-input"),
  submitFirstCode: document.getElementById("submit-first-code"),
  firstCodeMessage: document.getElementById("first-code-message"),
  lightPanelCard: document.getElementById("light-panel-card"),
  startLightPanel: document.getElementById("start-light-panel"),
  lightQuestion: document.getElementById("light-question"),
  lightAnswer: document.getElementById("light-answer"),
  submitLightAnswer: document.getElementById("submit-light-answer"),
  lightGrid: document.getElementById("light-grid"),
  lightCorrectCount: document.getElementById("light-correct-count"),
  lightTime: document.getElementById("light-time"),
  lightFeedback: document.getElementById("light-feedback"),
  lightResult: document.getElementById("light-result"),
  lightNextArea: document.getElementById("light-next-area"),
  retryLightButton: document.getElementById("retry-light-button"),
  lastCodeButton: document.getElementById("last-code-button"),
  finalCodeCard: document.getElementById("final-code-card"),
  finalCodeInput: document.getElementById("final-code-input"),
  submitFinalCode: document.getElementById("submit-final-code"),
  finalCodeMessage: document.getElementById("final-code-message"),
  finalSummary: document.getElementById("final-summary"),
  inspectCards: document.querySelectorAll(".inspect-card"),
  statusItems: document.querySelectorAll(".status-item"),
  resetProgress: document.getElementById("reset-progress")
};

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state.progress, parsed);
    } catch (error) {
      console.warn("Astea 1eko aurrerapena ezin igo.", error);
    }
  }
}

function updateStatusPanel() {
  elements.statusItems.forEach((item) => {
    const statusKey = item.dataset.status;
    item.classList.toggle("completed", state.progress[statusKey]);
    item.classList.toggle("active", state.progress[statusKey] && !item.classList.contains("completed"));
  });
}

function setConnected() {
  state.progress.connected = true;
  saveProgress();
  updateStatusPanel();
}

function setRoomExplored() {
  state.progress.roomExplored = true;
  saveProgress();
  updateStatusPanel();
}

function setFirstCodeDone() {
  state.progress.firstCode = true;
  saveProgress();
  updateStatusPanel();
}

function setLightsSynced() {
  state.progress.lightsSynced = true;
  saveProgress();
  updateStatusPanel();
}

function setFinalCodeDone() {
  state.progress.finalCode = true;
  saveProgress();
  updateStatusPanel();
}

function resetProgress() {
  state.progress = {
    connected: false,
    roomExplored: false,
    firstCode: false,
    lightsSynced: false,
    finalCode: false
  };
  state.currentLightIndex = 0;
  state.correctLights = 0;
  state.timeLeft = LIGHT_PANEL_CONFIG.totalTime;
  state.lightQuestions = [...LIGHT_PANEL_QUESTIONS];
  elements.lightCorrectCount.textContent = "0";
  elements.lightTime.textContent = String(LIGHT_PANEL_CONFIG.totalTime);
  elements.lightFeedback.classList.add("hidden");
  elements.lightResult.classList.add("hidden");
  elements.lightNextArea.classList.add("hidden");
  elements.finalCodeCard.classList.add("hidden");
  elements.firstCodeMessage.classList.add("hidden");
  elements.finalCodeMessage.classList.add("hidden");
  elements.finalSummary.classList.add("hidden");
  elements.lightGrid.innerHTML = "";
  saveProgress();
  updateStatusPanel();
  showSection(elements.connectCard);
  hideSection(elements.roomSceneCard);
  hideSection(elements.inspectionCard);
  hideSection(elements.worksheetCard);
  hideSection(elements.lightPanelCard);
  hideSection(elements.finalCodeCard);
  elements.inspectCards.forEach((card) => card.classList.remove("open"));
}

function showSection(section) {
  section.classList.remove("hidden");
}

function hideSection(section) {
  section.classList.add("hidden");
}

function startRoomSequence() {
  setConnected();
  showSection(elements.roomSceneCard);
  hideSection(elements.connectCard);
}

function activateInspection() {
  setRoomExplored();
  showSection(elements.inspectionCard);
  elements.openWorksheetArea.classList.remove("hidden");
}

function openWorksheet() {
  showSection(elements.worksheetCard);
  hideSection(elements.inspectionCard);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function markInspectCard(card) {
  card.classList.add("open");
}

function initInspectionCards() {
  elements.inspectCards.forEach((card) => {
    card.addEventListener("click", () => {
      markInspectCard(card);
      const allOpen = [...elements.inspectCards].every((item) => item.classList.contains("open"));
      if (allOpen) {
        elements.inspectionComplete.classList.remove("hidden");
        elements.openWorksheetArea.classList.remove("hidden");
      }
    });
  });
}

function submitFirstCode() {
  const code = elements.firstCodeInput.value.trim().toUpperCase();
  const target = "TAU-384";
  elements.firstCodeMessage.classList.remove("hidden");
  elements.firstCodeMessage.classList.add("status-banner");

  if (code === target) {
    elements.firstCodeMessage.textContent = "Lehen taupada aktibatuta. Bozgorailuek seinale garbiagoa bidali dute. Entsegu-gelako lehen argiak piztu dira.";
    setFirstCodeDone();
    showSection(elements.lightPanelCard);
    hideSection(elements.worksheetCard);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    elements.firstCodeMessage.textContent = "Kodea ez da zuzena. Ez saiatu asmatzen. Begiratu berriro zeinuak, parentesiak eta azken zifrak.";
  }
}

function renderLightGrid() {
  elements.lightGrid.innerHTML = "";
  for (let index = 0; index < LIGHT_PANEL_CONFIG.totalTime / 7; index++) {
    const light = document.createElement("div");
    light.className = "light-item";
    light.textContent = index + 1;
    elements.lightGrid.appendChild(light);
  }
}

function showLightQuestion() {
  const question = state.lightQuestions[state.currentLightIndex];
  if (!question) return;
  elements.lightQuestion.textContent = `Seinalea ${state.currentLightIndex + 1}: ${question.expression}`;
}

function updateLightCounters() {
  elements.lightCorrectCount.textContent = String(state.correctLights);
  elements.lightTime.textContent = String(state.timeLeft);
}

function evaluateLightAnswer() {
  const answerValue = elements.lightAnswer.value.trim();
  if (answerValue === "") return;
  const question = state.lightQuestions[state.currentLightIndex];
  const provided = Number(answerValue);
  const gridItems = elements.lightGrid.querySelectorAll(".light-item");
  const currentLight = gridItems[state.currentLightIndex];

  if (Number.isNaN(provided)) {
    elements.lightFeedback.textContent = "Sarrera baliogabea da. Zenbaki zuzen bat sartu, negatiboak baimenarekin.";
    elements.lightFeedback.classList.remove("hidden");
    return;
  }

  if (provided === question.answer) {
    state.correctLights += 1;
    elements.lightFeedback.textContent = "Argia egonkortuta.";
    currentLight.classList.add("correct");
  } else {
    elements.lightFeedback.textContent = "Argia ez da egonkortu. Jarraitu: hurrengo seinalea dator.";
    currentLight.classList.add("incorrect");
  }

  elements.lightFeedback.classList.remove("hidden");
  state.currentLightIndex += 1;
  elements.lightAnswer.value = "";
  updateLightCounters();

  if (state.currentLightIndex >= state.lightQuestions.length) {
    endLightPanel();
    return;
  }

  showLightQuestion();
}

function startTimer() {
  if (state.timerId) return;
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateLightCounters();
    if (state.timeLeft <= 0) {
      endLightPanel();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function endLightPanel() {
  stopTimer();
  elements.lightResult.classList.remove("hidden");
  const passed = state.correctLights >= LIGHT_PANEL_CONFIG.requiredCorrect;
  if (passed) {
    setLightsSynced();
    elements.lightResult.textContent = "Argi-panela sinkronizatuta. Entsegu-gelako eszena piztu da. Ispilu digitalean lehen koreografia-zatiaren silueta agertu da. Azken sarbidea aktibatu da.";
    elements.lightNextArea.classList.remove("hidden");
    elements.retryLightButton.classList.add("hidden");
    elements.submitFinalCode.disabled = false;
  } else {
    elements.lightResult.textContent = "Argi-panela ez da guztiz sinkronizatu. Ez da amaiera. Entsegu bat da. Begiratu berriro zeinuak eta eragiketen ordena, eta saiatu berriro.";
    elements.lightNextArea.classList.remove("hidden");
    elements.retryLightButton.classList.remove("hidden");
  }
  elements.submitLightAnswer.disabled = true;
  elements.lightAnswer.disabled = true;
  elements.startLightPanel.disabled = false;
}

function initializeLightPanel() {
  state.currentLightIndex = 0;
  state.correctLights = 0;
  state.timeLeft = LIGHT_PANEL_CONFIG.totalTime;
  elements.lightAnswer.value = "";
  elements.lightFeedback.classList.add("hidden");
  elements.lightResult.classList.add("hidden");
  elements.lightNextArea.classList.add("hidden");
  elements.lightCorrectCount.textContent = "0";
  elements.lightTime.textContent = String(LIGHT_PANEL_CONFIG.totalTime);
  renderLightGrid();
  showLightQuestion();
  updateLightCounters();
  elements.submitLightAnswer.disabled = false;
  elements.lightAnswer.disabled = false;
}

function openLastCode() {
  showSection(elements.finalCodeCard);
  hideSection(elements.lightPanelCard);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function submitFinalCode() {
  const code = elements.finalCodeInput.value.trim().toUpperCase();
  const target = "KOREO-1257";
  elements.finalCodeMessage.classList.remove("hidden");
  elements.finalCodeMessage.classList.add("status-banner");

  if (code === target) {
    setFinalCodeDone();
    elements.finalCodeMessage.textContent = "Koreografiaren lehen zatia berreskuratu da. 1. ZATIA: \"Oinarria ez da ikusten, baina dena eusten du.\" Pasaporterako froga: TAUPADA-01-BERRESKURATUTA";
    elements.finalSummary.classList.remove("hidden");
    elements.finalSummary.textContent = "Lehen gela gainditu duzu. Baina koreografia ez dago osorik. Erritmoa zatituta dago oraindik. Hurrengoan, zatitzaileak, multiploak eta erritmo ezkutuko patroiek erabakiko dute atea irekitzen den ala ez.";
    elements.submitFinalCode.disabled = true;
  } else {
    elements.finalCodeMessage.textContent = "Azken kodea ez da zuzena. DBH 4rako atean dago giltza. Ez hartu emaitzak bakarrik: begiratu nola eraiki behar den kodea.";
  }
}

function bindEvents() {
  elements.enterRoomButton.addEventListener("click", startRoomSequence);
  elements.inspectRoomButton.addEventListener("click", activateInspection);
  elements.openWorksheetButton.addEventListener("click", openWorksheet);
  elements.submitFirstCode.addEventListener("click", submitFirstCode);
  elements.startLightPanel.addEventListener("click", () => {
    initializeLightPanel();
    startTimer();
    elements.startLightPanel.disabled = true;
  });
  elements.submitLightAnswer.addEventListener("click", evaluateLightAnswer);
  elements.lightAnswer.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      evaluateLightAnswer();
    }
  });
  elements.retryLightButton.addEventListener("click", () => {
    initializeLightPanel();
    startTimer();
    elements.retryLightButton.classList.add("hidden");
    elements.startLightPanel.disabled = true;
  });
  elements.lastCodeButton.addEventListener("click", openLastCode);
  elements.submitFinalCode.addEventListener("click", submitFinalCode);
  elements.resetProgress.addEventListener("click", resetProgress);
}

function initFromProgress() {
  loadProgress();
  updateStatusPanel();
  if (state.progress.connected) {
    showSection(elements.roomSceneCard);
    hideSection(elements.connectCard);
  }
  if (state.progress.roomExplored) {
    showSection(elements.inspectionCard);
    elements.openWorksheetArea.classList.remove("hidden");
  }
  if (state.progress.firstCode) {
    showSection(elements.lightPanelCard);
    hideSection(elements.worksheetCard);
  }
  if (state.progress.lightsSynced) {
    showSection(elements.finalCodeCard);
    hideSection(elements.lightPanelCard);
  }
  if (!state.progress.connected) {
    hideSection(elements.roomSceneCard);
    hideSection(elements.inspectionCard);
    hideSection(elements.worksheetCard);
    hideSection(elements.lightPanelCard);
    hideSection(elements.finalCodeCard);
  }
}

initInspectionCards();
bindEvents();
initFromProgress();
