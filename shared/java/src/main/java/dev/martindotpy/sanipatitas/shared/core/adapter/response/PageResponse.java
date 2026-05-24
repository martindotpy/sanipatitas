package dev.martindotpy.sanipatitas.shared.core.adapter.response;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
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

    public static <T> PageResponseBuilder<T> from(PageResult<T> result) {
        return PageResponse.<T>builder()
                .data(result.getData())
                .page(result.getPage())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages());
    }
}
