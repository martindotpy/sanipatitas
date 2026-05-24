package dev.martindotpy.sanipatitas.patient.adapter.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.Gender;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.UpdatePatientPayload;
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
public class UpdatePatientRequest implements UpdatePatientPayload {
    @NotBlank
    @Size(max = 500)
    private String name;
    @Nullable
    private Gender gender;
    @Nullable
    private LocalDate birthDate;
    @Nullable
    @Size(max = 50)
    private String approximateAge;
    @Nullable
    @Digits(integer = 3, fraction = 2)
    private BigDecimal weightKg;
    @Nullable
    @Size(max = 2000)
    private String description;
    @Nullable
    private Boolean isSterilized;
    @Nullable
    private Boolean isDeceased;

    @Nullable
    private UUID breedId;
    @NotNull
    private UUID clientId;
}
