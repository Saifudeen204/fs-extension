import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users'
import NotFound from './NotFound'

const User = () => {
  const { id } = useParams()
  const [users, setUsers] = useState(null)

  useEffect(() => {
    userService
      .getAll()
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
  }, [])

  if (users === null) {
    return <p>loading...</p>
  }

  const person = users.find((u) => u.id === id)

  if (!person) {
    return <NotFound />
  }

  return (
    <div>
      <h2>{person.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {person.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
