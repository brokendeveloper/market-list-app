import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListSelectorProps } from "@/types";
import { Plus, Trash2 } from "lucide-react";

export function ListSelector({ lists, selectedListId, onSelectList, onAddList, onDeleteList }: ListSelectorProps) {
  const [newListName, setNewListName] = useState<string>("");
  
  const handleAddList = () => {
    if (newListName.trim() && !lists.some((list) => list.name === newListName)) {
      onAddList(newListName);
      setNewListName("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddList();
    }
  };
  
  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-white">Suas Listas</h2>
      
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Nome da nova lista"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-purple-500"
        />
        <Button 
          onClick={handleAddList} 
          className="bg-purple-600 hover:bg-purple-700 flex items-center"
        >
          <Plus size={16} className="mr-1" />Criar
        </Button>
      </div>
      
      <div className="space-y-2">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div
              key={list.id}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer
              ${selectedListId === list.id 
                ? 'bg-zinc-800 border border-purple-500' 
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'}`}
              onClick={() => onSelectList(list.id)}
            >
              <span className="font-medium text-white">{list.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteList(list.id);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-zinc-700 border-zinc-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4 bg-zinc-900 rounded-lg">
            Nenhuma lista encontrada
          </div>
        )}
      </div>
    </div>
  );
}