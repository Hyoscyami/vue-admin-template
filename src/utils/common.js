/**
 * 是否为空集合
 * @param collection
 * @returns {boolean} true：是，false：否
 */
export function isEmptyCollection(collection) {
  return collection === undefined || collection.length === 0
}

/**
 * 是否不为空集合
 * @param collection
 * @returns {boolean} true：是，false：否
 */
export function isNotEmptyCollection(collection) {
  return !isEmptyCollection(collection)
}

/**
 * 字符串是否为空
 * @param str
 * @returns {boolean}
 */
export function isBlank(str) {
  return str === undefined || str.length === 0
}
