package dev.martindotpy.sanipatitas.inventory.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.StockMovement;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockMovementPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface StockMovementMapper {
    @ObjectFactory
    default StockMovement.StockMovementBuilder<?, ?> createStockMovement() {
        return StockMovement.builder();
    }

    StockMovementDto toDto(StockMovement movement);

    @Mapping(target = "stock", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    StockMovement.StockMovementBuilder<?, ?> from(CreateStockMovementPayload payload);
}
