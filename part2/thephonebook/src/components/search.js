import React from 'react'

const Search = (props) => {
    return(
        <div>
            filter shown with <input value={props.value} onChange={props.onChange}/>
        </div>
    )
}


export default Search