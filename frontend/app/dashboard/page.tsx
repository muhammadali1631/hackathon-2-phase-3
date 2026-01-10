'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { EmptyState } from '@/components/tasks/empty-state';
import { AddTaskButton } from '@/components/tasks/add-task-button';
import { TaskForm } from '@/components/tasks/task-form';
import { apiService } from '@/lib/api';
import { Task } from '@/types';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleTaskDeleted = async (deletedTaskId: string) => {
    try {
      await apiService.deleteTask(deletedTaskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedTaskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Optionally show an error message to the user
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await apiService.toggleTaskCompletion(task.id, !task.completed);
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? response.task : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {tasks && tasks.length} {tasks &&  tasks.length === 1 ? 'task' : 'tasks'} total
          </p>
        </div>
        <AddTaskButton onClick={() => setShowTaskForm(true)} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : tasks && tasks.length === 0 ? (
        <EmptyState onAddTask={() => setShowTaskForm(true)} />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleTaskDeleted}
        />
      )}

      {showTaskForm && (
        <TaskForm
          task={editingTask || undefined}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleTaskUpdated : handleTaskCreated}
        />
      )}
    </div>
  );
}