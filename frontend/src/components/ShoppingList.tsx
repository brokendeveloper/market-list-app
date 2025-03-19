"use client"
import { useState, useEffect } from "react"
import { ItemForm } from "./ItemForm"
import { ShoppingListItem } from "./ShoppingListItem"
import { ListSelector } from "./ListSelector"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  type ShoppingItem,
  type ShoppingListState,
  categoryOptions,
  type ShoppingList as ShoppingListType,
} from "@/types"
import { Search, X, AlertCircle } from "lucide-react"
import {
  useShoppingListApi,
  adaptItemFromApi,
  adaptItemToApi,
  adaptShoppingListFromApi,
} from "@/lib/hooks/useShoppingListApi"

export function ShoppingList() {
  const {
    loading,
    getShoppingLists,
    getListItems,
    addItemToList,
    updateItem,
    deleteItem,
    createShoppingList,
    deleteShoppingList,
    updateItemStatus,
  } = useShoppingListApi()

  const [state, setState] = useState<ShoppingListState>({
    items: [],
    editingItem: null,
    filterCategory: null,
    sortBy: "added",
  })

  
  const [lists, setLists] = useState<ShoppingListType[]>([])
  const [selectedListId, setSelectedListId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState(false)

  // armazenamento no navegador (caso de erro de api)
  const loadFromLocalStorage = () => {
    setIsUsingLocalStorage(true)

    const savedLists = localStorage.getItem("shoppingLists")
    if (savedLists) {
      const parsedLists = JSON.parse(savedLists)
      setLists(parsedLists)

      if (parsedLists.length > 0) {
        setSelectedListId(parsedLists[0].id)

        const listItems = localStorage.getItem(`shoppingItems_${parsedLists[0].id}`)
        if (listItems) {
          setState((prevState) => ({
            ...prevState,
            items: JSON.parse(listItems),
          }))
        }
      }
    } else {
      const defaultList = { id: 1, name: "Lista Principal" }
      setLists([defaultList])
      setSelectedListId(1)
      localStorage.setItem("shoppingLists", JSON.stringify([defaultList]))
    }
  }

  
  const saveToLocalStorage = (listId: number | null, items: ShoppingItem[]) => {
    if (isUsingLocalStorage && listId) {
      localStorage.setItem(`shoppingItems_${listId}`, JSON.stringify(items))
      localStorage.setItem("shoppingLists", JSON.stringify(lists))
    }
  }

  
  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

    const loadLists = async () => {
      try {
        const listsFromApi = await getShoppingLists()
        const adaptedLists = listsFromApi.map(adaptShoppingListFromApi)
        setLists(adaptedLists)

        if (adaptedLists.length > 0) {
          setSelectedListId(adaptedLists[0].id)

          try {
            const items = await getListItems(adaptedLists[0].id)
            setState((prevState) => ({
              ...prevState,
              items: items.map(adaptItemFromApi),
            }))
          } catch (err) {
            console.error("Erro ao carregar itens:", err)
            setNetworkError("Erro ao carregar itens da lista.")
            setState((prevState) => ({ ...prevState, items: [] }))
          }
        } else {
          try {
            const defaultListDTO = { name: "Lista Principal" }
            const newList = await createShoppingList(defaultListDTO)
            const adaptedList = adaptShoppingListFromApi(newList)
            setLists([adaptedList])
            setSelectedListId(adaptedList.id)
          } catch (err) {
            console.error("Erro ao criar lista padrão:", err)
            setNetworkError("Erro ao criar lista padrão.")
            loadFromLocalStorage()
          }
        }
      } catch (err) {
        console.error("Erro ao carregar listas:", err)
        setNetworkError("Não foi possível conectar ao servidor. Usando armazenamento local como fallback.")
        loadFromLocalStorage()
      }
    }

    loadLists()
  }, [])

  
  useEffect(() => {
    if (isUsingLocalStorage && selectedListId) {
      saveToLocalStorage(selectedListId, state.items)
    }
  }, [state.items, lists, selectedListId, isUsingLocalStorage])

  
  useEffect(() => {
    if (!selectedListId) return

    if (isUsingLocalStorage) {
      const listItems = localStorage.getItem(`shoppingItems_${selectedListId}`)
      setState((prevState) => ({
        ...prevState,
        items: listItems ? JSON.parse(listItems) : [],
      }))
    } else {
      const loadItems = async () => {
        try {
          const items = await getListItems(selectedListId)
          setState((prevState) => ({
            ...prevState,
            items: items.map(adaptItemFromApi),
          }))
        } catch (err) {
          console.error("Erro ao carregar itens:", err)
          setNetworkError("Erro ao carregar itens da lista.")

          const listItems = localStorage.getItem(`shoppingItems_${selectedListId}`)
          if (listItems) {
            setState((prevState) => ({
              ...prevState,
              items: JSON.parse(listItems),
            }))
            setIsUsingLocalStorage(true)
          } else {
            setState((prevState) => ({ ...prevState, items: [] }))
          }
        }
      }

      loadItems()
    }
  }, [selectedListId])

  const handleAddList = async (name: string) => {
    if (isUsingLocalStorage) {
      const newList = { id: Date.now(), name }
      setLists((prevLists) => [...prevLists, newList])
      setSelectedListId(newList.id)
      setState((prevState) => ({ ...prevState, items: [] }))
    } else {
      try {
        const newList = await createShoppingList({ name })
        const adaptedList = adaptShoppingListFromApi(newList)
        setLists((prevLists) => [...prevLists, adaptedList])
        setSelectedListId(adaptedList.id)
        setState((prevState) => ({ ...prevState, items: [] }))
      } catch (err) {
        console.error("Erro ao criar lista:", err)
        setNetworkError("Erro ao criar lista. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        const newList = { id: Date.now(), name }
        setLists((prevLists) => [...prevLists, newList])
        setSelectedListId(newList.id)
        setState((prevState) => ({ ...prevState, items: [] }))
      }
    }
  }

  const handleDeleteList = async (id: number) => {
    if (isUsingLocalStorage) {
      setLists((prevLists) => prevLists.filter((list) => list.id !== id))
      localStorage.removeItem(`shoppingItems_${id}`)

      if (selectedListId === id) {
        const remainingLists = lists.filter((list) => list.id !== id)
        if (remainingLists.length > 0) {
          setSelectedListId(remainingLists[0].id)
          const listItems = localStorage.getItem(`shoppingItems_${remainingLists[0].id}`)
          setState((prevState) => ({
            ...prevState,
            items: listItems ? JSON.parse(listItems) : [],
          }))
        } else {
          setSelectedListId(null)
          setState((prevState) => ({ ...prevState, items: [] }))
        }
      }
    } else {
      try {
        await deleteShoppingList(id)
        setLists((prevLists) => prevLists.filter((list) => list.id !== id))

        if (selectedListId === id) {
          const remainingLists = lists.filter((list) => list.id !== id)
          if (remainingLists.length > 0) {
            setSelectedListId(remainingLists[0].id)
            try {
              const items = await getListItems(remainingLists[0].id)
              setState((prevState) => ({
                ...prevState,
                items: items.map(adaptItemFromApi),
              }))
            } catch (err) {
              console.error("Erro ao carregar itens da nova lista:", err)
              setNetworkError("Erro ao carregar itens da nova lista.")
              setState((prevState) => ({ ...prevState, items: [] }))
            }
          } else {
            setSelectedListId(null)
            setState((prevState) => ({ ...prevState, items: [] }))
          }
        }
      } catch (err) {
        console.error("Erro ao excluir lista:", err)
        setNetworkError("Erro ao excluir lista. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setLists((prevLists) => prevLists.filter((list) => list.id !== id))
        localStorage.removeItem(`shoppingItems_${id}`)

        if (selectedListId === id) {
          const remainingLists = lists.filter((list) => list.id !== id)
          if (remainingLists.length > 0) {
            setSelectedListId(remainingLists[0].id)
            const listItems = localStorage.getItem(`shoppingItems_${remainingLists[0].id}`)
            setState((prevState) => ({
              ...prevState,
              items: listItems ? JSON.parse(listItems) : [],
            }))
          } else {
            setSelectedListId(null)
            setState((prevState) => ({ ...prevState, items: [] }))
          }
        }
      }
    }
  }

  const handleAddItem = async (newItem: ShoppingItem) => {
    if (!selectedListId) return

    if (isUsingLocalStorage) {
      setState((prevState) => ({
        ...prevState,
        items: [
          ...prevState.items,
          {
            ...newItem,
            id: Date.now(),
            listId: selectedListId,
          },
        ],
      }))
    } else {
      try {
        const { id: _, ...itemWithoutId } = newItem; 
        const itemDTO = adaptItemToApi({
            ...itemWithoutId,
            listId: selectedListId,
        });


        const addedItem = await addItemToList(selectedListId, itemDTO)

        setState((prevState) => ({
          ...prevState,
          items: [...prevState.items, adaptItemFromApi(addedItem)],
        }))
      } catch (err) {
        console.error("Erro ao adicionar item:", err)
        setNetworkError("Erro ao adicionar item. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setState((prevState) => ({
          ...prevState,
          items: [
            ...prevState.items,
            {
              ...newItem,
              id: Date.now(),
              listId: selectedListId,
            },
          ],
        }))
      }
    }
  }

  const handleUpdateItem = async (updatedItem: ShoppingItem | null) => {
    if (!updatedItem) {
      setState((prevState) => ({ ...prevState, editingItem: null }))
      return
    }

    if (isUsingLocalStorage) {
      setState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        editingItem: null,
      }))
    } else {
      try {
        const itemForApi = adaptItemToApi(updatedItem)
        await updateItem(updatedItem.id, itemForApi)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
          editingItem: null,
        }))
      } catch (err) {
        console.error("Erro ao atualizar item:", err)
        setNetworkError("Erro ao atualizar item. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
          editingItem: null,
        }))
      }
    }
  }

  const handleToggleItem = async (id: number) => {
    if (isUsingLocalStorage) {
      setState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
      }))
    } else {
      try {
        const item = state.items.find((item) => item.id === id)
        if (!item) return

        const newStatus = !item.checked ? "PURCHASED" : "PENDING"
        await updateItemStatus(id, newStatus)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
        }))
      } catch (err) {
        console.error("Erro ao alternar status do item:", err)
        setNetworkError("Erro ao alterar status do item. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
        }))
      }
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (isUsingLocalStorage) {
      setState((prevState) => ({
        ...prevState,
        items: prevState.items.filter((item) => item.id !== id),
      }))
    } else {
      try {
        await deleteItem(id)
        setState((prevState) => ({
          ...prevState,
          items: prevState.items.filter((item) => item.id !== id),
        }))
      } catch (err) {
        console.error("Erro ao excluir item:", err)
        setNetworkError("Erro ao excluir item. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.filter((item) => item.id !== id),
        }))
      }
    }
  }

  const handleEditItem = (item: ShoppingItem) => {
    setState((prevState) => ({ ...prevState, editingItem: item }))
  }

  const handleClearCompleted = async () => {
    if (isUsingLocalStorage) {
      setState((prevState) => ({
        ...prevState,
        items: prevState.items.filter((item) => !item.checked),
      }))
    } else {
      try {
        const completedItems = state.items.filter((item) => item.checked)
        for (const item of completedItems) {
          await deleteItem(item.id)
        }

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.filter((item) => !item.checked),
        }))
      } catch (err) {
        console.error("Erro ao limpar itens concluídos:", err)
        setNetworkError("Erro ao limpar itens concluídos. Usando armazenamento local como fallback.")
        setIsUsingLocalStorage(true)

        setState((prevState) => ({
          ...prevState,
          items: prevState.items.filter((item) => !item.checked),
        }))
      }
    }
  }

  const handleReconnect = async () => {
    setNetworkError(null)
    setIsUsingLocalStorage(false)

    try {
      const listsFromApi = await getShoppingLists()
      const adaptedLists = listsFromApi.map(adaptShoppingListFromApi)
      setLists(adaptedLists)

      if (adaptedLists.length > 0) {
        setSelectedListId(adaptedLists[0].id)

        try {
          const items = await getListItems(adaptedLists[0].id)
          setState((prevState) => ({
            ...prevState,
            items: items.map(adaptItemFromApi),
          }))
        } catch (err) {
          console.error("Erro ao carregar itens:", err)
          setNetworkError("Erro ao carregar itens da lista.")
          setState((prevState) => ({ ...prevState, items: [] }))
        }
      }
    } catch (err) {
      console.error("Erro ao reconectar:", err)
      setNetworkError("Não foi possível conectar ao servidor. Usando armazenamento local como fallback.")
      setIsUsingLocalStorage(true)
    }
  }

  // filtrar / ordenar itens.
  const filteredItems = state.items.filter((item) => {
    const matchesCategory = state.filterCategory ? item.category === state.filterCategory : true
    const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    return matchesCategory && matchesSearch
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (state.sortBy === "name") return a.name.localeCompare(b.name)
    if (state.sortBy === "category") return a.category.localeCompare(b.category)
    if (state.sortBy === "checked") return a.checked === b.checked ? 0 : a.checked ? 1 : -1
    return a.id && b.id ? a.id - b.id : 0 // Default: sort by id (added order)
  })

  const handleSelectList = (listId: number) => {
    setSelectedListId(listId)
  }

  return (
    <div className="min-h-screen w-full bg-black text-white fixed inset-0 overflow-auto">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Market List App</h1>

        {/* testar a conexão com API. */}
        {process.env.NODE_ENV === "development" && (
          <Button
            variant="outline"
            className="mb-4 text-xs"
            onClick={async () => {
              try {
                const lists = await getShoppingLists()
                console.log("Listas retornadas:", lists)
                setNetworkError(null)
                setIsUsingLocalStorage(false)
              } catch (err) {
                console.error("Erro na chamada de teste:", err)
                setNetworkError("Erro ao conectar com a API. Verifique a conexão.")
              }
            }}
          >
            Testar Conexão API
          </Button>
        )}

        {/* Mensagens de erro e status */}
        {networkError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {networkError}
              {isUsingLocalStorage && (
                <Button variant="link" onClick={handleReconnect} className="ml-2 text-blue-500 p-0 h-auto">
                  Tentar reconectar
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isUsingLocalStorage && (
          <Alert className="mb-4 bg-yellow-900/20 text-yellow-500 border-yellow-800">
            <AlertDescription>
              Modo offline ativo: Os dados estão sendo salvos apenas no seu navegador.
            </AlertDescription>
          </Alert>
        )}

        {loading && <div className="text-center p-4">Carregando...</div>}

        <div className="space-y-6">
          {/* Seletor de listas */}
          <ListSelector
            lists={lists}
            selectedListId={selectedListId}
            onSelectList={handleSelectList}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
          />

          {selectedListId ? (
            <>
              {/* Formulário para adicionar/editar item */}
              <ItemForm onAddItem={handleAddItem} onUpdateItem={handleUpdateItem} editingItem={state.editingItem} />

              {/* Filtro de pesquisa */}
              {state.items.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Pesquisar itens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder-gray-500"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3">
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>

                  {/* Filtro por categoria */}
                  <Select
                    value={state.filterCategory || "all"}
                    onValueChange={(value) =>
                      setState((prev) => ({
                        ...prev,
                        filterCategory: value === "all" ? null : value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-zinc-900 border-zinc-800 text-white">
                      <SelectValue placeholder="Todas categorias" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                      <SelectItem value="all">Todas categorias</SelectItem>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lista de itens */}
              <div className="space-y-2">
                {sortedItems.length > 0 ? (
                  <>
                    {sortedItems.map((item) => (
                      <ShoppingListItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}

                    {/* Botão para limpar itens marcados */}
                    {sortedItems.some((item) => item.checked) && (
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="outline"
                          onClick={handleClearCompleted}
                          className="border-zinc-700 text-black hover:bg-red-900/20 hover:text-red-300"
                        >
                          Limpar concluídos
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-500 bg-zinc-900 rounded-lg">
                    Sua lista de compras está vazia. Adicione alguns itens acima.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-zinc-900 rounded-lg">
              Selecione uma lista ou crie uma nova para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

