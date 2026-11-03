import { useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import {
  useBlogStore,
  useUserStore,
} from './store'
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

  const blogs = useBlogStore((state) => state.blogs)
  const loaded = useBlogStore((state) => state.loaded)
  const fetchBlogs = useBlogStore((state) => state.fetchBlogs)
  const createBlog = useBlogStore((state) => state.createBlog)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const removeBlog = useBlogStore((state) => state.removeBlog)
  const commentBlog = useBlogStore((state) => state.commentBlog)

  const user = useUserStore((state) => state.user)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleLogin = async (credentials) => {
    const ok = await login(credentials)
    if (ok) {
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCreate = async (newBlog) => {
    const ok = await createBlog(newBlog)
    if (ok) {
      navigate('/')
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    const ok = await removeBlog(blog)
    if (ok) {
      navigate('/')
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

      <Notification />

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
                onLike={likeBlog}
                onRemove={handleRemove}
                onComment={commentBlog}
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
