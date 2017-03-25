import { set } from 'object-path';
import isPlainObj from 'is-plain-obj';

export const objToDot = (obj) => {

  const objToDotNotation = (obj, result = {}, dotPathArr = []) => {
    const keys = Object.keys(obj);
    for(let i = 0, l = keys.length; i < l; i++){
      const key = keys[i];
      const val = obj[key];
      if (isPlainObj(val)) {
        return objToDotNotation(val, result, dotPathArr.concat(key));
      }
      result[dotPathArr.concat(key).join('.')] = val;
    }
    return result;
  };
  return objToDotNotation(obj);

}


export const dotToObj = (path, value) => {
  const obj = {};
  set(obj, path, value);
  return obj;
}
