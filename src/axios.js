const {Observable} = require("rxjs");

const axiosPromise = require("axios");

// axios to rxjs observable
const axios = options => new Observable(observer => {
    const source = axios.CancelToken.source();

    axiosPromise({...options, cancelToken: source.token})
        .then((data) => observer.next(data))
        .catch(error => {
            if (axios.isCancel(error)) {
                // caused by cancel
                observer.complete();
            } else {
                observer.error(error);
            }
        })
        .then(() => observer.complete());

    return () => source.cancel();
});

module.exports = {
    axios,
};