package dev.martindotpy.sanipatitas.payment.application.usecase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingStatsDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingStatsPort;
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
        var now = LocalDateTime.now();
        var todayStart = now.with(LocalTime.MIN);
        var todayEnd = now.with(LocalTime.MAX);
        var monthStart = now.withDayOfMonth(1).with(LocalTime.MIN);

        Uni<Long> totalBillings = billingRepository.count();
        Uni<Long> totalPaid = billingRepository.count("paymentStatus = ?1", PaymentStatus.PAID);
        Uni<Long> totalPending = billingRepository.count("paymentStatus in (?1, ?2)",
                PaymentStatus.PENDING, PaymentStatus.PARTIAL);
        Uni<Long> billingToday = billingRepository.count("createdAt >= ?1 and createdAt <= ?2", todayStart, todayEnd);

        // Fetch payments and calculate revenue in Java
        Uni<BigDecimal> revenueToday = paymentRepository
                .find("paidAt >= ?1 and paidAt <= ?2", todayStart, todayEnd)
                .list()
                .map(payments -> payments.stream()
                        .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add));

        Uni<BigDecimal> revenueThisMonth = paymentRepository
                .find("paidAt >= ?1 and paidAt <= ?2", monthStart, todayEnd)
                .list()
                .map(payments -> payments.stream()
                        .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add));

        return Uni.combine().all()
                .unis(totalBillings, totalPaid, totalPending, billingToday, revenueToday, revenueThisMonth)
                .with((tb, tpaid, tpend, bt, rtoday, rmonth) -> BillingStatsDto.builder()
                        .totalBillings(tb)
                        .totalPaid(tpaid)
                        .totalPending(tpend)
                        .billingToday(bt)
                        .totalRevenueToday(rtoday.longValue())
                        .totalRevenueThisMonth(rmonth.longValue())
                        .build());
    }
}
