import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newNotification, setNewNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNewNotification({
        message: 'wrong username or password',
        notificationType: 'error'
      })

      setTimeout(() => {
        setNewNotification(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem(
      'loggedInUser', JSON.stringify(user)
    )
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    if(!blogObject.title || !blogObject.author || !blogObject.url){
      setNewNotification({
        message: 'Please set the title, author and url of the new blog entry',
        notificationType: 'error'
      })

      setTimeout(() => {
        setNewNotification(null)
      }, 3000)
    }

    blogService
      .create(blogObject)
      .then(blog => {
        blog.user = {}
        blog.user.name = user.name
        blog.user.username = user.username

        setBlogs(blogs.concat((blog)))

        setNewNotification({
          message: 'a new blog ' + blog.title + 'by ' + blog.author + ' added',
          notificationType: 'notification'
        })
        setTimeout(() => {
          setNewNotification(null)
        }, 3000)
      }).catch(error => {
        setNewNotification({
          message: error.message,
          notificationType: 'error'
        })

        setTimeout(() => {
          setNewNotification(null)
        }, 3000)
      })
  }

  const handleLikeButton = (blog) => {
    let blogToUpdate = { ...blog, likes: blog.likes + 1 }
    blogService.update(blog.id, blogToUpdate).then(() => {
      let updatedBlogList = blogs.map(blog => blog.id === blogToUpdate.id ? { ...blog, likes: blogToUpdate.likes } : blog)
      updatedBlogList.sort((a,b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
    })

  }

  const handleRemoveButton = (blog) => {
    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)){
      let blogToRemove = { ...blog }
      blogService.removeBlog(blog.id).then(() => {
        let updatedBlogList = blogs.filter(b => b.id !== blogToRemove.id)
        setBlogs(updatedBlogList)
      })
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
          username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  if (!user){
    return (
      <div>
        <h1>Blog Application</h1>
        <Notification newNotification={newNotification}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification newNotification={newNotification}/>
      <p>{user.name} logged in <button id='logoutButton' onClick={handleLogout}>logout</button></p>
      {
        blogs.map(blog =>
          <Blog className="blog" key={blog.id} blog={blog} handleLikeButton={handleLikeButton} handleRemoveButton={handleRemoveButton}
            loggedUser={user}/>
        )}

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

    </div>
  )


}

export default App