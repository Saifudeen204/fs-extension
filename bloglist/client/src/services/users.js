const getAll = async () => {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Error('failed to fetch users')
  }
  return response.json()
}

export default { getAll }
