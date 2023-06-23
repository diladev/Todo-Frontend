import React, { useState, useEffect } from "react";
import axios from "axios";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the backend API
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  // Add a new todo
  const addTodo = async (task) => {
    try {
      const newTodo = {
        task: task,
        completed: false,
        isEditing: false
      };

      const response = await axios.post("http://localhost:3001/todos", newTodo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await console.log(id)
      await axios.delete(`http://localhost:3001/todos/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ id: id }),
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };
  
  

  // Toggle the completion status of a todo
  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      await axios.put(`http://localhost:3001/todos/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // Edit a todo
  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // Save edited task
  const saveEditedTask = async (task, id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const updatedTodo = { ...todoToUpdate, task, isEditing: !todoToUpdate.isEditing };
      await axios.put(`http://localhost:3001/todos/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Todo application</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={saveEditedTask} task={todo} key={todo._id} />
        ) : (
          <Todo
        task={todo}
        deleteTodo={() => deleteTodo(todo._id)}
        editTodo={() => editTodo(todo._id)}
        toggleComplete={() => toggleComplete(todo._id)}
          />
        )
      )}
    </div>
  );
};
