const { DEBUG, log, getRaw, toTrimmedLines, deepClone } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `
    .|...\\....
    |.-.\\.....
    .....|-...
    ........|.
    ..........
    .........\\
    ..../.\\\\..
    .-.-/..|..
    .|....-|.\\
    ..//.|....`;
}

class Beam {
    static next = 0;

    constructor(p, v, path = []) {
        this.p = p;
        this.v = v;
        this.path = path;
        this.id = Beam.next++;
    }

    move(map, visited, beams) {
        let [x,y] = this.p;
        let [dx, dy] = this.v;
        log(`Moving beam ${this.id} at [${x},${y}] v:[${dx},${dy}]`);

        if (y < 0 || y >= map.length || x < 0 || x>= map[y].length) {
            log('Beam out of bounds');
            beams.delete(this);
            return;
        }

        log(this.path);
        if (this.path.find(([[nx, ny],[nvx, nvy]]) => nx === x && ny === y && nvx === dx && nvy === dy)) {
            log('Found loop');
            beams.delete(this);
            return;
        }


        this.path.push([[x,y], [dx,dy]]);
        visited[y][x] = '#';

        let c = map[y][x];
        log(c);
        if (c === '.' || (c === '|' && dy) || (c === '-' && dx)) {
            log('Straight');
        } else if (c === '/') {
            log('Deflect');
            /*
            1,0  => 0,-1
            -1,0 => 0,1
            0,1  => -1,0
            0,-1 => 1,0
            */
            let temp = dx;
            dx = -dy;
            dy = -temp;
        } else if (c === '\\') {
            log('Deflect');
            /*
            1,0  => 0,1
            -1,0 => 0,-1
            0,1  => 1,0
            0,-1 => -1,0
            */
           let temp = dx;
           dx = dy;
           dy = temp;
        } else if (c === '-') {
            log('Split');
            dx = 1;
            dy = 0;

            beams.add(new Beam([x-1, y], [-1,0], this.path));
        } else if (c === '|') {
            log('Split');
            dx = 0;
            dy = 1;

            beams.add(new Beam([x, y-1], [0,-1], this.path));
        }

        x += dx;
        y += dy;

        this.p[0] = x;
        this.p[1] = y;
        this.v[0] = dx;
        this.v[1] = dy;
        
        log(`Next: [${x},${y}] v:[${dx},${dy}]`);
        this.print(map);
    }

    getPath(map) {
        const maxY = map.length;

        const unique = new Set();
        this.path.forEach(([[x,y]]) => unique.add(x*maxY + y));

        unique;
    }

    print(map) {
        if (!DEBUG) return;
        const m = deepClone(map);

        for(let i=0; i<this.path.length; i++) {
            const [[x, y], [dx, dy]] = this.path[i];
            let c = m[y][x];
            if (c !== '.') {
                if(c === '>' || c === '<' || c === 'v' || c === '^') {
                    c = 2;
                } else if (!isNaN(Number(c))) {
                    c = `${Number(c) + 1}`;
                }
            } else if (dx === 1) {
                c = '>';
            } else if (dx === -1) {
                c = '<';
            } else if (dy === 1) {
                c = 'v';
            } else if (dy === -1) {
                c = '^';
            }
            m[y][x] = c;
        }

        log(m.map(r => r.join('')).join('\n'));
    }
}

function part1(lines) {
    const intialBeam = new Beam([0,0],[1,0]);
    const beams = new Set([intialBeam]);
    const map = lines.map(l => l.split(''));
    const visited = [];
    for (let y=0; y<map.length; y++) {
        visited[y] = [];
        for (let x=0; x<map[y].length; x++) {
            visited[y][x] = '.';
        }
    }

    while(beams.size > 0) {
        beams.forEach(b => b.move(map, visited, beams));
    }

    return visited.flatMap(row => row.filter(c => c === '#')).length;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));