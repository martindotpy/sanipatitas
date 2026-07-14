package dev.martindotpy.sanipatitas.shared.inventory.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.ProductCategory;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface ProductCategoryRepository extends PanacheRepositoryBase<ProductCategory, UUID> {
    default Uni<ProductCategory> update(ProductCategory category) {
        return getSession().chain(session -> session.merge(category));
    }
}
