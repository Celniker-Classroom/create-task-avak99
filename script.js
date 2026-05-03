let currentStep = 1;
let classes = [];
let gradientIndex = 0;
let gradientTimer = null;

/* =========================
   🔊 SOUND SYSTEM (UPDATED)
========================= */
let audioContext;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClick() {
  initAudio();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playType() {
  initAudio();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
}

/* =========================
   COLORS
========================= */
const gradeColors = {
  A: { background: "#0f7b22", text: "#eef7e7" },
  B: { background: "#a9d36f", text: "#1b3211" },
  C: { background: "#f7d843", text: "#3f3200" },
  D: { background: "#ee5d4c", text: "#ffffff" },
  F: { background: "#d32f2f", text: "#ffffff" }
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.closest("button")) playClick();
  });

  document.getElementById("continueBtn")?.addEventListener("click", continueSetup);
  document.getElementById("finishCategoriesBtn")?.addEventListener("click", finishCategoriesSetup);
  document.getElementById("darkModeToggle")?.addEventListener("click", toggleDarkMode);
  document.getElementById("resetBtn")?.addEventListener("click", resetApp);
  document.getElementById("calculateGpaBtn")?.addEventListener("click", calculateAndDisplayGPA);
  document.getElementById("sidebarToggle")?.addEventListener("click", toggleSidebar);
  document.getElementById("sidebarDarkMode")?.addEventListener("click", toggleDarkMode);
  document.getElementById("sidebarReset")?.addEventListener("click", resetApp);

  document.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT") playType();
  });

  injectDarkModeStyles();
  createFloatingCircles();
});

