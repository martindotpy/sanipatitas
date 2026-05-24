package dev.martindotpy.sanipatitas.species.adapter.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.species.domain.payload.UpdateSpeciesPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSpeciesRequest implements UpdateSpeciesPayload {
    @NotBlank
    @Size(max = 255)
    private String name;
    @Nullable
    @Size(max = 2000)
    private String description;
}
