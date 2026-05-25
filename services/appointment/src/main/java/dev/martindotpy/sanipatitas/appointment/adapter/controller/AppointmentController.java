package dev.martindotpy.sanipatitas.appointment.adapter.controller;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.appointment.adapter.request.CreateAppointmentRequest;
import dev.martindotpy.sanipatitas.appointment.adapter.request.UpdateAppointmentRequest;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.CreateAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.DeleteAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.FindAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.UpdateAppointmentPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final FindAppointmentPort findAppointmentPort;
    private final CreateAppointmentPort createAppointmentPort;
    private final DeleteAppointmentPort deleteAppointmentPort;
    private final UpdateAppointmentPort updateAppointmentPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<AppointmentDto>> findByDateRange(
            @RestQuery @Nullable LocalDate from,
            @RestQuery @Nullable LocalDate to,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findAppointmentPort.findByDateRange(from, to, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Citas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<AppointmentDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findAppointmentPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cita encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<AppointmentDto>> create(CreateAppointmentRequest request) {
        return createAppointmentPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cita creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<AppointmentDto>> update(
            @Uuid @RestPath UUID id, UpdateAppointmentRequest request) {
        return updateAppointmentPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Cita actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteAppointmentPort.deleteById(id);
    }
}
