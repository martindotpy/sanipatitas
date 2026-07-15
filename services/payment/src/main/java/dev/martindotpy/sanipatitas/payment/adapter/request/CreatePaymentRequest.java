package dev.martindotpy.sanipatitas.payment.adapter.request;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentMethod;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreatePaymentPayload;
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
public class CreatePaymentRequest implements CreatePaymentPayload {
    @Nullable private UUID id;

    @NotNull private UUID billingId;

    @NotNull private BigDecimal amount;

    @NotNull private PaymentMethod paymentMethod;

    @Nullable
    @Size(max = 255)
    private String reference;

    @Nullable private OffsetDateTime paidAt;

    @Nullable
    @Size(max = 500)
    private String notes;
}
