import { ChangeEvent, FormEvent, InvalidEvent, useEffect, useState } from 'react';
import uuid from 'react-uuid';

import styles from './App.module.css'
import { Header } from './components/Header'

import plusIcon from './assets/plus.svg';
import clipboardIcon from './assets/Clipboard.svg';

import './global.css'

import { TodoList } from './components/TodoList';

const LOCAL_STORAGE_KEY = "todo:savedTodoList"

export interface Todo {
  id: string;
  text: string;
  isChecked: boolean;
}

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const [todoText, setTodoText] = useState('');

  const completedTodoCount = todoList.filter(todo => todo.isChecked).length;

  function loadSavedTodoList() {
    const loaded = localStorage.getItem(LOCAL_STORAGE_KEY);

    if(loaded) {
      setTodoList(JSON.parse(loaded))
    }
  }

  useEffect(() => {
    loadSavedTodoList();
  },[])

  function setTodoAndSave(newTodoList: Todo[]) {
    setTodoList(newTodoList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTodoList))
  }

  function onEmpty() {
    return (
      <div className={styles.emptyTodo}>
        <img src={clipboardIcon} alt="Icone Clipboard" />
        <span>Você ainda não tem tarefas cadastradas</span>
        <p>Crie tarefas e organize seus itens a fazer</p>
      </div>
    )
  }

  function onFilled() {

    return (
      todoList.map(list => {
        return (
          <TodoList
          key={list.id}
          content={list} 
          onCheck={handleCheckClick}
          onDelete={handleDeleteTodo}
        />
        )
      })
    )
  }

  function handleCreateNewTodo(event: FormEvent) {
    event.preventDefault()

    const newTodo = {
      id: uuid(),
      text: todoText,
      isChecked: false
    }

    setTodoAndSave([...todoList, newTodo]);
    setTodoText('');
  }

  function handleNewTodoInvalid(event: InvalidEvent<HTMLInputElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório');
  }

  function handleNewTodoChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('');
    setTodoText(event.target.value);
  }
  
  function handleCheckClick(todoId: string) {
    const updatedTodo = todoList.map(todo => {
      if(todo.id === todoId) {
        return {
          ...todo,
          isChecked: !todo.isChecked,
        }
      }
      return todo;
    })

    console.log(updatedTodo)

    setTodoAndSave(updatedTodo);
  }

  function handleDeleteTodo (todoId: string) {
    const todosWithoutDeletedOne = todoList.filter(todo => {
      return todo.id !== todoId;
    })
    setTodoAndSave(todosWithoutDeletedOne);
  }
  

  return (
    <> 
      <Header />
      <div className={styles.wrapper}>
        <form onSubmit={handleCreateNewTodo} className={styles.newTodoForm}>
          <input
            type='text' 
            name='todo' 
            placeholder='Adicione uma nova tarefa'
            value={todoText}
            onChange={handleNewTodoChange}
            onInvalid={handleNewTodoInvalid}
            required
          />
          <button className={styles.buttonWithIcon} type="submit">
            <p>Criar</p>
            <img src={plusIcon} alt="Ícone plus" />
          </button>
        </form>
        <main>
          <header className={styles.todoCount}>
            <div className={styles.created}>Tarefas criadas <span>{todoList.length}</span></div>
            <div className={styles.finished}>Concluídas <span>{todoList.length ? `${completedTodoCount} de ${todoList.length}` : todoList.length}</span></div>
          </header>
          
          <div>
            {todoList.length 
            ? onFilled()
            : onEmpty()
          }
          </div>
        </main>
      </div>
    </>
  )
}

export default App
