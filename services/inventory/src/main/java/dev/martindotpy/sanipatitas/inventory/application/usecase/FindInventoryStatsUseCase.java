package dev.martindotpy.sanipatitas.inventory.application.usecase;

import java.math.BigDecimal;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.InventoryStatsDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindInventoryStatsPort;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Stock;
import dev.martindotpy.sanipatitas.shared.inventory.domain.entity.Stock;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductCategoryRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.ProductRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.StockRepository;
import dev.martindotpy.sanipatitas.shared.inventory.domain.repository.SupplierRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindInventoryStatsUseCase implements FindInventoryStatsPort {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final SupplierRepository supplierRepository;
    private final StockRepository stockRepository;

    @Override
    public Uni<InventoryStatsDto> getStats() {
        Uni<Long> totalProducts = productRepository.count();
        Uni<Long> totalCategories = productCategoryRepository.count();
        Uni<Long> totalSuppliers = supplierRepository.count();

        // Single fetch of all stocks — derived calculations inline to avoid 3x queries
        return stockRepository.findAll().list()
                .flatMap(stocks -> {
                    long lowStockCount = stocks.stream()
                            .filter(s -> s.getMinStock() != null && s.getQuantity() <= s.getMinStock())
                            .count();

                    BigDecimal totalValue = stocks.stream()
                            .map(s -> {
                                var price = s.getProduct().getPrice();
                                if (price == null) return BigDecimal.ZERO;
                                return price.multiply(BigDecimal.valueOf(s.getQuantity()));
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    long totalQuantity = stocks.stream()
                            .mapToLong(s -> (long) s.getQuantity())
                            .sum();

                    return Uni.combine().all()
                            .unis(totalProducts, totalCategories, totalSuppliers)
                            .with((tp, tc, ts) -> InventoryStatsDto.builder()
                                    .totalProducts(tp)
                                    .totalCategories(tc)
                                    .totalSuppliers(ts)
                                    .lowStockCount(lowStockCount)
                                    .totalStockValue(totalValue.longValue())
                                    .totalStockQuantity(totalQuantity)
                                    .build());
                });
    }
}
