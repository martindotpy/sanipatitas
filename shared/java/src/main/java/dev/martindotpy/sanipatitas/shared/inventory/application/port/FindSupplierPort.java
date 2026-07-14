package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindSupplierPort {
    Uni<PageResult<SupplierDto>> findAll(int page, int size);
    Uni<SupplierDto> findById(UUID id);
}
