package com.re.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> items;
    private PageMetadata page;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageMetadata {
        private int number;
        private int size;
        private long totalElements;
        private int totalPages;
    }

    public static <T> PagedResponse<T> of(Page<?> pageInfo, List<T> items) {
        return PagedResponse.<T>builder()
                .items(items)
                .page(PageMetadata.builder()
                        .number(pageInfo.getNumber() + 1)
                        .size(pageInfo.getSize())
                        .totalElements(pageInfo.getTotalElements())
                        .totalPages(pageInfo.getTotalPages())
                        .build())
                .build();
    }
}
