package dev.martindotpy.sanipatitas.inventory.application.usecase.product_category;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.ProductCategoryMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindProductCategoryPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductCategoryNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindProductCategoryUseCase implements FindProductCategoryPort {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;

    @Override
    public Uni<PageResult<ProductCategoryDto>> findAll(int page, int size) {
        var query = productCategoryRepository.findAll().page(page, size).list();
        var count = productCategoryRepository.count();
        return Uni.combine().all().unis(query, count)
                .with((categories, total) -> PageResult.from(page, size, total,
                        categories.stream().map(productCategoryMapper::toDto).toList()));
    }

    @Override
    public Uni<ProductCategoryDto> findById(UUID id) {
        return productCategoryRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductCategoryNotFoundException(id))
                .map(productCategoryMapper::toDto);
    }
}
