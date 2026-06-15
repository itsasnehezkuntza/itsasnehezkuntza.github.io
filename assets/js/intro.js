// --- CONSTANTES ---
const SCHOOL_IMAGE = "../img/backgrounds/1_IkastetxearenSarrera.png";
const DESK_IMAGE = "../img/backgrounds/2_LogelaOrdenagailua.png";
const ACCEPT_URL = "./pages/panel.html";

const typeIntervals = {};

const AUTO_TO_DESK_MS = 15500;


document.documentElement.style.setProperty("--school-url", `url("${SCHOOL_IMAGE}")`);
document.documentElement.style.setProperty("--desk-url", `url("${DESK_IMAGE}")`);

let introTimer = null;
window.addEventListener("load", function () { applyAvatarImages(); startAutoIntro() });
function startAutoIntro() {
  clearTimers(); resetTypedText("schoolTypedText");
  const storyCard = document.getElementById("storyCard");
  const autoProgress = document.getElementById("autoProgress");
  if (storyCard) storyCard.classList.remove("revealed");
  if (autoProgress) autoProgress.classList.remove("revealed");
  setTimeout(function () {
    typeText("schoolTypedText", 50, function () {
      if (storyCard) storyCard.classList.add("revealed");
      setTimeout(function () { if (autoProgress) autoProgress.classList.add("revealed") }, 900)
    })
  }, 5800);
  introTimer = setTimeout(function () { goToDesk() }, AUTO_TO_DESK_MS)
}
function clearTimers() {
  if (introTimer) {
    clearTimeout(introTimer);
    introTimer = null
  }
}
function goToDesk() {
  clearTimers(); const blackout = document.getElementById("blackout");
  const emailAlert = document.getElementById("emailAlert");
  if (emailAlert) emailAlert.classList.remove("ready");
  resetTypedText("deskTypedText");
  blackout.classList.add("show"); setTimeout(function () {
    document.getElementById("schoolScene").classList.remove("active");
    document.getElementById("deskScene").classList.add("active")
  }, 700);
  setTimeout(function () { blackout.classList.remove("show") }, 1250);
  setTimeout(function () {
    typeText("deskTypedText", 50, function () {
      setTimeout(function () { if (emailAlert) emailAlert.classList.add("ready") }, 900)
    })
  }, 3200)
}
function openComputer() {
  const computerWindow = document.getElementById("computerWindow");
  const emailAlert = document.getElementById("emailAlert");
  if (emailAlert) emailAlert.classList.remove("ready");
  if (computerWindow) computerWindow.classList.add("show")
} 

function openEmail() {
  const inboxView = document.getElementById("inboxView");
  const emailDraftView = document.getElementById("emailDraftView");
  const itzalaChatView = document.getElementById("itzalaChatView");
  const chatMessages = document.getElementById("chatMessages");
  const chatActions = document.getElementById("chatActions");
  const typedEmail = document.getElementById("academyEmailTyped");
  if (inboxView) inboxView.style.display = "none";
  if (itzalaChatView) itzalaChatView.classList.remove("show");
  if (chatMessages) chatMessages.innerHTML = "";
  if (chatActions) chatActions.classList.remove("show");
  if (emailDraftView) {
    emailDraftView.style.display = "block"; emailDraftView.classList.add("show");
    emailDraftView.classList.remove("corrupting")
  } if (typedEmail) {
    typedEmail.textContent = "";
    typedEmail.classList.remove("interrupted")
  } typeEmailUntilError("academyEmailTyped", 200, 0.95, function () { triggerErrorAndChat() })
}
function triggerErrorAndChat() {
  const emailDraftView = document.getElementById("emailDraftView");
  const errorGlitch = document.getElementById("errorGlitch");
  const itzalaChatView = document.getElementById("itzalaChatView");
  if (emailDraftView) { emailDraftView.classList.add("corrupting") } setTimeout(function () { if (errorGlitch) errorGlitch.classList.add("show") }, 250);
  setTimeout(function () {
    if (emailDraftView) {
      emailDraftView.classList.remove("show"); emailDraftView.classList.remove("corrupting");
      emailDraftView.style.display = "none"
    } if (errorGlitch) errorGlitch.classList.remove("show"); if (itzalaChatView) { itzalaChatView.classList.add("show"); startItzalaChat() }
  }, 1900)
}

