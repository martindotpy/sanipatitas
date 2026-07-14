package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import io.smallrye.mutiny.Uni;

public interface FindBillingItemPort {
    Uni<List<BillingItemDto>> findByBillingId(UUID billingId);
}
