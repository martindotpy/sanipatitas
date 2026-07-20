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

import dev.martindotpy.sanipatitas.ehr.adapter.request.CreateProcedureRequest;
import dev.martindotpy.sanipatitas.ehr.adapter.request.UpdateProcedureRequest;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.CreateProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.DeleteProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.FindProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.UpdateProcedurePort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/clinical/procedure")
@RequiredArgsConstructor
public class ProcedureController {
    private final FindProcedurePort findProcedurePort;
    private final CreateProcedurePort createProcedurePort;
    private final DeleteProcedurePort deleteProcedurePort;
    private final UpdateProcedurePort updateProcedurePort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<ProcedureDto>> findByPatientId(
            @RestQuery @Uuid UUID patientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findProcedurePort.findByPatientId(patientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Procedimientos encontrados exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<ProcedureDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findProcedurePort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Procedimiento encontrado exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProcedureDto>> create(@Valid @NotNull CreateProcedureRequest request) {
        return createProcedurePort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Procedimiento creado exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<ProcedureDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateProcedureRequest request) {
        return updateProcedurePort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Procedimiento actualizado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteProcedurePort.deleteById(id);
    }
}
