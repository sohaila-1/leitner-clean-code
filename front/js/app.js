let flashcards = [];
let currentCardIndex = 0;
let isAnswerVisible = false;

/**
 * Fetch cards from backend API
 */
async function loadCards() {
    try {
        const response = await fetch("http://localhost:3000/cards");
        flashcards = await response.json();

        if (flashcards.length === 0) {
            console.warn("No cards found");
            return;
        }

        renderCard();
    } catch (error) {
        console.error("Failed to load cards", error);
    }
}

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
    if (!card) return;

    const questionElement = document.getElementById("card-question");
    const answerElement = document.getElementById("card-answer");

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
 * Handles user answer
 */
function submitAnswer(isCorrect) {
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
    loadCards();
});
