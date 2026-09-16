// script.js - Vanilla Calculator Logic
const screen = document.getElementById('screen');
const keys = document.querySelectorAll('.keypad button');
const toggleTrack = document.getElementById('toggleTrack');
const toggleDot = document.getElementById('toggleDot');
const themeBtns = document.querySelectorAll('[data-theme-btn]');
let current = '0';
let previous = '';
let operation = null;
let overwrite = false;

function formatDisplay(numStr) {
  if (numStr === 'Error' || numStr === '') return numStr || '0';
  if (numStr === '-') return '-';
  const [intPart, decPart] = numStr.split('.');
  const isNeg = intPart.startsWith('-');
  const rawInt = isNeg ? intPart.slice(1) : intPart;
  if (rawInt === '' || rawInt === '-') return numStr;
  const formattedInt = Number(rawInt).toLocaleString('en-US');
  const prefix = isNeg ? '-' : '';
  if (decPart !== undefined) return prefix + formattedInt + '.' + decPart;
  return prefix + formattedInt;
}

function updateScreen() {
  screen.textContent = formatDisplay(current);
  if (screen.textContent.length > 10) {
    screen.style.fontSize = '32px';
  } else {
    screen.style.fontSize = '';
  }
}

function compute(a, op, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  if (isNaN(x) || isNaN(y)) return b || '0';
  let res;
  switch(op) {
    case '+': res = x + y; break;
    case '-': res = x - y; break;
    case 'x': case '*': res = x * y; break;
    case '/': 
      if (y === 0) return 'Error';
      res = x / y; break;
    default: return b;
  }
  let str = res.toString();
  if (str.includes('e')) return res.toPrecision(10).replace(/\.?0+$/, '');
  if (str.length > 12) {
    if (Math.abs(res) > 1e12 || (Math.abs(res) < 1e-6 && res !== 0)) {
      return res.toPrecision(8);
    }
    return parseFloat(res.toPrecision(10)).toString();
  }
  return str;
}

function inputDigit(d) {
  if (overwrite) { current = d; overwrite = false; return; }
  if (current === '0') current = d;
  else if (current.length < 12) current += d;
}

function inputDot() {
  if (overwrite) { current = '0.'; overwrite = false; return; }
  if (!current.includes('.')) current += '.';
}

function handleOperator(op) {
  if (current === 'Error') return;
  if (current === '' && previous !== '') {
    operation = op;
    return;
  }
  if (previous !== '' && operation && current !== '' && !overwrite) {
    const result = compute(previous, operation, current);
    current = result;
    previous = result === 'Error' ? '' : result;
    if (result !== 'Error') overwrite = true;
  } else if (current !== '') {
    previous = current;
  }
  if (current !== 'Error') {
    operation = op;
    overwrite = true;
    if (current === 'Error') { previous = ''; operation = null; }
    else current = previous;
    current = ''; // ready for next number, but keep previous
    // Actually set current to '' to detect new entry, display keeps previous until new digit
    // For display simplicity, keep screen showing previous
    screen.textContent = formatDisplay(previous);
    current = '';
    return;
  }
  // we used early return path, so handle differently
}

// Revised operator flow for vanilla version
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingSecond = false;

function resetAll() {
  displayValue = '0';
  firstOperand = null;
  operator = null;
  waitingSecond = false;
  current = '0';
  previous = '';
  operation = null;
  overwrite = false;
  updateScreen();
}

function handleInput(key) {
  if (key >= '0' && key <= '9') {
    if (waitingSecond) { displayValue = key; current = key; waitingSecond = false; }
    else {
      if (displayValue === '0') { displayValue = key; current = key; }
      else if (displayValue.length < 12) { displayValue += key; current += key; }
    }
  } else if (key === '.') {
    if (waitingSecond) { displayValue = '0.'; current = '0.'; waitingSecond = false; return; }
    if (!displayValue.includes('.')) { displayValue += '.'; current += '.'; }
  } else if (['+', '-', 'x', '*', '/'].includes(key)) {
    const op = key === '*' ? 'x' : key;
    if (firstOperand === null) {
      firstOperand = displayValue;
    } else if (!waitingSecond) {
      const result = compute(firstOperand, operator, displayValue);
      displayValue = result;
      current = result;
      firstOperand = result === 'Error' ? null : result;
    }
    operator = op;
    waitingSecond = true;
  } else if (key === 'DEL') {
    if (waitingSecond) return;
    if (displayValue.length <= 1) { displayValue = '0'; current = '0'; }
    else { displayValue = displayValue.slice(0,-1); current = current.slice(0,-1) || '0'; }
  } else if (key === 'RESET') {
    resetAll(); return;
  } else if (key === '=') {
    if (firstOperand !== null && operator && !waitingSecond) {
      const result = compute(firstOperand, operator, displayValue);
      displayValue = result;
      current = result;
      firstOperand = null;
      operator = null;
      waitingSecond = true;
    }
  }
  screen.textContent = formatDisplay(displayValue);
}

keys.forEach(btn => {
  btn.addEventListener('click', () => handleInput(btn.dataset.key));
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') handleInput(e.key);
  if (e.key === '.') handleInput('.');
  if (['+', '-', '*', '/'].includes(e.key)) handleInput(e.key);
  if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleInput('='); }
  if (e.key === 'Backspace') handleInput('DEL');
  if (e.key === 'Escape') handleInput('RESET');
});

// Theme
function setTheme(n) {
  document.documentElement.setAttribute('data-theme', n);
  localStorage.setItem('calc-theme', n);
  const x = (n-1)*22;
  toggleDot.style.transform = 'translateX(' + x + 'px)';
}
themeBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
toggleTrack.addEventListener('click', () => {
  const cur = parseInt(localStorage.getItem('calc-theme') || '1');
  setTheme(cur % 3 + 1);
});
const saved = localStorage.getItem('calc-theme') || '1';
setTheme(saved);
updateScreen();