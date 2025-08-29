// quiz.js
// Linear Equations Quiz Logic

// Fixed set of questions (do not change on reload)
const questions = [
    // ...existing code...
    {
        prompt: "A line is plotted on a graph that ranges from (-10, 10) on both axes. What is the slope?",
        type: "mc_slope",
        choices: ["Positive", "Negative", "Zero", "Undefined"],
        answer: "Negative",
        graph: "negative"
    },
    {
        prompt: "A line is plotted on a graph that ranges from (-10, 10) on both axes. What is the slope?",
        type: "mc_slope",
        choices: ["Positive", "Negative", "Zero", "Undefined"],
        answer: "Zero",
        graph: "zero"
    },
    {
        prompt: "A line is plotted on a graph that ranges from (-10, 10) on both axes. What is the slope?",
        type: "mc_slope",
        choices: ["Positive", "Negative", "Zero", "Undefined"],
        answer: "Positive",
        graph: "positive2"
    },
    // New multiple choice slope questions
    {
        prompt: "A line is plotted on a graph that ranges from (-10, 10) on both axes. What is the slope?",
        type: "mc_slope",
        choices: ["Positive", "Negative", "Zero", "Undefined"],
        answer: "Positive",
        graph: "positive"
    },
    {
        prompt: "A line is plotted on a graph that ranges from (-10, 10) on both axes. What is the slope?",
        type: "mc_slope",
        choices: ["Positive", "Negative", "Zero", "Undefined"],
        answer: "Undefined",
        graph: "undefined"
    },
    // ...existing code...
    {
        prompt: "What is the y-intercept of the line passing through (0, 5) with slope -3?",
        answer: "5",
        type: "intercept",
        calc: () => "5"
    },
    {
        prompt: "What is the slope of the line y = -7x + 2?",
        answer: "-7",
        type: "slope",
        calc: () => "-7"
    },
    {
        prompt: "What is the equation of the line passing through (3, 4) and (7, 12)? (in y = mx + b form)",
        answer: "y = 2x - 2",
        type: "equation",
        calc: () => {
            const m = (12 - 4) / (7 - 3);
            const b = 4 - m * 3;
            return `y = ${m}x ${b < 0 ? "- " + Math.abs(b) : "+ " + b}`;
        }
    },
    {
        prompt: "What is the slope of the line passing through (-1, 2) and (3, 10)?",
        answer: "2",
        type: "slope",
        calc: () => ((10 - 2) / (3 - (-1))).toFixed(2)
    },
    {
        prompt: "What is the y-intercept of the line y = 5x - 8?",
        answer: "-8",
        type: "intercept",
        calc: () => "-8"
    },
    {
        prompt: "What is the equation of the line with slope -2 passing through (0, 7)? (in y = mx + b form)",
        answer: "y = -2x + 7",
        type: "equation",
        calc: () => {
            const m = -2, x = 0, y = 7;
            const b = y - m * x;
            return `y = ${m}x ${b < 0 ? "- " + Math.abs(b) : "+ " + b}`;
        }
    }
];

let current = 0;
const userAnswers = Array(questions.length).fill("");
const quizDiv = document.getElementById("quiz");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");
let submitted = false;

function showPopup(isCorrect) {
    let popup = document.createElement('div');
    popup.textContent = isCorrect ? 'Correct!' : ('Incorrect. Correct answer: ' + (arguments[1] || ''));
    popup.style.position = 'fixed';
    popup.style.top = '8%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px 40px';
    popup.style.fontSize = '1.5rem';
    popup.style.fontWeight = 'bold';
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '9999';
    popup.style.background = isCorrect ? '#43a047' : '#e53935';
    popup.style.color = '#fff';
    popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    popup.style.opacity = '1';
    popup.style.transition = 'opacity 1s';
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.opacity = '0';
    }, 1200);
    setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 2200);
}

