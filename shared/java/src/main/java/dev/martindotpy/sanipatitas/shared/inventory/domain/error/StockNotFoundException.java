package dev.martindotpy.sanipatitas.shared.inventory.domain.error;

import java.util.UUID;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class StockNotFoundException extends HttpProblem {
    public StockNotFoundException(UUID stockId) {
        super(builder()
                .withTitle("Stock no encontrado")
                .withStatus(Response.Status.NOT_FOUND)
                .withDetail("El stock con ID %s no existe".formatted(stockId))
                .with("stockId", stockId));
    }
}
