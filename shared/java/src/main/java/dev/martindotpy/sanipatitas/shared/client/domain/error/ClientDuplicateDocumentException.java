package dev.martindotpy.sanipatitas.shared.client.domain.error;

import jakarta.ws.rs.core.Response;

import io.quarkiverse.resteasy.problem.HttpProblem;

public class ClientDuplicateDocumentException extends HttpProblem {
    public ClientDuplicateDocumentException(String idNumber) {
        super(builder()
                .withTitle("Número de documento duplicado")
                .withStatus(Response.Status.CONFLICT)
                .withDetail("El número de documento " + idNumber
                        + " ya está registrado para otro cliente.")
                .with("idNumber", idNumber));
    }
}
