let { DEBUG, raw, lcm, log } = require("../util");

if (DEBUG) {
    raw = `RL

    AAA = (BBB, CCC)
    BBB = (DDD, EEE)
    CCC = (ZZZ, GGG)
    DDD = (DDD, DDD)
    EEE = (EEE, EEE)
    GGG = (GGG, GGG)
    ZZZ = (ZZZ, ZZZ)`;
}

function parse(lines) {
    const sequence = lines[0];
    const nodes = {};
    const starts = [];

    for(let i=2; i<lines.length; i++) {
        const node = lines[i].substring(0,3);
        const left = lines[i].substring(7,10);
        const right = lines[i].substring(12, 15);
        nodes[node] = {
            L: left,
            R: right
        };
        if (node[2] === 'A') {
            starts.push(node);
        }
    }

    return {
        sequence,
        nodes,
        starts
    };
}

function part1(lines) {
    const { sequence, nodes } = parse(lines);
    log(sequence);
    log(nodes);

    let len = 0;
    let node = 'AAA';
    while(true) {
        const dir = sequence[len%sequence.length];
        log(dir);
        node = nodes[node][dir];
        log(node);
        len++;
        if (node === 'ZZZ') {
            break;
        }
    }
    return len;
}

function findPath(start, sequence, nodes, i=0) {
    const path = [];
    let pos = start;
    while(true) {
        path.push(pos);
        const dir = sequence[i];
        pos = nodes[pos][dir];
        i = (i+1)%sequence.length;
        if (pos[2] === 'Z') {
            break;
        }
    }
    return {
        path,
        i
    };
}

function part2(lines) {
    const { sequence, nodes, starts } = parse(lines);
    log(`Sequence length ${sequence.length}`);

    const distances = starts.map(s => {
        let {path, i} = findPath(s, sequence, nodes);
        log(`Path from ${s} length ${path.length}, ending at ${i}`);
        return path.length;
    });

    return lcm(...distances);
}

let lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));

if (DEBUG) {
    raw = `LR

    11A = (11B, XXX)
    11B = (XXX, 11Z)
    11Z = (11B, XXX)
    22A = (22B, XXX)
    22B = (22C, 22C)
    22C = (22Z, 22Z)
    22Z = (22B, 22B)
    XXX = (XXX, XXX)`;
}

lines = raw.trim().split('\n').map(l => l.trim());

console.log(part2(lines));