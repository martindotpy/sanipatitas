package dev.martindotpy.sanipatitas.shared.core.adapter.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DataResponse<T> {
    @NotNull
    private T data;
    @NotBlank
    private String message;
}
