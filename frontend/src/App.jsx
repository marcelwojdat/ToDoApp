import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')

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
  const addTask = (e) => {
    e.preventDefault()

    if (!newTaskTitle) return

    fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTaskTitle,
        completed: false
      }),
    })
    .then(response => response.json())
    .then(() => {
      setNewTaskTitle('')
      fetchTasks()
    })
  }
  const addCategory = (e) => {
    e.preventDefault()

    if (!newCategoryName) return

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
  const chooseCategory = (e) => {
    category_name = e.value
  }
  const deleteTask = (task) => {
    fetch('http://127.0.0.1:8000/api/tasks/' + task + '/', {
      method: 'DELETE'
    })
    .then(() => {
      fetchTasks()
    })

  }



  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My tasks</h1>
      <form onSubmit={addTask}>  
        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder='Enter task title '/>
        <button type='submit'>Add</button>
      </form>
      <form onSubmit={chooseCategory}>  
        {categories.map(category => (
          <label>
            <input type='radio' key={category.id} />
            <strong>{category.category_name}
              <br />
            </strong>
          </label>
        ))}
        <button type='submit' onClick={(e) => {console.log(e.value)}}>Submit</button>
      </form>
      <form onSubmit={addCategory}>  
        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder='Enter category name '/>
        <button type='submit'>Add</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.completed ? '✅ Done' : '❌ Pending\n'}
            <p>{task.category_name && `Category: ${task.category_name}`}</p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App