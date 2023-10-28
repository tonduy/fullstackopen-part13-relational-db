import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setNewTitle] = useState('')
  const [author, setNewAuthor] = useState('')
  const [url, setNewUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setNewTitle('')
    setNewUrl('')
    setNewAuthor('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
                    title:
          <input
            id='blogtitleInput'
            value={title}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
                    author:
          <input
            id='blogauthorInput'
            value={author}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
                    url:
          <input
            id='blogurlInput'
            value={url}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='write url here'
          />
        </div>

        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm