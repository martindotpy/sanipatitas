package dev.martindotpy.sanipatitas.shared.inventory.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.StockMovement;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface StockMovementRepository extends PanacheRepositoryBase<StockMovement, UUID> {
    default Uni<List<StockMovement>> findByStockId(UUID stockId, Page page) {
        return find("stock.id = ?1 order by createdAt desc", stockId).page(page).list();
    }

    default Uni<Long> countByStockId(UUID stockId) {
        return count("stock.id = ?1", stockId);
    }
}
