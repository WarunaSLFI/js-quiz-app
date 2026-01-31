

function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];

    for (let i = 0; i < 200; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            g: 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.g;
            if (p.y < canvas.height) active = true;
            ctx.fillStyle = p.c;
            ctx.fillRect(p.x, p.y, p.w, p.h);
        });

        if (active) requestAnimationFrame(animate);
        else document.body.removeChild(canvas);
    }
    animate();
}



// Existing Data and State
const questionsData = [
    {
        id: 1,
        category: 'JavaScript',
        difficulty: 'Easy',
        question: 'What is the correct output of typeof null?',
        options: ['"object"', '"null"', '"undefined"', '"number"'],
        answerIndex: 0
    },
    {
        id: 2,
        category: 'JavaScript',
        difficulty: 'Medium',
        question: 'Which method removes the last element from an array?',
        options: ['shift()', 'pop()', 'push()', 'splice()'],
        answerIndex: 1
    },
    {
        id: 3,
        category: 'JavaScript',
        difficulty: 'Medium',
        question: 'What does the spread operator (...) do?',
        options: ['Concatenates strings', 'Expands an iterable', 'Multiplies numbers', 'Checks equality'],
        answerIndex: 1
    },
    {
        id: 4,
        category: 'Web Basics',
        difficulty: 'Easy',
        question: 'Which tag is used for the largest heading in HTML?',
        options: ['<h6>', '<head>', '<h1>', '<header>'],
        answerIndex: 2
    },
    {
        id: 5,
        category: 'Web Basics',
        difficulty: 'Easy',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        answerIndex: 2
    },
    {
        id: 6,
        category: 'JavaScript',
        difficulty: 'Hard',
        question: 'How do you check if a property exists in an object?',
        options: ['obj.has(prop)', '"prop" in obj', 'obj.contains(prop)', 'obj.exists(prop)'],
        answerIndex: 1
    },
    {
        id: 7,
        category: 'JavaScript',
        difficulty: 'Medium',
        question: 'What is the result of 2 + "2" in JavaScript?',
        options: ['4', '"22"', 'NaN', 'Error'],
        answerIndex: 1
    },
    {
        id: 8,
        category: 'Web Basics',
        difficulty: 'Medium',
        question: 'Which HTTP status code means "Not Found"?',
        options: ['200', '500', '404', '403'],
        answerIndex: 2
    },
    {
        id: 9,
        category: 'Web Basics',
        difficulty: 'Hard',
        question: 'Which HTML5 element is used for navigation links?',
        options: ['<nav>', '<links>', '<navigation>', '<map>'],
        answerIndex: 0
    },
    {
        id: 10,
        category: 'JavaScript',
        difficulty: 'Hard',
        question: 'What is the purpose of "use strict"?',
        options: ['Enables strict typing', 'Prevents global variables', 'Enforces cleaner code', 'All of the above'],
        answerIndex: 2
    },
    {
        id: 11,
        category: 'Web Basics',
        difficulty: 'Medium',
        question: 'Which attribute opens a link in a new tab?',
        options: ['target="_blank"', 'target="_new"', 'rel="external"', 'window="new"'],
        answerIndex: 0
    },
    {
        id: 12,
        category: 'JavaScript',
        difficulty: 'Easy',
        question: 'Which keyword handles exceptions?',
        options: ['try', 'catch', 'finally', 'throw'],
        answerIndex: 0
    }
];

const state = {
    questions: [],
    currentIndex: 0,
    score: 0,

    answers: [],
    isLocked: false,
    selectedOptionIndex: -1,
    currentShuffledOptions: []
};

const dom = {
    quizView: document.getElementById('quiz-view'),
    resultsView: document.getElementById('results-view'),

    questionCount: document.getElementById('question-count'),
    progressFill: document.getElementById('progress-fill'),


    questionText: document.getElementById('question-text'),
    optionsGrid: document.getElementById('options-grid'),

    btnSkip: document.getElementById('btn-skip'),
    btnNext: document.getElementById('btn-next'),

    finalScore: document.getElementById('final-score'),
    finalPercent: document.getElementById('final-percent'),
    feedbackMsg: document.getElementById('feedback-message'),
    scoreCircle: document.querySelector('.score-circle'),

    statCorrect: document.getElementById('stat-correct'),
    statWrong: document.getElementById('stat-wrong'),
    statSkipped: document.getElementById('stat-skipped'),
    statTimeout: document.getElementById('stat-timeout'),
    reviewList: document.getElementById('review-list'),

    btnRestart: document.getElementById('btn-restart'),
    btnRetry: document.getElementById('btn-retry'),

    announcer: document.getElementById('aria-announcer')
};

