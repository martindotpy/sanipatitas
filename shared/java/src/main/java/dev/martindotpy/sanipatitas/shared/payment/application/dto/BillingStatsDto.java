package dev.martindotpy.sanipatitas.shared.payment.application.dto;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BillingStatsDto {
    @NotNull
    private final long totalBillings;
    @NotNull
    private final long totalPaid;
    @NotNull
    private final long totalPending;
    @NotNull
    private final long billingToday;
    @NotNull
    private final long totalRevenueToday;
    @NotNull
    private final long totalRevenueThisMonth;
}
