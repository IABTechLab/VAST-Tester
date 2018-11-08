// `react-scripts build` chokes on p-timeout, so here's our own version.
// Background: https://github.com/sindresorhus/ama/issues/446

const timeout = (promise, timeout, msg) => {
  let to = null
  const timingOut = new Promise((resolve, reject) => {
    to = setTimeout(reject, timeout, new Error(msg))
  })
  return Promise.race([promise, timingOut]).then(
    res => {
      clearTimeout(to)
      return res
    },
    error => {
      clearTimeout(to)
      throw error
    }
  )
}

export default timeout
