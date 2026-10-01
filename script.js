// Track total attendees and team counts
let totalAttendees = 0;
const maxGoal = 50;

let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

// Track checked-in attendees
let attendees = [];

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

const teamCardWater = document.getElementById("teamCardWater");
const teamCardZero = document.getElementById("teamCardZero");
const teamCardPower = document.getElementById("teamCardPower");

const celebrationBanner = document.getElementById("celebrationBanner");
const celebrationWinner = document.getElementById("celebrationWinner");

const attendeesList = document.getElementById("attendeesList");
const noAttendeesMsg = document.getElementById("noAttendeesMsg");

// Render the checked-in attendees list
function renderAttendees() {
  attendeesList.innerHTML = "";

  if (attendees.length === 0) {
    noAttendeesMsg.style.display = "block";
    return;
  }

  noAttendeesMsg.style.display = "none";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.innerHTML = `<i class="fas fa-user"></i> ${attendee.name}`;

    const teamSpan = document.createElement("span");
    teamSpan.className = `attendee-team-badge ${attendee.team}`;
    teamSpan.textContent = attendee.teamName;

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);
    attendeesList.appendChild(listItem);
  }
}

// Format list of team names into a readable string
function formatTeamNames(teams) {
  const names = [];
  for (let i = 0; i < teams.length; i++) {
    names.push(teams[i].name);
  }

  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  return `${names[0]}, ${names[1]}, and ${names[2]}`;
}

// Check and trigger celebration when attendance goal is reached
function checkCelebration() {
  // Clear any previous winner highlights
  teamCardWater.classList.remove("winner");
  teamCardZero.classList.remove("winner");
  teamCardPower.classList.remove("winner");

  if (totalAttendees < maxGoal) {
    celebrationBanner.style.display = "none";
    return;
  }

  // Goal reached: display celebration banner
  celebrationBanner.style.display = "block";

  // Determine highest attendance count
  const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);
  const winningTeams = [];

  if (waterCount === maxTeamCount) {
    winningTeams.push({ name: "Team Water Wise", card: teamCardWater });
  }
  if (zeroCount === maxTeamCount) {
    winningTeams.push({ name: "Team Net Zero", card: teamCardZero });
  }
  if (powerCount === maxTeamCount) {
    winningTeams.push({ name: "Team Renewables", card: teamCardPower });
  }

  // Visually highlight winning team card(s)
  for (let i = 0; i < winningTeams.length; i++) {
    winningTeams[i].card.classList.add("winner");
  }

  // Create message showing single winner or all tied teams
  const teamNamesText = formatTeamNames(winningTeams);

  if (winningTeams.length === 1) {
    celebrationWinner.textContent = `Congratulations to ${teamNamesText} for having the highest attendance with ${maxTeamCount} attendees!`;
  } else {
    celebrationWinner.textContent = `It is a tie! Congratulations to our tied winning teams: ${teamNamesText} with ${maxTeamCount} attendees each!`;
  }
}

// Save counts and attendee list to localStorage
function saveProgress() {
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Update the progress bar based on total attendees
function updateProgressBar() {
  const percentage = Math.min((totalAttendees / maxGoal) * 100, 100);
  progressBar.style.width = `${percentage}%`;
}

// Restore saved counts and attendees from localStorage when the page loads
function loadProgress() {
  const savedTotal = localStorage.getItem("totalAttendees");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");
  const savedAttendees = localStorage.getItem("attendees");

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

  if (savedAttendees !== null) {
    try {
      attendees = JSON.parse(savedAttendees) || [];
    } catch (error) {
      attendees = [];
    }
  }

  updateProgressBar();
  renderAttendees();
  checkCelebration();
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

  // Add new attendee to the list
  const newAttendee = {
    name: attendeeName,
    team: selectedTeam,
    teamName: selectedTeamName,
  };
  attendees.push(newAttendee);

  // Save progress in localStorage
  saveProgress();

  // Render the updated attendee list
  renderAttendees();

  // Check if attendance goal is reached and display celebration
  checkCelebration();

  // Combine name and team into a welcome message and show on the page
  greetingParagraph.textContent = `Welcome, ${attendeeName}! You have successfully checked in with ${selectedTeamName}.`;
  greetingParagraph.className = "success-message";
  greetingParagraph.style.display = "block";

  // Reset the form after submission
  checkInForm.reset();
});
