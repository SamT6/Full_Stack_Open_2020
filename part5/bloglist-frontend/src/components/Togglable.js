import React, {useState, useImperativeHandle} from 'react'
import PropTypes from 'prop-types'


const Togglable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = {display: visible ? 'none' : ''}
    const showWhenVisible = {display: visible ? '' : 'none'}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    //the useImperativeHandle function is a React hook, that is used for defining functions in a component which can be invoked from outside of the component
    useImperativeHandle(ref, ()=>{ // make its toggleVisibility function available outside of the component
        return{
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button id="new-blog-button" onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button  onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
})

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglable