package dev.martindotpy.sanipatitas.shared.payment.application.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BillingItemDto {
    @NotNull private final UUID id;
    @NotNull private final UUID billingId;
    @NotNull private final String description;
    private final int quantity;
    @NotNull private final BigDecimal unitPrice;
    @NotNull private final BigDecimal total;
    @NotNull private final BillingItemType itemType;
    @Nullable private final UUID referenceId;
    @NotNull private final OffsetDateTime createdAt;
}
