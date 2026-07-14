package dev.martindotpy.sanipatitas.payment.application.usecase.billing;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.BillingMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreateBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingPayload;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateBillingUseCase implements CreateBillingPort {
    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;

    @Override
    public Uni<BillingDto> create(CreateBillingPayload payload) {
        var billing = billingMapper.from(payload).build();
        return billingRepository.persist(billing)
                .map(billingMapper::toDto);
    }
}