function init() {
    const savedBest = localStorage.getItem('quizMasterBest') || 0;


    dom.btnNext.addEventListener('click', handleNext);
    dom.btnSkip.addEventListener('click', handleSkip);
    dom.btnRestart.addEventListener('click', () => startQuiz(true));
    dom.btnRetry.addEventListener('click', () => startQuiz(false));

    document.addEventListener('keydown', handleGlobalKeys);

    startQuiz(true);
}

function handleGlobalKeys(e) {
    if (dom.quizView.classList.contains('hidden-view')) return;

    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key) - 1;
        if (state.currentShuffledOptions[idx] && !state.isLocked) {
            selectOption(idx);
        }
    } else if (key === 'Enter') {
        if (!dom.btnNext.disabled) handleNext();
    } else if (key === 'Escape') {
        if (!dom.btnSkip.disabled) handleSkip();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz(shouldShuffle) {
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.isLocked = false;

    if (shouldShuffle) {
        state.questions = shuffleArray([...questionsData]);
    } else if (state.questions.length === 0) {
        state.questions = [...questionsData];
    }

    dom.quizView.classList.remove('hidden-view');
    dom.quizView.classList.add('active-view');
    dom.resultsView.classList.add('hidden-view');
    dom.resultsView.classList.remove('active-view');

    // Attempt to resume audio context on user interaction start


    renderQuestion();
}

function renderQuestion() {

    state.isLocked = false;
    state.selectedOptionIndex = -1;

    const q = state.questions[state.currentIndex];

    dom.questionCount.textContent = `${state.currentIndex + 1} / ${state.questions.length}`;
    const progressPct = ((state.currentIndex) / state.questions.length) * 100;
    dom.progressFill.style.width = `${progressPct}%`;


    dom.questionText.textContent = q.question;



    dom.btnNext.textContent = state.currentIndex === state.questions.length - 1 ? 'See Results' : 'Next';
    dom.btnNext.disabled = true;
    dom.btnSkip.disabled = false;

    const optionsWithIndices = q.options.map((opt, i) => ({ text: opt, originalIndex: i }));
    state.currentShuffledOptions = shuffleArray(optionsWithIndices);

    dom.optionsGrid.innerHTML = '';
    state.currentShuffledOptions.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';

        const keyIndicator = document.createElement('span');
        keyIndicator.className = 'key-hint';
        keyIndicator.textContent = index + 1;
        keyIndicator.style.marginRight = '12px';
        keyIndicator.style.opacity = '0.5';
        keyIndicator.style.fontSize = '0.8em';

        const span = document.createElement('span');
        span.textContent = opt.text;

        // Flex the button content to keep number left
        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'flex';
        contentDiv.style.alignItems = 'center';
        contentDiv.appendChild(keyIndicator);
        contentDiv.appendChild(span);

        btn.appendChild(contentDiv);
        btn.onclick = () => selectOption(index);

        dom.optionsGrid.appendChild(btn);
    });

    announce(`Question ${state.currentIndex + 1}: ${q.question}`);


}



function selectOption(index) {
    if (state.isLocked) return;

    state.selectedOptionIndex = index;
    state.isLocked = true;

    Array.from(dom.optionsGrid.children).forEach((btn, i) => {
        if (i === index) btn.classList.add('selected');
        else btn.disabled = true;
    });

    dom.btnNext.disabled = false;
    dom.btnSkip.disabled = true;
}

