import React, {useState} from 'react'

const BlogForm = ({addBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    
    const handleSubmit = (event) => {
        event.preventDefault()
        const blogObj = {
            title: title,
            author: author,
            url: url,
        }

        addBlog(blogObj)
        setTitle("")
        setAuthor("")
        setUrl("")
    }

    return (
        <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            id='title'
            type='text'
            value={title}
            name="Title"
            onChange={({target}) => setTitle(target.value)} //The event handlers are simple: An object is given to them as a parameter, and they destructure the field target from the object and save its value to the state.
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type="text"
            value={author}
            name="Author"
            onChange={({target}) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type="text"
            value={url}
            name="Url"
            onChange={({target}) => setUrl(target.value)}
          />
        </div>
        <button id="blog-form-button" type="submit">create</button>
      </form>
    )
}

export default BlogForm
