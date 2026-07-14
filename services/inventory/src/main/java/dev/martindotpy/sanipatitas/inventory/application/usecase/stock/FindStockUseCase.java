package dev.martindotpy.sanipatitas.inventory.application.usecase.stock;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.StockMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindStockPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.StockNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public class FindStockUseCase implements FindStockPort {
    private final StockRepository stockRepository;
    private final StockMapper stockMapper;

    @Override
    public Uni<StockDto> findByProductId(UUID productId) {
        return stockRepository.findByProductId(productId)
                .onItem().ifNull().failWith(() -> new StockNotFoundException(productId))
                .map(stockMapper::toDto);
    }

    @Override
    public Uni<StockDto> findById(UUID id) {
        return stockRepository.findById(id)
                .onItem().ifNull().failWith(() -> new StockNotFoundException(id))
                .map(stockMapper::toDto);
    }
}
