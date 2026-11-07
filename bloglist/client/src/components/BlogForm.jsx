import { useState } from 'react'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <label>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
          url
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
