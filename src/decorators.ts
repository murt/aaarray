/**
 * Decorator to ensure that a function is provided as the first argument as a callback.
 */
export function validCallback(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        if (typeof args[0] !== "function") {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw TypeError(`${args[0]} is not a function`);
        } else {
            return originalMethod.apply(this, args);
        }
    };
}