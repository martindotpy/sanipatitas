package dev.martindotpy.sanipatitas.inventory.application.usecase.supplier;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.port.DeleteSupplierPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.SupplierNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteSupplierUseCase implements DeleteSupplierPort {
    private final SupplierRepository supplierRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return supplierRepository.findById(id)
                .onItem().ifNull().failWith(() -> new SupplierNotFoundException(id))
                .call(supplierRepository::delete)
                .replaceWithVoid();
    }
}
