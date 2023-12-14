const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `#.##..##.
    ..#.##.#.
    ##......#
    ##......#
    ..#.##.#.
    ..##..##.
    #.#.##.#.
    
    #...##..#
    #....#..#
    ..##..###
    #####.##.
    #####.##.
    ..##..###
    #....#..#`;
}

function parse(lines) {
    const maps = [];
    let p = [];
    for(let i=0; i<lines.length; i++) {
        if (lines[i].trim() !== '') {
            p.push(lines[i])
        } else {
            maps.push(p);
            p = [];
        }
    }

    if (p.length > 0) {
        maps.push(p);
    }

    return maps;
}

function reflectsAtRow(y, rows) {
    log(`Considering row ${y}`);
    if (y === rows.length-1) {
        return false;
    }

    for (let i=0; (y+i+1)<rows.length && (y-i)>=0; i++) {
        const top = rows[y-i];
        const bottom = rows[y+i+1];
        log(top);
        log(bottom);

        if (top !== bottom) return false;
    }
    return true;
}

function reflectsAtColumn(x, rows) {
    log(`Considering column ${x}`);
    if (x === rows.length-1) {
        return false;
    }

    for (let i=0; (x+i+1)<rows[0].length && (x-i)>=0; i++) {
        const left = rows.map(r => r[x-i]).join('');
        const right = rows.map(r => r[x+i+1]).join('');

        if (left !== right) return false;
    }
    return true;
}

function part1(maps) {
    return maps.map((rows, mi) => {
        const y = rows.findIndex((r, i) => reflectsAtRow(i, rows));
        if (y > -1) {
            return (y+1)*100;
        }
        let x;
        for(let i=0; i<rows[0].length; i++) {
            if (reflectsAtColumn(i, rows)) {
                x = i;
                break;
            }
        }

        if (x === undefined) {
            throw new Error(`No reflection found for map ${mi}`);
        }

        return x+1;
    }).reduce((p,c) => p+c,0);
}

function enumerateRow(row) {
    const options = [];
    for(let i=0; i<row.length; i++) {
        options.push(
            row.substring(0, i) +
            (row[i] === '.' ? '#' : '.') +
            row.substring(i+1)
        );
    }
    return options;
}

function part2(maps) {
    const originalReflections = maps.map((rows, mi) => {
        const y = rows.findIndex((r, i) => reflectsAtRow(i, rows));
        if (y > -1) {
            return [-1, y+1];
        }
        let x;
        for(let i=0; i<rows[0].length; i++) {
            if (reflectsAtColumn(i, rows)) {
                x = i;
                break;
            }
        }

        if (x === undefined) {
            throw new Error(`No reflection found for map ${mi}`);
        }

        return [x+1,-1];
    });

    maps.map((rows, mi) => {
        
        const y = rows.findIndex((r, i) => reflectsAtRow(i, rows));
        if (y > -1) {
            return [-1, y+1];
        }
        let x;
        for(let i=0; i<rows[0].length; i++) {
            if (reflectsAtColumn(i, rows)) {
                x = i;
                break;
            }
        }

        if (x === undefined) {
            throw new Error(`No reflection found for map ${mi}`);
        }

        return [x+1,-1];
    });
}

const lines = toTrimmedLines(raw);
const maps = parse(lines);
log(maps);

console.log(part1(maps));