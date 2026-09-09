const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentExpression = '';

function updateDisplay() {
    display.textContent = currentExpression || '0';
}

function appendValue(value) {
    // Prevent multiple operators in a row
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentExpression.slice(-1);
    if (operators.includes(value)) {
        if (currentExpression === '' && value !== '-') {
            // Do not allow starting expression with +, *, /
            return;
        }
        if (operators.includes(lastChar)) {
            // Replace the previous operator
            currentExpression = currentExpression.slice(0, -1) + value;
            updateDisplay();
            return;
        }
    }
    currentExpression += value;
    updateDisplay();
}

function calculate() {
    try {
        // Use Function constructor for safe evaluation of simple arithmetic
        // Replace any accidental leading zeros (e.g., 08) which can cause octal interpretation
        const sanitized = currentExpression.replace(/^0+(?=\d)/, '');
        const result = Function(`"use strict";return (${sanitized})`)();
        currentExpression = String(result);
    } catch (e) {
        currentExpression = 'Error';
    }
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '';
    updateDisplay();
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        if (value !== null) {
            appendValue(value);
        } else if (btn.id === 'equals') {
            calculate();
        } else if (btn.id === 'clear') {
            clearDisplay();
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!isNaN(key) || key === '.' ) {
        appendValue(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendValue(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    }
});

updateDisplay();