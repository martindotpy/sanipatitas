package dev.martindotpy.sanipatitas.inventory.application.usecase.product;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductHasAssociatedDataException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteProductUseCase implements DeleteProductPort {
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return productRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductNotFoundException(id))
                .chain(product -> stockRepository.count("product.id", id)
                        .chain(stockCount -> {
                            if (stockCount > 0) {
                                return Uni.createFrom().failure(new ProductHasAssociatedDataException(id));
                            }
                            return productRepository.delete(product).replaceWithVoid();
                        }));
    }
}
