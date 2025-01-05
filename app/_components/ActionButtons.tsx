import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from 'lucide-react';
import { ActionButtonsProps } from '../../types/excel-table';

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onEdit}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

