import { useParams } from 'react-router-dom'
import NotFound from './NotFound'

const BlogView = ({ blogs, loaded, onLike }) => {
  const { id } = useParams()

  if (!loaded) {
    return <p>loading...</p>
  }

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <NotFound />
  }

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
      <div>added by {blog.user && blog.user.name}</div>
    </div>
  )
}

export default BlogView
