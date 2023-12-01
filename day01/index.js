let { DEBUG, raw,  log} = require("../util");

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
    let sum = 0;
    lines.forEach(line => {
        const digits = line.replace(/[^\d]/g,'');
        const first = digits[0];
        const last = digits[digits.length-1];
        log(`${first}${last}`);
        sum += Number(`${first}${last}`);
    });
    return sum;
}

function part2(lines) {
    const words = [
        '___',
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
    let sum = 0;
    lines.forEach(line => {
        let digits = [];
        for(let i=0; i<line.length; i++) {
            if (!isNaN(Number(line[i]))) {
                digits.push(Number(line[i]));
                continue;
            }
            const wordIndex = words.findIndex(w => line.slice(i).startsWith(w));
            if (wordIndex >= 0) {
                digits.push(wordIndex);
            }
        }
        log(digits);
        sum += (digits[0] * 10) + digits[digits.length-1];
    });

    return sum;
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));

// 55929 too high