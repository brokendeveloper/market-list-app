package tech.marketListApp.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.marketListApp.backend.dto.ShoppingListDTO;
import tech.marketListApp.backend.entity.ShoppingList;
import tech.marketListApp.backend.repository.ShoppingListRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingListService {

    private final ShoppingListRepository shoppingListRepository;

    public List<ShoppingListDTO> getAllShoppingLists() {
        List<ShoppingList> lists = shoppingListRepository.findAll();
        return lists.stream()
                .map(ShoppingListDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<ShoppingListDTO> getShoppingListById(Long shoppingListId) {
        return shoppingListRepository.findById(shoppingListId)
                .map(ShoppingListDTO::new);
    }

    @Transactional
    public ShoppingListDTO createShoppingList(ShoppingListDTO shoppingListDTO) {
        ShoppingList shoppingList = shoppingListDTO.toEntity();
        ShoppingList savedList = shoppingListRepository.save(shoppingList);
        return new ShoppingListDTO(savedList);
    }

    @Transactional
    public ShoppingListDTO updateShoppingList(Long id, ShoppingListDTO shoppingListDetailsDTO) {
        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopping List Not Found with id: " + id));

        ShoppingList shoppingListDetails = shoppingListDetailsDTO.toEntity();
        shoppingList.setName(shoppingListDetails.getName());

        ShoppingList updatedList = shoppingListRepository.save(shoppingList);
        return new ShoppingListDTO(updatedList);
    }

    @Transactional
    public void deleteShoppingList(Long id) {
        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopping List Not Found with id: " + id));
        shoppingListRepository.delete(shoppingList);
    }
}