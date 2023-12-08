const fs = require("fs");

let raw = fs.readFileSync("input.txt", "utf8").toString();

// set true to use sample data and draw map
let DEBUG = !!process.env.DEBUG;

function log(l) {
    if (DEBUG) {
        console.log(l);
    }
}

function deepClone(arr) {
    return [...arr.map(l => [...l])];
}

function constrain(num, min, max) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

function recursiveCompare(obj, reference){
    if(obj === reference) return true;
    if(obj.constructor !== reference.constructor) return false;
    if(obj instanceof Array){
         if(obj.length !== reference.length) return false;
         for(var i=0, len=obj.length; i<len; i++){
             if(typeof obj[i] == "object" && typeof reference[j] == "object"){
                 if(!recursiveCompare(obj[i], reference[i])) return false;
             }
             else if(obj[i] !== reference[i]) return false;
         }
    }
    else {
        var objListCounter = 0;
        var refListCounter = 0;
        for(var i in obj){
            objListCounter++;
            if(typeof obj[i] == "object" && typeof reference[i] == "object"){
                if(!recursiveCompare(obj[i], reference[i])) return false;
            }
            else if(obj[i] !== reference[i]) return false;
        }
        for(var i in reference) refListCounter++;
        if(objListCounter !== refListCounter) return false;
    }
    return true; //Every object and array is equal
}

/**
 * Calculates the frequency of items in an array.
 * @param {T[]} arr array of primitives
 * @returns {[{ value: T, count: Number }]} Array of value/frequency pairs
 */
function getFrequencies(arr) {
    const uniqueValues = Array.from(new Set(arr));

    return uniqueCards.map(value => ({
        value,
        count: arr.filter(a => a === value).length
    })).sort((a, b) => b.count - a.count);
}


function lcm(...numbers) {
  // Helper function to calculate the Greatest Common Divisor (GCD) of two numbers
  function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
  }

  // Helper function to calculate the LCM of two numbers
  function lcmTwoNumbers(a, b) {
    return (a * b) / gcd(a, b);
  }

  // Calculate LCM of multiple numbers
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = lcmTwoNumbers(result, numbers[i]);
  }
  return result;
}

module.exports = {
    constrain,
    raw,
    DEBUG,
    log,
    deepClone,
    recursiveCompare,
    getFrequencies,
    lcm
};