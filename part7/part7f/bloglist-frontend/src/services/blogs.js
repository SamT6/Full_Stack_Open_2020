import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token},
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (blogObject) => {
  const newBlogObj = {
    ...blogObject,
    likes: blogObject.likes + 1,
  }
  const response = await axios.put(baseUrl+'/'+blogObject.id, newBlogObj)
  return response.data
}

const remove = async (blogObject) => {
  const config = {
    headers: { Authorization: token},
  }

  const response = await axios.delete(baseUrl+'/'+blogObject.id, config)
  return response.data

}   

export default { getAll, setToken, create, like, remove }