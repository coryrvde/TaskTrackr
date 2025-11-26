import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/app.css";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then(res => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    const res = await axios.post("http://localhost:5000/tasks", { title });

    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const res = await axios.patch(`http://localhost:5000/tasks/${id}`, { completed });

    setTasks(tasks.map(t => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="app-container">
      <h1>TaskTrackr</h1>

      <div className="input-row">
        <input
          type="text"
          value={title}
          placeholder="Enter task..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li className="task-item" key={t._id}>
            <div className="task-left">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t._id, !t.completed)}
              />
              <span className={t.completed ? "completed" : ""}>
                {t.title}
              </span>
            </div>

            <button className="delete-btn" onClick={() => deleteTask(t._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
