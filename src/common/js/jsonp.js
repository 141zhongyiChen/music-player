import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// encode URI
function param (data) {
  let url = ''
  for (let attr in data) {
    let value = data[attr] !== undefined ? data[attr] : ''
    url += `&${attr}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
