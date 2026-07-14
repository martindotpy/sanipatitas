package dev.martindotpy.sanipatitas.payment.application.usecase.billing;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.payment.application.mapper.BillingMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import dev.martindotpy.sanipatitas.shared.payment.application.port.FindBillingPort;
import dev.martindotpy.sanipatitas.shared.payment.domain.error.BillingNotFoundException;
import dev.martindotpy.sanipatitas.shared.payment.domain.repository.BillingRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindBillingUseCase implements FindBillingPort {
    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;

    @Override
    public Uni<PageResult<BillingDto>> findAll(int page, int size) {
        var query = billingRepository.findAll().page(page, size).list();
        var count = billingRepository.count();
        return Uni.combine().all().unis(query, count)
                .with((billings, total) -> PageResult.from(page, size, total,
                        billings.stream().map(billingMapper::toDto).toList()));
    }

    @Override
    public Uni<BillingDto> findById(UUID id) {
        return billingRepository.findById(id)
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(id))
                .map(billingMapper::toDto);
    }

    @Override
    public Uni<BillingDto> findByAppointmentId(UUID appointmentId) {
        return billingRepository.find("appointmentId", appointmentId).firstResult()
                .onItem().ifNull().failWith(() -> new BillingNotFoundException(appointmentId))
                .map(billingMapper::toDto);
    }

    @Override
    public Uni<PageResult<BillingDto>> findByClientId(UUID clientId, int page, int size) {
        var query = billingRepository.find("clientId", clientId).page(page, size).list();
        var count = billingRepository.count("clientId", clientId);
        return Uni.combine().all().unis(query, count)
                .with((billings, total) -> PageResult.from(page, size, total,
                        billings.stream().map(billingMapper::toDto).toList()));
    }
}
