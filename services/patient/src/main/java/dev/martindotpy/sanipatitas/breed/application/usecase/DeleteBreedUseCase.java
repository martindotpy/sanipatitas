package dev.martindotpy.sanipatitas.breed.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.breed.application.port.DeleteBreedPort;
import dev.martindotpy.sanipatitas.shared.breed.domain.error.BreedNotFoundException;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteBreedUseCase implements DeleteBreedPort {
    private final BreedRepository breedRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return breedRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BreedNotFoundException(id))
                .call(breedRepository::delete)
                .replaceWithVoid();
    }
}
