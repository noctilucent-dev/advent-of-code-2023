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

function hash(cards, cardRank) {
    return cards
        .split('')
        .map(c => cardRank.indexOf(c))
        .reduce((p, c) => (p*cardRank.length) + c, 0);
}

function getType(cards) {
    const sorted = [...cards].sort((a, b) => a.localeCompare(b));
    log(sorted);
    const runs = [];
    for (let i=1, c=1; i<=sorted.length; i++) {
        if (sorted[i] !== sorted[i-1]) {
            runs.push(c);
            c = 1;
        } else {
            c++;
        }
    }
    runs.sort((a, b) => b-a);
    log(runs);

    const typeNames = [
        '',
        'High Card',
        'Pair',
        'Two Pair',
        'Three of a kind',
        'Full House',
        'Four of a kind',
        'Five of a kind'
    ];

    let type = 1;
    if (runs[0] === 5) {
        type = 7;
    } else if (runs[0] === 4) {
        type = 6;
    } else if (runs[0] === 3 && runs[1] === 2) {
        type = 5;
    } else if (runs[0] === 3) {
        type = 4;
    } else if (runs[0] === 2 && runs[1] === 2) {
        type = 3;
    } else if (runs[0] === 2) {
        type = 2;
    } else {
        type = 1;
    }

    log(`${cards}: ${typeNames[type]}`);

    return type;
}

function score(cards) {
    const cardRank = '23456789TJQKA'.split('');
    const type = getType(cards);
    let s = hash(cards, cardRank);
    return (type * Math.pow(13, 5)) + s;
}

function getBestType(cards) {
    if (cards === 'JJJJJ') cards = 'AAAAA';

    log(`Getting best type from ${cards}`);
    if (cards.indexOf('J') === -1) {
        return getType(cards);
    }

    let options = Array.from(new Set(cards.replace(/J/g,'').split('')));
    return options
        .map(o => {
            const newCards = cards.replace('J',o);
            return getBestType(newCards);
        })
        .reduce((p, c) => Math.max(p, c), 0);
}

function score2(cards) {
    const cardRank = 'J23456789TQKA'.split('');
    const o = getBestType(cards);
    return (o * Math.pow(13, 5)) + hash(cards, cardRank);
}

function part1(lines) {
    const hands = lines.map(parse);
    hands.forEach(h => h.score = score(h.cards)); 
    hands.sort((a, b) => a.score - b.score);
    log(hands);
    return hands.map((h, i) => h.bid * (i+1)).reduce((p,c) => p+c);
}

function part2(lines) {
    const hands = lines.map(parse);
    hands.forEach(h => h.score = score2(h.cards)); 
    hands.sort((a, b) => a.score - b.score);
    log(hands);
    return hands.map((h, i) => h.bid * (i+1)).reduce((p,c) => p+c);
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));