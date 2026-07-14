package dev.martindotpy.sanipatitas.payment.application.usecase.billing_item;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.BillingItemMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingItemPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingItemRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindBillingItemUseCase implements FindBillingItemPort {
    private final BillingItemRepository billingItemRepository;
    private final BillingItemMapper billingItemMapper;

    @Override
    public Uni<List<BillingItemDto>> findByBillingId(UUID billingId) {
        return billingItemRepository.list("billingId", billingId)
                .map(items -> items.stream().map(billingItemMapper::toDto).toList());
    }
}
