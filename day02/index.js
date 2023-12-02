let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
    Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
    Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
    Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
}

function parseLine(line) {
    const [game, rest] = line.split(':');
    const gameNumber = game.slice(5) * 1;
    const rounds = rest.trim().split('; ').map(r => {
        const balls = r.trim().split(', ');
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
    log(`Parsed game ${gameNumber} - rounds: ${JSON.stringify(rounds)}`);

    return {
        gameNumber,
        rounds
    };
}

function part1(lines) {
    const games = lines.map(parseLine);
    const validGames = games.filter(g => {
        const maxValues = {
            red: 0,
            green: 0,
            blue: 0
        };
        g.rounds.forEach(r => {
            maxValues.red = Math.max(maxValues.red, r.red);
            maxValues.green = Math.max(maxValues.green, r.green);
            maxValues.blue = Math.max(maxValues.blue, r.blue);
        });
        log(`Game ${g.gameNumber} has max ${maxValues.red} red, ${maxValues.green} green, ${maxValues.blue} blue`);

        return maxValues.red <= 12 && maxValues.green <= 13 && maxValues.blue <= 14;
    });
    return validGames.reduce((p, c) => p + c.gameNumber, 0);
}

function part2(lines) {
    const games = lines.map(parseLine);
    const powers = games.map(g => {
        const maxValues = {
            red: 0,
            green: 0,
            blue: 0
        };
        g.rounds.forEach(r => {
            maxValues.red = Math.max(maxValues.red, r.red);
            maxValues.green = Math.max(maxValues.green, r.green);
            maxValues.blue = Math.max(maxValues.blue, r.blue);
        });
        log(`Game ${g.gameNumber} has max ${maxValues.red} red, ${maxValues.green} green, ${maxValues.blue} blue`);

        return maxValues.red * maxValues.green * maxValues.blue;
    });
    return powers.reduce((p, c) => p + c, 0);
}

const lines = raw.trim().split('\n').map(l => l.trim()).filter(l => l !== '');

console.log(part1(lines));
console.log(part2(lines));