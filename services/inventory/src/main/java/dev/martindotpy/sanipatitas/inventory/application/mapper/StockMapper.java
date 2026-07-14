package dev.martindotpy.sanipatitas.inventory.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Stock;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateStockPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface StockMapper {
    @ObjectFactory
    default Stock.StockBuilder<?, ?> createStock() {
        return Stock.builder();
    }

    StockDto toDto(Stock stock);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Stock.StockBuilder<?, ?> from(CreateStockPayload payload);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Stock.StockBuilder<?, ?> from(UUID id, UpdateStockPayload payload);
}
