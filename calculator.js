const display = document.querySelector('.display');
const buttonsContainer = document.querySelector('.buttons');

let displayValue = '0';
let firstOperand = null;
let operator = null;
let isWaitingForSecondOperand = false;

function updateDisplay() {
    let [integerPart, decimalPart] = displayValue.split('.');
    
    let formattedInteger;
    if (isNaN(parseFloat(integerPart.replace(/,/g, '')))) {
        formattedInteger = integerPart;
    } else {
        formattedInteger = parseFloat(integerPart.replace(/,/g, '')).toLocaleString('en-US', {
            maximumFractionDigits: 0
        });
    }

    let textToDisplay = formattedInteger;
    if (decimalPart !== undefined) {
        textToDisplay = `${formattedInteger}.${decimalPart}`;
    }

    if (textToDisplay.length > 9 && textToDisplay.length <= 15) {
        display.style.fontSize = '2.2em';
    } else if (textToDisplay.length > 15) {
        display.style.fontSize = '1.8em';
    } else {
        display.style.fontSize = '3.2em';
    }

    display.textContent = textToDisplay;
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
        const currentDisplayValue = displayValue.replace(/,/g, '');
        
        if (currentDisplayValue.length >= 15) {
            return;
        }
        
        displayValue = currentDisplayValue === '0' ? digit : currentDisplayValue + digit;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (isWaitingForSecondOperand) {
        displayValue = '0.';
        isWaitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    
    const currentDisplayValue = displayValue.replace(/,/g, '');

    if (!currentDisplayValue.includes(dot)) {
        displayValue = currentDisplayValue + dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue.replace(/,/g, ''));

    if (isNaN(inputValue)) return;

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
    if (op === '÷') {
        if (second === 0) {
            return 'Error';
        }
        return first / second;
    }
    return second;
}

buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.matches('button')) {
        return;
    }

    const key = target.textContent;
    const buttonClass = target.classList;

    if (displayValue === 'Error' && key !== 'AC') {
        return;
    }

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
        const currentValue = parseFloat(displayValue.replace(/,/g, ''));
        if (currentValue === 0 || isNaN(currentValue)) return;
        displayValue = String(currentValue * -1);
        updateDisplay();
        return;
    }

    if (key === '%') {
        const currentValue = parseFloat(displayValue.replace(/,/g, ''));
        if (isNaN(currentValue)) return;
        displayValue = String(currentValue / 100);
        updateDisplay();
        return;
    }

    if (key === '=') {
        if (operator === null || firstOperand === null || isWaitingForSecondOperand) {
            return;
        }

        const secondOperand = parseFloat(displayValue.replace(/,/g, ''));
        
        if (isNaN(secondOperand)) return;

        const result = calculate(firstOperand, secondOperand, operator);

        displayValue = String(result);
        updateDisplay(); 
        
        firstOperand = null;
        operator = null;
        isWaitingForSecondOperand = true; 
        
        return;
    }

    inputDigit(key);
});

updateDisplay();