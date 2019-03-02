const {Observable} = require("rxjs");

const fs = require("fs");

/**
 * Convert stream to observable.
 * @param {*} stream 
 */
const stream = stream => new Observable(observer => {
    stream.on("data", (data) => observer.next(data));
    stream.on("end", () => observer.complete());
    stream.on("error", error => observer.error(error));

    return () => stream.destroy();
});

const readStream = (filename) => new Observable(observer => {
    const readS = fs.createReadStream(filename);
    const subscription = stream(readS).subscribe(observer);
    return () => {
        readS.close();
        subscription.unsubscribe();
    };
});


module.exports = {
    stream,
    readStream,
};