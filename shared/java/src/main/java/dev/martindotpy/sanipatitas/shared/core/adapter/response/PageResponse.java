package dev.martindotpy.sanipatitas.shared.core.adapter.response;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PageResponse<T> {
    @NotNull
    private List<T> data;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;

    @NotBlank
    private String message;
}
