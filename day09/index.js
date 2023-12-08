let { DEBUG, raw, getTrimmedLines, lcm, log } = require("../util");

if (DEBUG) {
    raw = `0 3 6 9 12 15
    1 3 6 10 15 21
    10 13 16 21 30 45`;
}

function getNext(sequence) {
    const stack = [[...sequence]];
    let previous = sequence;
    while(true) {
        const deltas = [];
        for(let i=1; i<previous.length; i++) {
            deltas.push(previous[i]-previous[i-1]);
        }
        stack.push(deltas);
        log(deltas);
        previous = deltas;
        if ((new Set(deltas)).size === 1 && deltas[0] === 0) {
            break;
        }
    }
    log(stack);
    
    for(let i=stack.length-2; i>=0; i--) {
        const s = stack[i];
        const se = s[s.length-1];
        const ds = stack[i+1];
        const dse = ds[ds.length-1];

        s.push(se + dse);
    }

    log(stack);
    
    return stack[0][stack[0].length-1];
}

function getPrevious(sequence) {
    const stack = [[...sequence]];
    let previous = sequence;
    while(true) {
        const deltas = [];
        for(let i=1; i<previous.length; i++) {
            deltas.push(previous[i]-previous[i-1]);
        }
        stack.push(deltas);
        previous = deltas;
        if ((new Set(deltas)).size === 1 && deltas[0] === 0) {
            break;
        }
    }
    
    for(let i=stack.length-2; i>=0; i--) {
        const s = stack[i];
        const s1 = s[0];
        const ds = stack[i+1];
        const ds1 = ds[0];

        stack[i] = [
            s1 - ds1,
            ...s
        ];
    }

    log(stack[0]);
    
    return stack[0][0];
}

function part1(lines) {
    lines = lines.map(l => l.split(' ').map(Number));
    return lines.map(getNext).reduce((p, c) => p+c);
}

function part2(lines) {
    lines = lines.map(l => l.split(' ').map(Number));
    return lines.map(getPrevious).reduce((p, c) => p+c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));