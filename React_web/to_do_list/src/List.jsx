import React, { useState } from 'react';

function List(props){
    let taskList = props.tasksToAdd;

    const [checkTask, setChangeTask]=useState(false);
    function checkTaskFunc(event){
        console.log(event.target.value)
    }

    return(
        <ul id="todo-list" className="list-unstyled">
            {taskList && taskList.map((task,idx)=><li key={idx} onClick={checkTaskFunc} >{idx+1}) {task}</li>)}
      </ul>
    )
}

export default List;