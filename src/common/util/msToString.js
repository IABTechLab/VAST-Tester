const msToString = ms =>
  ms < 1000 ? ms + ' ms' : ms === 1000 ? '1 second' : ms / 1000 + ' seconds'

export default msToString
