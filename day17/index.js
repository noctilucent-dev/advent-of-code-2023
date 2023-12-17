const { DEBUG, log, getRaw, toTrimmedLines, deepClone } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `2413432311323
    3215453535623
    3255245654254
    3446585845452
    4546657867536
    1438598798454
    4457876987766
    3637877979653
    4654967986887
    4564679986453
    1224686865563
    2546548887735
    4322674655533`;

    raw = `
    1111119911111
    1111119911111
    1111111111111
    1111119911111
    1111119911111`;

    raw = `
    11119911
    11111111
    11119911`
}

class Node {
    constructor(x, y, dx, dy, cost, straights, parent, map) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.cost = cost;
        this.straights = straights;
        this.parent = parent;
        this.map = map;
        this.estimate = cost + Node.heuristic([x, y], map)
    }

    static heuristic([x, y], map) {
        const dy = map.length - y - 1;
        const dx = map[0].length - x - 1;
        return dx + dy;
    }

    print() {
        const m = deepClone(this.map);
        for (let n=this; n!==undefined; n=n.parent) {
            const { x, y, dx, dy } = n;
            let c = '?';
            if (dx === 1) {
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

        return m.map(r  => r.map(c => `${c}`).join('')).join('\n');
    }
}

function findPath(map) {
    const vectors = [
        [1, 0],  // East
        [0, 1],  // South
        [-1, 0], // West
        [0, -1]  // North
    ];

    const maxX = map[0].length - 1;
    const maxY = map.length - 1;
    const hash = ([x, y]) => x*(maxX+1) + y;

    const start = new Node(0, 0, 0, 0, 0, 0, undefined, map);
    const leaves =[start];
    const visited = {};
    visited[hash([0,0])] = new Set([start]);

    while (leaves.length > 0) {
        const best = leaves.pop();
        const { x, y, dx, dy, straights, cost } = best;
        if (x === maxX && y === maxY) {
            log('Found best');
            console.log(best.print());

            return best.cost;
        }
        const key = hash([x, y]);
        //visited.add(hash([x, y]));
        if (DEBUG) {
            log(best.print());
            log('');
        }

        vectors
            .filter(([vx, vy]) => vx !== -dx || vy !== -dy) // reciprical
            .filter(([vx, vy]) => straights < 2 || vx !== dx || vy !== dy) // > 3 straights
            .filter(([vx, vy]) => vx+x >=0 && vx+x <= maxX && vy+y >=0 && vy+y <= maxY) // out of bounds
            .forEach(([vx, vy]) => {
                const nx = x+vx;
                const ny = y+vy;
                const nKey = hash([nx, ny]);
                const nCost = cost + map[ny][nx];
                const nStraights = ((vx === dx && vy === dy) ? straights + 1 : 0);
                const n = new Node(nx, ny, vx, vy, cost + map[ny][nx], nStraights, best, map);
                if (visited[nKey]) {
                    const better = Array.from(visited[nKey]).filter(p => 
                        p.cost <= nCost && 
                        p.straights <= nStraights &&
                        p.dx === vx &&
                        p.dy === vy
                        );
                    if (better.length > 0) {
                        // do nothing
                    } else {
                        // better.forEach(p => visited[nKey].delete(p));
                        const worse = Array.from(visited[nKey]).filter(p => p.cost > nCost && p.straights >= nStraights);
                        worse.forEach(p => visited[nKey].delete(p));
                        visited[nKey].add(n);
                        leaves.push(n);
                    }
                } else {
                    visited[nKey] = new Set([n]);
                    leaves.push(n);
                }
            });

        leaves.sort((a, b) => b.estimate - a.estimate);
    }

    throw new Error('Could not find path to end');
}

function part1(lines) {
    const map = lines.map(l => l.split('').map(Number));

    return findPath(map);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));