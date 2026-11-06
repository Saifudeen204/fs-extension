import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'
import { getUser, saveUser, removeUser } from './services/persistentUser'

let timer = null

export const useNotificationStore = create((set) => ({
  notification: null,
  notify: (message, type = 'success') => {
    clearTimeout(timer)
    set({ notification: { message, type } })
    timer = setTimeout(() => set({ notification: null }), 5000)
  },
}))

const notify = (message, type) =>
  useNotificationStore.getState().notify(message, type)

const initialUser = getUser()
if (initialUser) {
  blogService.setToken(initialUser.token)
}

export const useUserStore = create((set) => ({
  user: initialUser,
  login: async (credentials) => {
    try {
      const loggedIn = await loginService.login(credentials)
      saveUser(loggedIn)
      blogService.setToken(loggedIn.token)
      set({ user: loggedIn })
      return true
    } catch (error) {
      notify('wrong username or password', 'error')
      return false
    }
  },
  logout: () => {
    removeUser()
    blogService.setToken(null)
    set({ user: null })
  },
}))

export const useBlogStore = create((set, get) => ({
  blogs: [],
  loaded: false,
  fetchBlogs: async () => {
    try {
      const blogs = await blogService.getAll()
      set({ blogs })
    } catch (error) {
      set({ blogs: [] })
    } finally {
      set({ loaded: true })
    }
  },
  createBlog: async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      set({ blogs: get().blogs.concat(created) })
      notify(`a new blog ${created.title} by ${created.author} added`)
      return true
    } catch (error) {
      notify(error.message, 'error')
      return false
    }
  },
  likeBlog: async (blog) => {
    try {
      const updated = await blogService.update(blog.id, {
        likes: blog.likes + 1,
      })
      set({ blogs: get().blogs.map((b) => (b.id === blog.id ? updated : b)) })
    } catch (error) {
      notify(error.message, 'error')
    }
  },
  removeBlog: async (blog) => {
    try {
      await blogService.remove(blog.id)
      set({ blogs: get().blogs.filter((b) => b.id !== blog.id) })
      return true
    } catch (error) {
      notify(error.message, 'error')
      return false
    }
  },
  commentBlog: async (blog, comment) => {
    try {
      const updated = await blogService.addComment(blog.id, comment)
      set({ blogs: get().blogs.map((b) => (b.id === blog.id ? updated : b)) })
    } catch (error) {
      notify(error.message, 'error')
    }
  },
}))
