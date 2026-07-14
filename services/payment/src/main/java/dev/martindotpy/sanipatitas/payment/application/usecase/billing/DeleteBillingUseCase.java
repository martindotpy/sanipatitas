package dev.martindotpy.sanipatitas.payment.application.usecase.billing;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.payment.application.port.DeleteBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteBillingUseCase implements DeleteBillingPort {
    private final BillingRepository billingRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return billingRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(id))
                .call(billingRepository::delete)
                .replaceWithVoid();
    }
}
