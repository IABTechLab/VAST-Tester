// `react-scripts build` chokes on p-defer, so we've replicated it here.
// Credit: https://github.com/sindresorhus/p-defer
// Background: https://github.com/sindresorhus/ama/issues/446

const defer = () => {
  const ret = {}
  ret.promise = new Promise((resolve, reject) => {
    ret.resolve = resolve
    ret.reject = reject
  })
  return ret
}

export default defer
