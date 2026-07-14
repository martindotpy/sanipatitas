package dev.martindotpy.sanipatitas.appointment.adapter.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentStatsDto;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.FindAppointmentStatsPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/appointment/stats")
@RequiredArgsConstructor
public class AppointmentStatsController {
    private final FindAppointmentStatsPort findAppointmentStatsPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<AppointmentStatsDto>> getStats() {
        return findAppointmentStatsPort.getStats()
                .map(DataResponse::from)
                .map(response -> response
                        .message("Estadísticas obtenidas exitosamente")
                        .build());
    }
}
