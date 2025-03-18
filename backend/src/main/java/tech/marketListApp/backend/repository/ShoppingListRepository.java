package tech.marketListApp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.marketListApp.backend.entity.ShoppingList;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {

}
