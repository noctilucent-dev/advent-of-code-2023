const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `broadcaster -> a, b, c
    %a -> b
    %b -> c
    %c -> inv
    &inv -> a`;
}

const PULSE_HIGH = 1;
const PULSE_LOW = 0;

class Pulse {
    static HIGH = 1;
    static LOW = 0;

    constructor(source, destination, value) {
        this.source = source;
        this.destination = destination;
        this.value = value;
    }
}

class Module {
    constructor(name, type, children) {
        this.name = name;
        this.type = type;
        this.children = children;
    }

    handlePulse(pulse) {
        return [];
    }
}

class FlipFlop extends Module {
    static TYPE = '%';

    constructor(name, children) {
        super(name, FlipFlop.TYPE, children);
        this.on = false;
    }

    handlePulse(pulse) {
        if (pulse.value === Pulse.HIGH) {
            return [];
        }
        this.on = !this.on;

        const pulseValue = this.on ? Pulse.HIGH : Pulse.LOW;

        return this.children.map(c => new Pulse(this.name, c, pulseValue));
    }
}

class Conjunction extends Module {
    static TYPE = '&';

    constructor(name, children, parents = []) {
        super(name, Conjunction.TYPE, children);
        this.mostRecent = new Map(parents.map(c => [c, Pulse.LOW]));
    }

    set parents(val) {
        this._parents = val;
        this.mostRecent = new Map(val.map(c => [c, Pulse.LOW]));
    }

    get parents() {
        return this._parents;
    }

    handlePulse(pulse) {
        this.mostRecent.set(pulse.source, pulse.value);
        const someLowPulse = Array.from(this.mostRecent).find(([c, value]) => value === Pulse.LOW);
        const pulseValue = someLowPulse ? Pulse.HIGH : Pulse.LOW;
        return this.children.map(c => new Pulse(this.name, c, pulseValue));
    }
}

class Broadcast extends Module {
    static TYPE = 'x';

    constructor(children) {
        super('broadcaster', Broadcast.TYPE, children);
    }

    handlePulse(pulse) {
        return this.children.map(c => new Pulse(this.name, c, pulse.value));
    }
}

class Button extends Module {
    static TYPE = 'b';

    constructor() {
        super('button', Button.TYPE, []);
    }

    pressButton() {
        return [
            new Pulse(this.name, 'broadcaster', Pulse.LOW)
        ];
    }
}


function parse(lines) {
    const modules = {};
    const parents = new Map();
    let broadcaster;

    lines.forEach(line => {
        const r = /(?<type>[%&]?)(?<name>\w+) -> (?<children>.*)/;
        let { type, name, children} = r.exec(line).groups;
        children = children.split(', ');

        if (type === FlipFlop.TYPE) {
            modules[name] = new FlipFlop(name, children);
        } else if (type === Conjunction.TYPE) {
            modules[name] = new Conjunction(name, children, []);
        } else if (name === 'broadcaster') {
            broadcaster = new Broadcast(children);
            modules[name] = broadcaster;
        } else {
            throw new Error('Unexpected module type');
        }

        children.forEach(c => {
            if (!parents.has(c)) {
                parents.set(c, [name]);
            } else {
                parents.get(c).push(name);
            }
        })
    });

    for(const child of parents.keys()) {
        if (modules[child] && modules[child].type === Conjunction.TYPE) {
            modules[child].parents = parents.get(child);
        }
    }

    return {
        modules,
        broadcaster
    };
}

function part1(lines) {
    const { modules, broadcaster } = parse(lines);
    const button = new Button();

    log(modules);
    log(broadcaster);

    let pulseCounts = {
        [Pulse.LOW]: 0,
        [Pulse.HIGH]: 0
    };

    for(let i=0; i<1000; i++) {
        let queue = button.pressButton();
        pulseCounts[Pulse.LOW]++;

        while(queue.length > 0) {
            const pulse = queue.shift();
            const module = modules[pulse.destination];

            if (!module) {
                log(`Found dead end - ${pulse.destination}`);
                continue;
            }

            const pulses = module.handlePulse(pulse);
            pulses.forEach(p => pulseCounts[p.value]++);
            queue.push(...pulses);
        }
    }

    return pulseCounts[Pulse.HIGH] * pulseCounts[Pulse.LOW];
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));