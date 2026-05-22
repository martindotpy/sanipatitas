package dev.martindotpy.sanipatitas.patient.adapter.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreateSpeciesPayload;
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
public class CreateSpeciesRequest implements CreateSpeciesPayload {
    private UUID id;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 2000)
    private String description;
}
