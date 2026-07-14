package dev.martindotpy.sanipatitas.shared.inventory.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.ProductCategoryDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindProductCategoryPort {
    Uni<PageResult<ProductCategoryDto>> findAll(int page, int size);
    Uni<ProductCategoryDto> findById(UUID id);
}
