const messageReducer = (state='', action) => {
    switch(action.type){
        case 'SET_MESSAGE':
            return action.message
        default:
            return state
    }
}

var timeoutID, messageToDisplay

export const messageChange = (message, seconds) => {
    return async dispatch => {
        dispatch({
            type: 'SET_MESSAGE',
            message: message
        })

        if(messageToDisplay != message){
            clearTimeout(timeoutID)
        }
        
        messageToDisplay = message
        timeoutID = setTimeout(() => {
            dispatch({
                type: 'SET_MESSAGE',
                message: ''
            })
        }, Number(seconds)*1000)
    }
}

export default messageReducer