const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `...#......
    .......#..
    #.........
    ..........
    ......#...
    .#........
    .........#
    ..........
    .......#..
    #...#.....`;
}

function print(galaxies) {
    if (!DEBUG) return '';

    const maxX = galaxies.map(g => g[0]).reduce((p, c) => Math.max(p,c),0);
    const maxY = galaxies.map(g => g[1]).reduce((p, c) => Math.max(p,c),0);

    let lines = [];
    let count = 0;
    for (let y=0; y<=maxY; y++) {
        let line = '';
        for (let x=0; x<=maxX; x++) {
            if (galaxies.find(g => g[0] === x && g[1] === y)) {
                line += `${(count+1) % 10}`;
                count++;
            } else {
                line += '.';
            }
        }
        lines.push(line);
    }

    return lines.join('\n');
}

function parse(lines) {
    let galaxies = [];
    for (let y=0; y<lines.length; y++) {
        for (let x=0; x<lines[y].length; x++) {
            if (lines[y][x] === '#') {
                galaxies.push([x,y]);
            }
        }
    }

    const blankLines = [];
    const blankColumns = [];
    for (let y=0; y<lines.length; y++) {
        if (lines[y].indexOf('#') === -1) {
            blankLines.push(y);
        }
    }
    for (let x=0; x<lines[0].length; x++) {
        if (lines.map(l => l[x]).indexOf('#') === -1) {
            blankColumns.push(x);
        }
    }

    log(galaxies);
    log(blankLines);
    log(blankColumns);

    return {
        galaxies,
        blankLines,
        blankColumns
    };
}

function expand(galaxies, blankColumns, blankLines, expansion) {
    return galaxies.map(([x,y]) => {
        const rightShift = blankColumns.filter(c => c < x).length;
        const downShift = blankLines.filter(l => l < y).length;
        return [
            x+(rightShift * (expansion-1)),
            y+(downShift * (expansion-1))
        ];
    });
}

function sumShortestPaths(galaxies) {
    return galaxies.reduce((p, g, i) => {
        return p + galaxies.slice(i+1).map((o, j) => {
            const distance = Math.abs(g[0] - o[0]) + Math.abs(g[1] - o[1]);
            log(`Galaxy ${i+1} -> ${i+j+2} = ${distance}`);
            return distance;
        }).reduce((p, c) => p + c, 0);
    }, 0);
}

function part1(lines) {
    let { galaxies, blankColumns, blankLines } = parse(lines);
    log(print(galaxies));

    galaxies = expand(galaxies, blankColumns, blankLines, 2);
    log(print(galaxies));

    return sumShortestPaths(galaxies);
}

function part2(lines) {
    let { galaxies, blankColumns, blankLines } = parse(lines);
    log(print(galaxies));

    const expansion = DEBUG ? 10 : 1000000;

    galaxies = expand(galaxies, blankColumns, blankLines, expansion);
    log(print(galaxies));

    return sumShortestPaths(galaxies);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));