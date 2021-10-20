import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

import {
    BrowserRouter as Router,
} from "react-router-dom"

const reducer = combineReducers({
    blogs: blogReducer,
    user: userReducer
})

const store = createStore(reducer)

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>,
    document.getElementById('root')
)