const Notification = ({ newNotification }) => {
  if (newNotification === null) {
    return null
  }

  return (
    <div className={newNotification.notificationType}>
      {newNotification.message}
    </div>
  )
}

export default Notification