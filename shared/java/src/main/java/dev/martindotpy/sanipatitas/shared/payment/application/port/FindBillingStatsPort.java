package dev.martindotpy.sanipatitas.shared.payment.application.port;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingStatsDto;
import io.smallrye.mutiny.Uni;

public interface FindBillingStatsPort {
    Uni<BillingStatsDto> getStats();
}
