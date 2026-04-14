// add javascript here
// Store final percentages for GPA calculation
let subjectGrades = [0, 0]; 

// Function to calculate a single subject's weighted grade
function calculateSubjectGrade(subjectIndex) {
    const container = document.querySelectorAll('div')[subjectIndex];
    const inputs = container.querySelectorAll('input[type="number"]');
    let totalWeightedGrade = 0;

    // Loop through inputs in pairs (Weight, Grade)
    for (let i = 0; i < inputs.length; i += 2) {
        const weight = parseFloat(inputs[i].value) / 100 || 0;
        const grade = parseFloat(inputs[i+1].value) || 0;
        totalWeightedGrade += (grade * weight);
    }

    subjectGrades[subjectIndex] = totalWeightedGrade;
    alert(`Final Grade for Subject ${subjectIndex + 1}: ${totalWeightedGrade.toFixed(2)}%`);
}

// Function to convert percentage to 4.0 GPA scale
function getGPAValue(percentage) {
    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.0;
    if (percentage >= 70) return 2.0;
    if (percentage >= 60) return 1.0;
    return 0.0;
}