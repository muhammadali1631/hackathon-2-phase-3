import { Task } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const handleToggle = () => {
    onToggleComplete(task);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="pt-1">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleToggle}
            aria-label={task.completed ? `Mark task "${task.title}" as incomplete` : `Mark task "${task.title}" as complete`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit task"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete task"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}