package dev.martindotpy.sanipatitas.inventory.application.usecase.product_category;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.ProductCategoryMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductCategoryNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductCategoryPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateProductCategoryUseCase implements UpdateProductCategoryPort {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;

    @Override
    public Uni<ProductCategoryDto> update(UUID id, UpdateProductCategoryPayload payload) {
        return productCategoryRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductCategoryNotFoundException(id))
                .map(_ -> productCategoryMapper.from(id, payload).build())
                .chain(productCategoryRepository::update)
                .map(productCategoryMapper::toDto);
    }
}
