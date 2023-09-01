const fs = require('fs');

setTimeout(() => {
  console.log('Timer 1 finished'); // 2
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished'); // 3
});

fs.readFile('test-file.txt', 'utf8', () => {
  console.log('I/O finished'); // 4

  console.log('-----------------------');

  setTimeout(() => {
    console.log('Timer 2 finished'); // 6
  }, 0);

  setTimeout(() => {
    console.log('Timer 3 finished'); // 7
  }, 3000);

  setImmediate(() => {
    console.log('Immediate 2 finished'); // 5
  });

  process.nextTick(() => console.log('Process.nextTick'));
});

console.log('Hello from the top-level code'); // 1
