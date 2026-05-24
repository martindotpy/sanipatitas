package dev.martindotpy.sanipatitas.shared.client.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindClientPort {
    Uni<PageResult<ClientDto>> search(String search, int page, int size);

    Uni<ClientDto> findById(UUID id);
}
