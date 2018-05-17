// add className
export function addClass (el, className) {
  /* console.log('addClass is running') */
  if (!hasClass(el, className)) {
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
}

// test className
export function hasClass (el, className) {
  let reg = new RegExp('(^|//s)' + className + '(//s|$)')
  return reg.test(el.className)
}

// getter or setter[ setAttribute / getAttribute ]
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}
