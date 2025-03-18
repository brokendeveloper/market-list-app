package tech.marketListApp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.marketListApp.backend.entity.ShoppingItem;

import java.util.List;
import java.util.Optional;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {

    List<ShoppingItem> findByShoppingListId(Long shoppingListId);

    Optional<ShoppingItem> findByIdAndShoppingListId(Long id, Long shoppingListId);
}
