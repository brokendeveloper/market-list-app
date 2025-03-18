export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  checked: boolean;
  listId?: number | null; 
} 

  export interface ItemFormProps {
    onAddItem: (item: ShoppingItem) => void;
    onUpdateItem: (item: ShoppingItem | null) => void;
    editingItem: ShoppingItem | null;
  }
  
  
  export interface ShoppingListItemProps {
    item: ShoppingItem;
    onToggle: (id: number) => void;
    onEdit: (item: ShoppingItem) => void;
    onDelete: (id: number) => void;
  }
  
  
  export const categoryOptions = [
    { value: "GROCERY", label: "Mercado" },
    { value: "BAKERY", label: "Padaria" },
    { value: "BUTCHERY", label: "Açougue" },
    { value: "CLEANING", label: "Limpeza" },
    { value: "PERSONAL_CARE", label: "Cuidados Pessoais" },
    { value: "OTHER", label: "Outros" },
  ];
  
  
  export interface ShoppingListState {
    items: ShoppingItem[];
    editingItem: ShoppingItem | null;
    filterCategory: string | null;
    sortBy: string;
  }

  
export interface ShoppingList {
  id: number;
  name: string;
}


export interface ListSelectorProps {
  lists: ShoppingList[];
  selectedListId: number | null;
  onSelectList: (id: number) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: number) => void;
}