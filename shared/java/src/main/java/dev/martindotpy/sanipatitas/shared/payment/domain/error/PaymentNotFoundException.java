package dev.martindotpy.sanipatitas.shared.payment.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class PaymentNotFoundException extends HttpProblem {
    public PaymentNotFoundException(UUID paymentId) {
        super(builder()
                .withTitle("Pago no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El pago con ID %s no existe".formatted(paymentId))
                .with("paymentId", paymentId));
    }
}
