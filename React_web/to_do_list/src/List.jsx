import React from 'react';

function List(props){
    let taskList = props.tasksToAdd;

    return(
        <ul id="todo-list" className="list-unstyled">
            {taskList && taskList.map((task,idx)=><li key={idx} >{idx+1}) {task}</li>)}
      </ul>
    )
}

export default List;