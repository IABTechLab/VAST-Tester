const loadScript = async (url, crossOrigin, doc) =>
  new Promise((resolve, reject) => {
    const script = doc.createElement('script')
    doc.getElementsByTagName('head')[0].appendChild(script)
    script.addEventListener('load', () => {
      resolve(script)
    })
    script.addEventListener('error', () =>
      reject(new Error(`Failed to load script: ${url}`))
    )
    script.crossOrigin = crossOrigin
    script.src = url
  })

export default loadScript
