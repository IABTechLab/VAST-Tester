const replaceKey = (obj, from, to, seen = []) => {
  if (obj == null || typeof obj !== 'object') {
    return obj
  }
  if (seen.includes(obj)) {
    return obj
  }
  if (Array.isArray(obj)) {
    const clone = obj.map(el => replaceKey(el, from, to, seen))
    seen.push(clone)
    return clone
  }
  const clone = Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [key === from ? to : key]: replaceKey(obj[key], from, to, seen)
    }),
    {}
  )
  seen.push(clone)
  return clone
}

export default replaceKey
