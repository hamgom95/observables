const positionCheckSupport = () => {
    if (navigator.geolocation === undefined) throw Error("Geolocation is not supported by this browser");
}

const positionCurrent = () => new rxjs.Observable(observer => {
    positionCheckSupport();
    navigator.geolocation.getCurrentPosition(loc => observer.next(loc), err => observer.error(err));
});

// wrap html5 geolocation api with clearWatch
const positionWatch = (geolocationOptions = {}) => {
    let obs = new rxjs.Observable(observer => {
        positionCheckSupport();
        const watchId = navigator.geolocation.watchPosition(
            (loc) => observer.next(loc),
            (err) => observer.error(err),
            geolocationOptions
        );

        return () => navigator.geolocation.clearWatch(watchId);
    });
    obs = obs.pipe(
        // share the value producer across several subscriptions (like .multicast(new Rx.Subject()))
        rxjs.operators.publish(),
    );
    return obs;
};

// get description for geolocation error
const positionErrorDescription = error => {
    const messages = {
        [error.PERMISSION_DENIED]: 'Permission denied',
        [error.POSITION_UNAVAILABLE]: 'Position unavailable',
        [error.PERMISSION_DENIED_TIMEOUT]: 'Position timeout',
    };
    return messages[error.code] || error;
}

module.exports = {
    positionWatch,
};