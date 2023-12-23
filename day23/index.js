const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `#.#####################
    #.......#########...###
    #######.#########.#.###
    ###.....#.>.>.###.#.###
    ###v#####.#v#.###.#.###
    ###.>...#.#.#.....#...#
    ###v###.#.#.#########.#
    ###...#.#.#.......#...#
    #####.#.#.#######.#.###
    #.....#.#.#.......#...#
    #.#####.#.#.#########v#
    #.#...#...#...###...>.#
    #.#.#v#######v###.###v#
    #...#.>.#...>.>.#.###.#
    #####v#.#.###v#.#.###.#
    #.....#...#...#.#.#...#
    #.#########.###.#.#.###
    #...###...#...#...#.###
    ###.###.#.###v#####v###
    #...#...#.#.>.>.#.>.###
    #.###.###.#.###.#.#v###
    #.....###...###...#...#
    #####################.#`;
}

function parse(lines) {
    const m = lines.map(l => l.split(''));
    const start = [
        m[0].findIndex(c => c === '.'),
        0
    ];
    const end = [
        m[m.length-1].findIndex(c => c === '.'),
        m.length-1
    ];
    log(start);
    log(end);
    return {
        m,
        start,
        end
    };
}

class Node {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.adjacent = [];
    }
}

function getGraph(m, start, end, ignoreSlopes = false) {
    const nodes = [];
    const nodeMap = [];
    for(let y=0; y<m.length; y++) {
        nodeMap[y] = [];
        for(let x=0; x<m[y].length; x++) {
            const c = m[y][x];
            if (c === '#') {
                continue;
            } else {
                const node = new Node(x, y, c);
                nodes.push(node);
                nodeMap[y][x] = node;
            }
        }
    }

    for(let y=0; y<m.length; y++) {
        for(let x=0; x<m[y].length; x++) {
            const node = nodeMap[y][x];
            if (!node) {
                continue;
            }
            
            if (node.c === '.' || ignoreSlopes) {
                const vectors = [
                    [1,0],
                    [-1,0],
                    [0,1],
                    [0,-1]
                ];

                node.adjacent = vectors.map(([dx,dy]) => [dx+x,dy+y])
                    .filter(([x, y]) => y >= 0 && y < m.length && x >= 0 && x < m[y].length)
                    .filter(([x, y]) => nodeMap[y][x])
                    .map(([x, y]) => nodeMap[y][x]);
            } else if (node.c === '>') {
                node.adjacent = [
                    nodeMap[y][x+1]
                ];
            } else if (node.c === 'v') {
                node.adjacent = [
                    nodeMap[y+1][x]
                ];
            } else {
                throw new Error(`Unexpected character '${node.c}'`);
            }
        }
    }

    return {
        nodes,
        s: nodeMap[start[1]][start[0]],
        e: nodeMap[end[1]][end[0]]
    };
}

function longestPath(start, end, distance = 0, visited = new Set()) {
    if (start === end) {
        return distance;
    }

    const distances = start.adjacent.filter(a => !visited.has(a)).map(a => {
        let v = new Set(visited);
        v.add(start);
        return longestPath(a, end, distance+1, v);
    });

    return distances.reduce((p,c) => Math.max(p, c), -1);
}

function part1(lines) {
    let {m, start, end} = parse(lines);
    let { nodes, s, e } = getGraph(m, start, end);

    return longestPath(s, e);
}

function part2(lines) {
    let {m, start, end} = parse(lines);
    let { nodes, s, e } = getGraph(m, start, end, true);

    return longestPath(s, e);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));