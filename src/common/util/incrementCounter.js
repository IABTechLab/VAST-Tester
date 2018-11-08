const incrementCounter = (counts, key) => ({
  ...counts,
  [key]: (counts[key] || 0) + 1
})

export default incrementCounter
