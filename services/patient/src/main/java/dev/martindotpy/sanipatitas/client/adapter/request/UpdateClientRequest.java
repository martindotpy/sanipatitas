package dev.martindotpy.sanipatitas.client.adapter.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.client.domain.payload.UpdateClientPayload;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.PeruPhone;
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
public class UpdateClientRequest implements UpdateClientPayload {
    @NotBlank
    @Size(max = 100)
    private String firstName;
    @NotBlank
    @Size(max = 100)
    private String lastName;
    @NotNull
    private IdType idType;
    @NotBlank
    @Size(min = 6, max = 20)
    private String idNumber;
    @NotBlank
    @PeruPhone
    @Size(max = 15)
    private String phone;
    @Nullable
    @PeruPhone
    @Size(max = 15)
    private String phoneAlt;
    @Nullable
    @Email
    @Size(max = 255)
    private String email;
    @Nullable
    @Size(max = 500)
    private String address;
    @Nullable
    @Size(max = 2000)
    private String notes;
}
