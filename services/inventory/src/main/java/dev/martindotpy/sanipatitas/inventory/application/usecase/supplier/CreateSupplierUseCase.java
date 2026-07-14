package dev.martindotpy.sanipatitas.inventory.application.usecase.supplier;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.SupplierMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.SupplierDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateSupplierPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateSupplierUseCase implements CreateSupplierPort {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public Uni<SupplierDto> create(CreateSupplierPayload payload) {
        var supplier = supplierMapper.from(payload).build();
        return supplierRepository.persist(supplier)
                .map(supplierMapper::toDto);
    }
}
