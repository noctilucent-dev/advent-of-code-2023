const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = ``;
}

function part1(lines) {

}

const lines = toTrimmedLines(raw);

console.log(part1(lines));