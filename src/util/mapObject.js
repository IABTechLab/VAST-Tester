const mapObject = (keys, value) => {
  const obj = {}
  for (const key of keys) {
    obj[key] = typeof value === 'function' ? value(key) : value
  }
  return obj
}

export default mapObject
