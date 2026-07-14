package dev.martindotpy.sanipatitas.inventory.application.usecase.product;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteProductUseCase implements DeleteProductPort {
    private final ProductRepository productRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return productRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductNotFoundException(id))
                .call(productRepository::delete)
                .replaceWithVoid();
    }
}
