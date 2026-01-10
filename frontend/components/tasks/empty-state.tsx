import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks yet</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Get started by creating your first task
      </p>
      <Button onClick={onAddTask} className="inline-flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Add your first task
      </Button>
    </div>
  );
}