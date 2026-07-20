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
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.ehr.adapter.request.CreateMedicalConditionRequest;
import dev.martindotpy.sanipatitas.ehr.adapter.request.UpdateMedicalConditionRequest;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.CreateMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.DeleteMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.FindMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.UpdateMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/clinical/condition")
@RequiredArgsConstructor
public class MedicalConditionController {
    private final FindMedicalConditionPort findMedicalConditionPort;
    private final CreateMedicalConditionPort createMedicalConditionPort;
    private final DeleteMedicalConditionPort deleteMedicalConditionPort;
    private final UpdateMedicalConditionPort updateMedicalConditionPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<MedicalConditionDto>> findByPatientId(
            @RestQuery @Uuid UUID patientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findMedicalConditionPort.findByPatientId(patientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Condiciones médicas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<MedicalConditionDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findMedicalConditionPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Condición médica encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<MedicalConditionDto>> create(@Valid @NotNull CreateMedicalConditionRequest request) {
        return createMedicalConditionPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Condición médica creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<MedicalConditionDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateMedicalConditionRequest request) {
        return updateMedicalConditionPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Condición médica actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteMedicalConditionPort.deleteById(id);
    }
}