function startItzalaChat() {
  const messages = [
    { speaker: "itzala", type: "danger", label: "ITZALA", text: "JA JA JA...\nBerandu zabiltza...\nNire tranpan guztiz erori zara!" },
    { speaker: "alumna", type: "", label: "NI", text: "Zer? Zer gertatu da?\nNor zara zu?" },
    { speaker: "itzala", type: "danger", label: "ITZALA", text: "Itzala naiz.\nBaina horrek ez du garrantzirik." },
    { speaker: "alumna", type: "", label: "NI", text: "Zer nahi duzu nigandik?" },
    { speaker: "itzala", type: "danger", label: "ITZALA", text: "Zuregandik?\nZurengandik, EZER EZ." },
    { speaker: "itzala", type: "danger", label: "ITZALA", text: "Zure sarbidea nahi nuen.\nEta orain... blokeatuta dago." },
    { speaker: "alumna", type: "", label: "NI", text: "Nola? Blokeatuta? Hori ezin da izan!\nNola ireki dezaket?" },
    { speaker: "itzala", type: "", label: "ITZALA", text: "Ez da hain erraza izango.\nAkademiak ez du edonor onartzen. Zure balioa frogatu beharko duzu." },
    { speaker: "alumna", type: "", label: "NI", text: "Zer frogatu behar dut?" },
    { speaker: "itzala", type: "", label: "ITZALA", text: "Erritmoa kontrolatzen duzula.\nBurua hotz mantentzen duzula.\nEta presiopean ez zarela apurtzen." },
    { speaker: "alumna", type: "", label: "NI", text: "Eta hori lortzen badut?" },
    { speaker: "itzala", type: "", label: "ITZALA", text: "Orduan, agian...\nlehen atea irekiko da." },
    { speaker: "itzala", type: "final", label: "ITZALA", text: "Orain ez dago atzera egiterik.\nSartuko zara... ala itzalaren aurrean kikilduko zara?" }
  ];
  const chatMessages = document.getElementById("chatMessages");
  const chatActions = document.getElementById("chatActions");
  if (!chatMessages) return; chatMessages.innerHTML = "";
  if (chatActions) chatActions.classList.remove("show");
  let index = 0;
  function nextMessage() {
    if (index >= messages.length) { if (chatActions) chatActions.classList.add("show"); return } const item = messages[index];
    const row = createChatRow(item);
    chatMessages.appendChild(row);
    const bubble = row.querySelector(".chat-bubble");
    typeIntoBubble(bubble, item.text, 80, function () {
      bubble.classList.remove("typing");
      chatMessages.scrollTop = chatMessages.scrollHeight;
      index++;
      setTimeout(nextMessage, 550)
    });
    chatMessages.scrollTop = chatMessages.scrollHeight
  } nextMessage()
}
function createChatRow(item) {
  const row = document.createElement("div"); row.className = "chat-row " + item.speaker; const avatar = document.createElement("div"); avatar.className = "profile-avatar " + (item.speaker === "alumna" ? "alumna-avatar" : "itzala-avatar");
  const avatarSpan = document.createElement("span");
  avatarSpan.textContent = item.speaker === "alumna" ? "H08" : "I8";
  avatar.appendChild(avatarSpan); if (item.speaker === "alumna" && cssAvatarIsSet("--alumna-avatar-url")) avatar.classList.add("has-image"); if (item.speaker === "itzala" && cssAvatarIsSet("--itzala-avatar-url")) avatar.classList.add("has-image"); const bubble = document.createElement("div");
  bubble.className = "chat-bubble typing"; if (item.type) bubble.classList.add(item.type); if (item.speaker === "alumna") bubble.classList.add("alumna"); bubble.dataset.label = item.label; row.appendChild(avatar); row.appendChild(bubble); return row
}
function cssAvatarIsSet(varName) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value && value !== "none" && !value.includes("PEGA_AQUI") && !value.includes('url("")') && !value.includes("url('')")
}
function applyAvatarImages() {
  const headerAvatar = document.getElementById("itzalaHeaderAvatar");
  const challengeAvatar = document.getElementById("challengeAvatar");

  if (headerAvatar && cssAvatarIsSet("--itzala-avatar-url")) {
    headerAvatar.classList.add("has-image");
  }

  if (challengeAvatar && cssAvatarIsSet("--itzala-avatar-url")) {
    challengeAvatar.classList.add("has-image");
  }

  if (cssAvatarIsSet("--academy-logo-url")) {
    document.querySelectorAll(".academy-logo-target").forEach(function (element) {
      element.classList.add("has-image");
    });
  }
}
function acceptChallenge() { window.open(ACCEPT_URL, '_self') }
function showRefuseScene() {
  const refuseScene = document.getElementById("refuseScene");
  const computerWindow = document.getElementById("computerWindow");
  const refuseActions = document.getElementById("refuseActions");
  const chatActions = document.getElementById("chatActions");

  if (chatActions) chatActions.classList.remove("show");
  if (computerWindow) computerWindow.classList.remove("show");
  if (refuseActions) refuseActions.classList.remove("show");

  resetTypedText("refuseTypedText");

  if (refuseScene) refuseScene.classList.add("show");

  setTimeout(function () {
    typeText("refuseTypedText", 38, function () {
      setTimeout(function () {
        if (refuseActions) refuseActions.classList.add("show")
      }, 650)
    })
  }, 650)
}
function returnToChat() {
  const refuseScene = document.getElementById("refuseScene");
  const computerWindow = document.getElementById("computerWindow");
  const chatActions = document.getElementById("chatActions");

  if (refuseScene) refuseScene.classList.remove("show");
  if (computerWindow) computerWindow.classList.add("show");
  if (chatActions) {
    setTimeout(function () {
      chatActions.classList.add("show")
    }, 350)
  }
}
function backToInbox() {
  const inboxView = document.getElementById("inboxView");
  const emailDraftView = document.getElementById("emailDraftView");
  const itzalaChatView = document.getElementById("itzalaChatView");
  const errorGlitch = document.getElementById("errorGlitch");
  const typedEmail = document.getElementById("academyEmailTyped");
  const chatMessages = document.getElementById("chatMessages");
  const chatActions = document.getElementById("chatActions");
  if (emailDraftView) {
    emailDraftView.classList.remove("show");
    emailDraftView.classList.remove("corrupting");
    emailDraftView.style.display = "none"
  } if (itzalaChatView) itzalaChatView.classList.remove("show");
  if (errorGlitch) errorGlitch.classList.remove("show");
  if (typedEmail) {
    typedEmail.textContent = "";
    typedEmail.classList.remove("interrupted")
  } if (chatMessages) chatMessages.innerHTML = "";
  if (chatActions) chatActions.classList.remove("show");
  if (inboxView) inboxView.style.display = "block"
}
function typeText(elementId, speed = 80, onDone = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  if (typeIntervals[elementId]) { clearInterval(typeIntervals[elementId]) }
  const text = element.getAttribute("data-text") || "";
  element.dataset.started = "true";
  element.textContent = ""; element.classList.remove("done");
  element.classList.add("typing");
  let index = 0;
  typeIntervals[elementId] = setInterval(function () {
    element.textContent += text.charAt(index);
    index++; if (index >= text.length) {
      clearInterval(typeIntervals[elementId]);
      delete typeIntervals[elementId];
      element.classList.remove("typing");
      element.classList.add("done");
      if (typeof onDone === "function") { setTimeout(onDone, 450) }
    }
  }, speed)
} function resetTypedText(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return; if (typeIntervals[elementId]) {
    clearInterval(typeIntervals[elementId]);
    delete typeIntervals[elementId]
  } element.dataset.started = "false";
  element.textContent = ""; element.classList.remove("typing");
  element.classList.remove("done")
}

