import { useNotificationStore } from '../store'

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification)

  if (!notification) {
    return null
  }

  const color = notification.type === 'error' ? 'red' : 'green'

  const style = {
    color,
    background: '#eee',
    fontSize: 18,
    border: `2px solid ${color}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className="notification" style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
