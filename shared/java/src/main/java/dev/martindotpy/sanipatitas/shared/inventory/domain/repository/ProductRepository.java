package dev.martindotpy.sanipatitas.shared.inventory.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Product;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface ProductRepository extends PanacheRepositoryBase<Product, UUID> {
    default Uni<Product> update(Product product) {
        return getSession().chain(session -> session.merge(product));
    }
}
