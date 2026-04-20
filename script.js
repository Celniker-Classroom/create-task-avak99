let grades = []; 
// This array stores all grade objects the user adds

document.getElementById("addBtn").addEventListener("click", function () {
    addGrade(); 
    // Runs addGrade when the user clicks "Add"
});

document.getElementById("calcBtn").addEventListener("click", function () {
    calculate(grades);
    // Runs calculate using the full grades list when user clicks "Calculate"
});

function addGrade() {
    let category = document.getElementById("category").value;
    let weight = Number(document.getElementById("weight").value);
    let grade = Number(document.getElementById("grade").value);
    // Gets user input from the form fields and converts numbers

    grades.push({
        category: category,
        weight: weight,
        grade: grade
    });
    // Adds a new grade object into the grades list

    document.getElementById("output").innerText = "Grade added";
    // Shows confirmation message to the user
}

function calculate(calcGrades) {
    if (calcGrades.length === 0) {
        document.getElementById("output").innerText = "No grades entered";
        return;
        // Stops function if there is no data in the list
    }

    let total = 0;
    let totalWeight = 0;
    // Variables used to calculate weighted average

    for (let i = 0; i < calcGrades.length; i++) {
        total += calcGrades[i].grade * calcGrades[i].weight;
        totalWeight += calcGrades[i].weight;
        // Loops through list and builds total score and total weight
    }

    let finalGrade = total / totalWeight;
    // Calculates final weighted grade

    document.getElementById("output").innerText =
        "Final Grade: " + finalGrade.toFixed(2) +
        " | GPA: " + toGPA(finalGrade).toFixed(2);
    // Displays final results to the user
}

function toGPA(score) {
    if (score >= 90) return 4;
    else if (score >= 80) return 3;
    else if (score >= 70) return 2;
    else if (score >= 60) return 1;
    else return 0;
    // Converts numeric score into GPA scale
}