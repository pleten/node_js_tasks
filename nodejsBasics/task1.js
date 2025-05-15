
const recursiveSum = (arg) => {
    let array;
    if(typeof arg == 'string') {
        array = JSON.parse(arg);
    } else if (typeof arg == 'number') {
        array = [arg];
    } else {
        array = arg;
    }
    return array.reduce((prev, current) => {
        let prevValue;
        if (Array.isArray(prev)) {
            prevValue = recursiveSum(prev);
        } else {
            prevValue = prev;
        }
        if (Array.isArray(current)) {
            return prevValue + recursiveSum(current);
        } else {
            return prevValue + current;
        }
    });
}

console.log('Passed number array', process.argv[2]);
console.log('Sum of numbers in array is', recursiveSum(process.argv[2]));