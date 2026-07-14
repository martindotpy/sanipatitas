package dev.martindotpy.sanipatitas.payment.application.usecase.payment;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.PaymentMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindPaymentPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.PaymentRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindPaymentUseCase implements FindPaymentPort {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public Uni<List<PaymentDto>> findByBillingId(UUID billingId) {
        return paymentRepository.list("billingId", billingId)
                .map(payments -> payments.stream().map(paymentMapper::toDto).toList());
    }
}
