let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
}

function parse(line) {
    const [start, rest] = line.split(/:\s+/);
    let [winners, chosen] = rest.split(' | ');
    winners = winners.trim().split(/\s+/).map(Number);
    chosen = chosen.trim().split(/\s+/).map(Number);
    return {
        winners,
        chosen
    };
}

function scoreGame(winners, chosen) {
    winners = new Set(winners);
    const matching = chosen.filter(n => winners.has(n));
    if (matching.length === 0) {
        return {
            matches: 0,
            score: 0
        };
    }

    return {
        matches: matching.length,
        score: Math.pow(2, matching.length - 1)
    };
}

function part1(lines) {
    return lines.reduce((p, line) => {
        let { winners, chosen } = parse(line);
        log(winners);
        log(chosen);
        return scoreGame(winners, chosen).score + p;
    }, 0);
}

function part2(lines) {
    const games = lines.map(parse);
    const scores = games.map(({winners, chosen}) => {
        const {matches, score} = scoreGame(winners, chosen);
        return {
            matches,
            score,
            copies: 1
        }
    });
    log(scores);
    for(let i=0; i<scores.length; i++) {
        log(`Updating for game ${i+1}`);

        for (let j=0; j<scores[i].matches; j++) {
            log(`Adding ${scores[i].copies} copies for game ${i+j+1+1}`);
            scores[i+j+1].copies += scores[i].copies;
        }
        
        log(scores);
    }
    
    return scores.reduce((p, c) => p + c.copies, 0);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));