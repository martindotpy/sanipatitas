package dev.martindotpy.sanipatitas.ehr.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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

import dev.martindotpy.sanipatitas.ehr.adapter.request.CreateMedicalObservationRequest;
import dev.martindotpy.sanipatitas.ehr.adapter.request.UpdateMedicalObservationRequest;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.CreateMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.DeleteMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.FindMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.UpdateMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/clinical/observation")
@RequiredArgsConstructor
public class MedicalObservationController {
    private final FindMedicalObservationPort findMedicalObservationPort;
    private final CreateMedicalObservationPort createMedicalObservationPort;
    private final DeleteMedicalObservationPort deleteMedicalObservationPort;
    private final UpdateMedicalObservationPort updateMedicalObservationPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<MedicalObservationDto>> findByPatientId(
            @RestQuery @Uuid UUID patientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findMedicalObservationPort.findByPatientId(patientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Observaciones medicas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<MedicalObservationDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findMedicalObservationPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Observacion medica encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<MedicalObservationDto>> create(@Valid @NotNull CreateMedicalObservationRequest request) {
        return createMedicalObservationPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Observacion medica creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<MedicalObservationDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateMedicalObservationRequest request) {
        return updateMedicalObservationPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Observacion medica actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteMedicalObservationPort.deleteById(id);
    }
}