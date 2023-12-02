let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
    Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
    Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
    Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
}

/**
 * Parses a single line from input and returns structured data.
 * e.g.
 * {
 *   gameNumber: 1,
 *   rounds: [{
 *     red: 1,
 *     blue: 2,
 *     green: 3
 *   }, {
 *     red: 9,
 *     blue: 10,
 *     green: 0
 *   }]
 * }
 */
function parseLine(line) {
    const [game, rest] = line.split(': ');
    const gameNumber = game.slice(5) * 1;

    const rounds = rest.trim().split('; ').map(r => {
        const balls = r.trim().split(', ');
        // Note - colours default to zero if no balls picked in round
        const counts = {
            red: 0,
            green: 0,
            blue: 0
        };
        balls.forEach(b => {
            const [count, colour] = b.split(' ');
            counts[colour] += count * 1;
        });
        return counts;
    });

    return {
        gameNumber,
        rounds
    };
}

/**
 * Calculates the maximum number of balls of each colour from any of the specified rounds.
 */
function calculateMaxValues(rounds) {
    return rounds.reduce((p, c) => ({
        red: Math.max(p.red, c.red),
        blue: Math.max(p.blue, c.blue),
        green: Math.max(p.green, c.green)
    }));
}

function part1(lines) {
    return lines
        .map(parseLine)
        // Filter out any games where max ball count exceeds limit
        .filter(g => {
            const maxValues = calculateMaxValues(g.rounds);
            return maxValues.red <= 12 && maxValues.green <= 13 && maxValues.blue <= 14
        })
        // Sum the remaining game numbers
        .map(g => g.gameNumber)
        .reduce((p, c) => p + c);
}

function part2(lines) {
    return lines
        .map(parseLine)
        // Calculate the 'power' of each game using the ball counts
        .map(g => {
            const maxValues = calculateMaxValues(g.rounds);
            return maxValues.red * maxValues.green * maxValues.blue;
        })
        // Sum the powers
        .reduce((p, c) => p + c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));