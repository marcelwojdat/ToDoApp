import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedCategory, selectCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isDone, setTaskState] = useState(false)
  const [errors, setErrors] = useState([])
  const [categoryErrors, setCategoryErrors] = useState([])

  const fetchTasks = () => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then(response => response.json()) 
      .then(data => setTasks(data))      
      .catch(error => console.error('Error:', error))
  }
  const fetchCategories = () => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(response => response.json()) 
      .then(data => setCategories(data))      
      .catch(error => console.error('Error:', error))
  }

  const validateTaskForm = () => {
    const currentErrors = []
    if (!newTaskTitle) {
      currentErrors.push('Task title can\'t be empty!')
    }
    if (!selectedCategory) {
      currentErrors.push('Task category has to be selected!')
    }
    setErrors(currentErrors)

    if(errors.length==0){
      return true
    }
    else {
      return false
    }
  }

  const validateCategoryForm = () => {
    const currentErrors = []

    if (!newCategoryName) {
      currentErrors.push('Category name can\'t be empty!')
    }
    if (categories.map(e => e.category_name).includes(newCategoryName)) {
      currentErrors.push('Category name has to be unique!')
    }
    setCategoryErrors(currentErrors)

    if(categoryErrors.length==0){
      return true
    }
    else {
      return false
    }
  }

  const addTask = (e) => {
    e.preventDefault()

    if (!validateTaskForm()) return 

    fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTaskTitle,
        category_name: selectedCategory,
        completed: false
      }),
    })
    .then(response => response.json())
    .then(() => {
      setNewTaskTitle('')
      selectCategory('')
      fetchTasks()
    })
  }

  const changeTaskState = (id, e) => {
    setTaskState(e.target.checked)

    fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: e.target.checked
      }),
    })
    .then(response => response.json())
    .then(() => {
      fetchTasks()
    })
  }

  const addCategory = (e) => {
    e.preventDefault()

    if (!validateCategoryForm()) return 

    console.log(categories, newCategoryName)
    if (!newCategoryName || categories.map(e => e.category_name).includes(newCategoryName)) return

    fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category_name: newCategoryName,
      }),
    })
    .then(response => response.json())
    .then(() => {
      setNewCategoryName('')
      fetchCategories()
    })
  }
  const deleteTask = (task) => {
    fetch('http://127.0.0.1:8000/api/tasks/' + task + '/', {
      method: 'DELETE'
    })
    .then(() => {
      fetchTasks()
    })

  }
  const deleteCategory = (category) => {
    fetch('http://127.0.0.1:8000/api/categories/' + category + '/', {
      method: 'DELETE'
    })
    .then(() => {
      fetchCategories()
    })
  }
  useEffect(() => {
    fetchTasks(),
    fetchCategories()
  }, [])

  const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ToDo App</h1>
      <form onSubmit={addTask}>  
        {!!errors.length&&<ul className='errorList'>{errors.map(error => <li key={error}>{error}</li>)}</ul>}
        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder='Enter task title '/>
        <br />
        {categories.map(category => (
          <label key={category.id}>
            <input value={category.category_name} type='radio' name='category' checked={selectedCategory === category.category_name}
            onChange={() => {selectCategory(category.category_name)}}/>
            <strong>{category.category_name}
            </strong>
            <button className='deleteCategoryBtn' onClick={() => {deleteCategory(category.id)}}>❌</button>
          </label>
          ))
        }
        <button type='submit' id='addTaskBtn'>Add task</button>
      </form>

      <form onSubmit={addCategory}>  
      <br />
        {!!categoryErrors.length&&<ul className='errorList'>{categoryErrors.map(error => <li key={error}>{error}</li>)}</ul>}
        <p><strong>Add new category</strong></p>
        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder='Enter category name '/>
        <button type='submit'>Add</button>
      </form>
      <ul>
        {sortedTasks.map(task => (
          <li key={task.id} className='listedTasks'>
            <input type="checkbox" checked={task.completed} onChange={(e) => {changeTaskState(task.id, e)}}/>
            <strong>{task.title}</strong> | {task.completed ? '✅ | ' : '❌ | \n'}
            <span>{task.category_name && `${task.category_name} | `}</span>
            <button className='taskDelete' onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App