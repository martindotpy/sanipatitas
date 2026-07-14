package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.UpdateBillingPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateBillingPort {
    Uni<BillingDto> update(UUID id, UpdateBillingPayload payload);
}
