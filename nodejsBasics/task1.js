
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
        if (Array.isArray(prev)) {
            return recursiveSum(prev) + (Array.isArray(current) ? recursiveSum(current) : current);
        } else {
            return prev + (Array.isArray(current) ? recursiveSum(current) : current);
        }
    });
}

console.log('Passed number array', process.argv[2]);
console.log('Sum of numbers in array is', recursiveSum(process.argv[2]));