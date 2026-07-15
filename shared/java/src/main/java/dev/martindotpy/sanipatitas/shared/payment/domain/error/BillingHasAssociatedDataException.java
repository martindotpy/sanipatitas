package dev.martindotpy.sanipatitas.shared.payment.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class BillingHasAssociatedDataException extends HttpProblem {
    public BillingHasAssociatedDataException(UUID billingId) {
        super(builder()
                .withTitle("Factura tiene datos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar la factura porque tiene ítems o pagos asociados. " +
                        "Elimine primero los ítems y pagos antes de eliminar la factura.")
                .with("billingId", billingId));
    }
}
