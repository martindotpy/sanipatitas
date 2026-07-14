package dev.martindotpy.sanipatitas.shared.payment.domain.payload;

import java.math.BigDecimal;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreateBillingPayload {
    @Nullable UUID getId();
    UUID getClientId();
    @Nullable UUID getAppointmentId();
    BigDecimal getSubtotal();
    BigDecimal getDiscount();
    BigDecimal getTaxAmount();
    BigDecimal getTotalAmount();
    @Nullable String getNotes();
}
