package dev.martindotpy.sanipatitas.payment.application.usecase.billing;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.BillingMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.UpdateBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.UpdateBillingPayload;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateBillingUseCase implements UpdateBillingPort {
    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;

    @Override
    public Uni<BillingDto> update(UUID id, UpdateBillingPayload payload) {
        return billingRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(id))
                .map(_ -> billingMapper.from(id, payload).build())
                .chain(billingRepository::update)
                .map(billingMapper::toDto);
    }
}
