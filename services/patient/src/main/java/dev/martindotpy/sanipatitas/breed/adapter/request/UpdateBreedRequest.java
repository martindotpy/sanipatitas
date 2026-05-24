package dev.martindotpy.sanipatitas.breed.adapter.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.breed.domain.payload.UpdateBreedPayload;
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
public class UpdateBreedRequest implements UpdateBreedPayload {
    @NotBlank
    @Size(max = 255)
    private String name;
    @Nullable
    @Size(max = 2000)
    private String description;

    @NotNull
    private UUID speciesId;
}
