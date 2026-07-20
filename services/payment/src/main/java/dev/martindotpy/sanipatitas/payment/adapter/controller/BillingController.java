package dev.martindotpy.sanipatitas.payment.adapter.controller;

import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import dev.martindotpy.sanipatitas.payment.adapter.request.CreateBillingRequest;
import dev.martindotpy.sanipatitas.payment.adapter.request.UpdateBillingRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.PageResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreateBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.DeleteBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.UpdateBillingPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/billing")
@RequiredArgsConstructor
public class BillingController {
    private final FindBillingPort findBillingPort;
    private final CreateBillingPort createBillingPort;
    private final UpdateBillingPort updateBillingPort;
    private final DeleteBillingPort deleteBillingPort;

    @GET
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<BillingDto>> findAll(
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findBillingPort.findAll(page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Facturas encontradas exitosamente")
                        .build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<BillingDto>> getById(@Uuid @RestPath UUID id) {
        return findBillingPort.findById(id)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Factura encontrada exitosamente")
                        .build());
    }

    @GET
    @Path("/by-appointment/{appointmentId}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<BillingDto>> getByAppointmentId(@Uuid @RestPath UUID appointmentId) {
        return findBillingPort.findByAppointmentId(appointmentId)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Factura encontrada exitosamente")
                        .build());
    }

    @GET
    @Path("/by-client/{clientId}")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<PageResponse<BillingDto>> getByClientId(
            @Uuid @RestPath UUID clientId,
            @RestQuery @DefaultValue("0") @Min(0) int page,
            @RestQuery @DefaultValue("20") @Min(1) int size) {
        return findBillingPort.findByClientId(clientId, page, size)
                .map(PageResponse::from)
                .map(response -> response
                        .message("Facturas del cliente encontradas exitosamente")
                        .build());
    }

    @POST
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<BillingDto>> create(@Valid @NotNull CreateBillingRequest request) {
        return createBillingPort.create(request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Factura creada exitosamente")
                        .build());
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<BillingDto>> update(
            @Uuid @RestPath UUID id, @Valid @NotNull UpdateBillingRequest request) {
        return updateBillingPort.update(id, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Factura actualizada exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{id}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> delete(@Uuid @RestPath UUID id) {
        return deleteBillingPort.deleteById(id);
    }
}
