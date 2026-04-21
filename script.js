let state = {
    classes: {},
    current: null
};

/* ---------------- SETUP ---------------- */

function startSetup() {
    let count = Number(document.getElementById("classCount").value);

    for (let i = 0; i < count; i++) {
        let name = prompt("Enter class name " + (i + 1));
        state.classes[name] = [];
    }

    state.current = Object.keys(state.classes)[0];

    document.getElementById("setupScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderClasses();
}

/* ---------------- CLASSES ---------------- */

function renderClasses() {
    let list = document.getElementById("classList");
    list.innerHTML = "";

    for (let c in state.classes) {
        let div = document.createElement("div");
        div.className = "card";
        div.innerText = c;

        div.onclick = () => {
            state.current = c;
            document.getElementById("activeClassTitle").innerText = c;
            render();
        };

        list.appendChild(div);
    }
}

/* ---------------- ADD ASSIGNMENT ---------------- */

function addAssignment() {
    if (!state.current) return;

    state.classes[state.current].push({
        name: assignmentName.value,
        category: category.value,
        earned: Number(earned.value),
        possible: Number(possible.value)
    });

    render();
}

/* ---------------- RENDER ---------------- */

function render() {
    let box = document.getElementById("table");
    box.innerHTML = "";

    let cls = state.classes[state.current];

    cls.forEach(a => {
        let div = document.createElement("div");
        div.className = "card";

        div.innerText =
            `${a.name} | ${a.category} | ${a.earned}/${a.possible}`;

        box.appendChild(div);
    });
}

/* ---------------- CALCULATE ---------------- */

function calculate() {
    let cls = state.classes[state.current];

    let total = 0;

    cls.forEach(a => {
        total += (a.earned / a.possible);
    });

    let avg = (total / cls.length) * 100;

    let letter =
        avg >= 90 ? "A" :
        avg >= 80 ? "B" :
        avg >= 70 ? "C" :
        avg >= 60 ? "D" : "F";

    let output = document.getElementById("gradeOutput");

    output.innerText = `${avg.toFixed(2)} (${letter})`;
    output.className = letter;

    calculateGPA(avg);

    if (letter === "A" || letter === "B") {
        celebrate(state.current, letter);
    }

    if (letter === "A") confetti();
}

/* ---------------- GPA ---------------- */

function calculateGPA(avg) {
    let gpa = avg / 25;
    document.getElementById("gpaOutput").innerText =
        "GPA: " + gpa.toFixed(2);
}

/* ---------------- WHAT IF ---------------- */

function whatIf() {
    let cls = state.classes[state.current];

    let fake = [...cls];

    fake.push({
        earned: Number(wEarned.value),
        possible: Number(wPossible.value)
    });

    let total = 0;

    fake.forEach(a => {
        total += (a.earned / a.possible);
    });

    let avg = (total / fake.length) * 100;

    document.getElementById("whatResult").innerText =
        "Projected: " + avg.toFixed(2);
}

/* ---------------- DARK MODE ---------------- */

function toggleDark() {
    document.body.classList.toggle("dark");
}

/* ---------------- SOUND + MESSAGE ---------------- */

function celebrate(className, grade) {
    let msg = `Great job in ${className}!`;

    let utter = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(utter);

    let audio = new AudioContext();
    let osc = audio.createOscillator();

    osc.frequency.value = grade === "A" ? 880 : 520;
    osc.connect(audio.destination);

    osc.start();
    osc.stop(audio.currentTime + 0.2);
}

/* ---------------- CONFETTI ---------------- */

function confetti() {
    let c = document.getElementById("confetti");
    let ctx = c.getContext("2d");

    c.width = innerWidth;
    c.height = innerHeight;

    for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(Math.random()*c.width, Math.random()*c.height, 5, 5);
    }

    setTimeout(() => ctx.clearRect(0,0,c.width,c.height), 1200);
}