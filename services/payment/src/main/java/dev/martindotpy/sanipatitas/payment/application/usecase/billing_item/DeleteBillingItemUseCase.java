package dev.martindotpy.sanipatitas.payment.application.usecase.billing_item;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItem;
import dev.martindotpy.sanipatitas.shared.payment.application.port.DeleteBillingItemPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingItemNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingItemRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteBillingItemUseCase implements DeleteBillingItemPort {
    private final BillingItemRepository billingItemRepository;
    private final BillingRepository billingRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return billingItemRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BillingItemNotFoundException(id))
                .chain(item -> {
                    var billingId = item.getBillingId();
                    return billingItemRepository.delete(item)
                            .chain(_ -> recalculateBillingTotals(billingId));
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
