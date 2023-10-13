export const removeUndefined = (obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
};

export const dataGet = (data: object, key: string | number, defaultValue: unknown = undefined): unknown => {
  let result: object | undefined = Object.assign({}, data);
  (key + '').split('.').forEach((k: string) => {
    if (typeof(result) == 'object' && k in result) {
      result = Object.getOwnPropertyDescriptor(result, k)?.value;
    } else {
      result = undefined;
    }
  });
  return result ?? defaultValue;
};

let callDelayTimer: NodeJS.Timeout | number | undefined;
export const callDelay = (func: CallableFunction, delay: number): void => {
  if (callDelay != undefined) clearTimeout(callDelayTimer);
  callDelayTimer = setTimeout(()=>{
    func();
    callDelayTimer = undefined;
  }, delay);
}
