const display = document.querySelector('.display');
const buttonsContainer = document.querySelector('.buttons');

let displayValue = '0'; 
let firstOperand = null; 
let operator = null; 
let isWaitingForSecondOperand = false; 

function updateDisplay() {
    display.textContent = displayValue;
}

function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    isWaitingForSecondOperand = false;
    updateDisplay();
}

function inputDigit(digit) {
    if (isWaitingForSecondOperand) {
        displayValue = digit;
        isWaitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (isWaitingForSecondOperand) {
        displayValue = '0.';
        isWaitingForSecondOperand = false;
        return;
    }
    
    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } 

    operator = nextOperator;
    isWaitingForSecondOperand = true; 
}

function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '×') return first * second;
    if (op === '÷') return first / second;
    return second; 
}

buttonsContainer.addEventListener('click', (event) => {
    const target = event.target; 

    if (!target.matches('button')) {
        return;
    }

    const key = target.textContent; 
    const buttonClass = target.classList; 

    if (buttonClass.contains('operator') && key !== '=') {
        handleOperator(key);
        return;
    }

    if (key === '.') {
        inputDecimal(key);
        return;
    }

    if (key === 'AC') {
        resetCalculator();
        return;
    }

    if (key === '+/-') {
        displayValue = String(parseFloat(displayValue) * -1);
        updateDisplay();
        return;
    }

    if (key === '%') {
        displayValue = String(parseFloat(displayValue) / 100);
        updateDisplay();
        return;
    }

    if (key === '=') {
        if (operator === null || firstOperand === null || isWaitingForSecondOperand) {
            return;
        }

        const secondOperand = parseFloat(displayValue);
        const result = calculate(firstOperand, secondOperand, operator);

        displayValue = String(result);
        firstOperand = null; 
        operator = null; 
        isWaitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    inputDigit(key);
});

updateDisplay();