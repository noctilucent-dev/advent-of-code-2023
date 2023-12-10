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

function parse(lines) {
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

            if (c === 'S') {
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

    nodes[start] = adjacent;

    log(nodes);
    log(start);

    return {
        nodes,
        start
    };
}

function getPath(nodes, start) {
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
    }

    return path;
}

/**
 * Returns a pretty representation of the given lines.
 */
function pretty(lines) {
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

    return lines.map((line, y) => {
        return line.split('').map((c, x) => m[c]).join('');
    }).join('\n');
}

function part1(lines) {
    const { nodes, start } = parse(lines);

    const path = getPath(nodes, start);

    return Math.ceil(path.length / 2);
}

const getCoords = (key) => key.split(/[,\[\]]/).filter(x => x).map(Number);

function getStartSymbol(start, nodes) {
    const [sx, sy] = getCoords(start);
    const [[lx, ly], [rx, ry]] = nodes[start].map(getCoords);
    const west = lx < sx || rx < sx;
    const east = lx > sx || rx > sx;
    const north = ly < sy || ry < sy;
    const south = ly > sy || ry > sy;
    let c;
    if (east && west) {
        c === '-'
    } else if (north && south) {
        c = '|';
    } else if (north && east) {
        c = 'L';
    } else if (north && west) {
        c = 'J';
    } else if (south && west) {
        c = '7';
    } else if (south && east) {
        c = 'F';
    } else {
        throw new Error("Couldn't calculate start symbol");
    }

    return c;
}


function part2(lines) {
    const { nodes, start } = parse(lines);

    const path = getPath(nodes, start);

    // Remove all nodes not part of the main loop
    Object.getOwnPropertyNames(nodes).forEach(n => {
        if (path.indexOf(n) === -1) {
            delete nodes[n];
        }
    });

    // Replace the S with the appropriate symbol
    const startSymbol = getStartSymbol(start, nodes);
    const [sx, sy] = getCoords(start);

    // Remove pipes that aren't part of loop
    // and replace start symbol
    lines = lines.map((l,y) => {
        return l.split('').map((c,x) => {
            if (y === sy && x === sx) {
                return startSymbol;
            }

            if (nodes[JSON.stringify([x,y])]) {
                return c;
            }
            
            return '.';
        }).join('');
    });

    /**
     * Determines whet the given coordinates are inside the main loop.
     */
    const isInside = ([x, y]) => {
        // Pick the shorter of the line before or after the coords.
        // (Small optimisation)
        let s = x < (lines[y].length / 2) ?
            lines[y].substring(0,x) :
            lines[y].substring(x+1);

        // Find all the 'walls' between this position and the end of the line.
        // Note - walls are indicated by the following strings::
        //  |,
        //  L7, L-7, L--7, ...,
        //  FJ, F-J, F--J, ...
        let walls = s.match(/(\|)|(L-*7)|(F-*J)/g);

        // We can assume we are inside if there are an odd number of walls
        return walls && walls.length % 2 === 1;
    };

    log(pretty(lines));

    // Mark each 'inside' position
    let insideCount = 0;
    for(let y=0; y<lines.length; y++) {
        let l = lines[y].split('');

        // Note - the first and last position cannot be inside
        for (let x=1; x<l.length-1; x++) {
            const isLoopWall = !!nodes[JSON.stringify([x,y])];

            if (isLoopWall) {
                continue;
            }

            // Note - we can assume inside if adjacent to an inside space
            if (l[x-1] === 'I' || isInside([x, y])) {
                l[x] = 'I';
                insideCount++;
            }
        }
        lines[y] = l.join('');
    }

    console.log(pretty(lines));

    return insideCount;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));
