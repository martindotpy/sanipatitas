package dev.martindotpy.sanipatitas.shared.client.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.UpdateClientPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateClientPort {
    Uni<ClientDto> update(UUID id, UpdateClientPayload payload);
}
