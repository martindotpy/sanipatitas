package dev.martindotpy.sanipatitas.shared.payment.domain.payload;

import java.math.BigDecimal;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItemType;

public interface CreateBillingItemPayload {
    @Nullable UUID getId();
    UUID getBillingId();
    String getDescription();
    int getQuantity();
    BigDecimal getUnitPrice();
    BillingItemType getItemType();
    @Nullable UUID getReferenceId();
}
