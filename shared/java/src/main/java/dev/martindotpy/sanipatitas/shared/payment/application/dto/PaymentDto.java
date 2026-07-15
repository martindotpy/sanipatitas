package dev.martindotpy.sanipatitas.shared.payment.application.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PaymentDto {
    @NotNull private final UUID id;
    @NotNull private final UUID billingId;
    @NotNull private final BigDecimal amount;
    @NotNull private final PaymentMethod paymentMethod;
    @Nullable private final String reference;
    @NotNull private final OffsetDateTime paidAt;
    @Nullable private final String notes;
    @NotNull private final OffsetDateTime createdAt;
}
