const { Observable } = require("rxjs");

const { stream } = require("./node");

const http = require("http");
const https = require("https");
const { URL } = require("url");

const request = ({ url, body, ssl, ...options }) => new Observable(observer => {
    // split url to host and path
    if (url) {
        const u = new URL(url);
        options.hostname = u.hostname;
        options.path = u.pathname + u.search + u.hash;
        if (ssl === undefined) ssl = u.protocol === "https:";
    }

    // choose module for protocol
    const mod = (ssl) ? https : http;

    let subscription;
    const req = mod.request(options, res => {
        subscription = stream(res).subscribe(observer);
    });

    req.on("error", (error) => observer.error(error));
    req.end(body);

    return () => {
        if (subscription) subscription.unsubscribe();
        req.abort();
    };
});

module.exports = {
    request,
};
