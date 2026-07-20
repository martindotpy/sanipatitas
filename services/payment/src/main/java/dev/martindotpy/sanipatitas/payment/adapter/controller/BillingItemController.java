package dev.martindotpy.sanipatitas.payment.adapter.controller;

import java.util.List;
import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.ResponseStatus;
import org.jboss.resteasy.reactive.RestPath;

import dev.martindotpy.sanipatitas.payment.adapter.request.CreateBillingItemRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreateBillingItemPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.DeleteBillingItemPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingItemPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/billing")
@RequiredArgsConstructor
public class BillingItemController {
    private final FindBillingItemPort findBillingItemPort;
    private final CreateBillingItemPort createBillingItemPort;
    private final DeleteBillingItemPort deleteBillingItemPort;

    @GET
    @Path("/{billingId}/item")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<List<BillingItemDto>>> listItems(@Uuid @RestPath UUID billingId) {
        return findBillingItemPort.findByBillingId(billingId)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Items encontrados exitosamente")
                        .build());
    }

    @POST
    @Path("/{billingId}/item")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<BillingItemDto>> createItem(
            @Uuid @RestPath UUID billingId, @Valid @NotNull CreateBillingItemRequest request) {
        return createBillingItemPort.create(billingId, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Item creado exitosamente")
                        .build());
    }

    @DELETE
    @Path("/{billingId}/item/{itemId}")
    @ResponseStatus(204)
    @RolesAllowed({"admin"})
    public Uni<Void> deleteItem(
            @Uuid @RestPath UUID billingId, @Uuid @RestPath UUID itemId) {
        return deleteBillingItemPort.deleteById(itemId);
    }
}
