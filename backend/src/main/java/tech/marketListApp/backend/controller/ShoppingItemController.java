package tech.marketListApp.backend.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.marketListApp.backend.dto.ShoppingItemDTO;
import tech.marketListApp.backend.entity.ItemStatus;
import tech.marketListApp.backend.service.ShoppingItemService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ShoppingItemController {

    private final ShoppingItemService shoppingItemService;

    @GetMapping("/shopping-lists/{listId}/items")
    public ResponseEntity<List<ShoppingItemDTO>> getAllItemsByShoppingListId(@PathVariable Long listId) {
        List<ShoppingItemDTO> items = shoppingItemService.getAllItemsByShoppingListId(listId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/shopping-lists/{listId}/items/{id}")
    public ResponseEntity<ShoppingItemDTO> getItemById(@PathVariable Long id, @PathVariable Long listId) {
        return shoppingItemService.getItemById(listId, id)
                .map(item -> new ResponseEntity<>(item, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PostMapping("/shopping-lists/{listId}/items")
    public ResponseEntity<ShoppingItemDTO> addItemToShoppingList(@PathVariable Long listId, @RequestBody ShoppingItemDTO item) {
        System.out.println("Recebida requisição POST para /shopping-lists/" + listId + "/items");
        System.out.println("dados : " + item);
        try {
            ShoppingItemDTO newShoppingItem = shoppingItemService.addItemToShoppingList(listId, item);
            return new ResponseEntity<>(newShoppingItem, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ShoppingItemDTO> updateItem(@PathVariable Long id, @RequestBody ShoppingItemDTO item) {
        try {
            ShoppingItemDTO updatedShoppingItem = shoppingItemService.updateItem(id, item);
            return new ResponseEntity<>(updatedShoppingItem, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/items/{id}/status")
    public ResponseEntity<ShoppingItemDTO> updateItemStatus(@PathVariable Long id, @RequestBody ItemStatusRequest status) {
        try {
            ShoppingItemDTO updatedItemStatus = shoppingItemService.updateItemStatus(id, status.getStatus());
            return new ResponseEntity<>(updatedItemStatus, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            shoppingItemService.deleteItem(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Getter
    @Setter
    public static class ItemStatusRequest {
        private ItemStatus status;
    }
}