import React from "react";

function UserInput(props){
  function enterChanged(event){
    console.log("......event........\n",event.target.value);
    console.log(event.target.placeholder);
    console.log(event.target.type);
  }
    return(
        <div>

              <input onChange={enterChanged}
                type={props.type}
                className="form-control"
                id={props.label}
                placeholder={props.placeholder}
              />
        </div>
    )
}


export default UserInput;