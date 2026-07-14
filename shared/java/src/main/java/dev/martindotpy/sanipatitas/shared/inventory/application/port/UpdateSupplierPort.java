package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateSupplierPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateSupplierPort {
    Uni<SupplierDto> update(UUID id, UpdateSupplierPayload payload);
}
