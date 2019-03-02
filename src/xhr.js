const { Observable } = require("rxjs");
const XMLHttpRequest = require("xhr2");

const xhr = (xhrObj, body) => new Observable(observer => {
    xhrObj.addEventListener("error", (e) => observer.error(e));
    xhrObj.addEventListener("load", () => {
        observer.next(xhrObj.responseText);
        observer.complete();
    });
    xhrObj.send(body);

    return () => xhrObj.abort();
});

// ajax request observable (emit both progress and final xhr response)
const xhrProgress = (xhrObj, body) => new Observable(observer => {
    xhrObj.addEventListener("error", (e) => observer.error(e));
    xhrObj.addEventListener("load", () => observer.complete());

    let lastPosition = 0;
    xhrObj.addEventListener("progress", () => {
        // emit loaded chunk response text
        const resp = xhrObj.responseText;
        const chunk = resp.substring(lastPosition);
        lastPosition = resp.length;
        if (chunk.length > 0) observer.next(chunk);
    });

    xhrObj.send(body);

    return () => xhrObj.abort();
});


// xml poll loading based on triggerObservable emits
const xhrPoll = (triggerObservable, xhrObj, body) => new Observable(observer => {
    xhrObj.addEventListener("error", (e) => observer.error(e));
    xhrObj.addEventListener("load", () => observer.complete());

    let lastPosition = 0;
    const subscription = triggerObservable.subscribe(() => {
        // emit current accumulated response text
        const resp = xhrObj.responseText;
        const chunk = resp.substring(lastPosition);
        if (chunk.length > 0) observer.next(chunk);
        lastPosition = resp.length;

        if (xhrObj.readyState === XMLHttpRequest.DONE) observer.complete();
    });

    xhrObj.send(body);

    return () => {
        xhrObj.abort();
        subscription.unsubscribe();
    };
});

module.exports = {
    xhr,
    xhrProgress,
    xhrPoll,
};