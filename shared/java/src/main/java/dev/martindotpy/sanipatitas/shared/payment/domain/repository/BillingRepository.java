package dev.martindotpy.sanipatitas.shared.payment.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.Billing;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface BillingRepository extends PanacheRepositoryBase<Billing, UUID> {
    default Uni<Billing> update(Billing billing) {
        return getSession().chain(session -> session.merge(billing));
    }
}
