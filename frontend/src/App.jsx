import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const fetchTasks = () => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then(response => response.json()) 
      .then(data => setTasks(data))      
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
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.completed ? '✅ Done' : '❌ Pending'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App