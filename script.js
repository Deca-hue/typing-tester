const textToTypeEl = document.getElementById("text-to-type");
const typingAreaEl = document.getElementById("typing-area");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const resetBtn = document.getElementById("reset");
const difficultyEl = document.getElementById("difficulty");
const leaderboardList = document.getElementById("leaderboard-list");

let timeLeft = 60;
let timer = null;
let textToType = "";
let typedText = "";
let correctChars = 0;
let leaderboard = [];

// Expanded pool of fluent English paragraphs
const paragraphs = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is an essential skill in the modern world.",
    "A simple exercise can help you improve your typing speed.",
    "Short sentences like this one are great for beginners."
  ],
  medium: [
    "Practice makes perfect, and with regular typing exercises, you will improve.",
    "Learning to type accurately is just as important as learning to type quickly.",
    "Moderate difficulty sentences allow you to improve your focus and speed.",
    "Typing speed and accuracy are essential in professional environments."
  ],
  hard: [
    "Technology has revolutionized the way we live, work, and interact with one another.",
    "Efficient typing is crucial in a digital world where communication is key.",
    "With practice, you can achieve mastery over typing long and complex sentences.",
    "Challenges like this can test both your speed and precision simultaneously."
  ]
};

// Fetch a random paragraph based on difficulty
function fetchRandomText() {
  const difficulty = difficultyEl.value;
  const randomIndex = Math.floor(Math.random() * paragraphs[difficulty].length);
  textToType = paragraphs[difficulty][randomIndex];
  textToTypeEl.textContent = textToType;
}

// Start the timer
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        typingAreaEl.disabled = true;
        updateLeaderboard();
      }
    }, 1000);
  }
}

// Calculate Words Per Minute (WPM)
function calculateWPM() {
  const wordsTyped = typedText.trim().split(" ").length;
  const timeElapsed = 60 - timeLeft;
  return Math.round((wordsTyped / timeElapsed) * 60) || 0;
}

// Calculate Accuracy
function calculateAccuracy() {
  const totalChars = textToType.length;
  return ((correctChars / totalChars) * 100).toFixed(2);
}

// Handle Typing Input
function handleTyping() {
  startTimer();
  typedText = typingAreaEl.value;
  correctChars = 0;

  [...typedText].forEach((char, index) => {
    if (char === textToType[index]) {
      correctChars++;
    }
  });

  // Update stats
  const accuracy = calculateAccuracy();
  accuracyEl.textContent = accuracy;
  wpmEl.textContent = calculateWPM();

  // Automatically load a new paragraph when accuracy is 100%
  if (accuracy === "100.00" && typedText === textToType) {
    loadNextParagraph();
  }
}

// Load the next paragraph
function loadNextParagraph() {
  clearInterval(timer);
  timer = null;
  timeLeft = difficultyEl.value === "easy" ? 90 : difficultyEl.value === "hard" ? 30 : 60;
  timeEl.textContent = timeLeft;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;
  typingAreaEl.value = "";
  typingAreaEl.disabled = false;
  fetchRandomText();
}

// Update Leaderboard
function updateLeaderboard() {
  const wpm = calculateWPM();
  leaderboard.push(wpm);
  leaderboard.sort((a, b) => b - a); // Sort descending
  leaderboardList.innerHTML = leaderboard.slice(0, 5).map((score, index) => `<li>${index + 1}. ${score} WPM</li>`).join("");
}

// Reset the test
function resetTest() {
  loadNextParagraph();
}

// Event Listeners
typingAreaEl.addEventListener("input", handleTyping);
resetBtn.addEventListener("click", resetTest);
difficultyEl.addEventListener("change", resetTest);

// Initialize
fetchRandomText();