function getCorrectness(idx) {
    const correct = questions[idx].answer.replace(/\s+/g, "").toLowerCase();
    let user = userAnswers[idx].replace(/\s+/g, "").toLowerCase();
    if (questions[idx].type === "slope" || questions[idx].type === "intercept") {
        if (/^-?\d+\/?\d*$/.test(user)) {
            try {
                if (user.includes("/")) {
                    const [num, denom] = user.split("/").map(Number);
                    user = (num / denom).toFixed(2);
                }
            } catch {}
        }
    }
    if (user === correct || (questions[idx].type === "slope" && Math.abs(Number(user) - Number(correct)) < 0.01)) {
        return '<span style="color: green; font-weight: bold;">Correct!</span>';
    } else if (user.length > 0) {
        return '<span style="color: red; font-weight: bold;">Incorrect</span>';
    } else {
        return '';
    }
}

function renderQuestion(idx) {
    const q = questions[idx];
    let submittedMsg = submitted ? '<div style="color: #1976d2; margin-bottom: 8px;">Quiz submitted. You can review your answers.</div>' : '';
    let html = `${submittedMsg}
        <div class="question">
            <strong>Question ${idx + 1} of ${questions.length}:</strong><br>
            <span>${q.prompt}</span>
            <br><br>`;
    if (q.type === "mc_slope" && q.graph === "positive") {
        html += `<svg width="220" height="220" viewBox="0 0 220 220" style="background:#fff; border:1px solid #ccc; margin-bottom:16px;">
            <line x1="20" y1="200" x2="200" y2="40" stroke="#1976d2" stroke-width="3" />
            <line x1="110" y1="10" x2="110" y2="210" stroke="#888" stroke-width="1" />
            <line x1="10" y1="110" x2="210" y2="110" stroke="#888" stroke-width="1" />
            <text x="200" y="120" font-size="14" fill="#333">x</text>
            <text x="120" y="20" font-size="14" fill="#333">y</text>
        </svg>`;
    } else if (q.type === "mc_slope" && q.graph === "undefined") {
        html += `<svg width="220" height="220" viewBox="0 0 220 220" style="background:#fff; border:1px solid #ccc; margin-bottom:16px;">
            <line x1="110" y1="20" x2="110" y2="200" stroke="#1976d2" stroke-width="3" />
            <line x1="110" y1="10" x2="110" y2="210" stroke="#888" stroke-width="1" />
            <line x1="10" y1="110" x2="210" y2="110" stroke="#888" stroke-width="1" />
            <text x="200" y="120" font-size="14" fill="#333">x</text>
            <text x="120" y="20" font-size="14" fill="#333">y</text>
        </svg>`;
    } else if (q.type === "mc_slope" && q.graph === "negative") {
        html += `<svg width="220" height="220" viewBox="0 0 220 220" style="background:#fff; border:1px solid #ccc; margin-bottom:16px;">
            <line x1="200" y1="200" x2="40" y2="40" stroke="#1976d2" stroke-width="3" />
            <line x1="110" y1="10" x2="110" y2="210" stroke="#888" stroke-width="1" />
            <line x1="10" y1="110" x2="210" y2="110" stroke="#888" stroke-width="1" />
            <text x="200" y="120" font-size="14" fill="#333">x</text>
            <text x="120" y="20" font-size="14" fill="#333">y</text>
        </svg>`;
    } else if (q.type === "mc_slope" && q.graph === "zero") {
        html += `<svg width="220" height="220" viewBox="0 0 220 220" style="background:#fff; border:1px solid #ccc; margin-bottom:16px;">
            <line x1="20" y1="110" x2="200" y2="110" stroke="#1976d2" stroke-width="3" />
            <line x1="110" y1="10" x2="110" y2="210" stroke="#888" stroke-width="1" />
            <line x1="10" y1="110" x2="210" y2="110" stroke="#888" stroke-width="1" />
            <text x="200" y="120" font-size="14" fill="#333">x</text>
            <text x="120" y="20" font-size="14" fill="#333">y</text>
        </svg>`;
    } else if (q.type === "mc_slope" && q.graph === "positive2") {
        html += `<svg width="220" height="220" viewBox="0 0 220 220" style="background:#fff; border:1px solid #ccc; margin-bottom:16px;">
            <line x1="40" y1="180" x2="180" y2="60" stroke="#1976d2" stroke-width="3" />
            <line x1="110" y1="10" x2="110" y2="210" stroke="#888" stroke-width="1" />
            <line x1="10" y1="110" x2="210" y2="110" stroke="#888" stroke-width="1" />
            <text x="200" y="120" font-size="14" fill="#333">x</text>
            <text x="120" y="20" font-size="14" fill="#333">y</text>
        </svg>`;
    }
    if (q.type === "mc_slope") {
        html += `<form id="mcForm">`;
        q.choices.forEach((choice, i) => {
            html += `<label style="display:block; margin-bottom:8px;">
                <input type="radio" name="mc${idx}" value="${choice}" ${userAnswers[idx] === choice ? "checked" : ""} ${submitted ? "disabled" : ""}> ${choice}
            </label>`;
        });
        html += `</form>`;
    } else {
        html += `<input type="text" id="answerInput" value="${userAnswers[idx]}" autocomplete="off" style="width: 100%; padding: 8px; font-size: 1rem;" ${submitted ? 'disabled' : ''}>`;
    }
    html += `</div>`;
    quizDiv.innerHTML = html;
    if (!submitted && q.type === "mc_slope") {
        document.querySelectorAll(`input[name='mc${idx}']`).forEach((el) => {
            el.addEventListener("change", function(e) {
                userAnswers[idx] = e.target.value;
            });
        });
    } else if (!submitted) {
        document.getElementById("answerInput").addEventListener("input", function(e) {
            userAnswers[idx] = e.target.value;
        });
    }
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === questions.length - 1;
}

