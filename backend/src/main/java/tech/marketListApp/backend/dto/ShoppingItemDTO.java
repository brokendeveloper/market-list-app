package tech.marketListApp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tech.marketListApp.backend.entity.ItemStatus;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingItemDTO {

    private Long id;
    private String itemName;
    private String itemCategory;
    private int itemQuantity;
    private ItemStatus itemStatus;
    private Long shoppingListId;

    // Construtor para converter da entidade para DTO
    public ShoppingItemDTO(tech.marketListApp.backend.entity.ShoppingItem item) {
        this.id = item.getId();
        this.itemName = item.getItemName();
        this.itemCategory = item.getItemCategory();
        this.itemQuantity = item.getItemQuantity();
        this.itemStatus = item.getItemStatus();

        // Extrair apenas o ID da lista
        if (item.getShoppingList() != null) {
            this.shoppingListId = item.getShoppingList().getId();
        }
    }

    // converte em entidade
    public tech.marketListApp.backend.entity.ShoppingItem toEntity() {
        tech.marketListApp.backend.entity.ShoppingItem entity = new tech.marketListApp.backend.entity.ShoppingItem();
        entity.setId(this.id);
        entity.setItemName(this.itemName);
        entity.setItemCategory(this.itemCategory);
        entity.setItemQuantity(this.itemQuantity);
        entity.setItemStatus(this.itemStatus);


        return entity;
    }
}
