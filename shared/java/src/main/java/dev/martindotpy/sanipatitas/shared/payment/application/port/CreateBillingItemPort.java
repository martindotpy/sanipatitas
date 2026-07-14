package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingItemPayload;
import io.smallrye.mutiny.Uni;

public interface CreateBillingItemPort {
    Uni<BillingItemDto> create(UUID billingId, CreateBillingItemPayload payload);
}
