// querySelectorAll -> returns Static NodeList (does not update when the DOM changes), but each item is a live reference to the DOM element (text, style), supports foreach
// getElementsByClassName -> returns a live HTMLCollection ( updates when the DOM changes (elements removed or added)
// returns are no Array and must be converted first -> Array.from(nodeList)
const buttonsCollection = document.querySelectorAll('.choice');
let outcome = null;
let score = 0;

buttonsCollection.forEach((button) => {
  button.addEventListener('click', () => {
    const playerPick = button.getAttribute('value');
    const dealerPick = getComputerChoice();
    updateState(playerPick, dealerPick);
  });
});

function getComputerChoice() {
  // Math.floor rounds down
  // Math.random returns 0 >= x < 1
  // Multiplication scales the random number to a range [0,3]
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  const pick =
    randomNumber > 2 ? 'scissors' : randomNumber > 1 ? 'paper' : 'rock';
  return pick;
}

function updateState(playerPick, dealerPick) {
  if (playerPick === dealerPick) {
    outcome = 'Draw';
  } else if (
    (playerPick === 'rock' && dealerPick === 'scissors') ||
    (playerPick === 'paper' && dealerPick === 'rock') ||
    (playerPick === 'scissors' && dealerPick === 'paper')
  ) {
    outcome = 'Player Wins!';
    score++;
  } else outcome = 'Dealer Wins!';

  document.getElementById('you').textContent = playerPick;
  document.getElementById('dealer').textContent = dealerPick;
  document.getElementById('score').textContent = score;
  document.getElementById('outcome').textContent = outcome;
}
