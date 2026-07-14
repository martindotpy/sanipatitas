package dev.martindotpy.sanipatitas.payment.adapter.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingStatsDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingStatsPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/billing/stats")
@RequiredArgsConstructor
public class BillingStatsController {
    private final FindBillingStatsPort findBillingStatsPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<BillingStatsDto>> getStats() {
        return findBillingStatsPort.getStats()
                .map(DataResponse::from)
                .map(response -> response
                        .message("Estadísticas de facturación obtenidas exitosamente")
                        .build());
    }
}
