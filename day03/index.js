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

function parse(lines) {
    const numbers = [];
    const symbols = [];

    for (let y=0; y<lines.length; y++) {
        let number = undefined;
        const pushNumber = () => {
            number.value = Number(number.value);
            numbers.push(number);
            log(number);
            number = undefined;
        };

        for (let x=0; x<lines[y].length; x++) {
            const c = lines[y][x];
            if (isNaN(Number(c)) && number) {
                pushNumber();
            }

            if (c === '.') {
                continue;
            }
            if (!isNaN(Number(c))) {
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
                const symbol = {
                    value: c,
                    position: [x, y]
                };
                log(symbol);
                symbols.push(symbol);
            }
        }

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