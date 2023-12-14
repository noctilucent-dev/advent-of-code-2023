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

function rowReflectionDifferences(y, rows) {
    log(`Considering row ${y}`);

    let differences = 0;

    for (let i=0; (y+i+1)<rows.length && (y-i)>=0; i++) {
        const top = rows[y-i];
        const bottom = rows[y+i+1];
        log(top);
        log(bottom);

        if (top === bottom) {
            continue;
        }

        for(let j=0; j<top.length; j++) {
            if (top[j] !== bottom[j]) {
                differences++;
            }
        }
    }

    return differences;
}

function columnReflectionDifferences(x, rows) {
    log(`Considering column ${x}`);

    let differences = 0;

    for (let i=0; (x+i+1)<rows[0].length && (x-i)>=0; i++) {
        const left = rows.map(r => r[x-i]).join('');
        const right = rows.map(r => r[x+i+1]).join('');

        if (left === right) continue;

        for(let j=0; j<left.length; j++) {
            if (left[j] !== right[j]) {
                differences++;
            }
        }
    }

    return differences;
}

function part2(maps) {
    return maps.map((rows) => {
        const rowReflections = rows.slice(0,rows.length-1).map((r, i) => ({
            rowIndex: i,
            differences: rowReflectionDifferences(i, rows)
        }));

        const columnReflections = [];
        for(let i=0; i<rows[0].length-1; i++) {
            columnReflections.push({
                columnIndex: i,
                differences: columnReflectionDifferences(i, rows)
            });
        }

        const combined = [
            ...rowReflections,
            ...columnReflections
        ];
        combined.sort((a, b) => a.differences - b.differences);

        if (combined[1].differences !== 1) {
            debugger;
            throw new Error(JSON.stringify('Could not find smudge!'));
        }

        if (combined[1].columnIndex !== undefined) {
            return combined[1].columnIndex + 1;
        } else {
            return (combined[1].rowIndex+1) * 100;
        }
    }).reduce((p,c) => p+c,0);
}

const lines = toTrimmedLines(raw);
const maps = parse(lines);
log(maps);

console.log(part1(maps));
console.log(part2(maps));