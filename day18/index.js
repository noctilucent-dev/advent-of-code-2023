const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `R 6 (#70c710)
    D 5 (#0dc571)
    L 2 (#5713f0)
    D 2 (#d2c081)
    R 2 (#59c680)
    D 2 (#411b91)
    L 5 (#8ceee2)
    U 2 (#caa173)
    L 1 (#1b58a2)
    U 2 (#caa171)
    R 2 (#7807d2)
    U 3 (#a77fa3)
    L 2 (#015232)
    U 2 (#7a21e3)`;

    // raw = `
    // R 3 #
    // U 3 #
    // L 3 #
    // D 3 #`
}

function parse(line) {
    let [dir, dist, colour] = line.split(' ');
    return {
        dir,
        dist: Number(dist),
        colour
    };
}

function print(map, minX, minY, maxX, maxY) {
    let lines = [];
    for (let y=minY; y<=maxY; y++) {
        let line = '';
        for (let x=minX; x<=maxX; x++) {
            line += map[y][x] || '.';
        }
        lines.push(line);
    }
    return lines.join('\n');
}

function calculateArea(vertices, minX, minY) {
    const transposed = vertices.map(([x,y]) => [x-minX,y-minY]);
    
    let area = 0;
    let circumference = 0;
    for(let i=0, j=transposed.length-1; i<transposed.length; j=i++) {
        area += (transposed[j][0] + transposed[i][0]) * (transposed[j][1] - transposed[i][1]);
        circumference += Math.abs(transposed[j][0]-transposed[i][0]) + Math.abs(transposed[j][1] - transposed[i][1]);

        // area += jx * (ky-iy) + jy * (ix - kx);

        // area += ix * jy;
        // area -= iy * jx;
    }
    area = Math.abs(area) / 2;

    area += (circumference / 2) + 1;

    return area;
}

function part1(lines) {
    lines = lines.map(parse);

    let map = [['#']];
    let x = 0;
    let y = 0;
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let vertices = [[0,0]];

    lines.forEach(({dir, dist}) => {
        const vectors = {
            'R': [1, 0],
            'L': [-1,0],
            'U': [0,-1],
            'D': [0,1]
        };

        const [dx, dy] = vectors[dir];
        for (let i=0; i<dist; i++) {
            x += dx;
            y += dy;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);

            if (!map[y]) map[y] = [];
            map[y][x] = '#';
        }

        vertices.push([x,y]);

        if (DEBUG) log(print(map, minX, minY, maxX, maxY));
        log('');
    });

    return calculateArea(vertices, minX, minY);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));