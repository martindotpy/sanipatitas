package dev.martindotpy.sanipatitas.shared.payment.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class BillingItemNotFoundException extends HttpProblem {
    public BillingItemNotFoundException(UUID billingItemId) {
        super(builder()
                .withTitle("Item no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El item con ID %s no existe".formatted(billingItemId))
                .with("billingItemId", billingItemId));
    }
}
