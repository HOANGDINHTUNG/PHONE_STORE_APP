package com.re.ecommerce.modules.content.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {
    private UUID id;
    private String tag;
    private String title;
    private String description;
    private String content;
    private String date;
    private String image;
    private int viewsCount;
}
