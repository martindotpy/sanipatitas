package dev.martindotpy.sanipatitas.patient.adapter.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientStatsDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.FindPatientStatsPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/patient/stats")
@RequiredArgsConstructor
public class PatientStatsController {
    private final FindPatientStatsPort findPatientStatsPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<PatientStatsDto>> getStats() {
        return findPatientStatsPort.getStats()
                .map(DataResponse::from)
                .map(response -> response
                        .message("Estadísticas obtenidas exitosamente")
                        .build());
    }
}
