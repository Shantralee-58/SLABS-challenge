// -------------------- STUDENT INFO --------------------
const studentName = sessionStorage.getItem("studentName") || "Student";
const studentEmail = sessionStorage.getItem("studentEmail") || "idah@southernlabs.com";
const studentCourse = sessionStorage.getItem("studentCourse") || "N/A";
const studentDOB = sessionStorage.getItem("studentDOB") || "N/A";
const studentContact = sessionStorage.getItem("studentContact") || "N/A";
const studentAddress = sessionStorage.getItem("studentAddress") || "N/A";
const studentProvince = sessionStorage.getItem("studentProvince") || "N/A";

// -------------------- TEST STATE --------------------
let currentQuestion = parseInt(sessionStorage.getItem("currentQuestion")) || 0;
let score = parseInt(sessionStorage.getItem("score")) || 0;
const totalQuestions = 40;
const passMark = 60;

// -------------------- TIMER --------------------
let startTime = sessionStorage.getItem("startTime");
if (!startTime) {
  startTime = new Date();
  sessionStorage.setItem("startTime", startTime);
}

// Set end time to 30 minutes from start
const endTime = new Date(new Date(startTime).getTime() + 30 * 60 * 1000);

const timerEl = document.getElementById("timer");
let timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
  const now = new Date();
  let diff = Math.floor((endTime - now) / 1000);

  if (diff <= 0) {
    diff = 0;
    endTest();
  }

  const h = String(Math.floor(diff / 3600)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const s = String(diff % 60).padStart(2, "0");

  timerEl.textContent = `Time Left: ${h}:${m}:${s}`;
}


