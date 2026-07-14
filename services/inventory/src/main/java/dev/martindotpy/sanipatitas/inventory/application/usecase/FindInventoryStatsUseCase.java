package dev.martindotpy.sanipatitas.inventory.application.usecase;

import java.math.BigDecimal;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.inventory.application.dto.InventoryStatsDto;
import dev.martindotpy.sanipatitas.shared.inventory.application.port.FindInventoryStatsPort;
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

        // Single fetch of all stocks, reused for derived calculations
        var stocksUni = stockRepository.findAll().list();

        Uni<Long> lowStockCount = stocksUni
                .map(stocks -> stocks.stream()
                        .filter(s -> s.getMinStock() != null && s.getQuantity() <= s.getMinStock())
                        .count());

        Uni<BigDecimal> totalValue = stocksUni
                .map(stocks -> stocks.stream()
                        .map(s -> {
                            var price = s.getProduct().getPrice();
                            if (price == null) return BigDecimal.ZERO;
                            return price.multiply(BigDecimal.valueOf(s.getQuantity()));
                        })
                        .reduce(BigDecimal.ZERO, BigDecimal::add));

        Uni<Long> totalQuantity = stocksUni
                .map(stocks -> stocks.stream()
                        .mapToLong(s -> (long) s.getQuantity())
                        .sum());

        return Uni.combine().all()
                .unis(totalProducts, totalCategories, totalSuppliers, lowStockCount, totalValue, totalQuantity)
                .with((tp, tc, ts, lsc, tv, tq) -> InventoryStatsDto.builder()
                        .totalProducts(tp)
                        .totalCategories(tc)
                        .totalSuppliers(ts)
                        .lowStockCount(lsc)
                        .totalStockValue(tv.longValue())
                        .totalStockQuantity(tq)
                        .build());
    }
}
