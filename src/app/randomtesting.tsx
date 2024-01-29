function generateNormallyDistributedArray(size: any, totalSum: any) {
    let numbers = [];
    let sum = 0;
    
    // Generate normally distributed numbers using Box-Muller transform
    for (let i = 0; i < size; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // Random number with standard normal distribution
      numbers.push(randStdNormal);
      sum += randStdNormal;
    }
  
    // Scale the numbers to make their sum equal to totalSum
    numbers = numbers.map(num => num / sum * totalSum);
  
    // If you need integers, round the numbers and adjust to fix any rounding errors
    let integerNumbers = numbers.map(num => Math.round(num));
    let integerSum = integerNumbers.reduce((acc, num) => acc + num, 0);
    
    // Distribute the rounding error
    let error = totalSum - integerSum;
    while (error !== 0) {
      integerNumbers = integerNumbers.map(num => {
        if (error > 0 && num < totalSum) {
          error--;
          return num + 1;
        } else if (error < 0 && num > 0) {
          error++;
          return num - 1;
        }
        return num;
      });
    }
  
    return integerNumbers;
  }
  
  // Usage
  const size = 100; // Number of elements in the array
  const totalSum = 5900;
  const resultArray = generateNormallyDistributedArray(size, totalSum);
  
  console.log(resultArray);
  console.log(resultArray.reduce((acc, num) => acc + num, 0)); // Should log something very close to 5900