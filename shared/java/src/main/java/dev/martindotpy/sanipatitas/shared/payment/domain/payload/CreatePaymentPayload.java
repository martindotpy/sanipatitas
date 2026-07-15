package dev.martindotpy.sanipatitas.shared.payment.domain.payload;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentMethod;

public interface CreatePaymentPayload {
    @Nullable UUID getId();
    UUID getBillingId();
    BigDecimal getAmount();
    PaymentMethod getPaymentMethod();
    @Nullable String getReference();
    OffsetDateTime getPaidAt();
    @Nullable String getNotes();
}
