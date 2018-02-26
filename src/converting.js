// @flow
function toStringArray(input: mixed): Array<string> {
  let arr = [];
  if (Array.isArray(input)) {
    input.forEach((data) => {
      if (typeof data === 'string') {
        arr.push(data);
      } else {
        return [];
      }
    });
    return arr;
  }
  return [];
}

// function toArrayOf<T>(input: mixed, mapFunction: (mixed) => T): Array<T> {
//   let arr = [];
//   let a;
//   if (typeof input === 'object') {
//     for (let key of Object.keys(input)) {
//       a = mapFunction(input[key]);
//       arr.push(a);
//     }
//   } else if (Array.isArray(input)) {
//     for (let item of input) {
//       a = mapFunction(input[key]);
//       arr.push(a);
//     }
//   } else {
//     arr.push(input);
//   }
//   return arr;
// }
