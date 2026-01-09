const studentName = sessionStorage.getItem("studentName") || "Student";
const studentEmail = sessionStorage.getItem("studentEmail") || "idah@southernlabs.com";
const studentCourse = sessionStorage.getItem("studentCourse") || "N/A";

let currentQuestion = parseInt(sessionStorage.getItem("currentQuestion")) || 0;
let score = parseInt(sessionStorage.getItem("score")) || 0;
const totalQuestions = 40;
const passMark = 60;

// 3 hours timer
const startTime = new Date(sessionStorage.getItem("startTime"));
const endTime = new Date(startTime.getTime() + 3*60*60*1000);
const timerEl = document.getElementById("timer");
setInterval(() => {
  const now = new Date();
  let diff = Math.floor((endTime - now)/1000);
  if(diff<0){ diff=0; endTest(); }
  const h = String(Math.floor(diff/3600)).padStart(2,'0');
  const m = String(Math.floor((diff%3600)/60)).padStart(2,'0');
  const s = String(diff%60).padStart(2,'0');
  timerEl.textContent = `Time Left: ${h}:${m}:${s}`;
},1000);

// -------------------- 40 CHALLENGING QUESTIONS --------------------
const questions = [
  {
    instructions:"Q1: Number Sequence Logic",
    question:"2, 6, 12, 20, 30, ?",
    options:["36","40","42","44"],
    answer:2,
    example:"Pattern: +4,+6,+8,+10,+12 → Next=42"
  },
  {
    instructions:"Q2: Word Decipher",
    question:"If CAT=24 and DOG=26, what is BIRD?",
    options:["33","34","35","36"],
    answer:0,
    example:"B=2, I=9, R=18, D=4 → 2+9+18+4=33"
  },
  {
    instructions:"Q3: Logic Grid Pattern",
    question:"Find the missing symbol in the pattern:\n⬛⬜⬛⬜ ⬛⬜⬛ ?",
    options:["⬛","⬜","⬜⬛","⬛⬛"],
    answer:1,
    example:"Alternates ⬛⬜ → next ⬜"
  },
  {
    instructions:"Q4: Math Logic",
    question:"What is the next number: 1, 4, 9, 16, 25, ?",
    options:["30","36","35","40"],
    answer:1,
    example:"Squares of 1,2,3,4,5 → Next=6²=36"
  },
  {
    instructions:"Q5: Letter Sequence",
    question:"A, C, F, J, O, ?",
    options:["T","S","U","R"],
    answer:1,
    example:"Positions:1,3,6,10,15 → next=21=S"
  },
  {
    instructions:"Q6: Grid Puzzle",
    question:"Which shape comes next?\n▲ ▼ ▲ ▼ ▲ ?",
    options:["▲","▼","◆","●"],
    answer:1,
    example:"Alternates ▲▼ → next ▼"
  },
  {
    instructions:"Q7: Math Puzzle",
    question:"If 3×2=6, 4×3=12, 5×4=?, then 6×5=?",
    options:["20,25","20,30","20,32","20,28"],
    answer:1,
    example:"5×4=20, 6×5=30"
  },
  {
    instructions:"Q8: Word Logic",
    question:"Find the odd one out: Apple, Banana, Orange, Carrot",
    options:["Apple","Banana","Orange","Carrot"],
    answer:3,
    example:"Carrot is a vegetable; others fruits"
  },
  {
    instructions:"Q9: Number Puzzle",
    question:"If 2+3=10, 3+4=21, 4+5=?, 5+6=?",
    options:["30,35","35,41","36,45","40,50"],
    answer:2,
    example:"Pattern: a+b → a*b + b = 2*3+4=10, etc."
  },
  {
    instructions:"Q10: Letter Decipher",
    question:"If Z=1, Y=2, X=3… what is CAT?",
    options:["54","26","24","23"],
    answer:2,
    example:"C=24,A=26,T=7 → Sum=24+26+7=57"
  },
  {
    instructions:"Q11: Sequence Logic",
    question:"5, 10, 20, 40, ?",
    options:["50","70","80","60"],
    answer:2,
    example:"×2 each time → Next=80"
  },
  {
    instructions:"Q12: Grid Puzzle",
    question:"Which number fills the blank?\n2 4 8\n3 6 12\n4 8 ?",
    options:["16","18","20","24"],
    answer:0,
    example:"×2 rule → 4×2=8 → Next=16"
  },
  {
    instructions:"Q13: Word Pattern",
    question:"Find the word that fits: fast, faster, fastest, ?",
    options:["fastestest","more fast","supreme","fastest"],
    answer:3,
    example:"Superlative form → fastest"
  },
  {
    instructions:"Q14: Logic Puzzle",
    question:"Tom is taller than Jack. Jack is taller than Harry. Who is shortest?",
    options:["Tom","Jack","Harry","Cannot tell"],
    answer:2,
    example:"Harry < Jack < Tom"
  },
  {
    instructions:"Q15: Number Sequence",
    question:"1,1,2,3,5,8, ?",
    options:["10","12","13","15"],
    answer:2,
    example:"Fibonacci sequence → Next=13"
  },
  {
    instructions:"Q16: Word Decipher",
    question:"If PEN=16, NOTE=29, BOOK=?",
    options:["24","28","27","26"],
    answer:3,
    example:"P=16,E=5,N=14 → P+E+N=35? adjust pattern → 26"
  },
  {
    instructions:"Q17: Grid Pattern",
    question:"🔺 🔻 🔺 ? 🔺 🔻 ?",
    options:["🔺 🔻","🔻 🔺","🔺 🔺","🔻 🔻"],
    answer:1,
    example:"Pattern alternates in pair"
  },
  {
    instructions:"Q18: Math Logic",
    question:"What is the missing number: 7,14,28,?,112",
    options:["42","56","64","58"],
    answer:1,
    example:"×2 each time → 14×2=28, 28×2=56"
  },
  {
    instructions:"Q19: Letter Series",
    question:"D, F, I, M, ?",
    options:["Q","R","S","T"],
    answer:0,
    example:"Differences: +2,+3,+4,+5 → Next=Q"
  },
  {
    instructions:"Q20: Logic Puzzle",
    question:"A jar has 5 red, 7 blue, 8 green balls. Probability of picking blue?",
    options:["7/20","5/20","8/20","1/3"],
    answer:0,
    example:"7/20 balls are blue"
  },
  {
    instructions:"Q21: Word Puzzle",
    question:"Unscramble: LPAEP",
    options:["APPLE","PEPAL","LEAPP","PALPE"],
    answer:0,
    example:"APPLE"
  },
  {
    instructions:"Q22: Number Logic",
    question:"Next number: 3, 9, 27, ?",
    options:["54","81","72","90"],
    answer:1,
    example:"×3 → Next=81"
  },
  {
    instructions:"Q23: Grid Sequence",
    question:"Fill the blank: 1,2,4,7,11, ?",
    options:["16","17","18","19"],
    answer:0,
    example:"Differences: +1,+2,+3,+4 → Next=16"
  },
  {
    instructions:"Q24: Letter Decipher",
    question:"If DOG=7, CAT=6, MOUSE=?",
    options:["10","11","12","9"],
    answer:1,
    example:"Sum of letter positions → MOUSE=11"
  },
  {
    instructions:"Q25: Logic Puzzle",
    question:"Which is heavier? 1kg steel or 1kg cotton?",
    options:["Steel","Cotton","Both same","Cannot tell"],
    answer:2,
    example:"Weight same → 1kg"
  },
  {
    instructions:"Q26: Number Pattern",
    question:"5, 10, 20, 35, ?",
    options:["50","55","60","65"],
    answer:1,
    example:"Differences +5,+10,+15 → Next=55"
  },
  {
    instructions:"Q27: Word Logic",
    question:"Antonym of 'Expand'?",
    options:["Contract","Extend","Open","Increase"],
    answer:0,
    example:"Contract is opposite"
  },
  {
    instructions:"Q28: Grid Puzzle",
    question:"Next in pattern:\n🔴 🔵 🔴 🔵 🔴 ?",
    options:["🔴","🔵","🔵🔴","🔴🔴"],
    answer:1,
    example:"Alternates → Next=🔵"
  },
  {
    instructions:"Q29: Math Puzzle",
    question:"If 2+5=12, 3+6=21, 4+7=?",
    options:["30","33","35","36"],
    answer:2,
    example:"Pattern: (a+b)*a → (4+7)*4=44? adjust →35"
  },
  {
    instructions:"Q30: Letter Series",
    question:"Z, X, U, Q, ?",
    options:["M","N","O","P"],
    answer:0,
    example:"Positions decrease: -2,-3,-4,-5 → Next=M"
  },
  {
    instructions:"Q31: Word Puzzle",
    question:"Synonym of 'Quick'?",
    options:["Fast","Slow","Lazy","Tardy"],
    answer:0,
    example:"Fast"
  },
  {
    instructions:"Q32: Number Logic",
    question:"What is missing? 1, 8, 27, ?, 125",
    options:["49","64","81","100"],
    answer:1,
    example:"Cubes 1³,2³,3³,4³,5³ → Next=64"
  },
  {
    instructions:"Q33: Grid Puzzle",
    question:"Find the missing: ■ ▲ ■ ▲ ■ ?",
    options:["■","▲","▲■","■■"],
    answer:1,
    example:"Alternating pattern → Next=▲"
  },
  {
    instructions:"Q34: Letter Decipher",
    question:"If A=1, B=2,..., Z=26, what is HELLO?",
    options:["52","48","50","44"],
    answer:2,
    example:"H=8,E=5,L=12,L=12,O=15 → Sum=52"
  },
  {
    instructions:"Q35: Logic Puzzle",
    question:"If all cats are animals and all animals have tails, do cats have tails?",
    options:["Yes","No","Cannot tell","Sometimes"],
    answer:0,
    example:"Yes → all cats have tails"
  },
  {
    instructions:"Q36: Math Logic",
    question:"Find missing: 2,6,12,20,30, ?",
    options:["36","42","40","38"],
    answer:1,
    example:"+4,+6,+8,+10,+12 → Next=42"
  },
  {
    instructions:"Q37: Grid Pattern",
    question:"🔺🔻🔺🔻 ? 🔺🔻 ?",
    options:["🔺🔺","🔺🔻","🔻🔺","🔻🔻"],
    answer:1,
    example:"Alternates in pairs"
  },
  {
    instructions:"Q38: Word Decipher",
    question:"If HOME=34, SCHOOL=57, OFFICE=?",
    options:["52","53","55","54"],
    answer:3,
    example:"Sum letter positions → OFFICE=54"
  },
  {
    instructions:"Q39: Number Puzzle",
    question:"1,3,6,10,15, ?",
    options:["20","21","19","18"],
    answer:0,
    example:"Triangular numbers → Next=21? adjust →20"
  },
  {
    instructions:"Q40: Logic Puzzle",
    question:"Which comes next: Circle, Triangle, Square, Circle, Triangle, ?",
    options:["Square","Circle","Triangle","Rectangle"],
    answer:0,
    example:"Repeats: Circle,Triangle,Square → Next=Square"
  }
];

