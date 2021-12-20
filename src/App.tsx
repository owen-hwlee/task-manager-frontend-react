import './App.css';
import TaskList from './components/task-list/TaskList';

function App() {
  return (
    <div className="App">
      <div className="generalcontainer">
        <h1>Task Manager</h1>
        <div>
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
