import React, {useState} from 'react'


const Blog = ({blog, likeBlog, removeBlog}) => {
  const [viewDetail, setViewDetail] = useState(false)

  const toggleView = () => {
    setViewDetail(!viewDetail)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle} className='blogShortInfo'>
      {blog.title} {blog.author}

      {
        viewDetail ? 
        <div> 
          <button onClick={toggleView}>hide</button>
          <br/>
          {blog.url}
          <br/>
          {blog.likes}
          <button onClick={() => likeBlog(blog)}>like</button>
          <br/>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
        :
        <button onClick={toggleView}>view</button> 
      }
      
    </div>  
  )

}

export default Blog