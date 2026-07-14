package dev.martindotpy.sanipatitas.inventory.application.usecase.stock;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.inventory.application.mapper.StockMapper;
import dev.martindotpy.sanipatitas.shared.inventory.application.dto.StockDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.CreateStockPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.error.ProductNotFoundException;
import dev.martindotpy.sanipatitas.shared.inventory.domain.payload.CreateStockPayload;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateStockUseCase implements CreateStockPort {
    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final StockMapper stockMapper;

    @Override
    public Uni<StockDto> create(CreateStockPayload payload) {
        return productRepository.findById(payload.getProductId())
                .onItem().ifNull().failWith(() -> new ProductNotFoundException(payload.getProductId()))
                .map(product -> {
                    @SuppressWarnings("null")
                    var stock = stockMapper.from(payload).product(product).build();
                    return stock;
                })
                .chain(stockRepository::persist)
                .map(stockMapper::toDto);
    }
}
