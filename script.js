let currentStep = 1;
let classes = [];
let gradientIndex = 0;
let gradientTimer = null;

const gradeColors = {
  A: { background: "#0f7b22", text: "#eef7e7" },
  B: { background: "#a9d36f", text: "#1b3211" },
  C: { background: "#f7d843", text: "#3f3200" },
  D: { background: "#ee5d4c", text: "#ffffff" },
  F: { background: "#d32f2f", text: "#ffffff" }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("continueBtn")?.addEventListener("click", continueSetup);
  document.getElementById("finishCategoriesBtn")?.addEventListener("click", finishCategoriesSetup);
  document.getElementById("darkModeToggle")?.addEventListener("click", toggleDarkMode);
  document.getElementById("resetBtn")?.addEventListener("click", resetApp);

  injectDarkModeStyles();
});

function continueSetup(event) {
  event?.preventDefault();

  if (currentStep === 1) {
    const rawValue = document.getElementById("numClasses")?.value;
    const numClasses = parseInt(rawValue, 10);

    if (Number.isNaN(numClasses) || numClasses <= 0) {
      alert("Enter a valid number of classes");
      return;
    }

    generateClassInputs(numClasses);
    currentStep = 2;
    return;
  }
}

function generateClassInputs(num) {
  const container = document.getElementById("classInputs");
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < num; i += 1) {
    container.innerHTML += `
      <div class="class-box">
        <label>Class Name
          <input id="name${i}" placeholder="Class ${i + 1}" />
        </label>
      </div>
    `;
  }
  container.insertAdjacentHTML(
    "beforeend",
    `<button id="continueBtn2">Continue</button>`
  );
  document
    .getElementById("continueBtn2")
    ?.addEventListener("click", collectClassesAndShowCategories);
}

function collectClassesAndShowCategories(event) {
  event?.preventDefault();

  classes = [];
  const boxes = document.querySelectorAll(".class-box");
  boxes.forEach((box, i) => {
    const name = document.getElementById(`name${i}`)?.value.trim() || `Class ${i + 1}`;
    classes.push({ name, components: [], overallGrade: 0 });
  });

  if (!classes.length) {
    alert("Enter at least one class");
    return;
  }

  showCategoriesScreen();
  currentStep = 3;
}

function showCategoriesScreen() {
  document.getElementById("setupScreen")?.classList.add("hidden");
  document.getElementById("categoriesScreen")?.classList.remove("hidden");
  renderCategorySetup();
}

function renderCategorySetup() {
  const container = document.getElementById("categorySetupContainer");
  if (!container) return;

  container.innerHTML = "";

  classes.forEach((cls, classIndex) => {
    container.innerHTML += `
      <div class="category-setup-card">
        <h3>${cls.name}</h3>
        <div class="prompt">
          <label>How many grade components does ${cls.name} have?
            <small>(e.g., Labs, Homework, Quizzes, Exams)</small>
            <input id="numCat${classIndex}" type="number" min="1" placeholder="e.g. 4" />
          </label>
          <button onclick="generateComponentInputsForClass(${classIndex})">Add Components</button>
        </div>
        <div id="componentInputs${classIndex}" class="component-inputs"></div>
      </div>
    `;
  });
}

function generateComponentInputsForClass(classIndex) {
  const numInput = document.getElementById(`numCat${classIndex}`);
  const num = parseInt(numInput?.value, 10);

  if (Number.isNaN(num) || num <= 0) {
    alert("Enter a valid number of grade components");
    return;
  }

  const container = document.getElementById(`componentInputs${classIndex}`);
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < num; i += 1) {
    container.innerHTML += `
      <div class="component-input-row">
        <input id="compName${classIndex}_${i}" placeholder="Component name (e.g., Labs, Exams)" />
        <input id="compWeight${classIndex}_${i}" type="number" min="0" max="100" placeholder="Weight %" />
      </div>
    `;
  }
}

function finishCategoriesSetup(event) {
  event?.preventDefault();

  let allValid = true;

  classes.forEach((cls, classIndex) => {
    cls.components = [];
    let totalWeight = 0;

    const inputs = document.querySelectorAll(
      `#componentInputs${classIndex} .component-input-row`
    );
    inputs.forEach((row, i) => {
      const name = document.getElementById(`compName${classIndex}_${i}`)?.value.trim();
      const weight = Number(document.getElementById(`compWeight${classIndex}_${i}`)?.value);

      if (name && Number.isFinite(weight) && weight > 0) {
        cls.components.push({ name, weight, grade: 0 });
        totalWeight += weight;
      }
    });

    if (!cls.components.length) {
      alert(`Add at least one valid grade component for ${cls.name}`);
      allValid = false;
      return;
    }

    if (Math.abs(totalWeight - 100) > 0.01) {
      alert(
        `${cls.name} component weights total ${totalWeight.toFixed(1)}%, not 100%. Please adjust.`
      );
      allValid = false;
      return;
    }
  });

  if (!allValid) return;

  showGradebook();
  currentStep = 4;
}

