import React from "react";
import LogIn from "./LogIn";
import MainPage from "./MainPage";

var isLoggedIn = false;

function conditinRender(){ //same as this: {isLoggedIn ? <MainPage/> : <LogIn />}
  if(isLoggedIn){
    return (
      <MainPage />
    )
  }else{
    return(
      <LogIn />
    )
  }
}

function App(){
  return(
  <div class="container">
    <div class="row justify-content-center">
      {isLoggedIn ? <MainPage/> : <LogIn />}
    </div>
  </div>
  )
}



export default App;