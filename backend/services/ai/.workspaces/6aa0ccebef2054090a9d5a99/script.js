const display = document.getElementById('display');
let currentInput = '';

function updateDisplay() {
    display.textContent = currentInput || '0';
}

function appendNumber(num) {
    // Prevent multiple leading zeros
    if (currentInput === '' && num === '0') return;
    currentInput += num;
    updateDisplay();
}

function setOperator(op) {
    if (currentInput === '' && op !== '-') return; // don't start with operator except minus
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        // replace the operator
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        // Evaluate safely using Function constructor
        // Replace any accidental leading operators like '--' etc.
        const sanitized = currentInput.replace(/[^0-9+\-*/.]/g, '');
        const result = Function('"use strict";return (' + sanitized + ')')();
        currentInput = Number.isFinite(result) ? String(result) : 'Error';
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay();
}

document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const action = button.dataset.action;
        if (number !== undefined) {
            appendNumber(number);
        } else if (action) {
            switch (action) {
                case 'add':
                    setOperator('+');
                    break;
                case 'subtract':
                    setOperator('-');
                    break;
                case 'multiply':
                    setOperator('*');
                    break;
                case 'divide':
                    setOperator('/');
                    break;
                case 'clear':
                    clearAll();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'equals':
                    calculate();
                    break;
            }
        }
    });
});

// Allow keyboard input
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+' ) {
        setOperator('+');
    } else if (e.key === '-') {
        setOperator('-');
    } else if (e.key === '*') {
        setOperator('*');
    } else if (e.key === '/') {
        setOperator('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearAll();
    }
});

updateDisplay();