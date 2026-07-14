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

import dev.martindotpy.sanipatitas.ehr.adapter.request.CreatePrescriptionRequest;
import dev.martindotpy.sanipatitas.ehr.adapter.request.UpdatePrescriptionRequest;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.CreatePrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.DeletePrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.FindPrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.UpdatePrescriptionPort;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/clinical/prescription")
@RequiredArgsConstructor
public class PrescriptionController {
    private final FindPrescriptionPort findPrescriptionPort;
    private final CreatePrescriptionPort createPrescriptionPort;
    private final DeletePrescriptionPort deletePrescriptionPort;
    private final UpdatePrescriptionPort updatePrescriptionPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<PrescriptionDto>> findByPatientId(
            @RestQuery @Uuid UUID patientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findPrescriptionPort.findByPatientId(patientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Recetas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<PrescriptionDto>> getById(
            @Uuid @RestPath UUID id) throws NotFoundException {
        return findPrescriptionPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Receta encontrada exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<PrescriptionDto>> create(CreatePrescriptionRequest request) {
        return createPrescriptionPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Receta creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<PrescriptionDto>> update(
            @Uuid @RestPath UUID id, UpdatePrescriptionRequest request) {
        return updatePrescriptionPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Receta actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deletePrescriptionPort.deleteById(id);
    }
}
