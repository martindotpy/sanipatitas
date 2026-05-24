package dev.martindotpy.sanipatitas.shared.core.application.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PageResult<T> {
    @NotNull
    private final List<T> data;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;

    public static <T> PageResult<T> from(int page, int size, long totalElements, List<T> data) {
        var totalPages = (int) Math.ceil((double) totalElements / size);

        return new PageResult<>(data, page, size, totalElements, totalPages);
    }
}
