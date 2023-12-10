const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `FF7FSF7F7F7F7F7F---7
    L|LJ||||||||||||F--J
    FL-7LJLJ||||||LJL-77
    F--JF--7||LJLJ7F7FJ-
    L---JF-JLJ.||-FJLJJ7
    |F|F-JF---7F7-L7L|7|
    |FFJF7L7F-JF7|JL---7
    7-L-JL7||F7|L7F-7F7|
    L.L7LFJ|||||FJL7||LJ
    L7JLJL-JLJLJL--JLJ.L`;

    raw = `.F----7F7F7F7F-7....
    .|F--7||||||||FJ....
    .||.FJ||||||||L7....
    FJL7L7LJLJ||LJ.L-7..
    L--J.L7...LJS7F-7L7.
    ....F-J..F7FJ|L7L7L7
    ....L7.F7||L7|.L7L7|
    .....|FJLJ|FJ|F7|.LJ
    ....FJL-7.||.||||...
    ....L---J.LJ.LJLJ...`;
}

function part1(lines) {
    const nodes = {};
    let start;
    for(let y=0; y<lines.length; y++) {
        for (let x=0; x<lines[y].length; x++) {
            const c = lines[y][x];
            const here = JSON.stringify([x, y]);
            const north = JSON.stringify([x, y-1]);
            const east = JSON.stringify([x+1, y]);
            const south = JSON.stringify([x, y+1]);
            const west = JSON.stringify([x-1, y]);

            if (c === '.') {
                continue;
            } else if (c === 'S') {
                start = here;
            } else if (c === '-') {
                nodes[here] = [
                    west,
                    east
                ];
            } else if (c === '|') {
                nodes[here] = [
                    north,
                    south
                ];
            } else if (c === 'L') {
                nodes[here] = [
                    north,
                    east
                ];
            } else if (c === 'J') {
                nodes[here] = [
                    north,
                    west
                ];
            } else if (c === '7') {
                nodes[here] = [
                    south,
                    west
                ];
            } else if (c === 'F') {
                nodes[here] = [
                    south,
                    east
                ];
            }
        }
    }

    log(start);
    log(nodes);

    const adjacent = Object.getOwnPropertyNames(nodes).filter(k => {
        return nodes[k].find(n => n === start);
    });
    log(adjacent);

    nodes[start] = adjacent;

    const path = [];
    let previous;
    let current = start;
    while(true) {
        path.push(current);
        const next = nodes[current].find(n => n !== previous);
        previous = current;
        current = next;
        if (current === start) {
            break;
        }
        log(path);
    }

    return Math.ceil(path.length / 2);
}

function part2(lines) {
    const nodes = {};
    const ground = [];
    let start;
    for(let y=0; y<lines.length; y++) {
        for (let x=0; x<lines[y].length; x++) {
            const c = lines[y][x];
            const here = JSON.stringify([x, y]);
            const north = JSON.stringify([x, y-1]);
            const east = JSON.stringify([x+1, y]);
            const south = JSON.stringify([x, y+1]);
            const west = JSON.stringify([x-1, y]);

            if (c === '.') {
                ground.push([x, y]);
            } else if (c === 'S') {
                start = here;
            } else if (c === '-') {
                nodes[here] = [
                    west,
                    east
                ];
            } else if (c === '|') {
                nodes[here] = [
                    north,
                    south
                ];
            } else if (c === 'L') {
                nodes[here] = [
                    north,
                    east
                ];
            } else if (c === 'J') {
                nodes[here] = [
                    north,
                    west
                ];
            } else if (c === '7') {
                nodes[here] = [
                    south,
                    west
                ];
            } else if (c === 'F') {
                nodes[here] = [
                    south,
                    east
                ];
            }
        }
    }

    const adjacent = Object.getOwnPropertyNames(nodes).filter(k => {
        return nodes[k].find(n => n === start);
    });
    log(adjacent);

    nodes[start] = adjacent;

    log(start);
    log(nodes);
    log(ground);

    const path = [];
    let previous;
    let current = start;
    while(true) {
        path.push(current);
        const next = nodes[current].find(n => n !== previous);
        previous = current;
        current = next;
        if (current === start) {
            break;
        }
        log(path);
    }

    Object.getOwnPropertyNames(nodes).forEach(n => {
        if (path.indexOf(n) === -1) {
            delete nodes[n];
        }
    });

    const isInside = ([x, y]) => {
        let line = lines[y];
        line = line.split('').map((c, i) => {
            if (c === 'S') {
                return '-';
            }
            if (!nodes[JSON.stringify([i,y])]) {
                return '.';
            }
            return c;
        }).join('');
        // for(let i=0; i<line.length; i++) {
        //     if (!nodes[JSON.stringify([i,y])]) {
        //         line = line.slice(0,i) + '.' + line.slice(i+1);
        //     }
        // }
        let s = line.substring(0,x);
        let walls = s.match(/(\|)|(L-*7)|(F-*J)/g);
        if (!walls) return false;
        return walls.length % 2 === 1;
    };

    // log(lines.join('\n'));
    // log('');

    const m = {
        '-': '─',
        '|': '│',
        '7': '┐',
        'F': '┌',
        'L': '└',
        'J': '┘',
        '.': '.',
        'I': 'I',
        'O': 'O',
        'S': 'S'
    };

    const strippedLines = lines.map((line, y) => {
        return line.split('').map((c, x) => nodes[JSON.stringify([x,y])] ? m[c] : '.').join('');
    });

    const fs = require('fs');
    fs.writeFileSync('stripped.txt', strippedLines.join('\n'));

    // for(let y=0; y<lines.length; y++) {
    //     for (let x=0; x<lines[y].length; x++) {
    //         if (!nodes[JSON.stringify([x,y])]) {
    //             lines[y] = `${lines[y].slice(0,x)}.${lines[y].slice(x+1)}`;
    //         }
    //     }
    // }

    // log(lines.join('\n'));
    // log('');

    let insideCount = 0;
    const mappedLines = [];
    for(let y=0; y<lines.length; y++) {
        let l = '';
        for(let x=0; x<lines[y].length; x++) {
            const isLoopWall = !!nodes[JSON.stringify([x,y])];
            const isGround = !isLoopWall;
            const inside = isGround && isInside([x, y]);

            if (inside) {
                insideCount++;
                l += 'I';
            } else if (isGround) {
                l += 'O';
            } else if (isLoopWall) {
                l += lines[y][x];
            } else {
                l += '.';
            }
        }
        log(l);
        mappedLines.push(l.split('').map(c => m[c]).join(''));
    }

    fs.writeFileSync('mapped.txt',mappedLines.join('\n'));

    return insideCount;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));