package dev.martindotpy.sanipatitas.shared.inventory.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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
public class Product extends EntityWithUuidV7 {
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String name;

    @Nullable
    @Size(max = 100)
    private String code;

    @Nullable
    @Size(max = 2000)
    private String description;

    @Nullable
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Nullable
    @ManyToOne
    private ProductCategory category;

    @Nullable
    @ManyToOne
    private Supplier supplier;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
