import React from "react";

function UserInput(props){
    return(
        <div>
            <label for={props.label}>{props.label}</label>
              <input
                type={props.type}
                class="form-control"
                id={props.label}
                placeholder={props.placeholder}
              />
        </div>
    )
}


export default UserInput;