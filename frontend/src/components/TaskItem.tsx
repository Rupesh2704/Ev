import React from 'react';

interface TaskItemProps {
  task: { id: number; title: string; completed: boolean };
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTask, deleteTask }) => {
  return (
    <div style={{ margin: '10px 0', padding: '10px', background: task.completed ? '#e8f5e9' : '#fff', border: '1px solid #ddd' }}>
      <h3>{task.title}</h3>
      <button onClick={() => toggleTask(task.id)} style={{ marginRight: '10px' }}>
        {task.completed ? 'Mark Incomplete' : 'Mark Completed'}
      </button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
};

export default TaskItem;
