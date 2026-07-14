package dev.martindotpy.sanipatitas.inventory.application.usecase.supplier;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.SupplierMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.SupplierNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateSupplierPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateSupplierUseCase implements UpdateSupplierPort {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public Uni<SupplierDto> update(UUID id, UpdateSupplierPayload payload) {
        return supplierRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SupplierNotFoundException(id))
                .map(_ -> supplierMapper.from(id, payload).build())
                .chain(supplierRepository::update)
                .map(supplierMapper::toDto);
    }
}
