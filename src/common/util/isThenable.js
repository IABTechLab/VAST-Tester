const isThenable = o => o != null && typeof o.then === 'function'

export default isThenable
