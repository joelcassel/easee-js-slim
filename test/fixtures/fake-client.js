export function fakeClient({ get, post } = {}) {
  const calls = { get: [], post: [] }
  return {
    calls,
    defaults: { headers: { common: {} } },
    async get(url) {
      calls.get.push(url)
      return get ? get(url) : { data: {} }
    },
    async post(url, body) {
      calls.post.push({ url, body })
      return post ? post(url, body) : { status: 200, statusText: 'OK', data: {} }
    },
  }
}

export function httpError(status, statusText, data = {}) {
  const error = new Error(`${status} ${statusText}`)
  error.response = { status, statusText, data }
  error.config = { url: '/x', data: undefined }
  return error
}

export function networkError(message = 'ECONNREFUSED') {
  const error = new Error(message)
  error.config = { url: '/x', data: undefined }
  return error
}
