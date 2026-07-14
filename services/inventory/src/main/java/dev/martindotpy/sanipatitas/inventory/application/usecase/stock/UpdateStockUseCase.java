package dev.martindotpy.sanipatitas.inventory.application.usecase.stock;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.StockMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.UpdateStockPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.StockNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.UpdateStockPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateStockUseCase implements UpdateStockPort {
    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final StockMapper stockMapper;

    @Override
    public Uni<StockDto> update(UUID id, UpdateStockPayload payload) {
        return stockRepository.findById(id)
                .onItem().ifNull().failWith(() -> new StockNotFoundException(id))
                .chain(_ -> productRepository.findById(payload.getProductId())
                        .onItem().ifNull().failWith(() -> new ProductNotFoundException(payload.getProductId())))
                .map(product -> {
                    @SuppressWarnings("null")
                    var stock = stockMapper.from(id, payload).product(product).build();
                    return stock;
                })
                .chain(stockRepository::update)
                .map(stockMapper::toDto);
    }
}
