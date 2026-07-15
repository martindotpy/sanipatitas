package dev.martindotpy.sanipatitas.payment.application.usecase.billing;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.payment.application.port.DeleteBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingHasAssociatedDataException;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingItemRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.PaymentRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteBillingUseCase implements DeleteBillingPort {
    private final BillingRepository billingRepository;
    private final BillingItemRepository billingItemRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return billingRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(id))
                .chain(billing -> billingItemRepository.count("billingId", id)
                        .chain(itemCount -> paymentRepository.count("billingId", id)
                                .chain(paymentCount -> {
                                    if (itemCount > 0 || paymentCount > 0) {
                                        return Uni.createFrom().failure(new BillingHasAssociatedDataException(id));
                                    }
                                    return billingRepository.delete(billing).replaceWithVoid();
                                })));
    }
}
