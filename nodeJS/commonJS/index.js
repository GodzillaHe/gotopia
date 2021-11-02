const game = require('./lib.js');
let count = 0;
process.stdin.on('data', e => {
  const playerAction = e.toString().trim();
  const result = game(playerAction);
  if (result == -1) {
    count++
  }
  if (count === 3) {
    console.log('That’s Bullshit！F**k off！Asshole！');
    process.exit();
  }
})