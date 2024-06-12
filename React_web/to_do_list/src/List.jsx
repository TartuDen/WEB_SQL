import React, { useState } from "react";

function List(props) {
  let taskList = props.todoList;
  
  
  
  function localOnCheck(event) {
    let id = event.target.id;
    props.changeCheckState((prevValue) => {
        const newState = [...prevValue];
      newState[id] = !newState[id];
      return newState;
    });
  }


  return (
    <ul id="todo-list" className="list-unstyled">
      {taskList &&
        taskList.map((task, idx) => (
          <li
            key={idx}
            id={idx}
            onClick={localOnCheck}
            style={{ textDecoration: props.checkState[idx] ? "line-through" : "none", cursor: 'pointer' }}
          >
            {idx + 1}) {task}
          </li>
        ))}
    </ul>
  );
}

export default List;
