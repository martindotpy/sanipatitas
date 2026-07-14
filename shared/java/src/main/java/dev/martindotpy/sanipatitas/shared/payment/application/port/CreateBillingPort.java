package dev.martindotpy.sanipatitas.shared.payment.application.port;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingPayload;
import io.smallrye.mutiny.Uni;

public interface CreateBillingPort {
    Uni<BillingDto> create(CreateBillingPayload payload);
}
