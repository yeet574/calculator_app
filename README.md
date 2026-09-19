# Calc

A clean, responsive calculator built with vanilla HTML, CSS, and JavaScript — featuring three switchable color themes and full keyboard support.

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow) ![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

## Features

- **Basic arithmetic** — addition, subtraction, multiplication, and division
- **Three built-in themes** — toggle between them with the switch or the numbered buttons
- **Theme persistence** — your last selected theme is remembered via `localStorage`
- **Keyboard support** — use number keys, `+ - * /`, `Enter`/`=`, `Backspace` (delete), and `Escape` (clear)
- **Smart number formatting** — thousands separators and automatic font shrinking for long results
- **Responsive layout** — adapts cleanly to mobile screens
- **Error handling** — division by zero displays `Error` instead of crashing

## Demo

Open `index.html` in any modern browser — no build step or server required.

## Project Structure

```
├── index.html      # Markup and layout
├── style.css       # Theming (CSS custom properties) and responsive styles
└── script.js       # Calculator logic, input handling, and theme switching
```

## Usage

### Mouse / Touch
Click any key on the keypad. `DEL` removes the last digit, `Clear` resets the calculator, and `=` evaluates the current expression.

### Keyboard
| Key | Action |
|---|---|
| `0-9` | Enter digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last digit |
| `Escape` | Clear |

### Themes
Click the numbered `1`, `2`, `3` labels, or click the toggle track to cycle through themes. Your choice is saved automatically and restored on your next visit.

## How It Works

- Input is tracked as strings (`displayValue`, `firstOperand`, `operator`) rather than numbers, which keeps formatting (like trailing decimals) predictable while typing.
- `compute()` handles the actual math and guards against division by zero and floating-point display issues (long decimals are trimmed with `toPrecision`).
- `formatDisplay()` adds thousands separators for readability without altering the underlying stored value.
- Themes are implemented with CSS custom properties scoped under `[data-theme="n"]` selectors, so switching themes is just swapping an attribute on the root element.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses standard DOM APIs and `localStorage`, both widely supported.

## Possible Improvements

- Add support for parentheses and operator precedence
- Add a history/memory feature (M+, M-, MR)
- Add unit tests for `compute()` and `formatDisplay()`
- Add percentage (`%`) support

## License

Free to use and modify for personal or commercial projects.
