package dev.martindotpy.sanipatitas.inventory.application.usecase.stock_movement;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.StockMovementMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockMovementDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindStockMovementPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockMovementRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindStockMovementUseCase implements FindStockMovementPort {
    private final StockMovementRepository stockMovementRepository;
    private final StockMovementMapper stockMovementMapper;

    @Override
    public Uni<PageResult<StockMovementDto>> findByStockId(UUID stockId, int page, int size) {
        var pagination = Page.of(page, size);
        var query = stockMovementRepository.findByStockId(stockId, pagination);
        var count = stockMovementRepository.countByStockId(stockId);
        return Uni.combine().all().unis(query, count)
                .with((movements, total) -> PageResult.from(page, size, total,
                        movements.stream().map(stockMovementMapper::toDto).toList()));
    }
}