function handleNext() {
    if (state.selectedOptionIndex === -1) return;


    const q = state.questions[state.currentIndex];
    const chosen = state.currentShuffledOptions[state.selectedOptionIndex];
    const isCorrect = chosen.originalIndex === q.answerIndex;

    const options = dom.optionsGrid.children;
    const selectedBtn = options[state.selectedOptionIndex];

    if (isCorrect) {
        state.score++;
        selectedBtn.classList.add('correct');
        selectedBtn.classList.remove('selected');
        announce("Correct answer!");
    } else {
        selectedBtn.classList.add('wrong');
        selectedBtn.classList.remove('selected');
        announce("Incorrect answer.");

        state.currentShuffledOptions.forEach((opt, i) => {
            if (opt.originalIndex === q.answerIndex) {
                options[i].classList.add('correct');
            }
        });
    }

    state.answers.push({
        status: isCorrect ? 'correct' : 'wrong',
        question: q,
        userAnswer: chosen.text
    });

    setTimeout(() => {
        advanceToNext();
    }, 1000);
}

function handleSkip() {

    state.answers.push({
        status: 'skipped',
        question: state.questions[state.currentIndex],
        userAnswer: null
    });
    announce("Question skipped.");
    advanceToNext();
}

function showCorrectAnswer() {
    const q = state.questions[state.currentIndex];
    const options = dom.optionsGrid.children;
    state.currentShuffledOptions.forEach((opt, i) => {
        if (opt.originalIndex === q.answerIndex) {
            options[i].classList.add('correct');
        }
    });
}

function advanceToNext() {
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    dom.quizView.classList.remove('active-view');
    dom.quizView.classList.add('hidden-view');
    dom.resultsView.classList.remove('hidden-view');
    dom.resultsView.classList.add('active-view');

    const total = state.questions.length;
    const percent = Math.round((state.score / total) * 100);

    dom.finalScore.textContent = `${state.score}`;
    dom.finalPercent.textContent = `${percent}%`;
    dom.scoreCircle.style.setProperty('--percent', `${percent}%`);

    let msg = 'Keep practicing!';
    if (percent >= 80) {
        msg = 'Outstanding performance!';
        launchConfetti();
    } else if (percent >= 60) {
        msg = 'Great job!';
        launchConfetti();
    } else if (percent >= 40) {
        msg = 'Good effort!';
    }

    dom.feedbackMsg.textContent = msg;

    const best = Math.max(parseInt(localStorage.getItem('quizMasterBest') || 0), percent);
    localStorage.setItem('quizMasterBest', best);


    const correct = state.answers.filter(a => a.status === 'correct').length;
    const wrong = state.answers.filter(a => a.status === 'wrong').length;
    const skipped = state.answers.filter(a => a.status === 'skipped').length;

    dom.statCorrect.textContent = correct;
    dom.statWrong.textContent = wrong;
    dom.statSkipped.textContent = skipped;

    renderReview();
    announce(`Quiz complete. You scored ${percent} percent.`);
}

function renderReview() {
    dom.reviewList.innerHTML = '';
    state.answers.forEach((ans, i) => {
        const q = ans.question;
        const details = document.createElement('details');
        details.className = 'review-item';

        let statusClass = '';
        let statusText = '';

        if (ans.status === 'correct') { statusClass = 'status-correct'; statusText = 'Correct'; }
        else if (ans.status === 'wrong') { statusClass = 'status-wrong'; statusText = 'Wrong'; }
        else { statusClass = 'status-skipped'; statusText = ans.status === 'timeout' ? 'Time Out' : 'Skipped'; }

        const summary = document.createElement('summary');
        summary.className = 'review-summary';
        summary.innerHTML = `
            <span>Question ${i + 1}</span>
            <span class="review-status ${statusClass}">${statusText}</span>
        `;

        const content = document.createElement('div');
        content.className = 'review-details';

        const pQuestion = document.createElement('p');
        pQuestion.innerHTML = '<strong>Q:</strong> ';
        pQuestion.appendChild(document.createTextNode(q.question));

        const pUser = document.createElement('p');
        pUser.innerHTML = '<strong>Your Answer:</strong> ';
        pUser.appendChild(document.createTextNode(ans.userAnswer || '-'));

        const pCorrect = document.createElement('p');
        pCorrect.className = 'review-correct-ans';
        pCorrect.innerHTML = '<strong>Correct:</strong> ';
        pCorrect.appendChild(document.createTextNode(q.options[q.answerIndex]));

        content.appendChild(pQuestion);
        content.appendChild(pUser);
        content.appendChild(pCorrect);

        details.appendChild(summary);
        details.appendChild(content);
        dom.reviewList.appendChild(details);
    });
}

function announce(text) {
    dom.announcer.textContent = text;
}

document.addEventListener('DOMContentLoaded', init);
