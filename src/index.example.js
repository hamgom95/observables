const {from, of, timer} = require("rxjs");
const ops = require("rxjs/operators");

function* fibonacci(){
    let fn1 = 1;
    let fn2 = 1;
    while (1) {
      let current = fn2;
      fn2 = fn1;
      fn1 = fn1 + current;
      yield current;
    }
}

// from(fibonacci()).pipe(ops.take(10)).subscribe(console.log)

// delay each input by its value in ms
of(1000,500,200,2000).pipe(ops.concatMap((ms) => of(ms).pipe(ops.delay(ms)))).subscribe(console.log);

// like before but run all without waiting for previous
of(1000,500,200,2000).pipe(ops.flatMap((ms) => of(ms).pipe(ops.delay(ms)))).subscribe(console.log);
