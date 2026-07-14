package dev.martindotpy.sanipatitas.payment.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.Payment;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreatePaymentPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface PaymentMapper {
    @ObjectFactory
    default Payment.PaymentBuilder<?, ?> createPayment() {
        return Payment.builder();
    }

    PaymentDto toDto(Payment payment);

    @Mapping(target = "createdAt", ignore = true)
    Payment.PaymentBuilder<?, ?> from(CreatePaymentPayload payload);
}
