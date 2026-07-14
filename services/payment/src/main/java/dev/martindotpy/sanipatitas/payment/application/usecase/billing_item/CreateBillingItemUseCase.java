package dev.martindotpy.sanipatitas.payment.application.usecase.billing_item;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.BillingItemMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreateBillingItemPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItem;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingItemPayload;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingItemRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateBillingItemUseCase implements CreateBillingItemPort {
    private final BillingItemRepository billingItemRepository;
    private final BillingItemMapper billingItemMapper;
    private final BillingRepository billingRepository;

    @Override
    public Uni<BillingItemDto> create(UUID billingId, CreateBillingItemPayload payload) {
        return billingRepository.findById(billingId)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(billingId))
                .chain(billing -> {
                    var item = billingItemMapper.from(payload)
                            .billingId(billingId)
                            .total(payload.getUnitPrice().multiply(BigDecimal.valueOf(payload.getQuantity())))
                            .build();
                    return billingItemRepository.persist(item)
                            .chain(persisted -> recalculateBillingTotals(billingId)
                                    .map(_ -> billingItemMapper.toDto(persisted)));
                });
    }

    private Uni<Void> recalculateBillingTotals(UUID billingId) {
        return billingItemRepository.list("billingId", billingId)
                .chain(items -> {
                    var subtotal = items.stream()
                            .map(BillingItem::getTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return billingRepository.findById(billingId)
                            .onItem().ifNull().failWith(() -> new BillingNotFoundException(billingId))
                            .chain(billing -> {
                                billing.setSubtotal(subtotal);
                                billing.setTaxAmount(subtotal.multiply(new BigDecimal("0.18")));
                                billing.setTotalAmount(subtotal.subtract(billing.getDiscount()).add(billing.getTaxAmount()));
                                return billingRepository.update(billing).replaceWithVoid();
                            });
                });
    }
}
