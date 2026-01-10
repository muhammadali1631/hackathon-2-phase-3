import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface AddTaskButtonProps {
  onClick: () => void;
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <Plus className="h-5 w-5" />
      <span>Add Task</span>
    </Button>
  );
}