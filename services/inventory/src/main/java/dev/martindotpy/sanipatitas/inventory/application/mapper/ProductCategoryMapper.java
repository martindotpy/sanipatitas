package dev.martindotpy.sanipatitas.inventory.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.ProductCategory;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductCategoryPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductCategoryPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface ProductCategoryMapper {
    @ObjectFactory
    default ProductCategory.ProductCategoryBuilder<?, ?> createProductCategory() {
        return ProductCategory.builder();
    }

    ProductCategoryDto toDto(ProductCategory category);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductCategory.ProductCategoryBuilder<?, ?> from(CreateProductCategoryPayload payload);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductCategory.ProductCategoryBuilder<?, ?> from(UUID id, UpdateProductCategoryPayload payload);
}
