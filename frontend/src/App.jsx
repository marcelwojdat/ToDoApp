import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = () => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then(response => response.json()) 
      .then(data => setTasks(data))      
      .catch(error => console.error('Error:', error))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My tasks</h1>
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