function showGradebook() {
  document.getElementById("categoriesScreen")?.classList.add("hidden");
  document.getElementById("gradebook")?.classList.remove("hidden");
  renderGradebook();
  calculateGPA();
}

function renderGradebook() {
  const container = document.getElementById("classesContainer");
  if (!container) return;

  container.innerHTML = "";

  classes.forEach((cls, classIndex) => {
    let classCard = `
      <div class="class-card" id="classCard${classIndex}">
        <h3>${cls.name}</h3>
        <div class="component-breakdown">
    `;

    cls.components.forEach((comp, compIndex) => {
      const grade = comp.grade || 0;
      classCard += `
        <div class="component-row">
          <label>${comp.name} (${comp.weight}%)
            <input
              type="number"
              min="0"
              max="100"
              value="${grade}"
              placeholder="Grade %"
              oninput="updateComponentGrade(${classIndex}, ${compIndex}, this.value)"
            />
          </label>
        </div>
      `;
    });

    classCard += `
        </div>
        <div class="class-summary">
          <div class="grade-display" id="gradeDisplay${classIndex}">—</div>
          <p id="classGpa${classIndex}">GPA: 0.00</p>
        </div>
      </div>
    `;

    container.innerHTML += classCard;
  });
}

function updateComponentGrade(classIndex, compIndex, value) {
  const grade = Number(value) || 0;
  classes[classIndex].components[compIndex].grade = grade;
  calculateClassGrade(classIndex);
  calculateGPA();
}

function calculateClassGrade(classIndex) {
  const cls = classes[classIndex];
  let totalGrade = 0;
  let totalWeight = 0;

  cls.components.forEach((comp) => {
    totalGrade += (comp.grade || 0) * comp.weight;
    totalWeight += comp.weight;
  });

  const finalGrade = totalWeight > 0 ? totalGrade / totalWeight : 0;
  cls.overallGrade = finalGrade;

  updateClassDisplay(classIndex, finalGrade);
}

function updateClassDisplay(classIndex, grade) {
  const display = document.getElementById(`gradeDisplay${classIndex}`);
  const gpaDiv = document.getElementById(`classGpa${classIndex}`);
  const card = document.getElementById(`classCard${classIndex}`);

  if (!display) return;

  const letter = getLetterGrade(grade);
  const gpa = numericToGPA(grade);
  const style = gradeColors[letter];

  display.textContent = letter;
  display.style.backgroundColor = style.background;
  display.style.color = style.text;
  display.style.boxShadow = `0 0 20px ${style.background}88`;

  if (gpaDiv) gpaDiv.textContent = `GPA: ${gpa.toFixed(2)}`;
  if (card) card.style.borderColor = style.background;
}

function getLetterGrade(grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

function numericToGPA(score) {
  if (score >= 90) return 4;
  if (score >= 80) return 3;
  if (score >= 70) return 2;
  if (score >= 60) return 1;
  return 0;
}

function calculateGPA() {
  if (!classes.length) {
    document.getElementById("gpaOutput").innerText = "GPA: 0.00";
    document.getElementById("unweightedOutput").innerText = "Unweighted GPA: 0.00";
    return;
  }

  let totalWeightedGPA = 0;
  let totalUnweightedGPA = 0;

  classes.forEach((cls) => {
    const gpa = numericToGPA(cls.overallGrade || 0);
    totalWeightedGPA += gpa;
    totalUnweightedGPA += gpa;
  });

  const weightedGpa = (totalWeightedGPA / classes.length).toFixed(2);
  const unweightedGpa = (totalUnweightedGPA / classes.length).toFixed(2);

  document.getElementById("gpaOutput").innerText = `Weighted GPA: ${weightedGpa}`;
  document.getElementById("unweightedOutput").innerText = `Unweighted GPA: ${unweightedGpa}`;
  handleRewards(Number(weightedGpa));
}

function handleRewards(gpa) {
  if (gpa === 4.0) {
    confetti();
    speak("Congrats on your perfect GPA");
  } else if (gpa > 3.5) {
    confetti();
    speak("Congrats your GPA is greater than average");
  } else if (gpa >= 3.0) {
    speak("Congrats your GPA is greater than average");
  } else {
    speak("Keep trying to improve your GPA");
  }
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function confetti() {
  for (let i = 0; i < 100; i += 1) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.position = "fixed";
    conf.style.top = "-20px";
    conf.style.left = `${Math.random() * 100}vw`;
    conf.style.width = "10px";
    conf.style.height = "10px";
    conf.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 65%)`;
    conf.style.borderRadius = "50%";
    conf.style.opacity = "0.95";
    document.body.appendChild(conf);

    conf.animate(
      [
        { transform: "translateY(0) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform: `translateY(${window.innerHeight + 80}px) rotate(${Math.random() * 720}deg) scale(0)`,
          opacity: 0
        }
      ],
      {
        duration: Math.random() * 2000 + 2000,
        fill: "forwards",
        easing: "ease-out"
      }
    );

    setTimeout(() => conf.remove(), 4500);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

function injectDarkModeStyles() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
}

function resetApp() {
  window.location.reload();
}