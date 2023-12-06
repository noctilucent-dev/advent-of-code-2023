let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `Time:      7  15   30
    Distance:  9  40  200`;
}

/**
 * Calculates the 2 solutions that will give the specified distance in the specified time.
 */
function solve(totalTime, recordDistance) {
    // The distance travelled can be calculated as follows:
    //    d = w * (t - w)
    // Where d is the total distance travelled
    //       w is the time spent holding the button
    //       t is the total race time
    //
    // Rearranging this, we can say:
    //     w * (t - w) = d
    //   -w^2 + tw - d = 0
    //
    // This is a quadratic equation that we can solve with
    // the standard quadratic formula.

    const a = -1;
    const b = totalTime;
    const c = -recordDistance;

    const x1 = (-b + Math.sqrt((b*b) - 4*a*c)) / (2*a);
    const x2 = (-b - Math.sqrt((b*b) - 4*a*c)) / (2*a);

    log ([x1, x2]);

    // We need discrete (integer) values for the problem.
    // So we round to the solutions to the lowest/highest integers
    // such that the total distance < record distance.
    // Note - for our equation, x1 < x2
    return [Math.floor(x1), Math.ceil(x2)];
}

function part1(lines) {
    lines = lines.map(l => l.split(/\s+/).slice(1).map(Number));
    const races = lines[0].map((t, i) => [t, lines[1][i]]);
    log(races);

    return races.map(([t, c]) => {
        const [min, max] = solve(t, c);
        log ([min, max]);

        return max - min - 1;
    }).reduce((p, c) => p*c);
}

function part2(lines) {
    const time = Number(lines[0].substring(10).replace(/\s+/g,''));
    const distance = Number(lines[1].substring(10).replace(/\s+/g,''));
    log(time);
    log(distance);

    const [min, max] = solve(time, distance);
    return max - min - 1;
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));