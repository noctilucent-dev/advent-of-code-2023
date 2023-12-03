let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
}

/**
 * Parses the lines and returns arrays of numbers and symbols.
 * Each number defines its value and start/end coordinates (top left = [0,0]).
 * Each symbol defines its value and position.
 */
function parse(lines) {
    const numbers = [];
    const symbols = [];

    // Iterate over rows
    for (let y=0; y<lines.length; y++) {
        // Store the number we are currently parsing
        // Important - reset to undefined after number completed
        let number = undefined;

        // Convenience function to add number to array and reset
        const pushNumber = () => {
            number.value = Number(number.value);
            numbers.push(number);
            log(number);
            number = undefined;
        };

        // Iterate over characters
        for (let x=0; x<lines[y].length; x++) {
            const c = lines[y][x];

            // Check if we've reached the end of a number
            if (isNaN(Number(c)) && number) {
                pushNumber();
            }

            if (c === '.') {
                continue;
            }

            // Check if a digit
            if (!isNaN(Number(c))) {
                // Either start a new number or continue existing
                if (number) {
                    number.value += c;
                    number.end[0]++;
                } else {
                    number = {
                        value: c,
                        start: [x, y],
                        end: [x, y]
                    }
                }
            } else {
                // Must be a symbol - so add to array
                const symbol = {
                    value: c,
                    position: [x, y]
                };
                log(symbol);
                symbols.push(symbol);
            }
        }

        // Check for a number that went to the end of the line
        if (number) {
            pushNumber();
        }
    }
    return {
        numbers,
        symbols
    };
}

function isAdjacent(number, symbol) {
    // Define a bounding box around the number
    const topLeft = [number.start[0]-1, number.start[1]-1];
    const bottomRight = [number.end[0]+1, number.end[1]+1];
    
    // Check symbol coordinates inside box
    const [x, y] = symbol.position;
    return x >= topLeft[0] && x <= bottomRight[0] && y >= topLeft[1] && y <= bottomRight[1];
}

function part1(numbers, symbols) {
    return numbers
        .filter(n => symbols.find(s => isAdjacent(n, s)))
        .map(n => n.value)
        .reduce((p,c) => p+c);
}

function part2(numbers, symbols) {
    return symbols
        .filter(s => s.value === '*')
        .map(s => {
            const adjacentNumbers = numbers.filter(n => isAdjacent(n, s));
            if (adjacentNumbers.length === 2) {
                return adjacentNumbers[0].value * adjacentNumbers[1].value;
            } else {
                return 0;
            }
        })
        .reduce((p, c) => p+c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

const { numbers, symbols } = parse(lines);

console.log(part1(numbers, symbols));
console.log(part2(numbers, symbols));