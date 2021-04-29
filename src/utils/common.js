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
