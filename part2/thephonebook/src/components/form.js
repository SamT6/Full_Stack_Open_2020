import React from 'react'

const Form = (props) => {
    return(
        <form onSubmit={props.onSubmit}>
                <div>
                    name: <input value={props.name_value} onChange={props.name_onChange}/>
                </div>
                <div>
                    number: <input value={props.number_value} onChange={props.number_onChange}/>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
        </form>
    )
}


export default Form