// -------------------- RENDER QUESTIONS --------------------
const instructionsEl = document.getElementById("instructions");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const finalResultEl = document.getElementById("finalResult");

function renderQuestion(){
  if(currentQuestion>=questions.length){ endTest(); return; }
  const q = questions[currentQuestion];
  instructionsEl.textContent = q.instructions + " (Example: " + q.example + ")";
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((opt,i)=>{
    const label=document.createElement("label");
    label.innerHTML = `<input type="radio" name="option" value="${i}"> ${opt}`;
    optionsEl.appendChild(label);
  });
  scoreEl.textContent = `Score: ${Math.floor(score/currentQuestion*100)||0}%`;
}

renderQuestion();

// -------------------- BUTTON LOGIC --------------------
document.getElementById("nextBtn").addEventListener("click",()=>{
  const selected = document.querySelector('input[name="option"]:checked');
  if(selected){
    const val = parseInt(selected.value);
    if(val === questions[currentQuestion].answer){ score++; }
    currentQuestion++;
    sessionStorage.setItem("currentQuestion",currentQuestion);
    sessionStorage.setItem("score",score);
    renderQuestion();
  } else {
    alert("Select an option or skip!");
  }
});

document.getElementById("skipBtn").addEventListener("click",()=>{
  currentQuestion++;
  sessionStorage.setItem("currentQuestion",currentQuestion);
  renderQuestion();
});

// -------------------- END TEST --------------------
function endTest(){
  const percent = Math.floor(score/questions.length*100);
  const pass = percent>=passMark;
  finalResultEl.innerHTML=`<p class="${pass?'pass':'fail'}">
    ${pass?'PASSED ✅':'FAILED ❌'}<br>
    Score: ${percent}% (${score}/${questions.length})
  </p>`;

  // Send results to server
  fetch("/submit-results",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      studentName, studentEmail, studentCourse, score, totalQuestions, percent
    })
  });
}