// -------------------- 40 TRICKY QUESTIONS --------------------
const questions = [ {instructions:"Q1: Number Sequence Logic", question:"2, 6, 12, 20, 30, ?", options:["36","40","42","44"], answer:2, example:"Add 4, 6, 8, 10,... → next number"},
{instructions:"Q2: Word Decipher", question:"If A=1, B=20, C=3, what is DOG?", options:["62","57","48","50"], answer:0, example:"Sum letter values according to mapping A=1,B=20,C=3,..."},
{instructions:"Q3: Grid Pattern", question:"⬛⬜⬛⬜ ⬛⬜⬛ ?", options:["⬛","⬜","⬜⬛","⬛⬛"], answer:1, example:"Pattern alternates black and white squares"}, 
{instructions:"Q4: Math Logic", question:"1, 4, 9, 16, 25, ?", options:["30","36","35","40"], answer:1, example:"Squares of 1,2,3,4,5 → next square"},
{instructions:"Q5: Letter Sequence", question:"A, C, F, J, O, ?", options:["T","S","U","R"], answer:2, example:"Positions of letters increase cumulatively"},
{instructions:"Q6: Grid Puzzle", question:"▲ ▼ ▲ ▼ ▲ ?", options:["▲","▼","◆","●"], answer:1, example:"Symbols alternate in order"},
{instructions:"Q7: Math Puzzle", question:"If 3×2=6, 4×3=12, 5×4=?, 6×5=?", options:["20,25","20,30","20,32","20,28"], answer:1, example:"Multiply numbers accordingly"},
{instructions:"Q8: Logical Reasoning", question:"Four people need to cross a bridge at night. They have one torch and the bridge is too dangerous to cross without it. Only two people can cross at a time, and they must carry the torch. When two cross together, they move at the speed of the slower person. Times to cross: A = 1 minute B = 2 minutes C = 7 minutes D = 10 minutes What is the minimum total time for all four to cross?", options:["8 minutes","15 minutes","17 minutes","21 minutes"], answer:2, example:"Only 2 cross at once. Torch must return. Think who should bring the torch back to minimize total crossing time."},
{instructions:"Q9: Number Puzzle", question:"If 2+3=10, 3+4=21, 4+5=?, 5+6=?", options:["30,35","35,41","36,55","40,50"], answer:2, example:"Follow the pattern: a+b → a*b + b"}, 
{instructions:"Q10: Word Decipher", question:"If Z=1, Y=2, X=3… what is CAT?", options:["54","26","57","23"], answer:2, example:"Sum the letter values according to the reversed alphabet mapping"}, 
// Add more questions with tricky patterns, mappings, grid puzzles 
{instructions:"Q11: Number Logic", question:"5, 10, 20, 40, ?", options:["50","70","80","60"], answer:2, example:"Multiply by 2 each step"}, 
{instructions:"Q12: Grid Puzzle", question:"Which number fills the blank?\n2 4 8\n3 6 12\n4 8 ?", options:["16","18","20","24"], answer:0, example:"Each row doubles the number"}, 
{instructions:"Q13: Word Pattern", question:"fast, faster, ?", example: "Look at the pattern: positive → comparative → ? (superlative form)", options:["fastestest","more fast","supreme","fastest"], answer:3}, 
{instructions:"Q14: Logic Puzzle", question:"Tom > Jack, Jack > Harry. Who is shortest?", options:["Tom","Jack","Harry","Cannot tell"], answer:2, example:"Shortest is the one lesser than others"},
{instructions:"Q15: Number Sequence", question:"1,1,2,3,5,8, ?", options:["10","12","13","15"], answer:2, example:"Fibonacci sequence"}, 
{instructions:"Q16: Logical Reasoning", question:"A train travels 360 km in 4 hours. How long will it take to travel 540 km at the same speed?", options:["5 hours","6 hours","7 hours","8 hours"], answer:1, example:"Speed = Distance / Time"}, 
{instructions:"Q17: Grid Pattern", question:"🔺 🔻 🔺 ? 🔺 🔻 ?", options:["🔺 🔻","🔻 🔺","🔺 🔺","🔻 🔻"], answer:1, example:"Symbols alternate in pairs"}, 
{instructions:"Q18: Math Logic", question:"7,14,28,?,112", options:["42","56","64","58"], answer:1, example:"Multiply by 2 each step"}, 
{instructions:"Q19: Letter Series", question:"D, F, I, M, ?", options:["Q","R","S","T"], answer:1, example:"Differences: +2,+3,+4,.. → Next letter"}, 
{instructions:"Q20: Logic Puzzle", question:"5 red,7 blue,8 green balls. Probability blue?", options:["7/20","5/20","8/20","1/3"], answer:0, example:"Blue balls out of total"}, 
{instructions:"Q21: Word Puzzle", question:"Unscramble: LPAEP", options:["APPLE","PEPAL","LEAPP","PALPE"], answer:0, example:"Rearrange letters to form a word"}, 
{instructions:"Q22: Number Logic", question:"3, 9, 27, ?", options:["54","81","72","90"], answer:1, example:"Multiply by 3 each step"}, 
{instructions:"Q23: Grid Sequence", question:"1,2,4,7,11, ?", options:["16","17","18","19"], answer:0, example:"Add increasing differences +1,+2,+3,..."}, 
{instructions:"Q24: Logic Puzzle", question:"Three people — Alex, Ben, and Chris — write a test.\n\n• Alex scored more than Ben\n• Chris scored less than Alex\n• Ben did NOT score last\n\nWho scored the lowest?", options:["Alex", "Ben", "Chris", "Cannot be determined"], answer:2, example:"The one who scored lower than others"}, 
{instructions:"Q25: Logical Reasoning", question:"A train travels 120 km at 60 km/h and returns at 40 km/h.\n\nWhat is the average speed for the entire journey?", options:["48 km/h", "50 km/h", "45 km/h", "40 km/h"], answer:0, example:"Average speed = 2ab / (a + b). NB: a = speed going, b = speed returning"}, 
{instructions:"Q26: Number Pattern", question:"5,10,20,35, ?", options:["50","55","60","65"], answer:1, example:"Differences increase +5,+10,+15,..."}, 
{instructions:"Q27: Word Logic", question:"Antonym of 'Expand'?", options:["Contract","Extend","Open","Increase"], answer:0, example:"Opposite meaning"}, 
{instructions:"Q28: Grid Puzzle", question:"🔴 🔵 🔴 🔵 🔴 ?", options:["🔴","🔵","🔵🔴","🔴🔴"], answer:1, example:"Symbols alternate"}, 
{instructions:"Q29: Math Puzzle", question:"2x5=12, 3x6=21, 4x7=?", options:["30","33","35","32"], answer:3, example:"Use pattern (a*b)+a"}, 
{instructions:"Q30: Letter Series", question:"Z, X, U, Q, ?", options:["L","N","O","P"], answer:0, example:"Decreasing letter positions -2,-3,-4,-5"}, 
{instructions:"Q31: Word Puzzle", question:"Synonym of 'Quick'?", options:["Fast","Slow","Lazy","Tardy"], answer:0, example:"Choose synonym"}, 
{instructions:"Q32: Number Logic", question:"1,8,27,?,125", options:["49","64","81","100"], answer:1, example:"Cubes:1³,2³,..."}, 
{instructions:"Q33: Grid Puzzle", question:"■ ▲ ■ ▲ ■ ?", options:["■","▲","▲■","■■"], answer:1, example:"Alternate pattern"}, 
{instructions:"Q34: Logic Reasoning", question:"If ALL ZIBS are BANS and ALL BANS are TOMS, which statement must be true?", options:["All TOMS are ZIBS", "Some TOMS are ZIBS", "All ZIBS are TOMS", "Some ZIBS are not TOMS"], answer:2, example:"If A ⊆ B and B ⊆ C, then A ⊆ C"}, 
{instructions:"Q35: Logic Puzzle", question:"All cats are animals, all animals have eyes. Cats have tails?", options:["Yes","No","Cannot tell","Sometimes"], answer:0, example:"Apply logic"}, 
{instructions:"Q36: Math Logic", question:"The ratio of boys to girls in a class is 3 : 5. If there are 24 boys, how many girls are there?", options:["30","32","40","48"], answer:2, example:"Value per part = Known value / Known ratio part"}, 
{instructions:"Q37: Number Logic", question:"8 workers can complete a job in 15 days. After working for 5 days, 4 more workers join them. How many more days will it take to finish the remaining work?", options:["6¼ days","6⅔ days","7 days","7½ days"], answer:1, example:"Workers × Days = Total Work"}, 
{instructions:"Q38: Number Logic", question:"A father is 4 times as old as his son. In 12 years, he will be twice as old as his son. How old is the father now?", options:["32","27","24","40"], answer:2, example:"Let age be X"}, 
{instructions:"Q39: Number Puzzle", question:"1,3,6,10,15, ?", options:["20","21","19","18"], answer:1, example:"Triangular numbers"}, 
{instructions:"Q40: Logic Puzzle", question:"Circle, Triangle, Square, Circle, Triangle, ?", options:["Square","Circle","Triangle","Rectangle"], answer:0, example:"Repeats sequence"}];

