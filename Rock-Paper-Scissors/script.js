const buttonsCollection = document.getElementsByClassName("choice");
const buttons = Array.from(buttonsCollection);
let outcome = null;
let score = 0;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const playerPick = button.getAttribute("value");
    const dealerPick = getComputerChoice();
    updateState(playerPick, dealerPick);
  })
})

function getComputerChoice(){
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  const pick = randomNumber > 2 ? "scissors" : randomNumber > 1 ? "paper" : "rock";
  return pick;
}

function updateState(playerPick, dealerPick){
  if(playerPick === dealerPick){
    outcome = "Draw"
  }
  else if(
    playerPick === "rock" && dealerPick === "scissors" ||
    playerPick === "paper" && dealerPick === "rock" ||
    playerPick === "scissors" && dealerPick === "paper"
   ){
    outcome = "Player Wins!"
    score++;
   }
   else outcome = "Dealer Wins!";

   document.getElementById("you").textContent= playerPick;
   document.getElementById("dealer").textContent= dealerPick;
   document.getElementById("score").textContent = score;
   document.getElementById("outcome").textContent = outcome;
}