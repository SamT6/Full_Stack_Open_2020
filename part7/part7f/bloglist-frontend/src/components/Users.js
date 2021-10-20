import React, {useState, useEffect} from 'react'
import axios from 'axios'

const User = ({id}) => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    blogIDs: []
  })
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const request = axios.get(`http://localhost:3003/api/users/${id}`)
    request.then(response => {
      setUser({
        ...user,
        name: response.data.name,
        username: response.data.username,
        blogIDs: response.data.blogs
      })
    })
  }, [])

  const requestBlogsDetails = () => {
    console.log("ids,", user.blogIDs);
    for(let i = 0; i < user.blogIDs.length; i++){
      const request = axios.get(`http://localhost:3003/api/blogs/${user.blogIDs[i]}`)
      request.then(response => {
        console.log("blog", response.data);
        setBlogs([...blogs, response.data])
      })
      .catch(error => console.log(error))
    }
  }

  return (
    <div>
      <button onClick={() => requestBlogsDetails()}>get blog titles</button>
     <h2>{user.name} ({user.username})</h2>
     <ul>
         {blogs.map(blog => 
            <li key={blog.id}>
                {blog.title}
            </li>
         )}
     </ul>
    </div>  
  )
}


const Users = () => {
  const [users, setUsers] = useState([])

  
  useEffect(() => {
    const request = axios.get('http://localhost:3003/api/users')
    request.then(response => setUsers(response.data))
    console.log();
  }, [])

  return (
    <div >
     <h2>Users</h2>
     <ul>
         {users.map(user => 
            <li key={user.id}>
                <User id={user.id} />
                <a href={"http://localhost:3003/api/users/"+user.id}>
                {user.name} ({user.username})- {user.blogs.length}
                </a>
            </li>
         )}
     </ul>
    </div>  
  )

}

export default Users