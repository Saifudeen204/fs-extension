const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: token } : {}),
})

const handle = async (response) => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'request failed')
  }
  return response.status === 204 ? null : response.json()
}

const getAll = async () => handle(await fetch(baseUrl))

const create = async (newBlog) =>
  handle(
    await fetch(baseUrl, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(newBlog),
    })
  )

const update = async (id, changes) =>
  handle(
    await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(changes),
    })
  )

const remove = async (id) =>
  handle(
    await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  )

export default { getAll, create, update, remove, setToken }
