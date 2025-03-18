package tech.marketListApp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingListDTO {

    private Long id;
    private String name;
    private List<ShoppingItemDTO> items = new ArrayList<>();

    // de entidade para dto
    public ShoppingListDTO(tech.marketListApp.backend.entity.ShoppingList shoppingList) {
        this.id = shoppingList.getId();
        this.name = shoppingList.getName();

        // converte itens
        if (shoppingList.getItems() != null) {
            shoppingList.getItems().forEach(item ->
                    this.items.add(new ShoppingItemDTO(item))
            );
        }
    }

    // dto para entidade
    public tech.marketListApp.backend.entity.ShoppingList toEntity() {
        tech.marketListApp.backend.entity.ShoppingList entity = new tech.marketListApp.backend.entity.ShoppingList();
        entity.setId(this.id);
        entity.setName(this.name);

        return entity;

    }
}