function createFloatingCircles() {
  const container = document.querySelector('.background-circles');
  if (!container) return;

  const colors = [
    '#007acc',
    '#c41e3a',
    '#4caf50',
    '#ff9800',
    '#9c27b0',
    '#00bcd4',
    '#ff5722'
  ];

  const animations = ['floatCircle', 'floatCircleUpDown', 'floatCircleLeftRight', 'floatCircleDiag1', 'floatCircleDiag2', 'floatCircleCircular', 'floatCircleSpiral', 'floatCircleWave'];

  container.innerHTML = '';

  for (let i = 0; i < 100; i++) {
    const circle = document.createElement('div');
    circle.className = 'bg-circle';
    const size = Math.round(60 + Math.random() * 180); // 60-240px
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${Math.random() * 100}%`;
    circle.style.top = `${Math.random() * 100}%`;
    circle.style.backgroundColor = colors[i % colors.length];
    circle.style.opacity = (0.6 + Math.random() * 0.4).toString();
    circle.style.filter = `blur(${0.2 + Math.random() * 0.8}px)`;
    const duration = 5 + Math.random() * 15; // 5-20s
    circle.style.animation = `${animations[Math.floor(Math.random() * animations.length)]} ${duration}s ease-in-out infinite`;
    circle.style.animationDelay = `${-Math.random() * 5}s`;
    circle.style.border = '2px solid rgba(255,255,255,0.7)';
    container.appendChild(circle);
  }

  // Add particles for setup screen
  if (document.getElementById('setupScreen') && !document.getElementById('setupScreen').classList.contains('hidden')) {
    createSetupParticles();
  }
}

function createSetupParticles() {
  const container = document.querySelector('.background-circles');
  if (!container) return;

  // Remove existing particles
  container.querySelectorAll('.particle').forEach(p => p.remove());

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.round(2 + Math.random() * 6);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    container.appendChild(particle);
  }
}

function createDynamicCompletionElements() {
  const container = document.querySelector('.background-circles');
  if (!container || !allGradesEntered()) return;

  container.querySelectorAll('.dynamic-shape, .sparkle').forEach(el => el.remove());

  const shapeColors = [
    'rgba(16, 185, 129, 0.16)',
    'rgba(34, 197, 94, 0.14)',
    'rgba(74, 222, 128, 0.12)'
  ];

  for (let i = 0; i < 12; i++) {
    const shape = document.createElement('div');
    shape.className = 'dynamic-shape';
    const size = Math.round(35 + Math.random() * 70);
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    shape.style.backgroundColor = shapeColors[i % shapeColors.length];
    shape.style.animationDuration = `${12 + Math.random() * 13}s`;
    shape.style.animationDelay = `${Math.random() * -10}s`;
    shape.style.opacity = 0.14;
    shape.style.transform = `scale(${0.8 + Math.random() * 0.7})`;
    if (i % 3 !== 0) shape.style.borderRadius = '25%';
    container.appendChild(shape);
  }

  for (let i = 0; i < 14; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.width = `${Math.random() * 8 + 4}px`;
    sparkle.style.height = `${Math.random() * 8 + 4}px`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(sparkle);
  }
}

function clearDynamicCompletionElements() {
  const container = document.querySelector('.background-circles');
  if (!container) return;
  container.querySelectorAll('.dynamic-shape, .sparkle').forEach(el => el.remove());
}


/* =========================
   SETUP
========================= */
function continueSetup(event) {
  event?.preventDefault();

  if (currentStep === 1) {
    const numClasses = parseInt(document.getElementById("numClasses")?.value);

    if (Number.isNaN(numClasses) || numClasses <= 0) {
      alert("Enter valid number");
      return;
    }

    speak("Thank you for entering the number of classes");
    generateClassInputs(numClasses);
    currentStep = 2;
  }
}

/* =========================
   CLASS INPUTS (WITH AP)
========================= */
function generateClassInputs(num) {
  const container = document.getElementById("classInputs");
  container.innerHTML = "";

  for (let i = 0; i < num; i++) {
    container.innerHTML += `
      <div class="class-box">
        <label>Class Name
          <input id="name${i}" placeholder="Class ${i + 1}" />
        </label>

        <label>
          <input type="checkbox" id="ap${i}" />
          AP (Weighted)
        </label>
      </div>
    `;
  }

  container.innerHTML += `<button id="continueBtn2" class="btn btn-primary">Continue</button>`;

  document.getElementById("continueBtn2").onclick = collectClassesAndShowCategories;
}

function collectClassesAndShowCategories(e) {
  playClick();
  e.preventDefault();

  classes = [];

  document.querySelectorAll(".class-box").forEach((_, i) => {
    classes.push({
      name: document.getElementById(`name${i}`).value || `Class ${i + 1}`,
      isAP: document.getElementById(`ap${i}`).checked,
      components: [],
      overallGrade: 0
    });
  });

  speak("Thank you for entering your class names");
  updateSidebar();
  showCategoriesScreen();
}

/* =========================
   CATEGORY SCREEN (UNCHANGED)
========================= */
function showCategoriesScreen() {
  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("categoriesScreen").classList.remove("hidden");
  renderCategorySetup();
}

function renderCategorySetup() {
  const container = document.getElementById("categorySetupContainer");
  container.innerHTML = "";

  classes.forEach((cls, i) => {
    container.innerHTML += `
      <div class="category-setup-card">
        <h3>${cls.name}</h3>
        <input id="numCat${i}" type="number" placeholder="Number of components"/>
        <button onclick="generateComponentInputsForClass(${i})">Add</button>
        <div id="componentInputs${i}"></div>
      </div>
    `;
  });
}

function generateComponentInputsForClass(i) {
  playClick();
  const num = parseInt(document.getElementById(`numCat${i}`).value);
  const container = document.getElementById(`componentInputs${i}`);
  container.innerHTML = "";

  for (let j = 0; j < num; j++) {
    container.innerHTML += `
      <input id="compName${i}_${j}" placeholder="Name"/>
      <input id="compWeight${i}_${j}" placeholder="Weight %"/>
    `;
  }

  speak("Thank you for entering the number of components");
}

function finishCategoriesSetup(e) {
  e.preventDefault();

  // Validate weights
  for (let i = 0; i < classes.length; i++) {
    let totalWeight = 0;
    document.querySelectorAll(`#componentInputs${i} input`).forEach((input, j) => {
      if (j % 2 === 1) { // weight inputs
        totalWeight += parseFloat(input.value) || 0;
      }
    });
    if (Math.abs(totalWeight - 100) > 0.01) {
      alert(`Weights for ${classes[i].name} must add up to 100%. Current total: ${totalWeight}%`);
      return;
    }
  }

  classes.forEach((cls, i) => {
    cls.components = [];

    document.querySelectorAll(`#componentInputs${i} input`).forEach((input, j) => {
      if (j % 2 === 0) {
        cls.components.push({
          name: input.value,
          weight: parseFloat(document.getElementById(`compWeight${i}_${j/2}`).value),
          grade: 0
        });
      }
    });
  });

  speak("Thank you for entering the names and weights of your components");
  showGradebook();
}

/* =========================
   GRADEBOOK
========================= */
function showGradebook() {
  document.getElementById("categoriesScreen").classList.add("hidden");
  document.getElementById("gradebook").classList.remove("hidden");
  renderGradebook();
  updateSidebar();
}

function renderGradebook() {
  const container = document.getElementById("classesContainer");
  container.innerHTML = "";

  classes.forEach((cls, i) => {
    let html = `<div class="class-card"><h3>${cls.name}</h3>`;

    cls.components.forEach((comp, j) => {
      html += `
        <input type="number"
          placeholder="${comp.name}"
          oninput="updateComponentGrade(${i},${j},this.value)">
      `;
    });

    html += `<div id="gradeDisplay${i}">--</div></div>`;

    container.innerHTML += html;
  });
}

function updateComponentGrade(i, j, val) {
  classes[i].components[j].grade = parseFloat(val) || 0;
  calculateClassGrade(i);
}

/* =========================
   CALCULATIONS
========================= */
function calculateClassGrade(i) {
  let total = 0, weight = 0;

  classes[i].components.forEach(c => {
    total += c.grade * c.weight;
    weight += c.weight;
  });

  classes[i].overallGrade = total / weight;
}

function numericToGPA(score) {
  if (score >= 90) return 4;
  if (score >= 80) return 3;
  if (score >= 70) return 2;
  if (score >= 60) return 1;
  return 0;
}

