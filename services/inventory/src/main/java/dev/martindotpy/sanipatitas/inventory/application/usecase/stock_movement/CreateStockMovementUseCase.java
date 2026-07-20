package dev.martindotpy.sanipatitas.inventory.application.usecase.stock_movement;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.StockMovementMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateStockMovementPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.MovementType;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.StockNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockMovementPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockMovementRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateStockMovementUseCase implements CreateStockMovementPort {
    private final StockMovementRepository stockMovementRepository;
    private final StockRepository stockRepository;
    private final StockMovementMapper stockMovementMapper;

    @Override
    public Uni<StockMovementDto> create(CreateStockMovementPayload payload) {
        return stockRepository.findById(payload.getStockId())
                .onItem().ifNull().failWith(() -> new StockNotFoundException(payload.getStockId()))
                .chain(stock -> {
                    var movement = stockMovementMapper.from(payload)
                            .stock(stock)
                            .type(payload.getType())
                            .build();
                    var delta = switch (movement.getType()) {
                        case PURCHASE_ENTRY, RETURN -> movement.getQuantity();
                        case SALE_EXIT -> -movement.getQuantity();
                        case ADJUSTMENT -> movement.getQuantity();
                        case TRANSFER -> -movement.getQuantity();
                    };
                    stock.setQuantity(stock.getQuantity() + delta);
                    return stockRepository.update(stock)
                            .chain(_ -> stockMovementRepository.persist(movement));
                })
                .map(stockMovementMapper::toDto);
    }
}
