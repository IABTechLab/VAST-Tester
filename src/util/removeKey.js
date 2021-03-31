const removeKey = (obj, key) => {
  if (obj == null) {
    return
  }
  if (Array.isArray(obj)) {
    for (const entry of obj) {
      removeKey(entry, key)
    }
    return
  }
  if (typeof obj === 'object') {
    delete obj[key]
    for (const value of Object.values(obj)) {
      removeKey(value, key)
    }
  }
}

export default removeKey
