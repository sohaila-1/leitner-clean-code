let flashcards = [];
let currentCardIndex = 0;
let isAnswerVisible = false;

/**
 * Fetch cards from backend API
 */
async function loadCards() {
  try {
    const cards = await window.api.getCards();
    flashcards = cards;

    if (!cards || cards.length === 0) return;

    renderCard();
    renderCardsByCategory(cards);
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

  if (!questionElement || !answerElement) {
    return;
  }

  questionElement.textContent = card.question;
  answerElement.textContent = card.answer;
  answerElement.style.display = isAnswerVisible ? "block" : "none";
}

const CATEGORY_LABELS = {
  FIRST: "CATÉGORIE 1",
  SECOND: "CATÉGORIE 2",
  THIRD: "CATÉGORIE 3",
  FOURTH: "CATÉGORIE 4",
  FIFTH: "CATÉGORIE 5",
  SIXTH: "CATÉGORIE 6",
  SEVENTH: "CATÉGORIE 7",
  DONE: "MAÎTRISÉES",
};

function renderCardsByCategory(cards) {
  const container = document.getElementById("cardsContainer");
  if (!container) return;

  const order = [
    "FIRST", "SECOND", "THIRD", "FOURTH",
    "FIFTH", "SIXTH", "SEVENTH", "DONE"
  ];

  container.innerHTML = "";

  for (const category of order) {
    const column = document.createElement("div");
    column.className = "category-column";

    const title = document.createElement("h4");
    title.textContent = CATEGORY_LABELS[category] || category;
    column.appendChild(title);

    const categoryCards = cards.filter(c => c.category === category);

    if (categoryCards.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "— aucune carte —";
      empty.className = "card-empty";
      column.appendChild(empty);
    } else {
      categoryCards.forEach((card) => {
        const item = document.createElement("div");
        item.className = "card-item";

        const questionBtn = document.createElement("button");
        questionBtn.type = "button";
        questionBtn.className = "card-item-button";
        questionBtn.textContent = card.tag
          ? `${card.question}  —  [${card.tag}]`
          : card.question;

        const answerDiv = document.createElement("div");
        answerDiv.className = "card-item-answer";
        answerDiv.textContent = card.answer;
        answerDiv.style.display = "none";

        questionBtn.addEventListener("click", () => {
          const visible = answerDiv.style.display === "block";
          answerDiv.style.display = visible ? "none" : "block";
        });

        item.appendChild(questionBtn);
        item.appendChild(answerDiv);
        column.appendChild(item);
      });
    }

    container.appendChild(column);
  }
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

function addCard() {
  const form = document.getElementById("createCardForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();
    const tag = document.getElementById("tag").value.trim();

    try {
      if (tag) {
        await window.api.createCard(question, answer, tag);
      } else {
        await window.api.createCard(question, answer);
      }

      await loadCards();
      form.reset();
      alert("Carte créée avec succès");
    } catch (err) {
      console.error("Failed to create card", err);
      alert("Erreur lors de la création de la carte");
    }
  });
}

/**
 * Initialize app
 */
document.addEventListener("DOMContentLoaded", () => {
    loadCards();
    addCard();    
});
