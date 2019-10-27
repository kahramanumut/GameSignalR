//cengiz's js try
let userScore =0;
let computerScore =0;
const userScore_span =document.getElementById('user-score');
const computerScore_span =document.getElementById('pc-score');
const scoreBoard_div = document.getElementById('.score-board');
const result_p = document.querySelector('.result > p');
const rock_div = document.getElementById('r');
const paper_div = document.getElementById('p');
const makas_div = document.getElementById('s');

function getComputerChoice() {
  const choices = ['r','p','s'];
  const randomNumber = Math.floor(Math.random()*3);
  return choices[randomNumber];
}
function convertnames(letter){
  if (letter=="r") return "Taş";
  if (letter=="p") return "Kağıt";
  if (letter=="s") return "Makas";

}
function win(userChoice,computerChoice) {
  userScore++;
  userScore_span.innerHTML =userScore;
  computerScore_span.innerHTML=computerScore;
  console.log("Skorun-->"+userScore);
  console.log("KAZANDIN");
  result_p.innerHTML= convertnames(userChoice) +" "+ convertnames(computerChoice) + "'ı yener. Kazandın!!" ;
  document.getElementById(userChoice).classList.add('kazanma-ani');
  setTimeout(function(){document.getElementById(userChoice).classList.remove('kazanma-ani')},300);
  
}

function lose(userChoice,computerChoice) {
  computerScore++;
  userScore_span.innerHTML =userScore;
  computerScore_span.innerHTML=computerScore;
  result_p.innerHTML= convertnames(userChoice) +" "+ convertnames(computerChoice) + "'a kaybeder. Kaybettin!!" ;
  console.log("KAYBETTİN");
  document.getElementById(userChoice).classList.add('kaybetme-ani');
  setTimeout(function(){document.getElementById(userChoice).classList.remove('kaybetme-ani')},300);

}

function draw(userChoice,computerChoice) {
  result_p.innerHTML= convertnames(userChoice) +" "+ convertnames(computerChoice) + " ile aynı. Berabere!!" ;
  console.log("BERABERE");
  document.getElementById(userChoice).classList.add('berabere-ani');
  setTimeout(function(){document.getElementById(userChoice).classList.remove('berabere-ani')},300);
}

function game(userChoice){
  const computerChoice = getComputerChoice();
  console.log("Kullanıcı Seçimi -->" + userChoice);
  console.log("Bilgisayar Seçimi -->"+ computerChoice);
  switch (userChoice + computerChoice) {
    case "rs":
    case "pr":
    case "sp":
    console.log("Kazandın");
      win(userChoice,computerChoice);
      break;
    case "rp":
    case "ps":
    case "sr":
    console.log("Kaybettin");
      lose(userChoice,computerChoice);
      break;
    case "rr":
    case "pp":
    case "ss":
    console.log("Berabere");
      draw(userChoice,computerChoice);
      break;
    }
}

function main(){
  rock_div.addEventListener('click',function() {
    game("r");
  })
  paper_div.addEventListener('click',function() {
    game("p");
  })
  makas_div.addEventListener('click',function() {
    game("s");
  })
  }

main();
