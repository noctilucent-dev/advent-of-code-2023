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

function solve(map, groups, depth=0, m='') {
    const prefix = '                   '.substring(0, (depth*2) + 1);
    log(`${prefix}Checking '${map}' with groups [${groups}]`);
    map = trim(map);

    if (groups.length === 0) {
        if (map.indexOf('#') === -1) {
            log(`${prefix}Valid`);
            log(m);
            return 1;
        } else {
            log(`${prefix}Invalid`);
            return 0;
        }
    } else if (map.length === 0) {
        log(`${prefix}Invalid`);
        return 0;
    }

    let options = 0;
    while(true) {
        if (map.length < groups[0]) {
            log(`${prefix}Returning ${options}`);
            return options;
        }

        let mapGroupLen = map.indexOf('.');
        if (mapGroupLen === -1) mapGroupLen = map.length;

        if (mapGroupLen < groups[0]) {
            const firstSpring = map.indexOf('#');
            if (firstSpring === -1 || firstSpring > mapGroupLen) {
                log(`${prefix}Skipping ${mapGroupLen+1}`);
                map = map.substring(mapGroupLen+1);
                m += '..............'.substring(0,mapGroupLen+1);
                continue;
            } else {
            log(`${prefix}Returning ${options}`);
            return options;
            }
        }

        if (map[groups[0]] !== '#') {
            const g = '###########'.substring(0,groups[0]);
            options += solve(map.substring(groups[0] + 1), groups.slice(1),depth+1, `${m}${g}.`);
        } else {
            log(`${prefix}Skipping`);
        }

        if(map[0] === '#') {
            log(`${prefix}Returning ${options}`);
            return options;
        }
        
        map = map.substring(1);
        m += '.';
    }
    // if (mapGroup.minLength > groups[0]) {
    //         log(`${prefix}Invalid`);
    //         return 0;
    // }

    // const firstSpring = mapGroup.s.indexOf('#');
    // let initialWildcards = 0;
    // if (firstSpring > -1) {
    //     initialWildcards = firstSpring;
    // } else {
    //     initialWildcards = mapGroup.s.length;
    // }

    // let options = 0;
    // for(let offset=0; offset<=initialWildcards && groups[0] + offset <= mapGroup.maxLength; offset++) {
    //     let newMap = map.substring(offset + groups[0] + 1);
    //     options += solve(newMap, groups.slice(1), depth+1);
    // }

    // log(`${prefix}Returning ${options}`);
    // return options;
}

function part1(lines) {
    return lines.map(parse).map(({map, groups}, i) => {
        if (i === 5 || true)
            return solve(map, groups);
        else
            return 0;
    })
    .reduce((p,c) => p+c);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));