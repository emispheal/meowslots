function generateNormallyDistributedArray(size, totalSum) {
    var numbers = [];
    var sum = 0;
    // Generate normally distributed numbers using Box-Muller transform
    for (var i = 0; i < size; i++) {
        var u1 = Math.random();
        var u2 = Math.random();
        var randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // Random number with standard normal distribution
        numbers.push(randStdNormal);
        sum += randStdNormal;
    }
    // Scale the numbers to make their sum equal to totalSum
    numbers = numbers.map(function (num) { return num / sum * totalSum; });
    // If you need integers, round the numbers and adjust to fix any rounding errors
    var integerNumbers = numbers.map(function (num) { return Math.round(num); });
    var integerSum = integerNumbers.reduce(function (acc, num) { return acc + num; }, 0);
    // Distribute the rounding error
    var error = totalSum - integerSum;
    while (error !== 0) {
        integerNumbers = integerNumbers.map(function (num) {
            if (error > 0 && num < totalSum) {
                error--;
                return num + 1;
            }
            else if (error < 0 && num > 0) {
                error++;
                return num - 1;
            }
            return num;
        });
    }
    return integerNumbers;
}
// Usage
var size = 100; // Number of elements in the array
var totalSum = 5900;
var resultArray = generateNormallyDistributedArray(size, totalSum);
console.log(resultArray);
console.log(resultArray.reduce(function (acc, num) { return acc + num; }, 0)); // Should log something very close to 5900
