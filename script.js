let state = {
    classes: {},
    current: null
};

/* START SETUP */
function startSetup() {
    let count = Number(document.getElementById("classCount").value);

    if (!count || count < 1 || count > 8) {
        alert("Enter 1–8 classes");
        return;
    }

    state.classes = {};

    for (let i = 0; i < count; i++) {
        let name = prompt("Enter class name " + (i + 1));

        if (!name) name = "Class " + (i + 1);

        let weighted = confirm(
            "Is this class weighted?\nOK = Weighted\nCancel = Unweighted"
        );

        state.classes[name] = {
            assignments: [],
            isWeighted: weighted
        };
    }

    state.current = Object.keys(state.classes)[0];

    // SHOW BUTTON INSTEAD OF AUTO SWITCH
    document.getElementById("goBtn").style.display = "block";
}

/* GO TO GRADEBOOK (THIS FIXES YOUR ISSUE) */
function goToGradebook() {
    document.getElementById("setupScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderSidebar();
    renderClass();
    updateGPA();
}

/* CALCULATE CLASS GRADE */
function calcClass(name) {
    let c = state.classes[name];

    let total = 0;
    let possible = 0;

    c.assignments.forEach(a => {
        total += a.earned;
        possible += a.possible;
    });

    if (possible === 0) return 0;

    return (total / possible) * 100;
}

/* LETTER GRADE */
function letter(p) {
    if (p >= 90) return "A";
    if (p >= 80) return "B";
    if (p >= 70) return "C";
    if (p >= 60) return "D";
    return "F";
}

/* SIDEBAR */
function renderSidebar() {
    let list = document.getElementById("classList");
    list.innerHTML = "";

    for (let name in state.classes) {
        let pct = calcClass(name);
        let l = letter(pct);

        let div = document.createElement("div");
        div.innerHTML = name + " - " + pct.toFixed(1) + "% (" + l + ")";
        div.style.padding = "8px";
        div.style.cursor = "pointer";

        div.onclick = () => {
            state.current = name;
            renderClass();
        };

        list.appendChild(div);
    }
}

/* CLASS VIEW */
function renderClass() {
    let name = state.current;

    let pct = calcClass(name);
    let l = letter(pct);

    document.getElementById("classGrade").innerText =
        name + ": " + pct.toFixed(2) + "% (" + l + ")";

    renderSidebar();
}

/* ADD ASSIGNMENT */
function addAssignment() {
    state.classes[state.current].assignments.push({
        category: document.getElementById("category").value,
        earned: Number(document.getElementById("earned").value),
        possible: Number(document.getElementById("possible").value)
    });

    renderClass();
    updateGPA();
}

/* GPA */
function updateGPA() {
    let sum = 0;
    let count = 0;

    for (let c in state.classes) {
        let pct = calcClass(c);
        if (pct === 0) continue;

        let gpa =
            pct >= 90 ? 4 :
            pct >= 80 ? 3 :
            pct >= 70 ? 2 :
            pct >= 60 ? 1 : 0;

        sum += gpa;
        count++;
    }

    if (count === 0) return;

    let avg = sum / count;

    document.getElementById("uwGPA").innerText = avg.toFixed(2);
    document.getElementById("wGPA").innerText = avg.toFixed(2);
}

/* DARK MODE */
function toggleDark() {
    document.body.classList.toggle("dark");
}

/* CALCULATE BUTTON */
function calculate() {
    renderClass();
    updateGPA();
}