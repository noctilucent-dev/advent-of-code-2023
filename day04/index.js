let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
}

/**
 * Parses an input line into two arrays of numbers - winners and chosen.
 */
function parse(line) {
    const [_, rest] = line.split(/:\s+/);
    let [winners, chosen] = rest.split(' | ');
    winners = winners.trim().split(/\s+/).map(Number);
    chosen = chosen.trim().split(/\s+/).map(Number);
    return {
        winners,
        chosen
    };
}

/**
 * Calculates the count of matching numbers and score for the specified card.
 */
function scoreCard(winners, chosen) {
    winners = new Set(winners);
    const matches = chosen.filter(n => winners.has(n)).length;

    return {
        matches,
        score: matches ? Math.pow(2, matches - 1) : 0
    };
}

function part1(lines) {
    // Sum the score for each card
    return lines.reduce((p, line) => {
        let { winners, chosen } = parse(line);
        log(winners);
        log(chosen);
        return scoreCard(winners, chosen).score + p;
    }, 0);
}

function part2(lines) {
    // Parse cards and track the number of copies of each
    const cards = lines.map(parse).map(({winners, chosen}) => {
        const {matches} = scoreCard(winners, chosen);
        return {
            matches,
            copies: 1
        }
    });
    log(cards);

    // Iterate over each card, adding subsequent copies
    for(let i=0; i<cards.length; i++) {
        log(`Updating for card ${i+1}`);

        // Add copies of subsequent cards
        // Note -  number of copies depends on copies of this card
        for (let j=0; j<cards[i].matches; j++) {
            log(`Adding ${cards[i].copies} copies for card ${i+j+1+1}`);
            cards[i+j+1].copies += cards[i].copies;
        }
        
        log(cards);
    }

    // Sum all the copies
    return cards.reduce((p, c) => p + c.copies, 0);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));