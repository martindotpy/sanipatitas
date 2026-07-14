package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class SupplierNotFoundException extends HttpProblem {
    public SupplierNotFoundException(UUID supplierId) {
        super(builder()
                .withTitle("Proveedor no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El proveedor con ID %s no existe".formatted(supplierId))
                .with("supplierId", supplierId));
    }
}
