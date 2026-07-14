package dev.martindotpy.sanipatitas.payment.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.Billing;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreateBillingPayload;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.UpdateBillingPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface BillingMapper {
    @ObjectFactory
    default Billing.BillingBuilder<?, ?> createBilling() {
        return Billing.builder();
    }

    BillingDto toDto(Billing billing);

    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Billing.BillingBuilder<?, ?> from(CreateBillingPayload payload);

    @Mapping(target = "clientId", ignore = true)
    @Mapping(target = "appointmentId", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Billing.BillingBuilder<?, ?> from(UUID id, UpdateBillingPayload payload);
}
