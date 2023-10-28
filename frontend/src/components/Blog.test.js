import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Part 5.13 blog list tests, test Blog component rendering', () => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'http://testblog.com',
    likes: 0
  }
  const user = ''
  const handleLikeButton = () => null
  const handleRemoveButton = () => null


  render(
    <Blog
      blog={blog}
      loggedUser={user}
      handleLikeButton={handleLikeButton}
      handleRemoveButton={handleRemoveButton}/>
  )
  const element = screen.getByText('test blog', { exact: false })


  expect(element).toBeDefined()
  expect(element).toHaveTextContent('test blog')
  expect(element).toHaveTextContent('test author')
  expect(element).not.toHaveTextContent('http://testblog.com')
  expect(element).not.toHaveTextContent(0)
})

test('Part 5.14 blog list tests, test button click to show blog likes and url', async () => {

  const blogUser = { name: 'testUser' , username: 'testUser' }
  const handleLikeButton = () => null
  const handleRemoveButton = () => null

  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'http://testblog.com',
    likes: 0,
    user: blogUser
  }

  const blogComponent = render(
    <Blog
      blog={blog}
      loggedUser={blogUser}
      handleLikeButton={handleLikeButton}
      handleRemoveButton={handleRemoveButton}/>
  )
  const user = userEvent.setup()
  const button = screen.getByText('view', { exact: false })
  await user.click(button)

  expect(blogComponent.container).toBeDefined()
  expect(blogComponent.container).toHaveTextContent('test blog')
  expect(blogComponent.container).toHaveTextContent('test author')
  expect(blogComponent.container).toHaveTextContent('http://testblog.com')
  expect(blogComponent.container).toHaveTextContent(0)
})

test('Part 5.15 blog list tests, test like button clicked twice', async () => {

  const blogUser = { name: 'testUser' , username: 'testUser' }
  const handleLikeButton = jest.fn()
  const handleRemoveButton = () => null

  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'http://testblog.com',
    likes: 0,
    user: blogUser
  }

  render(
    <Blog
      blog={blog}
      loggedUser={blogUser}
      handleLikeButton={handleLikeButton}
      handleRemoveButton={handleRemoveButton}/>
  )
  const user = userEvent.setup()
  const viewButton = screen.getByText('view', { exact: false })
  await user.click(viewButton)
  const likeButton = screen.getByText('like', { exact: true })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLikeButton.mock.calls).toHaveLength(2)

})
