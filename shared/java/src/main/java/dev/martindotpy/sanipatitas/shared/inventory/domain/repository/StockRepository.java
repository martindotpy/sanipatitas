package dev.martindotpy.sanipatitas.shared.inventory.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Stock;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface StockRepository extends PanacheRepositoryBase<Stock, UUID> {
    default Uni<Stock> findByProductId(UUID productId) {
        return find("product.id = ?1", productId).firstResult();
    }

    default Uni<Stock> update(Stock stock) {
        return getSession().chain(session -> session.merge(stock));
    }
}
