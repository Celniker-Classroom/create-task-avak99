let grades = [];

document.getElementById("addBtn").addEventListener("click", function () {
    addGrade();
});

document.getElementById("calcBtn").addEventListener("click", function () {
    calculate(grades);
});

function addGrade() {
    let category = document.getElementById("category").value;
    let weight = Number(document.getElementById("weight").value);
    let grade = Number(document.getElementById("grade").value);

    grades.push({
        category: category,
        weight: weight,
        grade: grade
    });

    document.getElementById("output").innerText = "Grade added";
}

function calculate(calcGrades) {
    let total = 0;
    let totalWeight = 0;

    for (let i = 0; i < calcGrades.length; i++) {
         total += calcGrades[i].grade * calcGrades[i].weight;
         totalWeight += calcGrades[i].weight
    }

    let finalGrade = total / totalWeight;

    document.getElementById("output").innerText =
        "Final Grade: " + finalGrade.toFixed(2) +
        " | GPA: " + toGPA(finalGrade).toFixed(2);
}

function toGPA(score) {
    if (score >= 90) return 4;
    if (score >= 80) return 3;
    if (score >= 70) return 2;
    if (score >= 60) return 1;
    return 0;
}