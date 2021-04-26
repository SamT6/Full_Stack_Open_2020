import axios from 'axios'
//const baseUrl = 'http://localhost:3001/notes' //for local json file
const baseUrl = 'http://localhost:3001/api/notes' //for local server backend

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

//the 'then' method of a promise also returns a promise

// const getAll = () => {
//     const request = axios.get(baseUrl)
//     return request.then(response => response.data)
// }

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
      id: 10000,
      content: 'This note is not saved to server',
      date: '2019-05-30T17:30:31.098Z',
      important: true,
    }
    return request.then(response => response.data.concat(nonExisting))
}

/*
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    return response.data
  })
}
*/

const create = async newObject => {
    const config = {
      headers: { Authorization: token},
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data

    // before login 
    // const request = axios.post(baseUrl, newObject)
    // return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

// returns an object that has three functions
export default {
    getAll: getAll,
    create: create,
    update: update,
    setToken: setToken
}

/*
since the names of the keys and the assigned variables are the same,
export can be simplified to  
export default { getAll, create, update }
*/