package dev.martindotpy.sanipatitas.inventory.application.usecase.product_category;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductCategoryHasAssociatedDataException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductCategoryNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteProductCategoryUseCase implements DeleteProductCategoryPort {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return productCategoryRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductCategoryNotFoundException(id))
                .chain(category -> productRepository.count("category.id", id)
                        .chain(productCount -> {
                            if (productCount > 0) {
                                return Uni.createFrom().failure(new ProductCategoryHasAssociatedDataException(id));
                            }
                            return productCategoryRepository.delete(category).replaceWithVoid();
                        }));
    }
}
