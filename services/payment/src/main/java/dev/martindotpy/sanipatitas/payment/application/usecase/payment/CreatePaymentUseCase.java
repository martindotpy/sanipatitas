package dev.martindotpy.sanipatitas.payment.application.usecase.payment;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.PaymentMapper;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.PaymentDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.CreatePaymentPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentStatus;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.payload.CreatePaymentPayload;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.PaymentRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreatePaymentUseCase implements CreatePaymentPort {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final BillingRepository billingRepository;

    @Override
    public Uni<PaymentDto> create(UUID billingId, CreatePaymentPayload payload) {
        return billingRepository.findById(billingId)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(billingId))
                .chain(billing -> {
                    var paidAt = payload.getPaidAt() != null ? payload.getPaidAt() : OffsetDateTime.now();
                    var payment = paymentMapper.from(payload)
                            .billingId(billingId)
                            .paidAt(paidAt)
                            .build();
                    return paymentRepository.persist(payment)
                            .chain(persisted -> paymentRepository.list("billingId", billingId)
                                    .map(allPayments -> {
                                        var totalPaid = allPayments.stream()
                                                .map(p -> p.getAmount())
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                                        if (totalPaid.compareTo(billing.getTotalAmount()) >= 0) {
                                            billing.setPaymentStatus(PaymentStatus.PAID);
                                        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
                                            billing.setPaymentStatus(PaymentStatus.PARTIAL);
                                        }
                                        return billing;
                                    })
                                    .chain(billingRepository::update)
                                    .map(_ -> paymentMapper.toDto(persisted)));
                });
    }
}
