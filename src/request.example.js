const rxjs = require("rxjs");
const ops = require("rxjs/operators");

const {encode} = require("./util");
const {request} = require("./request");

async function test() {

    // flatmap to emit on source stream (else stream of streams)
    const data = await rxjs.of("https://google.de?a=1#top", "http://google.org").pipe(
        ops.flatMap(url => request({method: "GET", url})),
        encode("utf-8"),
        ops.scan((acc, elem) => [...acc, elem], []), // gather two loaded page contents for promise resolve (else only last shows)
    ).toPromise();
    console.log(data);
}

test();