const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog_model')

const api = supertest(app)

const blogs = [ 
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, 
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, 
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, 
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, 
    { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, 
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjs = blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
             .expect(200)
             .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(blogs.length)
})

test('unique identifiers are named id', async () => {
    const response = await api.get('/api/blogs')
    //console.log(response.body);
    expect(response.body[0]['id']).toBeDefined()
})

test('can add a blog', async () => {
    const newBlog = { 
        title: "Testing adding a new blog", 
        author: "S.T.", 
        url: "nothing here", 
        likes: 100
    }

    await api.post('/api/blogs')
             .send(newBlog)
             .expect(201)
             .expect('Content-Type', /application\/json/)

    const blogs_in_db = await api.get('/api/blogs')
    expect(blogs_in_db.body).toHaveLength(blogs.length + 1)

    //check the title was in the blogs stored on db
    const titles = blogs_in_db.body.map(b => b.title)
    expect(titles).toContain('Testing adding a new blog')

})

test('if missing "likes" property, default to value 0', async () => {
    const newBlog = { 
        title: "Testing adding a new blog without likes", 
        author: "S.T.", 
        url: "empty",
    }

    await api.post('/api/blogs')
             .send(newBlog)
             .expect(201)
             .expect('Content-Type', /application\/json/)


    const blogs_in_db = await api.get('/api/blogs')
    const newBlog_likes = blogs_in_db.body.filter(blog => blog["title"] === "Testing adding a new blog without likes")
    expect(newBlog_likes[0]['likes']).toBe(0)
})

test('if "title" and "url" are missing, get status code 400 Bad Request', async () => {
    const newBlog = { 
        author: "S.T.",
        likes: 100 
    }

    await api.post('/api/blogs')
             .send(newBlog)
             .expect(400)
})



afterAll(() => {
    mongoose.connection.close()
})