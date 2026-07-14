package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreatePaymentPayload;
import io.smallrye.mutiny.Uni;

public interface CreatePaymentPort {
    Uni<PaymentDto> create(UUID billingId, CreatePaymentPayload payload);
}
