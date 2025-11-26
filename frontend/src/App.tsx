import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const useApi = () =>
  useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
      }),
    []
  );

function App() {
  const api = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Task[]>("/tasks");
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, [api]);

  const handleAddTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      const { data } = await api.post<Task>("/tasks", { title: trimmed });
      setTasks(prev => [...prev, data]);
      setTitle("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not add task.");
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      setBusyTaskId(task._id);
      const { data } = await api.patch<Task>(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(prev => prev.map(t => (t._id === data._id ? data : t)));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not update task.");
    } finally {
      setBusyTaskId(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setBusyTaskId(taskId);
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not delete task.");
    } finally {
      setBusyTaskId(null);
    }
  };

  return (
    <main className="app-container">
      <h1>TaskTrackr</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <button className="add-btn" onClick={handleAddTask} disabled={!title.trim()}>
          Add
        </button>
      </div>

      {error && <p className="status-message error">{error}</p>}

      {loading ? (
        <p className="status-message">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="status-message">No tasks yet. Start by adding one!</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  disabled={busyTaskId === task._id}
                />
                <span className={task.completed ? "completed" : ""}>{task.title}</span>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
                disabled={busyTaskId === task._id}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
