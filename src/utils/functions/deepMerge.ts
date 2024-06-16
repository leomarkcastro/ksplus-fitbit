export const deepMerge = (objects: any[]) => {
  const isObject = (obj: any) => obj && typeof obj === "object";
  const combinedObject = objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = deepMerge([pVal, oVal]);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
  return combinedObject;
};

// this would work like this:
// const merged = deepMerge([{ a: 1, b: { c: 2 } }, { b: { d: 3 } }]);
