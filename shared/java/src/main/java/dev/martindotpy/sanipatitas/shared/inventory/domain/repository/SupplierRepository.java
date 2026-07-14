package dev.martindotpy.sanipatitas.shared.inventory.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Supplier;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface SupplierRepository extends PanacheRepositoryBase<Supplier, UUID> {
    default Uni<Supplier> update(Supplier supplier) {
        return getSession().chain(session -> session.merge(supplier));
    }
}
