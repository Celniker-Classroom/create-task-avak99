let state = { classes: {}, current: null };
let audioCtx;

/* ERROR */
function showError(msg) {
    let box = document.getElementById("errorBox");
    box.innerText = msg;
    box.classList.remove("hidden");

    setTimeout(() => box.classList.add("hidden"), 3000);
}

/* START */
function startSetup() {
    let count = Number(classCount.value);

    if (!count || count > 8)
        return showError("Enter 1–8 classes");

    for (let i = 0; i < count; i++) {
        let name = prompt("Class name:");
        state.classes[name] = { assignments: [], weighted: true };
    }

    state.current = Object.keys(state.classes)[0];

    setupScreen.classList.add("hidden");
    app.classList.remove("hidden");

    renderClasses();
}

/* CLASSES */
function renderClasses() {
    classList.innerHTML = "";

    for (let c in state.classes) {
        let d = document.createElement("div");
        d.innerText = c;
        d.onclick = () => state.current = c;
        classList.appendChild(d);
    }
}

/* SOUND (FIXED GLOBAL AUDIO) */
function clickFX(btn) {
    btn.style.transform = "scale(0.95)";

    if (!audioCtx) audioCtx = new AudioContext();

    let osc = audioCtx.createOscillator();
    osc.frequency.value = 600;
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);

    setTimeout(() => btn.style.transform = "scale(1)", 100);
}

/* ADD */
function addAssignment() {
    let e = Number(earned.value);
    let p = Number(possible.value);

    if (e > p) return showError("Earned > Possible not allowed");

    state.classes[state.current].assignments.push({
        earned: e,
        possible: p
    });

    clickFX(event.target);
}

/* CALC */
function calculate() {
    let cls = state.classes[state.current];

    let t = 0, p = 0;

    cls.assignments.forEach(a => {
        t += a.earned;
        p += a.possible;
    });

    if (p === 0) return showError("No data");

    let pct = (t / p) * 100;

    let letter =
        pct >= 90 ? "A" :
        pct >= 80 ? "B" :
        pct >= 70 ? "C" :
        pct >= 60 ? "D" : "F";

    gradeOutput.innerText = pct.toFixed(2) + "% " + letter;

    document.body.className = letter + "-bg";

    updateGPA(letter);

    if (pct >= 90) confetti();
}

/* GPA + VOICE */
function updateGPA(letter) {
    let base =
        letter === "A" ? 4 :
        letter === "B" ? 3 :
        letter === "C" ? 2 :
        letter === "D" ? 1 : 0;

    uwGPA.innerText = base;
    wGPA.innerText = base;

    let msg =
        base === 4 ? "Congrats on your perfect GPA" :
        base >= 3 ? "Your GPA is above average" :
        "Keep improving your GPA";

    speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
}

/* DARK MODE */
function toggleMode() {
    document.body.classList.toggle("dark");
}

/* CONFETTI */
function confetti() {
    let c = document.getElementById("confetti");
    let ctx = c.getContext("2d");

    c.width = innerWidth;
    c.height = innerHeight;

    for (let i = 0; i < 250; i++) {
        ctx.fillRect(Math.random()*c.width, Math.random()*c.height, 4, 4);
    }

    setTimeout(() => ctx.clearRect(0,0,c.width,c.height), 1200);
}

/* WHAT IF */
function whatIf() {
    let pct = Number(whatPercent.value);
    whatResult.innerText = "Projected: " + pct + "%";
}