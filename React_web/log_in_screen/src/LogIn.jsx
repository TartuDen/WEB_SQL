import React, { useState } from "react";
import UserInput from "./UserInput";

function LogIn() {
  const [logMessage, cheangLogMessage]=useState("Login");
  function changeMessae(){
    if (logMessage === "Login"){
      cheangLogMessage("Logged!");
    }else{
      cheangLogMessage("Login")
    }
  }
  const [butColour, changeButColour]=useState("lightblue")
  function changeButColourIn(){
    changeButColour("blue")
  }
  function changeButColourOut(){
    changeButColour("lightblue")
  }


  return (
    <div className="col-md-6 text-center">
      <div className="card mt-5">
        <div className="card-body">
          <h3 className="card-title text-center">{logMessage}</h3>
          {/* <form> */}
            <div className="form-group">
            <UserInput
                label="username"
                type="text"
                placeholder="Enter User Name" />
            </div>
            <div className="form-group">
                <UserInput
                label="password"
                type="password"
                placeholder="Enter Password" />
            </div>
            <button type="submit" style={{backgroundColor: butColour}} className="btn btn-primary btn-block" onClick={changeMessae} onMouseEnter={changeButColourIn} onMouseLeave={changeButColourOut}>
              Login
            </button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}

export default LogIn;
