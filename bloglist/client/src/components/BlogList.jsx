import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      {sorted.map((blog) => (
        <div
          key={blog.id}
          style={{ padding: 8, border: '1px solid black', marginBottom: 5 }}
        >
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
        </div>
      ))}
    </div>
  )
}

export default BlogList
