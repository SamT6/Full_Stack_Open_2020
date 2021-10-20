
const blogReducer = (state = [], action) => {
    switch(action.type){
        case 'NEW_BLOG':
            return state.concat(action.data) //OR using js array spread syntax [...state, action.data]
        case 'INIT_BLOGS':
          return action.data

        default:
            return state
    }
}

export const initializedBlogs = (blogs) => {
    return {
        type: 'INIT_BLOGS',
        data: blogs,
    }
}

export const addBlogAction = (blog) => {
    return {
        type: 'NEW-BLOG',
        data: blog
    }
}


export default blogReducer