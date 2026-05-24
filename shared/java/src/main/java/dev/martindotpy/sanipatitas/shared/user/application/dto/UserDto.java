package dev.martindotpy.sanipatitas.shared.user.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.jspecify.annotations.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserDto {
    @NotNull
    private final UUID id;

    @NotBlank
    @Size(max = 255)
    private final String name;
    @NotBlank
    @Size(max = 255)
    @Email
    private final String email;
    @NotNull
    private final Boolean emailVerified;
    @Nullable
    @Size(max = 500)
    private final String image;
    @Nullable
    @Size(max = 50)
    private final String role;
    @Nullable
    private final Boolean banned;
    @Nullable
    @Size(max = 500)
    private final String banReason;
    @Nullable
    private final OffsetDateTime banExpires;
    @NotBlank
    @Size(max = 255)
    private final String lastName;

    @NotNull
    private final OffsetDateTime createdAt;
    @NotNull
    private final OffsetDateTime updatedAt;
}
