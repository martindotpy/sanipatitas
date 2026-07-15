package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class SupplierHasAssociatedDataException extends HttpProblem {
    public SupplierHasAssociatedDataException(UUID supplierId) {
        super(builder()
                .withTitle("Proveedor tiene productos asociados")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("No se puede eliminar el proveedor porque tiene productos asociados. " +
                        "Elimine o reasigne los productos antes de eliminar el proveedor.")
                .with("supplierId", supplierId));
    }
}
