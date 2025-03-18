package tech.marketListApp.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.marketListApp.backend.dto.ShoppingListDTO;
import tech.marketListApp.backend.service.ShoppingListService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/shopping-lists")
@RequiredArgsConstructor
public class ShoppingListController {

    private final ShoppingListService shoppingListService;

    @GetMapping
    public ResponseEntity<List<ShoppingListDTO>> getAllShoppingLists() {
        List<ShoppingListDTO> shoppingLists = shoppingListService.getAllShoppingLists();
        return new ResponseEntity<>(shoppingLists, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingListDTO> getShoppingListById(@PathVariable Long id) {
        return shoppingListService.getShoppingListById(id)
                .map(shoppingList -> new ResponseEntity<>(shoppingList, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ShoppingListDTO> createShoppingList(@RequestBody ShoppingListDTO shoppingListDTO) {
        ShoppingListDTO newShoppingList = shoppingListService.createShoppingList(shoppingListDTO);
        return new ResponseEntity<>(newShoppingList, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingListDTO> updateShoppingList(@PathVariable Long id, @RequestBody ShoppingListDTO shoppingListDTO) {
        try {
            ShoppingListDTO updatedShoppingList = shoppingListService.updateShoppingList(id, shoppingListDTO);
            return new ResponseEntity<>(updatedShoppingList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoppingList(@PathVariable Long id) {
        try {
            shoppingListService.deleteShoppingList(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}