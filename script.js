// Track total attendees and team counts
let totalAttendees = 0;
const maxGoal = 50;

let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

// Get DOM elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greetingParagraph = document.getElementById("greeting");

const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");

// Save counts to localStorage
function saveProgress() {
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);
}

// Update the progress bar based on total attendees
function updateProgressBar() {
  const percentage = Math.min((totalAttendees / maxGoal) * 100, 100);
  progressBar.style.width = `${percentage}%`;
}

// Restore saved counts from localStorage when the page loads
function loadProgress() {
  const savedTotal = localStorage.getItem("totalAttendees");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");

  if (savedTotal !== null) {
    totalAttendees = parseInt(savedTotal, 10) || 0;
    attendeeCountSpan.textContent = totalAttendees;
  }

  if (savedWater !== null) {
    waterCount = parseInt(savedWater, 10) || 0;
    waterCountSpan.textContent = waterCount;
  }

  if (savedZero !== null) {
    zeroCount = parseInt(savedZero, 10) || 0;
    zeroCountSpan.textContent = zeroCount;
  }

  if (savedPower !== null) {
    powerCount = parseInt(savedPower, 10) || 0;
    powerCountSpan.textContent = powerCount;
  }

  updateProgressBar();
}

// Load progress on initial page load
loadProgress();

// Listen for a form submission and run code
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the values from the input and dropdown
  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const selectedTeamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (!attendeeName || !selectedTeam) {
    return;
  }

  // Increment total and store in a variable
  totalAttendees += 1;

  // Show the updated total count on the page
  attendeeCountSpan.textContent = totalAttendees;

  // Update the progress bar
  updateProgressBar();

  // Update the correct team's count on the page
  if (selectedTeam === "water") {
    waterCount += 1;
    waterCountSpan.textContent = waterCount;
  } else if (selectedTeam === "zero") {
    zeroCount += 1;
    zeroCountSpan.textContent = zeroCount;
  } else if (selectedTeam === "power") {
    powerCount += 1;
    powerCountSpan.textContent = powerCount;
  }

  // Save progress in localStorage
  saveProgress();

  // Combine name and team into a welcome message and show on the page
  greetingParagraph.textContent = `Welcome, ${attendeeName}! You have successfully checked in with ${selectedTeamName}.`;
  greetingParagraph.className = "success-message";
  greetingParagraph.style.display = "block";

  // Reset the form after submission
  checkInForm.reset();
});
