package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ProductCategoryNotFoundException extends HttpProblem {
    public ProductCategoryNotFoundException(UUID categoryId) {
        super(builder()
                .withTitle("Categoria no encontrada")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("La categoria con ID %s no existe".formatted(categoryId))
                .with("categoryId", categoryId));
    }
}
