// -------------------- STUDENT INFO --------------------
const studentName = sessionStorage.getItem("studentName") || "Student";
const studentEmail = sessionStorage.getItem("studentEmail") || "idah@southernlabs.com";
const studentCourse = sessionStorage.getItem("studentCourse") || "N/A";
const studentID = sessionStorage.getItem("studentID") || "N/A";
const studentAge = sessionStorage.getItem("studentAge") || "N/A";
const studentContact = sessionStorage.getItem("studentContact") || "N/A";
const studentAddress = sessionStorage.getItem("studentAddress") || "N/A";

// -------------------- TEST STATE --------------------
let currentQuestion = parseInt(sessionStorage.getItem("currentQuestion")) || 0;
let score = parseInt(sessionStorage.getItem("score")) || 0;
const totalQuestions = 40;
const passMark = 60;

// -------------------- TIMER --------------------
let startTime = sessionStorage.getItem("startTime");
if(!startTime){
  startTime = new Date();
  sessionStorage.setItem("startTime", startTime);
}
const endTime = new Date(new Date(startTime).getTime() + 1*60*60*1000);
const timerEl = document.getElementById("timer");
let timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
  const now = new Date();
  let diff = Math.floor((endTime - now)/1000);
  if(diff <= 0){ diff=0; endTest(); }
  const h = String(Math.floor(diff/3600)).padStart(2,'0');
  const m = String(Math.floor((diff%3600)/60)).padStart(2,'0');
  const s = String(diff%60).padStart(2,'0');
  timerEl.textContent = `Time Left: ${h}:${m}:${s}`;
}

