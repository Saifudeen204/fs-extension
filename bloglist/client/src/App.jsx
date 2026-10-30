import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import { getUser, saveUser, removeUser } from './services/persistentUser'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(() => {
    const saved = getUser()
    if (saved) {
      blogService.setToken(saved.token)
    }
    return saved
  })

  useEffect(() => {
    blogService
      .getAll()
      .then((data) => setBlogs(data))
      .catch(() => setBlogs([]))
      .finally(() => setLoaded(true))
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedIn = await loginService.login(credentials)
      saveUser(loggedIn)
      blogService.setToken(loggedIn.token)
      setUser(loggedIn)
      navigate('/')
    } catch (error) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    removeUser()
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleCreate = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      setBlogs(blogs.concat(created))
      notify(`a new blog ${created.title} by ${created.author} added`)
      navigate('/')
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const updated = await blogService.update(blog.id, {
        likes: blog.likes + 1,
      })
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
      navigate('/')
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  const handleComment = async (blog, comment) => {
    try {
      const updated = await blogService.addComment(blog.id, comment)
      setBlogs(blogs.map((b) => (b.id === blog.id ? updated : b)))
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  return (
    <div>
      <nav
        style={{
          background: '#1976d2',
          color: 'white',
          padding: 10,
          marginBottom: 10,
        }}
      >
        <strong>Blog App</strong>{' '}
        <Link to="/" style={{ color: 'white', marginLeft: 10 }}>
          blogs
        </Link>{' '}
        <Link to="/users" style={{ color: 'white', marginLeft: 10 }}>
          users
        </Link>{' '}
        {user ? (
          <>
            <Link to="/create" style={{ color: 'white', marginLeft: 10 }}>
              new blog
            </Link>{' '}
            <span style={{ marginLeft: 10 }}>{user.name} logged in</span>{' '}
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', marginLeft: 10 }}>
            login
          </Link>
        )}
      </nav>

      <Notification notification={notification} />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                loaded={loaded}
                user={user}
                onLike={handleLike}
                onRemove={handleRemove}
                onComment={handleComment}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/create"
            element={
              user ? (
                <BlogForm onCreate={handleCreate} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
