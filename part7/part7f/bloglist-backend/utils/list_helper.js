const blogsRouter = require("../controllers/blogs_router")

const dummy = (blogs) => {
    return 1
}

//returns the total sum of likes in all of the blog posts
const totalLikes = (blogs) => {
    let total = 0
    blogs.forEach(blog => {
        total += blog.likes
    });

    return total
}

const favoriteBlog = (blogs) => {
    let max = 0
    let max_index = 0
    blogs.forEach((blog, index) =>{
        if(blog.likes > max){
            max = blog.likes
            max_index = index
        }
    })

    return {
        title: blogs[max_index].title,
        author: blogs[max_index].author,
        likes: blogs[max_index].likes
    }
}

//part4a - exercise 4.6*
const mostBlogs = (blogs) => {

}

//part4a - exercise 4.7* 
const mostLikes = (blogs) => {

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}