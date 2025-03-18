import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useShoppingListApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    setError(null);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      if (method === 'DELETE') {
        setLoading(false);
        return true;
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Implementação das funções da API
  const createShoppingList = (shoppingListDTO) => {
    return fetchApi('/shopping-lists', 'POST', shoppingListDTO);
  };

  const getShoppingLists = () => {
    return fetchApi('/shopping-lists');
  };

  const getShoppingList = (listId) => {
    return fetchApi(`/shopping-lists/${listId}`);
  };

  const updateShoppingList = (listId, shoppingListDTO) => {
    return fetchApi(`/shopping-lists/${listId}`, 'PUT', shoppingListDTO);
  };

  const deleteShoppingList = (listId) => {
    return fetchApi(`/shopping-lists/${listId}`, 'DELETE');
  };

  const addItemToList = (listId, itemDTO) => {
    return fetchApi(`/shopping-lists/${listId}/items`, 'POST', itemDTO);
  };

  const getListItems = (listId) => {
    return fetchApi(`/shopping-lists/${listId}/items`);
  };

  const getItem = (listId, itemId) => {
    return fetchApi(`/shopping-lists/${listId}/items/${itemId}`);
  };

  const updateItem = (itemId, itemDTO) => {
    return fetchApi(`/items/${itemId}`, 'PUT', itemDTO);
  };

  const updateItemStatus = (itemId, status) => {
    return fetchApi(`/items/${itemId}/status`, 'PATCH', {
      status: status
    });
  };

  const deleteItem = (itemId) => {
    return fetchApi(`/items/${itemId}`, 'DELETE');
  };

  return {
    loading,
    error,
    createShoppingList,
    getShoppingLists,
    getShoppingList,
    updateShoppingList,
    deleteShoppingList,
    addItemToList,
    getListItems,
    getItem,
    updateItem,
    updateItemStatus,
    deleteItem
  };
}

// Funções adaptadoras
export function adaptItemFromApi(apiItem) {
  return {
    id: apiItem.id,
    name: apiItem.itemName,
    category: apiItem.itemCategory,
    quantity: apiItem.itemQuantity,
    checked: apiItem.itemStatus === "PURCHASED",
    listId: apiItem.shoppingList ? apiItem.shoppingList.id : null
  };
}

export const adaptItemToApi = (item) => {
  return {
    id: item.id,
    itemName: item.name,
    itemCategory: item.category,
    itemQuantity: item.quantity,
    itemStatus: item.checked ? "PURCHASED" : "PENDING",
    shoppingListId:  item.listId 
  };
};

// Função adaptadora para ShoppingList
export function adaptShoppingListFromApi(apiShoppingList) {
  return {
    id: apiShoppingList.id,
    name: apiShoppingList.name,
    
  };
}

export const adaptShoppingListToApi = (shoppingList) => {
  return {
    id: shoppingList.id,
    name: shoppingList.name,
    
  };
};