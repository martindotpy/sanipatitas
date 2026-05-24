package dev.martindotpy.sanipatitas.client.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.client.application.port.DeleteClientPort;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteClientUseCase implements DeleteClientPort {
    private final ClientRepository clientRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return clientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(id))
                .call(clientRepository::delete)
                .replaceWithVoid();
    }
}
