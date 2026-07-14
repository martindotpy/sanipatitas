package dev.martindotpy.sanipatitas.shared.payment.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.payment.application.dto.BillingDto;
import io.smallrye.mutiny.Uni;

public interface FindBillingPort {
    Uni<PageResult<BillingDto>> findAll(int page, int size);
    Uni<BillingDto> findById(UUID id);
    Uni<BillingDto> findByAppointmentId(UUID appointmentId);
    Uni<PageResult<BillingDto>> findByClientId(UUID clientId, int page, int size);
}
