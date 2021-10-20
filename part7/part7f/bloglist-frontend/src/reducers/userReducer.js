
const userReducer = (state = null, action) => {
    switch(action.type){
        case 'SET_USER':
            return action.user
        
        default:
            return state
    }
}

export const userChange = user => {
    return {
        type: 'SET_USER',
        user: user,
    }
}


export default userReducer