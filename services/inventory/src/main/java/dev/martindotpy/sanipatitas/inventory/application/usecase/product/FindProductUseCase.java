package dev.martindotpy.sanipatitas.inventory.application.usecase.product;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.ProductMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindProductUseCase implements FindProductPort {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public Uni<PageResult<ProductDto>> findAll(int page, int size) {
        var query = productRepository.findAll().page(page, size).list();
        var count = productRepository.count();
        return Uni.combine().all().unis(query, count)
                .with((products, total) -> PageResult.from(page, size, total,
                        products.stream().map(productMapper::toDto).toList()));
    }

    @Override
    public Uni<ProductDto> findById(UUID id) {
        return productRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductNotFoundException(id))
                .map(productMapper::toDto);
    }
}
