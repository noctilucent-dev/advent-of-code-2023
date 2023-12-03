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
        let num = undefined;
        for (let x=0; x<lines[y].length; x++) {
            const c = lines[y][x];
            if (isNaN(Number(c)) && num) {
                num.value = Number(num.value);
                    numbers.push(num);
                    log(num);
                    num = undefined;
            }

            if (c === '.') {
                continue;
            }
            if (!isNaN(Number(c))) {
                if (num) {
                    num.value += c;
                    num.end[0]++;
                } else {
                    num = {
                        value: c,
                        start: [x, y],
                        end: [x, y]
                    }
                }
            } else {
                const s = {
                    value: c,
                    position: [x, y]
                };
                log(s);
                symbols.push(s);
            }
        }
        if (num) {
            num.value = Number(num.value);
            numbers.push(num);
            log(num);
        }
    }
    return {
        numbers,
        symbols
    };
}

function part1(numbers, symbols) {
    const parts = numbers.filter(num => {
        log(`Checking number ${num.value}, (${num.start} -> ${num.end})`);
        const adjacentSymbol = symbols.find(s => {
            const ny = num.start[1];
            const nxS = num.start[0];
            const nxE = num.end[0];
            const [sx, sy] = s.position;
            if (Math.abs(sy - ny) <= 1) {
                return sx <= nxE + 1 && sx >= nxS -1;
            } else {
                return false;
            }
        });

        if (adjacentSymbol) {
            log(`Found adjacent symbol ${adjacentSymbol.value} at [${adjacentSymbol.position}]`);
            return true;
        } else {
            log(`No adjacent symbol fouund`);
            return false;
        }
    });
    
    return parts.map(n => n.value).reduce((p,c) => p+c);
}

function part2(numbers, symbols) {
    return symbols
        .filter(s => s.value === '*')
        .map(s => {
            const adjacentNumbers = numbers.filter(num => {
                const ny = num.start[1];
                const nxS = num.start[0];
                const nxE = num.end[0];
                const [sx, sy] = s.position;
                if (Math.abs(sy - ny) <= 1) {
                    return sx <= nxE + 1 && sx >= nxS -1;
                } else {
                    return false;
                }
            })
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