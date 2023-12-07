let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `32T3K 765
    T55J5 684
    KK677 28
    KTJJT 220
    QQQJA 483`;
}

function parse(line) {
    let [cards, bid] = line.split(' ');
    bid = Number(bid);
    return {
        cards,
        bid
    };
}

/**
 * Creates a hash of the specified hand of cards.
 * Uses the specified cardRank to ensure the hashes
 * are sortable by 'highest card' rule.
 */
function calculateOrderedHash(cards, cardRank) {
    return cards
        .split('')
        .map(c => cardRank.indexOf(c))
        .reduce((p, c) => (p*cardRank.length) + c, 0);
}

/**
 * Calculates the frequency of each unique card in the specified hand.
 * Ordered by most to least frequent.
 */
function getFrequencies(cards) {
    const arr = cards.split('');
    const uniqueCards = Array.from(new Set(arr));

    return uniqueCards.map(card => ({
        card,
        count: arr.filter(a => a === card).length
    })).sort((a, b) => b.count - a.count);
}

/**
 * Gets the type (number) of hand from the specified cards.
 * The best type has a value of 6, the worst 0.
 */
function getType(cards) {
    log(`Calculating hand type for ${cards}`);

    // Get an ordered list of card runs (longest to shortest)
    const runs = getFrequencies(cards).map(c => c.count);
    log(`Card runs: ${runs}`);
    
    // Array of names - just for debug purposes
    const typeNames = [
        'High Card',
        'Pair',
        'Two Pair',
        'Three of a kind',
        'Full House',
        'Four of a kind',
        'Five of a kind'
    ];

    // Lookup the type based on the card runs
    let type;
    if (runs[0] === 5) {
        type = 6;
    } else if (runs[0] === 4) {
        type = 5;
    } else if (runs[0] === 3 && runs[1] === 2) {
        type = 4;
    } else if (runs[0] === 3) {
        type = 3;
    } else if (runs[0] === 2 && runs[1] === 2) {
        type = 2;
    } else if (runs[0] === 2) {
        type = 1;
    } else {
        type = 0;
    }

    log(`${cards}: ${typeNames[type]}`);

    return type;
}

/**
 * Calculates the best type avilable taking into account wildcards.
 */
function getBestType(cards) {
    log(`Getting best type for ${cards}`);

    // Work out the best replacement for jokers, if any
    if (cards.indexOf('J') > -1) {
        // Get all card frequencies, ignoring jokers
        const frequencies = getFrequencies(cards).filter(f => f.card !== 'J');

        // Handle the case of only jokers
        if (frequencies.length === 0) {
            return 6;
        }

        log(`Replacing jokers with ${frequencies[0].card}`);

        // Replace all jokers with the most frequent card
        cards = cards.replace(/J/g,frequencies[0].card);
    }

    return getType(cards);
}

function part1(lines) {
    const cardRank = '23456789TJQKA'.split('');
    const hands = lines.map(parse);

    // Score each hand, such that a hand with a higher score always beats a hand
    // with a lower score.
    hands.forEach(h => {
        const type = getType(h.cards);
        const hash = calculateOrderedHash(h.cards, cardRank);

        // A single score can be calculated from the sum of:
        // - the type, multiplied by the highest hash value; and,
        // - the hash.
        h.score = (type * Math.pow(13, 5)) + hash;
    }); 
    
    // Sort the hands by score
    hands.sort((a, b) => a.score - b.score);
    log(`Scored, sorted hands:`);
    log(hands);

    // Caluclate total winnings
    return hands.map((h, i) => h.bid * (i+1)).reduce((p,c) => p+c);
}

function part2(lines) {
    // Modified card rank for the hash
    const cardRank = 'J23456789TQKA'.split('');
    const hands = lines.map(parse);

    // As with part1, but with a different function for getting the type
    hands.forEach(h => {
        const type = getBestType(h.cards);
        const hash = calculateOrderedHash(h.cards, cardRank);

        h.score = (type * Math.pow(13, 5)) + hash;
    }); 

    // We can take exactly the same approach now to calculate the total winnings
    hands.sort((a, b) => a.score - b.score);
    log(`Scored, sorted hands:`);
    log(hands);

    return hands.map((h, i) => h.bid * (i+1)).reduce((p,c) => p+c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));