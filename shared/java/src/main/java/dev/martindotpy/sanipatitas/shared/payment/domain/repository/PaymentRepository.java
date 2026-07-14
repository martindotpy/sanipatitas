package dev.martindotpy.sanipatitas.shared.payment.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.Payment;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.smallrye.mutiny.Uni;

public interface PaymentRepository extends PanacheRepositoryBase<Payment, UUID> {
    default Uni<Payment> update(Payment payment) {
        return getSession().chain(session -> session.merge(payment));
    }
}
