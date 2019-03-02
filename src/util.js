const {Observable, of, from} = require("rxjs");
const ops = require("rxjs/operators");

// encode data to string
const encode = (encoding="utf-8") => sourceObservable => sourceObservable.pipe(ops.map(bin => bin.toString(encoding)));

// concat chunks to full data
const concat = sourceObservable => sourceObservable.pipe(ops.scan((acc, i) => acc + i));

const count = sourceObservable => sourceObservable.pipe(ops.scan((acc, i) => acc + i), 0);

// add counter to streamed values
const enumerate = (start = 0, inc = 1) => sourceObservable => sourceObservable.pipe(
    ops.map(v => [(start+=inc, start), v])
);

// count number of emitted events in time interval
const multiEmit = (timeout = 1000, minCount = 2) => sourceObservable =>
    sourceObservable.pipe(
        rxjs.operators.bufferTime(timeout),
        rxjs.operators.map(list => list.length),
        rxjs.operators.filter(x => x >= minCount),
    );

// endless stream of looped values
// same as: rxjs.of(1,2,3).pipe(ops.repeat()).subscribe(console.log);
const loop = (...values) => new Observable(observer => {
    let run = true;

    // run async but start now
    setImmediate(() => {
        while (run) {
            for (const value of values) {
                observer.next(value);
            }
        }
        observer.complete();
    });

    return () => { run = false; };
});

const dice = (sides=6) => of(null).pipe(ops.map(() => Math.floor(Math.random() * sides) + 1));

// like rxjs.timer but using nested setTimeout
const timeoutTimer = (initialWait, intervalWait=initialWait) => new Observable(observer => {
    let count = 0;
    let id;

    const handler = () => {
        observer.next(count++);
        id = setTimeout(handler, intervalWait);
    };

    id = setTimeout(handler, initialWait);

    // once we stop listening to values clear the interval
    return () => {
        clearTimeout(id);
    };
});

// gather chunks, concat to buffer and encode to string
const chunksToString = source => source.pipe(
    reduce((acc, it) => [...acc, it], []),
    map(chunks => Buffer.concat(chunks).toString("UTF-8"))
);

module.exports = {
    encode,
    concat,
    enumerate,
    loop,
    count,
    multiEmit,
    dice,
    timeoutTimer,
    chunksToString,
};

