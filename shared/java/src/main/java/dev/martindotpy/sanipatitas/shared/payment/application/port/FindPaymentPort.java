package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import io.smallrye.mutiny.Uni;

public interface FindPaymentPort {
    Uni<List<PaymentDto>> findByBillingId(UUID billingId);
}
