const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
}

function hash(str) {
    let value=0;
    for(let i=0; i<str.length; i++) {
        value += str.charCodeAt(i);
        value *= 17;
        value %= 256;
    }

    return value;
}

function part1(raw) {
    const steps=raw.split(',');
    return steps.map(hash).reduce((p,c) => p+c);
}

function print(boxes) {
    if (!DEBUG) return;

    for (let i=0; i<boxes.length; i++) {
        if (boxes[i].length > 0) {
            const content = boxes[i].map(box => `[${box.label} ${box.focalLength}]`).join(',');
            log(`Box ${i}: ${content}`);
        }
    }
}

function part2(raw) {
    const steps=raw.split(',');
    const boxes = [];
    for(let i=0; i<256; i++) {
        boxes[i] = [];
    }
    steps.forEach(step => {
        const a = step.indexOf('=');
        const b = step.indexOf('-');
        const len = a > -1 ? a : b;

        const label = step.substring(0,len);
        const box = boxes[hash(label)];

        const instr = step[len];

        if (instr === '=') {
            const focalLength = Number(step.substring(len+1));
            const lens = {
                label,
                focalLength
            };
            
            const existingIndex = box.findIndex(lens => lens.label === label);
            if (existingIndex === -1) {
                box.push(lens);
            } else {
                box[existingIndex] = lens;
            }
        } else {
            const existingIndex = box.findIndex(lens => lens.label === label);
            if (existingIndex === -1) {
                return;
            }
            for(let i=existingIndex; i<box.length-1; i++) {
                box[i] = box[i+1];
            }
            box.pop();
        }
        log(`After "${step}"`)
        print(boxes);
        log('');
    });

    return boxes
        .flatMap((box, i) =>
            box.map(({focalLength}, j) =>
                (i+1)*(j+1)*focalLength
            )
        )
        .reduce((p,c) => p+c);
}

console.log(part1(raw));
console.log(part2(raw));