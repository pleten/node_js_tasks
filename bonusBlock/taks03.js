const promiseTimeOut = (callback, timeout) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
           return resolve(callback);
        }, timeout);
    })
};

const promise1 = promiseTimeOut('First promise resolved after 1 second', 1000);
const promise2 = promiseTimeOut('Second promise resolved after 2 seconds', 2000);
const promise3 = promiseTimeOut('Third promise resolved after 3 seconds', 3000);

promise3.then(r => console.log(r));
promise2.then(r => console.log(r));
promise1.then(r => console.log(r));
