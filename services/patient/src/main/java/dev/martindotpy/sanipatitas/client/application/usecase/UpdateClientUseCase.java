package dev.martindotpy.sanipatitas.client.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.client.application.mapper.ClientMapper;
import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.application.port.UpdateClientPort;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.UpdateClientPayload;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateClientUseCase implements UpdateClientPort {
    private final ClientRepository clientRepository;

    private final ClientMapper clientMapper;

    @Override
    public Uni<ClientDto> update(UUID id, UpdateClientPayload payload) {
        var newClient = clientMapper.from(id, payload)
                .build();

        return clientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(id))
                .replaceWith(clientRepository.update(newClient))
                .map(clientMapper::toDto);
    }
}
