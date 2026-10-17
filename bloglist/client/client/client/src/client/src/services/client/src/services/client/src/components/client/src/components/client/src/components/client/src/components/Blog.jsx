import { useState } from 'react'

const Blog = ({ blog, user, onLike, onRemove }) => {
  const [visible, setVisible] = useState(false)

  const style = {
    padding: 8,
    border: '1px solid black',
    marginBottom: 5,
  }

  const isOwner = user && blog.user && blog.user.username === user.username

  return (
    <div className="blog" style={style}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {isOwner && <button onClick={() => onRemove(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
