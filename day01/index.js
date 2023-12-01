let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen`;
}

function part1(lines) {
    return lines
        .map(line => line.replace(/[^\d]/g,''))
        .map(line => Number(`${line[0]}${line[line.length-1]}`))
        .reduce((p, c) => p + c);
}

function part2(lines) {
    const words = [
        ...'0123456789'.split(''),
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine'
    ];
    const lineToDigits = (line) => {
        return line.split('')
            .map((c, i) => words.findIndex(w => line.slice(i).startsWith(w)) % 10)
            .filter(i => i > -1);
    };

    return lines
        .map(lineToDigits)
        .map(d => (d[0] * 10) + d.pop())
        .reduce((p, c) => p+c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));
