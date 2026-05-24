package dev.martindotpy.sanipatitas.client.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.client.application.mapper.ClientMapper;
import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.application.port.CreateClientPort;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.CreateClientPayload;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateClientUseCase implements CreateClientPort {
    private final ClientRepository clientRepository;

    private final ClientMapper clientMapper;

    @Override
    public Uni<ClientDto> create(CreateClientPayload payload) {
        var newClient = clientMapper.from(payload)
                .build();

        return clientRepository.persist(newClient)
                .map(clientMapper::toDto);
    }
}
