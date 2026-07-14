package dev.martindotpy.sanipatitas.inventory.application.usecase.product_category;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.ProductCategoryMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductCategoryPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateProductCategoryUseCase implements CreateProductCategoryPort {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;

    @Override
    public Uni<ProductCategoryDto> create(CreateProductCategoryPayload payload) {
        var category = productCategoryMapper.from(payload).build();
        return productCategoryRepository.persist(category)
                .map(productCategoryMapper::toDto);
    }
}
