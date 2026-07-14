package dev.martindotpy.sanipatitas.shared.payment.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BillingDto {
    @NotNull private final UUID id;
    @NotNull private final UUID clientId;
    @Nullable private final UUID appointmentId;
    @NotNull private final BigDecimal subtotal;
    @NotNull private final BigDecimal discount;
    @NotNull private final BigDecimal taxAmount;
    @NotNull private final BigDecimal totalAmount;
    @NotNull private final PaymentStatus paymentStatus;
    @Nullable private final String invoiceNumber;
    @Nullable private final String notes;
    @NotNull private final LocalDateTime createdAt;
    @NotNull private final LocalDateTime updatedAt;
}
