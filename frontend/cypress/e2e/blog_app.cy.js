describe('Blog app', function() {

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'John Doe',
      username: 'testUser',
      password: 'test1'
    }

    const user1 = {
      name: 'Max Doe',
      username: 'testUser1',
      password: 'test1'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.visit('http://localhost:3000')
  })

  describe('Part 5.17', function () {
    it('Login form is shown', function () {
      cy.visit('http://localhost:3000')
      cy.contains('Blog Application')
      cy.contains('username')
      cy.contains('password')
    })

  })

  describe('Part 5.18', function () {

    it('succeeds with correct credentials', function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('John Doe logged in')
    })

    it('fails with wrong credentials', function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username')
    })
  })

  describe('Part 5.19', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#blogtitleInput').type('New test blog')
      cy.get('#blogauthorInput').type('Test Author')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()
      cy.contains('New test blog')
      cy.contains('Test Author')
    })
  })

  describe('Part 5.20', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('new blog').click()
      cy.get('#blogtitleInput').type('New test blog')
      cy.get('#blogauthorInput').type('Test Author')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()
    })

    it('A blog can be liked', function () {
      cy.get('#viewBlogButton').click()
      cy.get('#likeBlogButton').click()
      cy.get('#likeBlogButton').click()
      cy.contains('2')

    })
  })

  describe('Part 5.21', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('create new blog').click()
      cy.get('#blogtitleInput').type('New test blog')
      cy.get('#blogauthorInput').type('Test Author')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()
    })

    it('A blog can be deleted by same user', function () {
      cy.get('#viewBlogButton').click()
      cy.get('#deleteBlogButton').click()
      cy.get('html').should('not.contain', 'New test blog')
      cy.get('html').should('not.contain', 'Test Author')

    })
  })

  describe('Part 5.22', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('new blog').click()
      cy.get('#blogtitleInput').type('New test blog')
      cy.get('#blogauthorInput').type('Test Author')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()

      cy.contains('logout').click()
      cy.contains('login').click()
      cy.get('#username').type('testUser1')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()
    })

    it('A blog cannot be deleted by other users', function () {
      cy.get('#viewBlogButton').click()
      cy.get('html').should('not.contain', '#deleteBlogButton')

    })
  })

  describe('Part 5.23', function () {
    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('login').click()
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1')
      cy.get('#login-button').click()

      cy.contains('create new blog').click()
      cy.get('#blogtitleInput').type('New test blog')
      cy.get('#blogauthorInput').type('Test Author')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()

      cy.contains('create new blog').click()
      cy.get('#blogtitleInput').type('New test blog1')
      cy.get('#blogauthorInput').type('Test Author1')
      cy.get('#blogurlInput').type('http://test.com')
      cy.contains('save').click()

      cy.get('#viewBlogButton').click()
      cy.get('#viewBlogButton').click()
      cy.contains('New test blog1')
        .contains('like')
        .click()
    })

    it('A blog can be liked', function () {
      cy.get('.blog').eq(0).should('contain', 'New test blog1')
      cy.get('.blog').eq(1).should('contain', 'New test blog')
    })
  })
})



