package com.re.ecommerce.modules.content.service;

import com.re.ecommerce.modules.content.dto.response.BannerResponse;
import com.re.ecommerce.modules.content.entity.Banner;
import com.re.ecommerce.modules.content.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> getPublicBanners() {
        List<Banner> banners = bannerRepository.findByStatusOrderBySortOrderAsc("ACTIVE");
        return banners.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BannerResponse mapToResponse(Banner b) {
        return BannerResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .label(b.getLabel())
                .subtitle(b.getSubtitle())
                .image(b.getImageUrl())
                .linkUrl(b.getLinkUrl())
                .bgColor(b.getBgColor())
                .textColor(b.getTextColor())
                .sortOrder(b.getSortOrder())
                .build();
    }
}
