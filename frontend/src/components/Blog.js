import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikeButton, handleRemoveButton, loggedUser, className }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetailedBlog, setShowDetailedBlog] = useState(false)

  const addLike = (event) => {
    event.preventDefault()
    handleLikeButton(blog)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    handleRemoveButton(blog)
  }


  if (!showDetailedBlog){
    return (
      <div className={className} style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button id='viewBlogButton' onClick={() => setShowDetailedBlog(true)}>view</button>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={() => setShowDetailedBlog(false)}>hide</button>
        <div>
          {blog.url}
        </div>
        <div>
            likes {blog.likes} <button id='likeBlogButton' onClick={addLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {loggedUser.username === blog.user.username &&
              <button id='deleteBlogButton' onClick={removeBlog}>remove</button>}
        </div>
      </div>
    </div>
  )


}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikeButton: PropTypes.func.isRequired,
  handleRemoveButton: PropTypes.func.isRequired
}

export default Blog