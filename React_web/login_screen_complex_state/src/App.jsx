import React, { useState } from 'react'

import './css/App.css'

function App() {

  const [fullName, updateFullName]=useState({
    fName: "",
    lName: ""
  })



  function addFullName(event){
    const {name,value}=event.target;
    updateFullName(pValue=>{
      console.log("......pValue......\n",pValue)
      if(name==="fName"){
        return {
          fName: value,
          lName: pValue.lName
        }
      }else if (name==="lName"){
        return {
          fName: pValue.fName,
          lName: value
        }
      }
    })
  }


  return(
    <div className="login-container">
    <div className="login-card">
      <h2 className="text-center">Login {fullName.fName} {fullName.lName}</h2>
      <form>
        <div className="form-group">
          <label for="name">Name</label>
          <input type="text" className="form-control" id="name" name='fName' onChange={addFullName} value={fullName.fName} placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label for="surname">Surname</label>
          <input type="text" className="form-control" id="surname" name='lName' onChange={addFullName} value={fullName.lName} placeholder="Enter your surname" />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Submit</button>
      </form>
    </div>
  </div>
  )
}

export default App
