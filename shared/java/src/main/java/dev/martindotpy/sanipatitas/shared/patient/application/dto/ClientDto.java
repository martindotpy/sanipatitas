package dev.martindotpy.sanipatitas.shared.patient.application.dto;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import dev.martindotpy.sanipatitas.shared.core.adapter.validation.PeruPhone;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ClientDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 100)
    private final String firstName;

    @NotBlank
    @Size(max = 100)
    private final String lastName;

    @NotNull
    private final IdType idType;

    @NotBlank
    @Size(min = 6, max = 20)
    private final String idNumber;

    @NotBlank
    @PeruPhone
    private final String phone;

    @Email
    @Size(max = 255)
    private final String email;
}
