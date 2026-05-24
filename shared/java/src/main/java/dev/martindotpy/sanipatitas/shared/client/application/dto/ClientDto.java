package dev.martindotpy.sanipatitas.shared.client.application.dto;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.PeruPhone;
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
    @Nullable
    @PeruPhone
    @Size(max = 15)
    private final String phoneAlt;
    @Nullable
    @Email
    @Size(max = 255)
    private final String email;
    @Nullable
    @Size(max = 500)
    private final String address;
    @Nullable
    @Size(max = 2000)
    private final String notes;
}