let gpaValue = 0;

function calculateGPA() {
  let w = 0, u = 0;

  classes.forEach(c => {
    const base = numericToGPA(c.overallGrade || 0);
    u += base;
    w += c.isAP ? base + 1 : base;
  });

  let wg = (w / classes.length).toFixed(2);
  let ug = (u / classes.length).toFixed(2);

  document.getElementById("gpaOutput").innerText = `Weighted GPA: ${wg}`;
  document.getElementById("unweightedOutput").innerText = `Unweighted GPA: ${ug}`;

  gpaValue = parseFloat(wg);
  updateSidebar();
  return { weighted: parseFloat(wg), unweighted: parseFloat(ug) };
}

function showScreen(screenId) {
  playClick(); // Add sound to nav clicks
  const screens = ['setupScreen', 'categoriesScreen', 'gradebook'];
  screens.forEach(id => {
    const screen = document.getElementById(id);
    if (id === screenId) {
      screen.classList.remove('hidden');
    } else {
      screen.classList.add('hidden');
    }
  });
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = Array.from(document.querySelectorAll('.nav-item')).find(item => item.onclick.toString().includes(screenId));
  if (activeNav) activeNav.classList.add('active');

  // Add special background for setup screen
  if (screenId === 'setupScreen') {
    document.body.classList.add('setup-bg');
  } else {
    document.body.classList.remove('setup-bg');
  }

  // Add special effects for setup screen
  if (screenId === 'setupScreen') {
    createSetupParticles();
  } else {
    // Remove particles for other screens
    document.querySelectorAll('.particle').forEach(p => p.remove());
  }
}

function toggleSidebar() {
  playClick();
  document.querySelector('.sidebar').classList.toggle('active');
}

function updateSidebar() {
  document.getElementById('sidebarClassCount').textContent = classes.length;
  document.getElementById('sidebarGpa').textContent = gpaValue.toFixed(2);
}

/* =========================
   VOICE FIX
========================= */
let spoken = false;

function handleRewards(weighted, unweighted) {
  if (!allGradesEntered()) return;
  if (spoken) return;

  spoken = true;

  if (unweighted === 4.00) {
    speak("Congrats on your perfect GPA");
  } else if (weighted >= 3.8) {
    speak("Amazing work, your weighted GPA is excellent");
  } else if (weighted >= 3.0) {
    speak("Good work, keep improving");
  } else {
    speak("Keep trying to improve your GPA");
  }
}

function showConfetti() {
  // Remove any existing confetti
  const existingConfetti = document.querySelector('.confetti-container');
  if (existingConfetti) {
    document.body.removeChild(existingConfetti);
  }

  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '9999';
  confettiContainer.style.overflow = 'hidden';
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.width = (Math.random() * 15 + 5) + 'px';
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.pointerEvents = 'none';
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
    }
  }, 4000);
}

function allGradesEntered() {
  return classes.every(c => c.components.every(x => x.grade > 0));
}

/* =========================
   BACKGROUND ANIMATION
========================= */
function updateDynamicBackground(gpa) {
  const gradientMap = [
    { threshold: 3.5, gradient: "linear-gradient(135deg, #0f766e 0%, #22c55e 20%, #5eead4 45%, #bef264 75%, #4ade80 100%)" },
    { threshold: 3.0, gradient: "linear-gradient(135deg, #facc15 0%, #fb8500 30%, #ef4444 60%, #ec4899 80%, #8b5cf6 100%)" },
    { threshold: 0.0, gradient: "linear-gradient(135deg, #f43f5e 0%, #ef4444 30%, #fb7185 55%, #f97316 80%, #facc15 100%)" }
  ];

  const selected = gradientMap.find(item => gpa >= item.threshold) || gradientMap[gradientMap.length - 1];
  document.body.style.animation = "none";
  document.body.style.background = selected.gradient;
  document.body.style.backgroundSize = "600% 600%";
  document.body.style.backgroundBlendMode = "screen";
  document.body.style.transition = "background 0.6s ease";

  clearInterval(gradientTimer);
  gradientTimer = setInterval(() => {
    gradientIndex = (gradientIndex + 1) % 600;
    document.body.style.backgroundPosition = `${gradientIndex}% 50%`;
  }, 35);
}

/* =========================
   SPEECH
========================= */
function speak(text) {
  let u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
}

/* =========================
   DARK MODE + RESET
========================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function injectDarkModeStyles() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

function calculateAndDisplayGPA() {
  const gpas = calculateGPA();
  handleRewards(gpas.weighted, gpas.unweighted);
  updateDynamicBackground(gpas.unweighted);
  playClick(); // Ensure sound plays

  // Add voice narration
  speak(`Your weighted GPA is ${gpas.weighted}`);
  setTimeout(() => speak(`Your unweighted GPA is ${gpas.unweighted}`), 2000);

  if (allGradesEntered()) {
    createDynamicCompletionElements();
  } else {
    clearDynamicCompletionElements();
  }

  if (gpas.unweighted > 3.5) {
    showConfetti();
  }
}