const ACADEMY_EMAIL_PARTS = [
  {
    text: "Mezu hau irakurtzen ari bazara, ez da kasualitatea.\n",
    className: "email-script-line"
  },

  { text: "Zure profila ez da oharkabean pasa. " },
  { text: "Taupada Akademiaren hautaketa-batzordeak zure eskaera aztertu du eta... " },
  { strong: "lehen aukeraketa-faserako onartua izan zara!\n" },

  { text: "Hautagaien kopurua oso handia izan da, eta gutxi batzuk soilik pasatu dira hurrengo fasera. " },
  { text: "Hemendik aurrera, aukera berezi bat duzu: " },
  { strong: "Akademiako hautaketa-proban zure lekua defendatzea" },
  { text: ".\n" },

  { text: "Proba horretarako, Akademiak " },
  { strong: "koreografia ofiziala" },
  { text: " prestatu du zuretzat. Koreografia horrek zure erritmoa, zehaztasuna eta kontrola neurtuko ditu.\n" },

  { strong: "Erritmoa ez da nahikoa izango" },
  { text: ": arreta, kontrola eta burua ere beharko dituzu. " },
  { text: "Pauso bakoitzak, eten bakoitzak eta taupada bakoitzak garrantzia izango du.\n" },

  { text: "Zure lana argia izango da: " },
  { strong: "koreografia ikasi, entrenatu eta azken oholtzan zehaztasunez aurkeztea" },
  { text: ".\n" },

  { text: "Mezu honekin batera, zure sarbide-fitxategia aurkituko duzu:\n" },
];


