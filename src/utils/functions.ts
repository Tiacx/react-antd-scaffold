import { AnyObject } from "antd/es/_util/type";

// 移除 Undefiled 元素
export const removeUndefined = (obj: AnyObject) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
};

// 獲取對象屬性值
export const dataGet = (data: AnyObject, key: string | number, defaultValue: unknown = undefined): unknown => {
  let result: AnyObject | undefined = Object.assign({}, data);
  (key + '').split('.').forEach((k: string) => {
    if (typeof(result) == 'object' && k in result) {
      result = Object.getOwnPropertyDescriptor(result, k)?.value;
    } else {
      result = undefined;
    }
  });
  return result ?? defaultValue;
};

// 延時調用
let callDelayTimer: NodeJS.Timeout | number | undefined;
export const callDelay = (func: CallableFunction, delay: number): void => {
  if (callDelay != undefined) clearTimeout(callDelayTimer);
  callDelayTimer = setTimeout(()=>{
    func();
    callDelayTimer = undefined;
  }, delay);
};

// 遞歸Map
export const recursiveMap = (data: AnyObject[], filter: CallableFunction, childrenKey = 'children'): AnyObject[] => {
  let result:AnyObject[] = [];
  data.forEach((item: AnyObject) => {
    const value = filter(item);
    if (value !== false) result.push(value);
    if (Array.isArray(item[childrenKey])) {
      result = result.concat(recursiveMap(item[childrenKey], filter, childrenKey));
    }
  });
  return result;
};
