import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then((data) => setBlogs(data))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('loggedBlogappUser')
    if (saved) {
      const parsed = JSON.parse(saved)
      setUser(parsed)
      blogService.setToken(parsed.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedIn = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedIn))
      blogService.setToken(loggedIn.token)
      setUser(loggedIn)
    } catch (error) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      setBlogs(blogs.concat(created))
      setFormVisible(false)
      notify(`a new blog ${created.title} by ${created.author} added`)
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const updated = await blogService.update(blog.id, { likes: blog.likes + 1 })
      setBlogs(blogs.map((b) => (b.id === blog.id ? updated : b)))
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h1>Blog App</h1>
      <Notification notification={notification} />

      {user === null ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          {formVisible ? (
            <div>
              <BlogForm onCreate={handleCreate} />
              <button onClick={() => setFormVisible(false)}>cancel</button>
            </div>
          ) : (
            <button onClick={() => setFormVisible(true)}>create new blog</button>
          )}

          <h2>blogs</h2>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onLike={handleLike}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