function appendFormattedText(parent, text) {
  const pieces = text.split("\n");
  pieces.forEach(function (piece, i) {
    if (i > 0) parent.appendChild(document.createElement("br"));
    if (piece.length > 0) parent.appendChild(document.createTextNode(piece))
  })
}
function renderAcademyEmail(element, parts, count) {
  element.innerHTML = "";

  let remaining = count;

  for (const part of parts) {
    const value = part.text || part.strong || "";
    if (remaining <= 0) break;

    const slice = value.slice(0, remaining);

    let node;

    if (part.strong) {
      node = document.createElement("strong");
    } else if (part.className) {
      node = document.createElement("span");
      node.className = part.className;
    } else {
      node = document.createElement("span");
    }

    appendFormattedText(node, slice);
    element.appendChild(node);

    remaining -= slice.length;
  }
}
function typeEmailUntilError(elementId, speed = 34, interruptAt = .88, onInterrupt = null) {
  const element = document.getElementById(elementId); if (!element) return;
  const total = ACADEMY_EMAIL_PARTS.reduce(function (sum, part) { return sum + (part.text || part.strong || "").length }, 0);
  const stopIndex = Math.floor(total * interruptAt); element.innerHTML = "";
  element.classList.remove("interrupted");
  let index = 0;
  const interval = setInterval(function () {
    index++;
    renderAcademyEmail(element, ACADEMY_EMAIL_PARTS, index);
    if (index >= stopIndex) {
      clearInterval(interval); element.classList.add("interrupted");
      if (typeof onInterrupt === "function") { setTimeout(onInterrupt, 350) }
    }
  }, speed)
}
function typeIntoBubble(element, text, speed = 80, onDone = null) {
  let index = 0;
  const label = element.dataset.label || "";
  element.innerHTML = "";
  if (label) {
    const labelEl = document.createElement("span");
    labelEl.className = "speaker-label";
    labelEl.textContent = label;
    element.appendChild(labelEl)
  }
  const textNode = document.createTextNode("");
  element.appendChild(textNode);
  const interval = setInterval(function () {
    textNode.nodeValue += text.charAt(index);
    index++; if (index >= text.length) {
      clearInterval(interval);
      if (typeof onDone === "function") { onDone() }
    }
  }, speed)
}
