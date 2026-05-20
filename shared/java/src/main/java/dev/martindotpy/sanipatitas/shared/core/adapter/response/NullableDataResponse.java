package dev.martindotpy.sanipatitas.shared.core.adapter.response;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class NullableDataResponse<T> {
    private T data;
    @NotBlank
    private String message;
}
