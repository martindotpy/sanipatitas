package dev.martindotpy.sanipatitas.shared.payment.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItem;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface BillingItemRepository extends PanacheRepositoryBase<BillingItem, UUID> {
    default Uni<BillingItem> update(BillingItem item) {
        return getSession().chain(session -> session.merge(item));
    }
}
