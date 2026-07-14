package dev.martindotpy.sanipatitas.inventory.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Product;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateProductPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateProductPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface ProductMapper {
    @ObjectFactory
    default Product.ProductBuilder<?, ?> createProduct() {
        return Product.builder();
    }

    ProductDto toDto(Product product);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product.ProductBuilder<?, ?> from(CreateProductPayload payload);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product.ProductBuilder<?, ?> from(UUID id, UpdateProductPayload payload);
}
