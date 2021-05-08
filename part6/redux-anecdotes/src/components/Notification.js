
import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if(props.message != ''){
    return (
      <div style={style}>
        {props.message}
      </div>
    )
  }
  else{
    return(<div></div>)
  }
  
}

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
}

export default connect(mapStateToProps)(Notification)