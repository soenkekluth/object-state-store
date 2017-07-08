import objectPath from 'object-path';
import isPlainObj from 'is-plain-obj';

const {ensureExists} = objectPath;

export const objToDot = (obj) => {
  if(!isPlainObj(obj) || typeof obj === 'string'){
    return obj;
  }

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

};


export const dotToObj = (path, value = 'DEFAULT') => {
  if(!isPlainObj(path)){
    return path;
  }
  const obj = {};
  ensureExists(obj, path, value);
  return obj;
};
