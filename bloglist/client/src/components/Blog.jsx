import { useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'

const Blog = ({ blogs, loaded, user, onLike, onRemove, onComment }) => {
  const { id } = useParams()
  const [comment, setComment] = useState('')

  if (!loaded) {
    return <p>loading...</p>
  }

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <NotFound />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!comment.trim()) {
      return
    }
    await onComment(blog, comment)
    setComment('')
  }

  // blog.user is read without a null check on purpose:
  // the error boundary test relies on this page crashing for a blog without a user
  const addedBy = blog.user.name
  const isOwner = user && blog.user.username === user.username

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes <button onClick={() => onLike(blog)}>like</button>
      </div>
      <div>added by {addedBy}</div>
      {isOwner && <button onClick={() => onRemove(blog)}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
