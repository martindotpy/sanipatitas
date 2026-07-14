package dev.martindotpy.sanipatitas.ehr.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.constraints.Min;
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

import dev.martindotpy.sanipatitas.ehr.adapter.request.CreateImmunizationRequest;
import dev.martindotpy.sanipatitas.ehr.adapter.request.UpdateImmunizationRequest;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.CreateImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.DeleteImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.FindImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.UpdateImmunizationPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/clinical/immunization")
@RequiredArgsConstructor
public class ImmunizationController {
    private final FindImmunizationPort findImmunizationPort;
    private final CreateImmunizationPort createImmunizationPort;
    private final DeleteImmunizationPort deleteImmunizationPort;
    private final UpdateImmunizationPort updateImmunizationPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<ImmunizationDto>> findByPatientId(
            @RestQuery @Uuid UUID patientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findImmunizationPort.findByPatientId(patientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Inmunizaciones encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<ImmunizationDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findImmunizationPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Inmunización encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ImmunizationDto>> create(CreateImmunizationRequest request) {
        return createImmunizationPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Inmunización creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ImmunizationDto>> update(
            @Uuid @RestPath UUID id, UpdateImmunizationRequest request) {
        return updateImmunizationPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Inmunización actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteImmunizationPort.deleteById(id);
    }
}
