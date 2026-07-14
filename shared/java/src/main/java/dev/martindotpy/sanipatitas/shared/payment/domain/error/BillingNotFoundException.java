package dev.martindotpy.sanipatitas.shared.payment.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class BillingNotFoundException extends HttpProblem {
    public BillingNotFoundException(UUID billingId) {
        super(builder()
                .withTitle("Factura no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La factura con ID %s no existe".formatted(billingId))
                .with("billingId", billingId));
    }
}
