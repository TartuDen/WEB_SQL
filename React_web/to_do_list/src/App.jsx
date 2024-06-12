import React, { useState } from 'react';
import List from './List';


function App() {
  const [inputTask, updateInputTask]=useState("");

  function funcUpdateTask(event){
    updateInputTask(event.target.value);
  }

  const [todoList, updateToDoList]=useState([])

  function clearList(event){
    event.preventDefault();
    updateToDoList([])
  }

  function funcUpdateList(event){
    event.preventDefault();

    updateToDoList(prevValue=>([...prevValue,inputTask]));
    updateInputTask("");
  }

  function deleteItem(event){
    console.log("clicked\n",event.target.id);
    let id = event.target.id;
    updateToDoList(prevValue =>{
      const newList = [
        ...prevValue.slice(0, id),
        ...prevValue.slice(id + 1, -1)
      ];
      return newList;
    })
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
      onCheck = {deleteItem}
      tasksToAdd={todoList} />
    </div>
  )
}

export default App
