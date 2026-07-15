package dev.martindotpy.sanipatitas.shared.inventory.domain.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.envers.Audited;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@Audited
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement extends EntityWithUuidV7 {
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private MovementType type;

    @Min(1)
    @Column(nullable = false)
    private int quantity;

    @Nullable
    @Column(precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Nullable
    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Nullable
    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Nullable
    @Size(max = 255)
    private String reference;

    @Nullable
    @Size(max = 500)
    private String notes;

    @NotNull
    @ManyToOne(optional = false)
    private Stock stock;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
