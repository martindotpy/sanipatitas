package dev.martindotpy.sanipatitas.payment.adapter.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItemType;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingItemPayload;
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
public class CreateBillingItemRequest implements CreateBillingItemPayload {
    @Nullable private UUID id;

    @NotNull private UUID billingId;

    @NotBlank
    @Size(max = 255)
    private String description;

    private int quantity;

    @NotNull private BigDecimal unitPrice;

    @NotNull private BillingItemType itemType;

    @Nullable private UUID referenceId;
}
