let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;
let operate = (operator, a, b) => operator(a, b);

let isDecimal = false;
const display = document.querySelector('#display');
let statement = "";


const split = (expression, operator) => {
    const result = [];
    let braces = 0;
    let currentChunk = "";
    for (let i = 0; i < expression.length; ++i) {
        const curCh = expression[i];
        if (curCh == '(') {
            braces++;
        } else if (curCh == ')') {
            braces--;
        }
        if (braces == 0 && operator == curCh) {
            result.push(currentChunk);
            currentChunk = "";
        } else currentChunk += curCh;
    }
    if (currentChunk != "") {
        result.push(currentChunk);
    }
    return result;
};
// this will only take strings containing * operator [ no + ]
const parseMultiplicationSeparatedExpression = (expression) => {
    const numbersString = split(expression, 'x');
    const numbers = numbersString.map(noStr => {
        if (noStr[0] == '(') {
            const expr = noStr.substr(1, noStr.length - 2);
            // recursive call to the main function
            return parsePlusSeparatedExpression(expr);
        }
        return +noStr;
    });
    const initialValue = 1.0;
    const result = numbers.reduce((acc, no) => acc * no, initialValue);
    return result;
};

const parseDivisionSeparatedExpression = (expression) => {
    const numbersString = split(expression, '/');
    const numbers = numbersString.map(noStr => parseMultiplicationSeparatedExpression(noStr));
    const initialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc, no) => acc / no, initialValue);
    return result;
};
// both * -
const parseMinusSeparatedExpression = (expression) => {
    const numbersString = split(expression, '-');
    const numbers = numbersString.map(noStr => parseDivisionSeparatedExpression(noStr));
    const initialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
    return result;
};
// * - + 
const parsePlusSeparatedExpression = (expression) => {
    const numbersString = split(expression, '+');
    const numbers = numbersString.map(noStr => parseMinusSeparatedExpression(noStr));
    const initialValue = 0.0;
    const result = numbers.reduce((acc, no) => acc + no, initialValue);
    return result;
};
const parse = (expresion) => {
    const expression = expresion;
    const result = parsePlusSeparatedExpression(expression, '+');
    return result;
};



function evaluateStatement(expresion) {
    displayStatement(parse(expresion));
    statement = "";
}

function displayStatement(toDisplay) {
    display.textContent = toDisplay;
}

function addToStatement(toAdd) {
    if (toAdd === '.') {
        if (!isDecimal) {
            isDecimal = true;
            statement += toAdd;
        }
    } else {
        statement += toAdd;
    }
    displayStatement(statement);
    console.log(statement);
}


// buttons is a node list. It looks and acts much like an array.
const buttons = document.querySelectorAll('button');

// we use the .forEach method to iterate through each button
buttons.forEach((button) => {

  // and for each one we add a 'click' listener
  button.addEventListener('click', () => {
    if (button.textContent === '=') {
        evaluateStatement(statement);
    } else if (button.textContent === 'Clear') {
        isDecimal = false;
        statement = '';
        displayStatement(statement);
    } else if (button.textContent === 'Back') {
        if (statement.charAt(statement.length - 1) === '.') {
            isDecimal = false;
        }
        statement = statement.substr(0, statement.length - 1);
        displayStatement(statement);
    } else {
        addToStatement(button.textContent);
    }
  });
});


