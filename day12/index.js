const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `???.### 1,1,3
    .??..??...?##. 1,1,3
    ?#?#?#?#?#?#?#? 1,3,1,6
    ????.#...#... 4,1,1
    ????.######..#####. 1,6,5
    ?###???????? 3,2,1`;
}

function parse(line) {
    let [map, groups] = line.split(' ');
    groups = groups.split(',').map(Number);
    return {
        map,
        groups
    };
}

function trim(map) {
    while(map.length > 0 && map[0] === '.') {
        map = map.slice(1);
    }
    while(map.length > 0 && map[map.length-1] === '.') {
        map = map.slice(0, map.length-1);
    }
    return map;
}

function swapChar(str, i, c) {
    return str.substring(0, i) + c + str.substring(i+1);
}

const c = {};

function solve(map, groups, depth=0) {
    const key = `${map},[${groups}]`;
    if (c[key] !== undefined) return c[key]

    const prefix = '                   '.substring(0, (depth*2) + 1);
    log(`${prefix}Checking '${map}' with groups [${groups}]`);
    map = trim(map);

    if (groups.length === 0) {
        if (map.indexOf('#') === -1) {
            log(`${prefix}Valid`);
            c[key] = 1;
            return 1;
        } else {
            log(`${prefix}Invalid`);
            c[key] = 0;
            return 0;
        }
    } else if (map.length === 0) {
        log(`${prefix}Invalid`);
        c[key] = 0;
        return 0;
    }

    let options = 0;

    while(true) {
        if (map.length < groups[0]) {
            log(`${prefix}Returning ${options}`);
            c[key] = options;
            return options;
        }

        let mapGroupLen = map.indexOf('.');
        if (mapGroupLen === -1) mapGroupLen = map.length;

        if (mapGroupLen < groups[0]) {
            const firstSpring = map.indexOf('#');
            if (firstSpring === -1 || firstSpring > mapGroupLen) {
                log(`${prefix}Skipping ${mapGroupLen+1}`);
                map = map.substring(mapGroupLen+1);
                continue;
            } else {
                log(`${prefix}Returning ${options}`);
                c[key] = options;
                return options;
            }
        }

        if (map[groups[0]] !== '#') {
            options += solve(map.substring(groups[0] + 1), groups.slice(1),depth+1);
        }

        if(map[0] === '#') {
            log(`${prefix}Returning ${options}`);
            c[key] = options;
            return options;
        }
        
        map = map.substring(1);
    }
}

function part1(lines) {
    return lines.map(parse).map(({map, groups}, i) => {
        return solve(map, groups);
    })
    .reduce((p,c) => p+c);
}

function part2(lines) {
    return lines.map(parse).map(({map, groups}, i) => {
        map = `${map}?${map}?${map}?${map}?${map}`;
        groups = [
            ...groups,
            ...groups,
            ...groups,
            ...groups,
            ...groups
        ];
        return solve(map, groups);
    })
    .reduce((p,c) => p+c);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));