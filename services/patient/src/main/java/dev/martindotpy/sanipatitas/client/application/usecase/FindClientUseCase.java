package dev.martindotpy.sanipatitas.client.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.client.application.mapper.ClientMapper;
import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.application.port.FindClientPort;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindClientUseCase implements FindClientPort {
    private final ClientRepository clientRepository;

    private final ClientMapper clientMapper;

    @Override
    public Uni<PageResult<ClientDto>> search(String search, int page, int size) {
        var pagination = Page.of(page, size);
        var hasSearch = search != null && !search.isBlank();

        var clientQuery = hasSearch ? clientRepository.search(search, pagination)
                : clientRepository.findAll(pagination);
        var clientCountQuery = hasSearch ? clientRepository.countSearch(search) : clientRepository.count();

        return Uni.combine().all()
                .unis(clientQuery, clientCountQuery)
                .with((clients, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        clients.stream()
                                .map(clientMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<ClientDto> findById(UUID id) {
        return clientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(id))
                .map(clientMapper::toDto);
    }
}
