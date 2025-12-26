let number: string[] = [''];
let outputNumber: string = '';
const output = document.querySelector<HTMLElement>('#output');
const operators: string[] = ['+', '-', '*', '/'];

const keyMap: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '.': '.',
  ',': '.',
  Backspace: 'Delete',
  Delete: 'Clear',
  Enter: '=',
  '=': '=',
};

window.addEventListener('keydown', (e) => {
  const action = keyMap[e.key];
  if (!action) return;

  e.preventDefault();

  const button = document.querySelector<HTMLButtonElement>(
    `button[data-key="${action}"]`,
  );
  if (button) {
    button.click();
  }
});

document
  .querySelectorAll<HTMLButtonElement>('.number')
  .forEach((numberInput) => {
    numberInput.addEventListener('click', () => {
      if (!number[number.length - 1]?.includes('.')) {
        number[number.length - 1] += numberInput.value;
      } else if (numberInput.value !== '.') {
        number[number.length - 1] += numberInput.value;
      }
      if (output) {
        outputNumber = '';
        number.forEach((number) => {
          outputNumber += number;
        });
        output.innerHTML = outputNumber;
        adjustFontSize();
      }
    });
  });

document
  .querySelector<HTMLButtonElement>('.clear')
  ?.addEventListener('click', () => {
    number = [''];
    outputNumber = '';
    if (output) {
      output.innerHTML = '';
    }
  });

document
  .querySelectorAll<HTMLButtonElement>('.operator')
  ?.forEach((operatorInput) => {
    operatorInput.addEventListener('click', () => {
      if (
        number[0] &&
        !operators.includes(number[number.length - 1]!) &&
        number[number.length - 1] !== ''
      ) {
        number.push(operatorInput.value);
        number.push('');

        if (output) {
          outputNumber += operatorInput.value;
          output.innerHTML = outputNumber;
        }
      }
    });
  });

document
  .querySelector<HTMLButtonElement>('.delete')
  ?.addEventListener('click', () => {
    const lastIndex = number.length - 1;

    if (number[lastIndex] && number[lastIndex] !== '') {
      // Remove last character of current number
      number[lastIndex] = number[lastIndex].slice(0, -1);
    } else if (lastIndex > 0) {
      // Current number is empty, remove last operator
      number.pop(); // remove operator

      // Now the previous number is the current number
      const prevIndex = number.length - 1;
      if (number[prevIndex]) {
        // Remove last character of the previous number
        number[prevIndex] = number[prevIndex].slice(0, -1);

        // If it becomes empty, keep it as an empty string to allow new digits
        if (number[prevIndex] === '') {
          number[prevIndex] = '';
        }
      }
    }

    outputNumber = number.join('');
    if (output) output.innerHTML = outputNumber;
  });

document
  .querySelector<HTMLButtonElement>('.equals')
  ?.addEventListener('click', () => {
    if (number.length > 2 && number[number.length - 1] !== '') {
      if (output) {
        const result = solveEquation(number).toString();
        output.innerHTML = result;
        outputNumber = result;
        number = [result];
      }
    } else {
      if (output) {
        output.innerHTML = 'Error';
        outputNumber = '';
        number = [''];
      }
    }
  });

function adjustFontSize() {
  const maxLength = 35;
  if (output) {
    if (output?.innerText.length > maxLength) {
      output.style.fontSize = `${Math.max(12, 24 - (output?.innerText.length - maxLength))}px`;
    } else {
      output.style.fontSize = '24px';
    }
  }
}

function solveEquation(arr: string[]) {
  const postfix = infixToPostfix(arr);
  return evaluatePostfix(postfix);
}

type Token = string | number;

// Convert infix array to postfix (RPN)
const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

function infixToPostfix(arr: Token[]): Token[] {
  const output: Token[] = [];
  const stack: string[] = [];

  for (const token of arr) {
    if (typeof token === 'number' || !isNaN(Number(token))) {
      output.push(Number(token));
    } else {
      while (
        stack.length > 0 &&
        precedence[stack[stack.length - 1]!]! >= precedence[token as string]!
      ) {
        output.push(stack.pop()!);
      }
      stack.push(token as string);
    }
  }

  while (stack.length > 0) {
    output.push(stack.pop()!);
  }

  return output;
}

function evaluatePostfix(postfix: Token[]): number {
  const stack: number[] = [];

  for (const token of postfix) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result: number;

      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = a / b;
          break;
        default:
          throw new Error(`Unknown operator: ${token}`);
      }

      stack.push(Math.round(result * 10000) / 10000);
    }
  }

  return stack[0]!;
}
