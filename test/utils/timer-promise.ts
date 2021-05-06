export default function timerPromise<T = any, P = any>(callback: (value: P) => T, timeout = 1) {
    return async (...value: Parameters<typeof callback>) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(callback(...value));
                } catch (err) {
                    reject(err);
                }
            }, timeout);
        });
}
