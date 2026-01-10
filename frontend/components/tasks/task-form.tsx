import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Task } from '@/types';
import { apiService } from '@/lib/api';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

export function TaskForm({ task, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };

      let result: { task: Task };

      if (task) {
        // Update existing task
        result = await apiService.updateTask(task.id, taskData);
      } else {
        // Create new task
        result = await apiService.createTask(taskData);
      }

      onSubmit(result.task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date (optional)
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              {loading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}