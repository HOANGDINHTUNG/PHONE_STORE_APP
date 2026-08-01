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
public class BannerResponse {
    private UUID id;
    private String title;
    private String label;
    private String subtitle;
    private String image;
    private String linkUrl;
    private String bgColor;
    private String textColor;
    private int sortOrder;
}
