const KEY = 'loggedBlogappUser'

export const getUser = () => {
  const saved = window.localStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : null
}

export const saveUser = (user) => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem(KEY)
}
