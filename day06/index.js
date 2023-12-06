let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `Time:      7  15   30
    Distance:  9  40  200`;
}

function parse(lines) {
    let [_, ...times] = lines[0].split(/\s+/);
    let [__, ...distances] = lines[1].split(/\s+/);

    return times.map((t, i) => [Number(t), Number(distances[i])]);
}

function solve(t, c) {
    // x * (t - x) = c
    // -x^2 + tx - c = 0

    const a = -1;
    const b = t;
    c = -c;

    const pos = (-b + Math.sqrt((b*b) - 4*a*c)) / (2*a);
    const neg = (-b - Math.sqrt((b*b) - 4*a*c)) / (2*a);

    log ([pos, neg]);

    return [Math.floor(pos), Math.ceil(neg)];
}

function part1(lines) {
    const races = parse(lines);
    log(races);
    return races.map(([t, c]) => {
        const [min, max] = solve(t, c);
        log ([min, max]);
        return max - min - 1;
    }).reduce((p, c) => p*c);
}

function part2(lines) {
    const time = Number(lines[0].substring(10).replace(/\s+/g,''));
    const distance = Number(lines[1].substring(10).replace(/\s+/g,''));
    log(time);
    log(distance);
    const [min, max] = solve(time, distance);
    return max - min - 1;
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));