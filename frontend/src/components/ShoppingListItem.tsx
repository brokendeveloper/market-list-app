import React from "react";
import { ShoppingListItemProps, categoryOptions } from "@/types";
import { MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function ShoppingListItem({ item, onToggle, onEdit, onDelete }: ShoppingListItemProps) {
  
  const getCategoryLabel = (value: string) => {
    const category = categoryOptions.find(opt => opt.value === value);
    return category ? category.label : value;
  };

  
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'GROCERY':
        return 'bg-green-900 text-green-300';
      case 'BAKERY':
        return 'bg-yellow-900 text-yellow-300';
      case 'BUTCHERY':
        return 'bg-red-900 text-red-300';
      case 'CLEANING':
        return 'bg-blue-900 text-blue-300';
      case 'PERSONAL_CARE':
        return 'bg-purple-900 text-purple-300';
      case 'OTHER':
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          className="rounded-sm bg-transparent border-gray-500 w-5 h-5"
        />
        <div>
          <p className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-white'}`}>
            {item.name}
          </p>
          <p className="text-gray-400 text-sm">
            {item.quantity} {item.quantity > 1 ? 'unidades' : 'unidade'}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <span className={`px-3 py-1 text-xs rounded-full ${getCategoryColors(item.category)}`}>
          {getCategoryLabel(item.category)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-3 text-gray-400 hover:text-white">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
            <DropdownMenuItem 
              onClick={() => onEdit(item)}
              className="hover:bg-zinc-700"
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(item.id)}
              className="text-red-400 hover:bg-zinc-700 hover:text-red-300"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}