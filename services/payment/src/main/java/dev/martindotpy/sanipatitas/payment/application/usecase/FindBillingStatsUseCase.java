package dev.martindotpy.sanipatitas.payment.application.usecase;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingStatsDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingStatsPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.Payment;
import dev.martindotpy.sanipatitas.shared.payment.domain.entity.PaymentStatus;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.PaymentRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindBillingStatsUseCase implements FindBillingStatsPort {
    private final BillingRepository billingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Uni<BillingStatsDto> getStats() {
        var now = OffsetDateTime.now(ZoneOffset.ofHours(-5));
        var todayStart = now.with(LocalTime.MIN);
        var todayEnd = now.with(LocalTime.MAX);
        var monthStart = now.withDayOfMonth(1).with(LocalTime.MIN);

        // Execute count queries sequentially to avoid Hibernate Reactive session state issues
        return billingRepository.count()
                .chain(totalBillings -> billingRepository
                        .count("paymentStatus = ?1", PaymentStatus.PAID)
                        .chain(totalPaid -> billingRepository
                                .count("paymentStatus in (?1, ?2)",
                                        PaymentStatus.PENDING, PaymentStatus.PARTIAL)
                                .chain(totalPending -> billingRepository
                                        .count("createdAt >= ?1 and createdAt <= ?2", todayStart, todayEnd)
                                        .chain(billingToday -> paymentRepository
                                                .find("paidAt >= ?1 and paidAt <= ?2", todayStart, todayEnd)
                                                .list()
                                                .chain(paymentsToday -> paymentRepository
                                                        .find("paidAt >= ?1 and paidAt <= ?2", monthStart, todayEnd)
                                                        .list()
                                                        .map(paymentsMonth -> {
                                                            var revenueToday = sumAmounts(paymentsToday);
                                                            var revenueThisMonth = sumAmounts(paymentsMonth);

                                                            return BillingStatsDto.builder()
                                                                    .totalBillings(totalBillings)
                                                                    .totalPaid(totalPaid)
                                                                    .totalPending(totalPending)
                                                                    .billingToday(billingToday)
                                                                    .totalRevenueToday(revenueToday.longValue())
                                                                    .totalRevenueThisMonth(revenueThisMonth.longValue())
                                                                    .build();
                                                        }))))));
    }

    private BigDecimal sumAmounts(List<? extends Payment> payments) {
        return payments.stream()
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
