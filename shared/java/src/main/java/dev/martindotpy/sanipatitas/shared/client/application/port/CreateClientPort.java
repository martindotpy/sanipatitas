package dev.martindotpy.sanipatitas.shared.client.application.port;

import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.CreateClientPayload;
import io.smallrye.mutiny.Uni;

public interface CreateClientPort {
    Uni<ClientDto> create(CreateClientPayload payload);
}