prevBtn.addEventListener("click", function() {
    if (current > 0) {
        current--;
        renderQuestion(current);
    }
});

nextBtn.addEventListener("click", function() {
    if (current < questions.length - 1) {
        // Show popup feedback before moving to next question
        const correct = questions[current].answer.replace(/\s+/g, "").toLowerCase();
        let user = userAnswers[current].replace(/\s+/g, "").toLowerCase();
        if (questions[current].type === "slope" || questions[current].type === "intercept") {
            if (/^-?\d+\/?\d*$/.test(user)) {
                try {
                    if (user.includes("/")) {
                        const [num, denom] = user.split("/").map(Number);
                        user = (num / denom).toFixed(2);
                    }
                } catch {}
            }
        }
        let isCorrect;
        if (questions[current].type === "mc_slope") {
            isCorrect = user === correct;
        } else {
            isCorrect = (user === correct || (questions[current].type === "slope" && Math.abs(Number(user) - Number(correct)) < 0.01));
        }
        if (user.length > 0) {
            showPopup(isCorrect, isCorrect ? null : questions[current].answer);
        }
        current++;
        renderQuestion(current);
    }
});

submitBtn.addEventListener("click", function() {
    let score = 0;
    let feedback = "";
    for (let i = 0; i < questions.length; i++) {
        const correct = questions[i].answer.replace(/\s+/g, "").toLowerCase();
        let user = userAnswers[i].replace(/\s+/g, "").toLowerCase();
        // Accept fractions for slope/intercept questions
        if (questions[i].type === "slope" || questions[i].type === "intercept") {
            // Try to parse user input as a fraction
            if (/^-?\d+\/?\d*$/.test(user)) {
                try {
                    if (user.includes("/")) {
                        const [num, denom] = user.split("/").map(Number);
                        user = (num / denom).toFixed(2);
                    }
                } catch {}
            }
        }
        // Accept answer if matches or is close (for decimals)
        if (user === correct || (questions[i].type === "slope" && Math.abs(Number(user) - Number(correct)) < 0.01)) {
            score++;
        } else {
            feedback += `<div>Q${i+1}: Correct answer is <strong>${questions[i].answer}</strong></div>`;
        }
    }
    resultDiv.innerHTML = `<div>Your score: <strong>${score} / ${questions.length}</strong></div>` + (score < questions.length ? `<div>${feedback}</div>` : "<div>Excellent!</div>");
    submitted = true;
    submitBtn.disabled = true;
    renderQuestion(current);
});

// Initial render
renderQuestion(current);
