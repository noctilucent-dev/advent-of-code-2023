const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `O....#....
    O.OO#....#
    .....##...
    OO.#O....O
    .O.....O#.
    O.#..O.#.#
    ..O..#O..O
    .......O..
    #....###..
    #OO..#....`;
}

function part1(lines) {
    const map = lines.map(l => l.split(''));

    while (true) {
        let rocksMoved = 0;
        for(let y=1; y<map.length; y++) {
            for(let x=0; x<map[y].length; x++) {
                if (map[y][x] !== 'O') {
                    continue;
                }
                if (map[y-1][x] === '.') {
                    map[y-1][x] = 'O';
                    map[y][x] = '.';
                    rocksMoved++;
                }
            }
        }

        if (rocksMoved === 0) {
            break;
        }
    }

    let load = 0;

    for(let y=0; y<map.length; y++) {
        for(let x=0; x<map[y].length; x++) {
            if(map[y][x] === 'O') {
                load += map.length-y;
            }
        }
    }

    return load;
}

function rollNorth(map) {
    while (true) {
        let rocksMoved = 0;
        for(let y=1; y<map.length; y++) {
            for(let x=0; x<map[y].length; x++) {
                if (map[y][x] !== 'O') {
                    continue;
                }
                if (map[y-1][x] === '.') {
                    map[y-1][x] = 'O';
                    map[y][x] = '.';
                    rocksMoved++;
                }
            }
        }

        if (rocksMoved === 0) {
            break;
        }
    }

    return map;
}

function rollSouth(map) {
    while (true) {
        let rocksMoved = 0;
        for(let y=map.length-2; y>=0; y--) {
            for(let x=0; x<map[y].length; x++) {
                if (map[y][x] !== 'O') {
                    continue;
                }
                if (map[y+1][x] === '.') {
                    map[y+1][x] = 'O';
                    map[y][x] = '.';
                    rocksMoved++;
                }
            }
        }

        if (rocksMoved === 0) {
            break;
        }
    }

    return map;
}

function rollWest(map) {
    while (true) {
        let rocksMoved = 0;
        for(let x=1; x<map[0].length; x++) {
            for(let y=0; y<map.length; y++) {
                if (map[y][x] !== 'O') {
                    continue;
                }
                if (map[y][x-1] === '.') {
                    map[y][x-1] = 'O';
                    map[y][x] = '.';
                    rocksMoved++;
                }
            }
        }

        if (rocksMoved === 0) {
            break;
        }
    }

    return map;
}

function rollEast(map) {
    while (true) {
        let rocksMoved = 0;
        for(let x=map[0].length-2; x>=0; x--) {
            for(let y=0; y<map.length; y++) {
                if (map[y][x] !== 'O') {
                    continue;
                }
                if (map[y][x+1] === '.') {
                    map[y][x+1] = 'O';
                    map[y][x] = '.';
                    rocksMoved++;
                }
            }
        }

        if (rocksMoved === 0) {
            break;
        }
    }

    return map;
}

function part2(lines) {
    let map = lines.map(l => l.split(''));
    const c = {};

    let i=0;
    let loopStart;
    let loopEnd;
    while (true) {
        map = rollNorth(map);
        map = rollWest(map);
        map = rollSouth(map);
        map = rollEast(map);

        if (DEBUG && i < 3) {
            log(map.map(r => r.join('')).join('\n'));
            log('');
        }
        i++;
        const key = JSON.stringify(map);
        if (c[key]) {
            loopStart = c[key];
            loopEnd = i;
            log(`Found loop at from ${loopStart} to ${loopEnd}`);
            break;
        } else {
            c[key] = i;
        }
    }

    const offset = (1000000000 - loopStart) % (loopEnd-loopStart);
    log(`Offset ${offset}`);
    
    for (i=0; i<offset; i++) {
        map = rollNorth(map);
        map = rollWest(map);
        map = rollSouth(map);
        map = rollEast(map);
    }

    let load = 0;

    for(let y=0; y<map.length; y++) {
        for(let x=0; x<map[y].length; x++) {
            if(map[y][x] === 'O') {
                load += map.length-y;
            }
        }
    }

    return load;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));