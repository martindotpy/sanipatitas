package dev.martindotpy.sanipatitas.patient.adapter.controller;

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

import dev.martindotpy.sanipatitas.patient.adapter.request.CreatePatientRequest;
import dev.martindotpy.sanipatitas.patient.adapter.request.UpdatePatientRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.CreatePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.application.port.DeletePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.application.port.FindPatientPort;
import dev.martindotpy.sanipatitas.shared.patient.application.port.UpdatePatientPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/patient")
@RequiredArgsConstructor
public class PatientController {
    private final FindPatientPort findPatientPort;
    private final CreatePatientPort createPatientPort;
    private final DeletePatientPort deletePatientPort;
    private final UpdatePatientPort updatePatientPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<PatientDto>> search(
            @RestQuery @Nullable String search,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findPatientPort.search(search, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Pacientes encontrados exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<PatientDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findPatientPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Paciente encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<PatientDto>> create(CreatePatientRequest request) {
        return createPatientPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Paciente creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "worker"})
    public Uni<DataResponse<PatientDto>> update(
            @Uuid @RestPath UUID id, UpdatePatientRequest request) {
        return updatePatientPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Paciente actualizado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deletePatientPort.deleteById(id);
    }
}
