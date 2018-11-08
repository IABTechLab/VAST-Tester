export const children = (element, name) =>
  Array.from(element.childNodes).filter(child => child.nodeName === name)

export const child = (element, name) => children(element, name)[0]

export const descendant = (element, names) => names.reduce(child, element)

export const descendants = (element, names) => {
  names = names.slice()
  const last = names.pop()
  const parent = descendant(element, names)
  return children(parent, last)
}

export const text = node => node.textContent.trim()