// -------------------- 40 TRICKY QUESTIONS --------------------
const questions = [ {instructions:"Q1: Number Sequence Logic", question:"2, 6, 12, 20, 30, ?", options:["36","40","42","44"], answer:2, example:"Add 4, 6, 8, 10,... → next number"},
{instructions:"Q2: Word Decipher", question:"If A=1, B=20, C=3, what is DOG?", options:["64","57","48","50"], answer:1, example:"Sum letter values according to mapping A=1,B=20,C=3,..."},
{instructions:"Q3: Grid Pattern", question:"⬛⬜⬛⬜ ⬛⬜⬛ ?", options:["⬛","⬜","⬜⬛","⬛⬛"], answer:1, example:"Pattern alternates black and white squares"}, 
{instructions:"Q4: Math Logic", question:"1, 4, 9, 16, 25, ?", options:["30","36","35","40"], answer:1, example:"Squares of 1,2,3,4,5 → next square"},
{instructions:"Q5: Letter Sequence", question:"A, C, F, J, O, ?", options:["T","S","U","R"], answer:1, example:"Positions of letters increase cumulatively"},
{instructions:"Q6: Grid Puzzle", question:"▲ ▼ ▲ ▼ ▲ ?", options:["▲","▼","◆","●"], answer:1, example:"Symbols alternate in order"},
{instructions:"Q7: Math Puzzle", question:"If 3×2=6, 4×3=12, 5×4=?, 6×5=?", options:["20,25","20,30","20,32","20,28"], answer:1, example:"Multiply numbers accordingly"},
{instructions:"Q8: Word Logic", question:"Find the odd one out: Apple, Banana, Orange, Carrot", options:["Apple","Banana","Orange","Carrot"], answer:3, example:"One is a vegetable, others are fruits"},
{instructions:"Q9: Number Puzzle", question:"If 2+3=10, 3+4=21, 4+5=?, 5+6=?", options:["30,35","35,41","36,45","40,50"], answer:2, example:"Follow the pattern: a+b → a*b + b"}, 
{instructions:"Q10: Letter Decipher", question:"If Z=1, Y=2, X=3… what is CAT?", options:["54","26","24","23"], answer:2, example:"Sum the letter values according to the reversed alphabet mapping"}, 
// Add more questions with tricky patterns, mappings, grid puzzles 
{instructions:"Q11: Number Logic", question:"5, 10, 20, 40, ?", options:["50","70","80","60"], answer:2, example:"Multiply by 2 each step"}, 
{instructions:"Q12: Grid Puzzle", question:"Which number fills the blank?\n2 4 8\n3 6 12\n4 8 ?", options:["16","18","20","24"], answer:0, example:"Each row doubles the number"}, 
{instructions:"Q13: Word Pattern", question:"fast, faster, fastest, ?", options:["fastestest","more fast","supreme","fastest"], answer:3, example:"Use superlative form"}, 
{instructions:"Q14: Logic Puzzle", question:"Tom > Jack, Jack > Harry. Who is shortest?", options:["Tom","Jack","Harry","Cannot tell"], answer:2, example:"Shortest is the one lesser than others"},
{instructions:"Q15: Number Sequence", question:"1,1,2,3,5,8, ?", options:["10","12","13","15"], answer:2, example:"Fibonacci sequence"}, 
{instructions:"Q16: Word Decipher", question:"If PEN=16, NOTE=29, BOOK=?", options:["24","28","27","26"], answer:3, example:"Sum letter values using a given mapping pattern"}, 
{instructions:"Q17: Grid Pattern", question:"🔺 🔻 🔺 ? 🔺 🔻 ?", options:["🔺 🔻","🔻 🔺","🔺 🔺","🔻 🔻"], answer:1, example:"Symbols alternate in pairs"}, 
{instructions:"Q18: Math Logic", question:"7,14,28,?,112", options:["42","56","64","58"], answer:1, example:"Multiply by 2 each step"}, 
{instructions:"Q19: Letter Series", question:"D, F, I, M, ?", options:["Q","R","S","T"], answer:0, example:"Differences: +2,+3,+4,+5 → Next letter"}, 
{instructions:"Q20: Logic Puzzle", question:"5 red,7 blue,8 green balls. Probability blue?", options:["7/20","5/20","8/20","1/3"], answer:0, example:"Blue balls out of total"}, 
{instructions:"Q21: Word Puzzle", question:"Unscramble: LPAEP", options:["APPLE","PEPAL","LEAPP","PALPE"], answer:0, example:"Rearrange letters to form a word"}, 
{instructions:"Q22: Number Logic", question:"3, 9, 27, ?", options:["54","81","72","90"], answer:1, example:"Multiply by 3 each step"}, 
{instructions:"Q23: Grid Sequence", question:"1,2,4,7,11, ?", options:["16","17","18","19"], answer:0, example:"Add increasing differences +1,+2,+3,..."}, 
{instructions:"Q24: Letter Decipher", question:"DOG=7, CAT=6, MOUSE=?", options:["10","11","12","9"], answer:1, example:"Sum letters using given mapping"}, 
{instructions:"Q25: Logic Puzzle", question:"1kg steel vs 1kg cotton?", options:["Steel","Cotton","Both same","Cannot tell"], answer:2, example:"Weights same"}, 
{instructions:"Q26: Number Pattern", question:"5,10,20,35, ?", options:["50","55","60","65"], answer:1, example:"Differences increase +5,+10,+15,..."}, 
{instructions:"Q27: Word Logic", question:"Antonym of 'Expand'?", options:["Contract","Extend","Open","Increase"], answer:0, example:"Opposite meaning"}, 
{instructions:"Q28: Grid Puzzle", question:"🔴 🔵 🔴 🔵 🔴 ?", options:["🔴","🔵","🔵🔴","🔴🔴"], answer:1, example:"Symbols alternate"}, 
{instructions:"Q29: Math Puzzle", question:"2+5=12, 3+6=21, 4+7=?", options:["30","33","35","36"], answer:2, example:"Use pattern (a+b)*a"}, 
{instructions:"Q30: Letter Series", question:"Z, X, U, Q, ?", options:["M","N","O","P"], answer:0, example:"Decreasing letter positions -2,-3,-4,-5"}, 
{instructions:"Q31: Word Puzzle", question:"Synonym of 'Quick'?", options:["Fast","Slow","Lazy","Tardy"], answer:0, example:"Choose synonym"}, 
{instructions:"Q32: Number Logic", question:"1,8,27,?,125", options:["49","64","81","100"], answer:1, example:"Cubes:1³,2³,..."}, 
{instructions:"Q33: Grid Puzzle", question:"■ ▲ ■ ▲ ■ ?", options:["■","▲","▲■","■■"], answer:1, example:"Alternate pattern"}, 
{instructions:"Q34: Letter Decipher", question:"A=1,B=2,...,Z=26, HELLO?", options:["52","48","50","44"], answer:2, example:"Sum letter values"}, 
{instructions:"Q35: Logic Puzzle", question:"All cats animals, all animals have tails. Cats have tails?", options:["Yes","No","Cannot tell","Sometimes"], answer:0, example:"Apply logic"}, 
{instructions:"Q36: Math Logic", question:"2,6,12,20,30, ?", options:["36","42","40","38"], answer:1, example:"Pattern +4,+6,+8,..."}, 
{instructions:"Q37: Grid Pattern", question:"🔺🔻🔺🔻 ? 🔺🔻 ?", options:["🔺🔺","🔺🔻","🔻🔺","🔻🔻"], answer:1, example:"Alternates in pairs"}, 
{instructions:"Q38: Word Decipher", question:"HOME=34, SCHOOL=57, OFFICE=?", options:["52","53","55","54"], answer:3, example:"Sum letter values"}, 
{instructions:"Q39: Number Puzzle", question:"1,3,6,10,15, ?", options:["20","21","19","18"], answer:0, example:"Triangular numbers"}, 
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
let testActive = true; // Track if test is running

function handleCheat(reason){
  if(!testActive) return; // ignore after test ends
  cheatCount++;
  alert(`${reason} Violations: ${cheatCount}/${maxCheats}`);
  if(cheatCount >= maxCheats){
    alert("Too many violations. Test will end and you FAIL.");
    endTest(true); // force fail
  }
}

// Warn or fail on tab switch
window.addEventListener('blur', ()=> handleCheat("Do not leave the test window!"));

// Disable right-click
window.addEventListener('contextmenu', (e)=>{
  e.preventDefault();
  handleCheat("Right-click is disabled!");
});

// Detect F12 / DevTools (basic)
window.addEventListener('keydown', (e)=>{
  if(e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key==="I")){
    handleCheat("DevTools opening detected!");
  }
});

