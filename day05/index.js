let { DEBUG, raw, log } = require("../util");

if (DEBUG) {
    raw = `seeds: 79 14 55 13

    seed-to-soil map:
    50 98 2
    52 50 48
    
    soil-to-fertilizer map:
    0 15 37
    37 52 2
    39 0 15
    
    fertilizer-to-water map:
    49 53 8
    0 11 42
    42 0 7
    57 7 4
    
    water-to-light map:
    88 18 7
    18 25 70
    
    light-to-temperature map:
    45 77 23
    81 45 19
    68 64 13
    
    temperature-to-humidity map:
    0 69 1
    1 0 69
    
    humidity-to-location map:
    60 56 37
    56 93 4`;
}

function parse(lines) {
    const seeds = lines[0].split(': ')[1].split(' ').map(Number);
    const tiers = [];
    let tier;

    for (let i=2; i<lines.length; i++) {
        if (/^[a-z]/.test(lines[i])) {
            if (tier) {
                tiers.push(tier);
                tier = undefined;
            }

            const[sourceName, _, destinationName] = lines[i].split(/[-\s]/);
            tier = {
                sourceName,
                destinationName,
                mappings: []
            };
        } else if (/^\d/.test(lines[i])) {
            const [destinationStart, sourceStart, range] = lines[i].split(' ').map(Number);
            tier.mappings.push({
                destinationStart,
                sourceStart,
                range
            });
        } else {
            log(tier);
        }
    }

    tiers.push(tier);

    return {
        seeds,
        tiers
    };
}

function part1(lines) {
    const {seeds, tiers} = parse(lines);
    
    tiers.forEach(t => t.mappings.forEach(m => {
        m.delta = m.destinationStart - m.sourceStart;
        m.sourceEnd = m.sourceStart + m.range - 1;
    }));

    const locations = seeds.map(seed => {
        let n = seed;
        for (let i=0; i<tiers.length; i++) {
            const mapping = tiers[i].mappings.find(m => m.sourceStart <= n && m.sourceEnd >= n);
            if (mapping) {
                n += mapping.delta;
            }
        }
        return n;
    });
    log(locations);

    return locations.reduce((p, c) => Math.min(p, c));
}

/**
 * Recursively search for the minimum location from this point
 */
function getMinLocation(minSeed, maxSeed, tierIndex, tiers, depth = 0) {
    const indent = '                                       '.substring(0, depth * 2);
    if (tierIndex >= tiers.length) {
        log(`${indent}Return min ${minSeed}`);
        return minSeed;
    }
    log(`${indent}Mapping ${tiers[tierIndex].sourceName} ${minSeed} -> ${maxSeed} to ${tiers[tierIndex].destinationName}`);

    const tier = tiers[tierIndex];
    const locations = [];

    // Go through each range of seed values
    while(minSeed < maxSeed) {
        // Find the next-lowest mapping
        // Note - we have pre-sorted the mappings
        const nextMapping = tier.mappings.find(m => m.sourceEnd >= minSeed);
        if (!nextMapping) {
            // No more mappings, so skip to next tier and break out of the loop
            locations.push(
                getMinLocation(
                    minSeed,
                    maxSeed,
                    tierIndex + 1,
                    tiers,
                    depth + 1
                )
            );
            break;
        }

        if (nextMapping.sourceStart > minSeed) {
            // There's a gap before the next-lowest mapping
            // so fork here for the gap
            locations.push(
                getMinLocation(
                    minSeed,
                    nextMapping.sourceStart-1,
                    tierIndex + 1,
                    tiers,
                    depth + 1
                )
            );
        }

        // Fork for the next-lowest mapping
        locations.push(
            getMinLocation(
                Math.max(minSeed, nextMapping.sourceStart) + nextMapping.delta,
                Math.min(maxSeed, nextMapping.sourceEnd) + nextMapping.delta,
                tierIndex + 1,
                tiers,
                depth + 1
            )
        );

        // Shift the starting range for the next loop
        minSeed = Math.min(maxSeed, nextMapping.sourceEnd) + 1;
    }

    // Get the minimum of all found locations
    return locations.reduce((p, c) => Math.min(p, c), Number.MAX_VALUE);
}

function part2(lines) {
    const {seeds, tiers} = parse(lines);
    
    // Calculate end of range and delta for every mapping
    tiers.forEach(t => t.mappings.forEach(m => {
        m.delta = m.destinationStart - m.sourceStart;
        m.sourceEnd = m.sourceStart + m.range - 1;
    }));

    // Sort all mappings by source start
    tiers.forEach(tier => tier.mappings.sort((a, b) => a.sourceStart - b.sourceStart));

    const locations = [];

    // Calculate the minimum location for each seed
    for(let i=0; i<seeds.length; i += 2) {
        const seed = seeds[i];
        const seedRange = seeds[i+1];

        locations.push(getMinLocation(seed, seed + seedRange - 1, 0, tiers));
    }

    log(locations);

    // Return the minimum location
    return locations.reduce((p, c) => Math.min(p, c));
}

const lines = raw.trim().split('\n').map(l => l.trim());

console.log(part1(lines));
console.log(part2(lines));