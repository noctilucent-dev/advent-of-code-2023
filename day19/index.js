const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `px{a<2006:qkq,m>2090:A,rfg}
    pv{a>1716:R,A}
    lnx{m>1548:A,A}
    rfg{s<537:gd,x>2440:R,A}
    qs{s>3448:A,lnx}
    qkq{x<1416:A,crn}
    crn{x>2662:A,R}
    in{s<1351:px,qqz}
    qqz{s>2770:qs,m<1801:hdj,R}
    gd{a>3333:R,R}
    hdj{m>838:A,pv}
    
    {x=787,m=2655,a=1222,s=2876}
    {x=1679,m=44,a=2067,s=496}
    {x=2036,m=264,a=79,s=2244}
    {x=2461,m=1339,a=466,s=291}
    {x=2127,m=1623,a=2188,s=1013}`;
}

function parseRules(rules) {
    rules = rules.split(',');
    const defaultWorkflow = rules.pop();

    rules = rules.map(rule => {
        let [key, operand, value, _, workflow] = rule.split(/\b/);
        value = Number(value);

        return {
            key,
            operand,
            value,
            workflow
        };
    });

    return {
        rules,
        defaultWorkflow
    };
}

function parse(raw) {
    let [workflows, parts] = raw.trim().split(/\n\s*\n/);
    workflows = workflows.trim().split('\n').map(l => l.trim());
    parts = parts.trim().split('\n').map(l => l.trim());

    workflows = workflows.map(l => {
        const result = l.match(/(?<name>\w+){(?<rules>[^}]+)}/);
        let { name, rules } = result.groups;
        rules = parseRules(rules);
        return {
            name,
            rules
        };
    });

    parts = parts.map(p => JSON.parse(p.replace(/(\w+)=(\d+)/g, '"$1":$2')));

    const workflowMap = {};
    workflows.forEach(w => {
        workflowMap[w.name] = w.rules;
    });

    return {
        parts,
        workflows: workflowMap
    };
}

function part1(parts, workflows) {
    return parts.filter(part => {
        let workflow = 'in';
        while(workflow !== 'A' && workflow !== 'R') {
            const { rules, defaultWorkflow } = workflows[workflow];
            const rule = rules.find(({key, operand, value}) => {
                if (operand === '<') {
                    return part[key] < value;
                } else {
                    return part[key] > value;
                }
            });
            if (rule) {
                workflow = rule.workflow;
            } else {
                workflow = defaultWorkflow;
            }
        }

        return workflow === 'A';
    })
    .map(part => part.x + part.m + part.a + part.s)
    .reduce((p,c) => p+c);
}

function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
}

function countAccepted(group, workflowName, workflows, depth=0) {
    const prefix = '                        '.substring(0, depth*2);
    log(`${prefix}Considering ${workflowName}, x: ${group.min.x} -> ${group.max.x}, m: ${group.min.m} -> ${group.max.m}, a: ${group.min.a} -> ${group.max.a}, s: ${group.min.s} -> ${group.max.s}`)
    if (workflowName === 'R') return [];
    if (workflowName === 'A') {
        // const dx = group.max.x - group.min.x + 1;
        // const dm = group.max.m - group.min.m + 1;
        // const da = group.max.a - group.min.a + 1;
        // const ds = group.max.s - group.min.s + 1;

        // return dx * dm * da * ds;
        return [group];
    }

    const { rules, defaultWorkflow } = workflows[workflowName];

    let counts = rules.flatMap(rule => {
        const nextGroup = deepClone(group);
        if (rule.operand === '<') {
            nextGroup.max[rule.key] = Math.min(rule.value - 1, nextGroup.max[rule.key]);
        } else {
            nextGroup.min[rule.key] = Math.max(rule.value + 1, nextGroup.min[rule.key]);
        }
        return countAccepted(nextGroup, rule.workflow, workflows, depth+1);
    });
    
    counts.push(...countAccepted(group, defaultWorkflow, workflows, depth+1));

    return counts;
    // return counts.reduce((p,c) => p+c);
}

function numberRangesOverlap([minA, maxA], [minB, maxB]) {
    return (minA >= minB && minA < maxB) || (maxA >= minB && maxA <= maxB);
}

function groupsOverlap(a, b) {
    const keys = ['x','m','a','s'];
    return keys
        .map (k => numberRangesOverlap([a.min[k], a.max[k]],[b.min[k],b.max[k]]))
        // .map(k => (a.min[k] >= b.min[k] && a.min[k] <= b.max[k]) || (a.max[k] >= b.min[k] && a.max[k] <= b.max[k]))
        .reduce((p,c) => p&&c);    
}

function calculateArea(group) {
    const dx = group.max.x - group.min.x + 1;
    const dm = group.max.m - group.min.m + 1;
    const da = group.max.a - group.min.a + 1;
    const ds = group.max.s - group.min.s + 1;

    return dx * dm * da * ds;
}

function reduceGroups(groups) {
    const keys = ['x','m','a','s'];

    let area = 0;
    let counted = [];
    for(let i=0; i<groups.length; i++) {
        area += calculateArea(groups[i]);
        counted
            .filter((c) => groupsOverlap(groups[i], c));
    }
}

function part2(workflows) {
    let initialGroup = {
        min: {
            x: 1,
            m: 1,
            a: 1,
            s: 1
        },
        max: {
            x: 4000,
            m: 4000,
            a: 4000,
            s: 4000
        }
    };
    // return countAccepted(initialGroup, 'in', workflows);
    const acceptedGroups = countAccepted(initialGroup, 'in', workflows);

    log(acceptedGroups);

    for(let i=1; i<acceptedGroups.length; i++) {
        for(let j=0; j<i; j++) {
            if (groupsOverlap(acceptedGroups[i], acceptedGroups[j])) {
                log(`Group ${i} overlaps with group ${j}`);
            }
        }
    }

    // let count = 0;
    // for (let x=1; x<=4000; x++) {
    //     for (let m=1; m<=4000; m++) {
    //         for (let a=1; a<=4000; a++) {
    //             for (let s=1; s<=4000; s++) {
    //                 if (acceptedGroups.find(g => {
    //                     return
    //                         x >= g.min.x && x <= g.max.x &&
    //                         m >= g.min.m && m <= g.max.m &&
    //                         a >= g.min.a && a <= g.max.a &&
    //                         s >= g.min.s && s <= g.max.s;
    //                 })) {
    //                     count++;
    //                 }
    //             }
    //         }
    //     }
    // }

    // return count;
}

const { parts, workflows } = parse(raw);
log(parts);
log(workflows);

console.log(part1(parts, workflows));
console.log(part2(workflows));