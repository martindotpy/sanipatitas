package dev.martindotpy.sanipatitas.payment.adapter.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBillingRequest implements CreateBillingPayload {
    @Nullable private UUID id;

    @NotNull private UUID clientId;

    @Nullable private UUID appointmentId;

    @NotNull private BigDecimal subtotal;

    @NotNull private BigDecimal discount;

    @NotNull private BigDecimal taxAmount;

    @NotNull private BigDecimal totalAmount;

    @Nullable
    @Size(max = 500)
    private String notes;
}
