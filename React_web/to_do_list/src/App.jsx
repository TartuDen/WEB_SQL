import React, { useState } from 'react';
import List from './List';


function App() {
  const [inputTask, updateInputTask]=useState("");

  function funcUpdateTask(event){
    updateInputTask(event.target.value);
  }

  const [todoList, updateToDoList]=useState({
    tasks: []
  })

  function clearList(event){
    event.preventDefault();
    updateToDoList({
      tasks: []
    })
  }

  function funcUpdateList(event){
    event.preventDefault();

    updateToDoList(prevValue=>({
      tasks: [...prevValue.tasks,inputTask]
    }));
    updateInputTask("");

  }

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <form id="todo-form" className="d-flex mb-4">
        <input type="text" id="todo-input" className="form-control mr-2" value={inputTask} onChange={funcUpdateTask} placeholder="Enter your task" />
          <button type="submit" className="btn btn-custom" onClick={funcUpdateList}>Submit</button>
          <button type="submit" className="btn btn-custom" onClick={clearList}>Clear</button>
      </form>
      <List
      tasksToAdd={todoList.tasks} />
    </div>
  )
}

export default App
