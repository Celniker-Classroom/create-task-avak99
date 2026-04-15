// LIST (ARRAY)
let subjectGrades = [0,0,0,0,0,0,0,0];

// CALCULATE SUBJECT GRADE
function calculateSubjectGrade(index) {
    const container = document.getElementById(`subject${index}`);
    const inputs = container.querySelectorAll("input");

    let total = 0;

    // ITERATION
    for (let i = 0; i < inputs.length; i += 2) {
        let weight = parseFloat(inputs[i].value) / 100 || 0;
        let grade = parseFloat(inputs[i + 1].value) || 0;
        total += weight * grade;
    }

    subjectGrades[index] = total;

    document.getElementById(`result${index}`).innerText =
        `Final Grade: ${total.toFixed(2)}% | Status: ---`;
}

// CHECK STATUS (IF / ELSE + HTML OUTPUT)
function checkStatus(index) {
    let g = subjectGrades[index];
    let status = "";

    if (g >= 90) status = "A";
    else if (g >= 80) status = "B";
    else if (g >= 70) status = "C";
    else if (g >= 60) status = "D";
    else status = "F";

    document.getElementById(`result${index}`).innerText =
        `Final Grade: ${g.toFixed(2)}% | Status: ${status}`;
}

// GPA CONVERSION
function getGPA(g) {
    if (g >= 90) return 4.0;
    else if (g >= 80) return 3.0;
    else if (g >= 70) return 2.0;
    else if (g >= 60) return 1.0;
    else return 0.0;
}

// GPA CALCULATION (ITERATION)
function calculateGPA() {
    let total = 0;

    for (let i = 0; i < subjectGrades.length; i++) {
        total += getGPA(subjectGrades[i]);
    }

    let gpa = total / subjectGrades.length;

    document.getElementById("gpaOutput").innerText =
        "GPA: " + gpa.toFixed(2);
}

// EVENT LISTENERS USING ITERATION
for (let i = 0; i < 8; i++) {

    document.getElementById(`calc${i}`).addEventListener("click", function () {
        calculateSubjectGrade(i);
    });

    document.getElementById(`status${i}`).addEventListener("click", function () {
        checkStatus(i);
    });
}

// GPA BUTTON
document.getElementById("gpaBtn").addEventListener("click", calculateGPA);