import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// The state of the store defined by the reducer above is an object with two properties: notes and filter. The value of the notes property is defined by the noteReducer, which does not have to deal with the other properties of the state. Likewise, the filter property is managed by the filterReducer.
const reducer = combineReducers({
    notes: noteReducer,
    filter: filterReducer
})

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

export default store