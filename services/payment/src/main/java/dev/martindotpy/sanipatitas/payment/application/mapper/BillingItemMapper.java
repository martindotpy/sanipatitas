package dev.martindotpy.sanipatitas.payment.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingItemDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.BillingItem;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingItemPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface BillingItemMapper {
    @ObjectFactory
    default BillingItem.BillingItemBuilder<?, ?> createBillingItem() {
        return BillingItem.builder();
    }

    BillingItemDto toDto(BillingItem item);

    @Mapping(target = "total", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    BillingItem.BillingItemBuilder<?, ?> from(CreateBillingItemPayload payload);
}
