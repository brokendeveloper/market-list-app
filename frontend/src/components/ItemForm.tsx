"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ShoppingItem, ItemFormProps, categoryOptions } from "@/types";

export function ItemForm({ onAddItem, onUpdateItem, editingItem }: ItemFormProps) {
  const [item, setItem] = useState<ShoppingItem>({
    id: 0,
    name: "",
    category: "GROCERY",
    quantity: 1,
    checked: false,
  });

  useEffect(() => {
    if (editingItem) {
      setItem({ ...editingItem });
    } else {
      setItem({
        id: 0,
        name: "",
        category: "GROCERY",
        quantity: 1,
        checked: false,
      });
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.name.trim()) return;
    if (item.id) {
      onUpdateItem(item);
    } else {
      onAddItem(item);
    }
    if (!editingItem) {
      setItem({
        id: 0,
        name: "",
        category: "GROCERY",
        quantity: 1,
        checked: false,
      });
    }
  };

  
  if (!editingItem) {
    return (
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2 bg-zinc-900 rounded-lg p-2">
          <Input
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500"
            placeholder="Item"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            required
          />
          <Input
            type="number"
            className="w-24 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500"
            placeholder="1"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: Number(e.target.value) })}
            min="1"
          />
          <Select 
            value={item.category}
            onValueChange={(value) => setItem({ ...item, category: value })}
          >
            <SelectTrigger className="w-32 bg-transparent border-none focus:ring-0 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white border-gray-700">
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-purple-600 hover:bg-purple-700 w-10 h-10"
          >
            <span className="text-lg">+</span>
          </Button>
        </div>
      </form>
    );
  }

  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg p-4 bg-zinc-900 text-white mb-6">
      <h3 className="font-medium text-lg">
        Editar Item
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Nome do Item</Label>
          <Input
            id="name"
            placeholder="Digite o nome do item"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            required
            className="bg-zinc-800 border-gray-700 text-white placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-300">Categoria</Label>
          <Select
            value={item.category}
            onValueChange={(value) => setItem({ ...item, category: value })}
          >
            <SelectTrigger className="bg-zinc-800 border-gray-700 text-white">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white border-gray-700">
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-gray-300">Quantidade</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Quantidade"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: Number(e.target.value) })}
            min="1"
            className="bg-zinc-800 border-gray-700 text-white placeholder-gray-500"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onUpdateItem(null)}
          className="border-gray-700 text-gray-300 hover:bg-zinc-800"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Atualizar
        </Button>
      </div>
    </form>
  );
}