// -------------------- DOM ELEMENTS --------------------
const instructionsEl = document.getElementById("instructions");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const finalResultEl = document.getElementById("finalResult");

// -------------------- RENDER QUESTIONS --------------------
function renderQuestion(){
  if(currentQuestion >= questions.length){
    endTest();
    return;
  }
  const q = questions[currentQuestion];
  instructionsEl.textContent = q.instructions + " (Example: " + q.example + ")";
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="option" value="${i}"> ${opt}`;
    optionsEl.appendChild(label);
  });
  scoreEl.textContent = `Score: ${Math.floor(score/currentQuestion*100)||0}%`;
}
renderQuestion();

// -------------------- BUTTON LOGIC --------------------
document.getElementById("nextBtn").addEventListener("click", ()=>{
  const selected = document.querySelector('input[name="option"]:checked');
  if(selected){
    const val = parseInt(selected.value);
    if(val === questions[currentQuestion].answer){ score++; }
    currentQuestion++;
    sessionStorage.setItem("currentQuestion", currentQuestion);
    sessionStorage.setItem("score", score);
    renderQuestion();
  } else {
    alert("Select an option or skip!");
  }
});

document.getElementById("skipBtn").addEventListener("click", ()=>{
  currentQuestion++;
  sessionStorage.setItem("currentQuestion", currentQuestion);
  renderQuestion();
});

// -------------------- ANTI-CHEAT --------------------
let cheatCount = 0;
const maxCheats = 3;
let testActive = true;

function handleCheat(reason){
  if(!testActive) return;

  cheatCount++;

  allowBlur = false;
  alert(`${reason}\n\nViolations: ${cheatCount}/${maxCheats}`);
  allowBlur = true;

  if(cheatCount >= maxCheats){
    allowBlur = false;
    alert("Too many violations. The test will now end and you have FAILED.");
    endTest(true);
  }
}

// Detect tab switching
window.addEventListener('blur', () => {
  if(allowBlur){
    handleCheat("Do not leave the test window!");
  }
});

// Disable right-click
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  handleCheat("Right-click is disabled!");
});

// Detect DevTools
window.addEventListener('keydown', (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key === "I") ||
    (e.ctrlKey && e.shiftKey && e.key === "J") ||
    (e.ctrlKey && e.key === "U")
  ) {
    handleCheat("Developer tools are not allowed!");
  }
});



// -------------------- END TEST --------------------
function endTest(forceFail = false) {
  testActive = false;
  clearInterval(timerInterval);

  const percent = forceFail ? 0 : Math.floor((score / questions.length) * 100);
  const pass = !forceFail && percent >= passMark;

  // Track attempts
  let attempts = parseInt(localStorage.getItem("attempts")) || 0;
  attempts++;
  localStorage.setItem("attempts", attempts);

  // Save results in sessionStorage for result.html
  sessionStorage.setItem("score", score);
  sessionStorage.setItem("percent", percent);
  sessionStorage.setItem("pass", pass ? "true" : "false");
  sessionStorage.setItem("attempt", attempts);

  // -------------------- SEND RESULTS TO SERVER --------------------
  fetch("/submit-results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentName,
      studentEmail,
      studentCourse,
      studentDOB,
      studentProvince,
      studentContact,
      studentAddress,
      score,
      totalQuestions: questions.length,
      percent
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Email status:", data.message);
      // Redirect after sending results
      window.location.href = "result.html";
    })
    .catch(err => {
      console.error("Email error:", err);
      // Redirect anyway, don't block student
      window.location.href = "result.html";
    });
}


// -------------------- START BUTTON --------------------
document.getElementById("startBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;
  const studentDOB = document.getElementById("studentDOB").value.trim(); 
  const studentProvince = parseInt(document.getElementById("province").value);
  const contact = document.getElementById("contact").value.trim();
  const address = document.getElementById("address").value.trim();

  if(!name || !email || !course || !dateOfBirth || !contact || !address || !province){
    alert("Please fill in all fields.");
    return;
  }

  sessionStorage.setItem("studentName", name);
  sessionStorage.setItem("studentEmail", email);
  sessionStorage.setItem("studentCourse", course);
  sessionStorage.setItem("studentDOB", dateOfBirth);
  sessionStorage.setItem("studentContact", contact);
  sessionStorage.setItem("studentAddress", address);
  sessionStorage.setItem("studentProvince", province);
  sessionStorage.setItem("currentQuestion", "0");
  sessionStorage.setItem("score", "0");
  sessionStorage.setItem("startTime", new Date());

  window.location.href = "result.html";
});
