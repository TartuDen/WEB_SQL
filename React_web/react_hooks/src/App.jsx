import React, { useState } from "react";

function App() {
  // let time="0";
  const [time, setTime] = React.useState(getCurrentTime);

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let curTime= `${hours}:${minutes}:${seconds}`;
    return curTime;
  }

  function changeTime(){
    setTime(getCurrentTime())
  }

  setInterval(changeTime,1000)

  return (
    <div className="container centered">
    <h1 className="text-center">{time}</h1>
    <p>_____</p>
    {/* <button style={{marginBottom: "10px"}} type="button" className="btn btn-primary" onClick={changeTime}>check time</button> */}

  </div>

  );
}

export default App;
