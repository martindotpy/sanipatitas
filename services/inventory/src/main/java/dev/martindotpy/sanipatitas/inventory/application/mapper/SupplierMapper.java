package dev.martindotpy.sanipatitas.inventory.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Supplier;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateSupplierPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateSupplierPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface SupplierMapper {
    @ObjectFactory
    default Supplier.SupplierBuilder<?, ?> createSupplier() {
        return Supplier.builder();
    }

    SupplierDto toDto(Supplier supplier);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supplier.SupplierBuilder<?, ?> from(CreateSupplierPayload payload);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supplier.SupplierBuilder<?, ?> from(UUID id, UpdateSupplierPayload payload);
}
