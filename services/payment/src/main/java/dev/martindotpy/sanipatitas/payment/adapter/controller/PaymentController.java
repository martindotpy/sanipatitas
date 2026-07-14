package dev.martindotpy.sanipatitas.payment.adapter.controller;

import java.util.List;
import java.util.UUID;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import org.jboss.resteasy.reactive.RestPath;

import dev.martindotpy.sanipatitas.payment.adapter.request.CreatePaymentRequest;
import dev.martindotpy.sanipatitas.shared.core.adapter.response.DataResponse;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreatePaymentPort;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindPaymentPort;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@Path("/api/billing")
@RequiredArgsConstructor
public class PaymentController {
    private final FindPaymentPort findPaymentPort;
    private final CreatePaymentPort createPaymentPort;

    @GET
    @Path("/{billingId}/payment")
    @RolesAllowed({"admin", "veterinarian", "worker"})
    public Uni<DataResponse<List<PaymentDto>>> listPayments(@Uuid @RestPath UUID billingId) {
        return findPaymentPort.findByBillingId(billingId)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Pagos encontrados exitosamente")
                        .build());
    }

    @POST
    @Path("/{billingId}/payment")
    @RolesAllowed({"admin", "veterinarian"})
    public Uni<DataResponse<PaymentDto>> createPayment(
            @Uuid @RestPath UUID billingId, CreatePaymentRequest request) {
        return createPaymentPort.create(billingId, request)
                .map(DataResponse::from)
                .map(response -> response
                        .message("Pago registrado exitosamente")
                        .build());
    }
}
