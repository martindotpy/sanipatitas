package dev.martindotpy.sanipatitas.inventory.application.usecase.product;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.ProductMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateProductPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.ProductCategory;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Supplier;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductCategoryNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.SupplierNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateProductUseCase implements UpdateProductPort {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;

    @Override
    public Uni<ProductDto> update(UUID id, UpdateProductPayload payload) {
        var categoryId = payload.getCategoryId();
        var supplierId = payload.getSupplierId();

        return productRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProductNotFoundException(id))
                .chain(_ -> resolveCategory(categoryId)
                        .chain(category -> resolveSupplier(supplierId)
                                .map(supplier -> {
                                    @SuppressWarnings("null")
                                    var product = productMapper.from(id, payload)
                                            .category(category).supplier(supplier).build();
                                    return product;
                                })))
                .chain(productRepository::update)
                .map(productMapper::toDto);
    }

    private Uni<ProductCategory> resolveCategory(UUID categoryId) {
        if (categoryId == null) {
            return Uni.createFrom().nullItem();
        }
        return productCategoryRepository.findById(categoryId)
                .onItem().ifNull().failWith(() -> new ProductCategoryNotFoundException(categoryId));
    }

    private Uni<Supplier> resolveSupplier(UUID supplierId) {
        if (supplierId == null) {
            return Uni.createFrom().nullItem();
        }
        return supplierRepository.findById(supplierId)
                .onItem().ifNull().failWith(() -> new SupplierNotFoundException(supplierId));
    }
}
