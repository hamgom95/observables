// observe hash changes (with current hash as first emit)
const hashes = () => rxjs
    .fromEvent(window, "hashchange")
    // emit current hash as first value
    .pipe(
        // get hash from changed url
        rxjs.operators.map(e => new URL(e.newURL).hash),
        // add initial value
        rxjs.operators.startWith(window.location.hash),
        // remove #
        rxjs.operators.map(hash => hash.substring(1)),
    );

// emit when dom is ready (even if event already fired)
const domContentLoaded = (document) => new rxjs.Observable(observer => {
    // `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => observer.complete());
    } else {  // `DOMContentLoaded` already fired
        observer.complete();
    }
    return () => doc.removeEventListener("DOMContentLoaded", handler);
});

module.exports = {
    hashes,
    domContentLoaded,
};