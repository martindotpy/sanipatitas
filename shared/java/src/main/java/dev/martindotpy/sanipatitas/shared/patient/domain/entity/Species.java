package dev.martindotpy.sanipatitas.shared.patient.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Species extends EntityWithUuidV7 {
    @NotBlank
    @Size(max = 255)
    @Column(unique = true, nullable = false)
    private String name;
    @Size(max = 2000)
    private String description;
}
