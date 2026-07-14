package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateSupplierPayload;
import io.smallrye.mutiny.Uni;

public interface CreateSupplierPort {
    Uni<SupplierDto> create(CreateSupplierPayload payload);
}
