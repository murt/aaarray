// Array polyfills for flat and flatMap
// @ts-expect-error
export const flat: typeof Array.prototype.flat = function (depth?: number) {
    return depth
        ? Array.prototype.reduce.call(
              this,
              (prev: any, cur) => (cur instanceof Array ? prev.concat(flat.call(cur, depth - 1)) : prev.concat(cur)),
              []
          )
        : this;
};
