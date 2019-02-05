import startsWith from './startsWith'

const isDataURI = uri => startsWith(uri, 'data:')

export default isDataURI
