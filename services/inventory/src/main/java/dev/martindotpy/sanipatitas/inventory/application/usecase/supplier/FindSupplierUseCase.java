package dev.martindotpy.sanipatitas.inventory.application.usecase.supplier;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.SupplierMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.SupplierNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindSupplierUseCase implements FindSupplierPort {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public Uni<PageResult<SupplierDto>> findAll(int page, int size) {
        var query = supplierRepository.findAll().page(page, size).list();
        var count = supplierRepository.count();
        return Uni.combine().all().unis(query, count)
                .with((suppliers, total) -> PageResult.from(page, size, total,
                        suppliers.stream().map(supplierMapper::toDto).toList()));
    }

    @Override
    public Uni<SupplierDto> findById(UUID id) {
        return supplierRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SupplierNotFoundException(id))
                .map(supplierMapper::toDto);
    }
}
