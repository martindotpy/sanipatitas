package dev.martindotpy.sanipatitas.shared.payment.domain.payload;

import java.math.BigDecimal;

import org.jspecify.annotations.Nullable;

public interface UpdateBillingPayload {
    BigDecimal getSubtotal();
    BigDecimal getDiscount();
    BigDecimal getTaxAmount();
    BigDecimal getTotalAmount();
    @Nullable String getNotes();
}
