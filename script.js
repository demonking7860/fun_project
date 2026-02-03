const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const statusMessage = document.getElementById("statusMessage");
const tooltip = document.getElementById("noTooltip");
const confettiLayer = document.getElementById("confettiLayer");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const floatingHearts = document.getElementById("floatingHearts");
const cursorTrail = document.getElementById("cursorTrail");
const musicToggle = document.getElementById("musicToggle");
const countdownValue = document.getElementById("countdownValue");
const noAudio = document.getElementById("noAudio");
const musicAudio = document.getElementById("musicAudio");

const funnyMessages = [
  "Nice try 😏",
  "Are you sure??",
  "System error: Only YES allowed",
  "Think again 💕",
  "Plot twist: the YES button loves you",
];

let noEscapes = 0;
let countdown = 60;
let lastTrailTime = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createFloatingHearts = (count = 14) => {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.animationDuration = `${10 + Math.random() * 10}s`;
    heart.style.opacity = `${0.35 + Math.random() * 0.5}`;
    floatingHearts.appendChild(heart);
  }
};

const spawnConfetti = () => {
  const pieces = 26;
  for (let i = 0; i < pieces; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti-piece";
    confetti.style.left = `${50 + (Math.random() * 40 - 20)}%`;
    confetti.style.top = `${45 + (Math.random() * 10 - 5)}%`;
    confetti.style.background = `linear-gradient(135deg, ${
      Math.random() > 0.5 ? "#ff6b9a" : "#ffd1e8"
    }, ${Math.random() > 0.5 ? "#ff3b7a" : "#f5c26b"})`;
    confettiLayer.appendChild(confetti);
    setTimeout(() => confetti.remove(), 900);
  }
};

const setTooltip = (message) => {
  tooltip.textContent = message;
};

const moveNoButton = () => {
  if (noAudio) {
    noAudio.currentTime = 0;
    noAudio.play().catch(() => {});
  }
  const card = document.querySelector(".card");
  const bounds = card.getBoundingClientRect();
  const buttonBounds = noButton.getBoundingClientRect();
  const padding = 12;

  const maxLeft = bounds.width - buttonBounds.width - padding;
  const maxTop = bounds.height - buttonBounds.height - padding;

  const randomLeft = Math.random() * maxLeft;
  const randomTop = Math.random() * maxTop;

  noButton.style.position = "absolute";
  noButton.style.left = `${clamp(randomLeft, padding, maxLeft)}px`;
  noButton.style.top = `${clamp(randomTop, padding, maxTop)}px`;
  noButton.style.transition = "left 0.25s ease, top 0.25s ease";
  noButton.classList.add("runaway");

  noEscapes += 1;
  setTooltip(funnyMessages[noEscapes % funnyMessages.length]);

  if (noEscapes >= 4) {
    noButton.classList.add("shrink");
  }
  if (noEscapes >= 7) {
    noButton.classList.add("spin");
  }
};

const showSuccess = () => {
  statusMessage.textContent = "Best decision ever! ❤️";
  spawnConfetti();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
};

const closeSuccess = () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
};

const handleYes = () => {
  showSuccess();
};

const initCountdown = () => {
  const tick = () => {
    countdown -= 1;
    if (countdown <= 0) {
      countdown = 0;
      countdownValue.textContent = "0";
      statusMessage.textContent = "Time's up... but YES is still open 💌";
      return;
    }
    countdownValue.textContent = String(countdown);
    setTimeout(tick, 1000);
  };
  setTimeout(tick, 1000);
};

const handleMusicToggle = async () => {
  const isPressed = musicToggle.getAttribute("aria-pressed") === "true";
  if (isPressed) {
    if (musicAudio) {
      musicAudio.pause();
    }
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.querySelector(".label").textContent = "Music";
  } else {
    if (musicAudio) {
      musicAudio.currentTime = 0;
      await musicAudio.play().catch(() => {});
    }
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.querySelector(".label").textContent = "Music On";
  }
};

const handleTrail = (event) => {
  const now = Date.now();
  if (now - lastTrailTime < 60) {
    return;
  }
  lastTrailTime = now;
  const heart = document.createElement("span");
  heart.className = "trail-heart";
  heart.style.left = `${event.clientX}px`;
  heart.style.top = `${event.clientY}px`;
  cursorTrail.appendChild(heart);
  setTimeout(() => heart.remove(), 700);
};

const handleEasterEgg = (event) => {
  if (event.key.toLowerCase() === "y") {
    handleYes();
  }
};

createFloatingHearts();
initCountdown();

yesButton.addEventListener("click", handleYes);
noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("click", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
closeModal.addEventListener("click", closeSuccess);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeSuccess();
  }
});
document.addEventListener("keydown", handleEasterEgg);
document.addEventListener("mousemove", handleTrail);
musicToggle.addEventListener("click", handleMusicToggle);
