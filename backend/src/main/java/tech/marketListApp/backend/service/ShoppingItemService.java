package tech.marketListApp.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.marketListApp.backend.dto.ShoppingItemDTO;
import tech.marketListApp.backend.entity.ItemStatus;
import tech.marketListApp.backend.entity.ShoppingItem;
import tech.marketListApp.backend.entity.ShoppingList;
import tech.marketListApp.backend.repository.ShoppingItemRepository;
import tech.marketListApp.backend.repository.ShoppingListRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingItemService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final ShoppingListRepository shoppingListRepository;

    public List<ShoppingItemDTO> getAllItemsByShoppingListId(Long shoppingListId) {
        List<ShoppingItem> items = shoppingItemRepository.findByShoppingListId(shoppingListId);
        return items.stream()
                .map(ShoppingItemDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<ShoppingItemDTO> getItemById(Long shoppingListId, Long id) {
        return shoppingItemRepository.findByIdAndShoppingListId(id, shoppingListId)
                .map(ShoppingItemDTO::new);
    }

    @Transactional
    public ShoppingItemDTO addItemToShoppingList(Long shoppingListId, ShoppingItemDTO shoppingItemDTO) {

        ShoppingList shoppingList = shoppingListRepository.findById(shoppingItemDTO.getShoppingListId())
                .orElseThrow(() -> new RuntimeException("Shopping List Not Found with Id: " + shoppingItemDTO.getShoppingListId()));


        ShoppingItem shoppingItem = shoppingItemDTO.toEntity();
        shoppingItem.setShoppingList(shoppingList);


        if (shoppingItem.getItemStatus() == null) {
            shoppingItem.setItemStatus(ItemStatus.PENDING);
        }


        ShoppingItem savedItem = shoppingItemRepository.save(shoppingItem);
        return new ShoppingItemDTO(savedItem);
    }

    @Transactional
    public ShoppingItemDTO updateItem(Long id, ShoppingItemDTO itemDetailsDTO){
        ShoppingItem item = shoppingItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopping Item Not Found with Id: " + id));

        ShoppingItem itemDetails = itemDetailsDTO.toEntity();
        item.setItemName(itemDetails.getItemName());
        item.setItemCategory(itemDetails.getItemCategory());
        item.setItemQuantity(itemDetails.getItemQuantity());
        item.setItemStatus(itemDetails.getItemStatus());

        ShoppingItem updatedItem = shoppingItemRepository.save(item);
        return new ShoppingItemDTO(updatedItem);
    }

    @Transactional
    public ShoppingItemDTO updateItemStatus(Long id, ItemStatus itemStatus){
        ShoppingItem item = shoppingItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopping Item Not Found with Id: " + id));
        item.setItemStatus(itemStatus);

        ShoppingItem updatedItem = shoppingItemRepository.save(item);
        return new ShoppingItemDTO(updatedItem);
    }

    public void deleteItem(Long id){
        ShoppingItem item = shoppingItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shopping Item Not Found with Id: " + id));
        shoppingItemRepository.delete(item);
    }
}