// -------------------- END TEST --------------------
function endTest(forceFail=false){
  testActive = false;       // <-- DISABLE cheat detection
  clearInterval(timerInterval); // Stop the timer
  const percent = forceFail ? 0 : Math.floor((score / questions.length) * 100);
  const pass = !forceFail && percent >= passMark;

  finalResultEl.innerHTML = `<p class="${pass ? 'pass' : 'fail'}">
    ${pass ? 'PASSED ✅' : 'FAILED ❌'}<br>
    Score: ${percent}% (${score}/${questions.length})
  </p>`;

  // Send results to server
  fetch("/submit-results", {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      studentName,
      studentEmail,
      studentCourse,
      studentID,
      studentAge,
      studentContact,
      studentAddress,
      score,
      totalQuestions,
      percent
    })
  })
  .then(res => res.json())
  .then(data => console.log('Email status:', data.message))
  .catch(err => console.error('Email error:', err));
}

// -------------------- START BUTTON --------------------
document.getElementById("startBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;
  const studentID = document.getElementById("studentID").value.trim(); 
  const selectedAge = parseInt(document.getElementById("age").value);
  const contact = document.getElementById("contact").value.trim();
  const address = document.getElementById("address").value.trim();

  if(!name || !email || !course || !idNumber || !contact || !address || !selectedAge){
    alert("Please fill in all fields.");
    return;
  }
	// Validate SA ID
  if (!isValidSAID(studentID)) {
    alert("Invalid South African ID number. Please enter a valid ID.");
    return;
  }

  // Validate age against ID
  const realAge = getAgeFromID(studentID);
  if (realAge !== selectedAge) {
    alert(`Age does not match ID number. Your real age is ${realAge}.`);
    return;
  }

  sessionStorage.setItem("studentName", name);
  sessionStorage.setItem("studentEmail", email);
  sessionStorage.setItem("studentCourse", course);
  sessionStorage.setItem("studentID", idNumber);
  sessionStorage.setItem("studentContact", contact);
  sessionStorage.setItem("studentAddress", address);
  sessionStorage.setItem("studentAge", selectedAge);
  sessionStorage.setItem("currentQuestion", "0");
  sessionStorage.setItem("score", "0");
  sessionStorage.setItem("startTime", new Date());

  window.location.href = "test.html";
});
