export function delay(s) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, s);
  });
}
