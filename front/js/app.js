/**
 * Flashcards data (mock)
 * In a real application, this would come from the backend
 */
const flashcards = [
    {
        id: 1,
        question: "Qu’est-ce que le système de Leitner ?",
        answer: "Une méthode de répétition espacée basée sur des flashcards.",
        box: 1
    },
    {
        id: 2,
        question: "Que se passe-t-il si une réponse est incorrecte ?",
        answer: "La carte retourne dans la première boîte.",
        box: 1
    }
];

let currentCardIndex = 0;
let isAnswerVisible = false;

/**
 * Returns the current flashcard
 */
function getCurrentCard() {
    return flashcards[currentCardIndex];
}

/**
 * Displays the current card on the screen
 */
function renderCard() {
    const card = getCurrentCard();

    const questionElement = document.getElementById("card-question");
    const answerElement = document.getElementById("card-answer");

    if (!questionElement || !answerElement) {
        return;
    }

    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    answerElement.style.display = isAnswerVisible ? "block" : "none";
}

/**
 * Shows the answer
 */
function showAnswer() {
    isAnswerVisible = true;
    renderCard();
}

/**
 * Handles user answer (correct or incorrect)
 * @param {boolean} isCorrect
 */
function submitAnswer(isCorrect) {
    const card = getCurrentCard();

    if (isCorrect) {
        card.box += 1;
    } else {
        card.box = 1;
    }

    moveToNextCard();
}

/**
 * Moves to the next card
 */
function moveToNextCard() {
    isAnswerVisible = false;
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    renderCard();
}

/**
 * Initialize app
 */
document.addEventListener("DOMContentLoaded", () => {
    renderCard();
});
