package dev.martindotpy.sanipatitas.shared.inventory.domain.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Supplier extends EntityWithUuidV7 {
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String name;

    @Nullable
    @Size(max = 20)
    private String ruc;

    @Nullable
    @Size(max = 255)
    private String contactName;

    @Nullable
    @Size(max = 50)
    private String contactPhone;

    @Nullable
    @Size(max = 255)
    private String email;

    @Nullable
    @Size(max = 500)
    private String address;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
