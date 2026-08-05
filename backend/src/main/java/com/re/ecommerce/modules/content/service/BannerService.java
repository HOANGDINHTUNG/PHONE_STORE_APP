package com.re.ecommerce.modules.content.service;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.content.dto.request.BannerRequest;
import com.re.ecommerce.modules.content.dto.response.BannerResponse;
import com.re.ecommerce.modules.content.entity.Banner;
import com.re.ecommerce.modules.content.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> getPublicBanners() {
        return bannerRepository.findByStatusOrderBySortOrderAsc("ACTIVE").stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getAdminBanners(String keyword, String status) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase();
        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();
        return bannerRepository.findAllByOrderBySortOrderAsc().stream()
                .filter(b -> normalizedKeyword.isBlank()
                        || b.getTitle().toLowerCase().contains(normalizedKeyword)
                        || (b.getLabel() != null && b.getLabel().toLowerCase().contains(normalizedKeyword)))
                .filter(b -> normalizedStatus.isBlank() || normalizedStatus.equals(b.getStatus()))
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = new Banner(
                request.title().trim(), trimToNull(request.label()), trimToNull(request.subtitle()), request.imageUrl().trim(),
                trimToNull(request.linkUrl()), defaultIfBlank(request.position(), "HERO"), trimToNull(request.bgColor()),
                trimToNull(request.textColor()), request.sortOrder(), normalizeStatus(request.status(), "ACTIVE"));
        return mapToResponse(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse updateBanner(UUID id, BannerRequest request) {
        Banner banner = getBanner(id);
        int previousSortOrder = banner.getSortOrder();
        int requestedSortOrder = request.sortOrder();
        String requestedPosition = defaultIfBlank(request.position(), banner.getPosition());

        if (previousSortOrder != requestedSortOrder) {
            bannerRepository.findAllByOrderBySortOrderAsc().stream()
                    .filter(candidate -> !candidate.getId().equals(banner.getId()))
                    .filter(candidate -> requestedPosition.equalsIgnoreCase(candidate.getPosition()))
                    .filter(candidate -> candidate.getSortOrder() == requestedSortOrder)
                    .findFirst()
                    .ifPresent(candidate -> candidate.setSortOrder(previousSortOrder));
        }
        applyRequest(banner, request);
        return mapToResponse(banner);
    }

    @Transactional
    public BannerResponse changeStatus(UUID id, String status) {
        Banner banner = getBanner(id);
        banner.setStatus(normalizeStatus(status, banner.getStatus()));
        return mapToResponse(banner);
    }

    private Banner getBanner(UUID id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BANNER_NOT_FOUND", "Banner not found: " + id));
    }

    private void applyRequest(Banner banner, BannerRequest request) {
        banner.setTitle(request.title().trim());
        banner.setLabel(trimToNull(request.label()));
        banner.setSubtitle(trimToNull(request.subtitle()));
        banner.setImageUrl(request.imageUrl().trim());
        banner.setLinkUrl(trimToNull(request.linkUrl()));
        banner.setPosition(defaultIfBlank(request.position(), banner.getPosition() == null ? "HERO" : banner.getPosition()));
        banner.setBgColor(trimToNull(request.bgColor()));
        banner.setTextColor(trimToNull(request.textColor()));
        banner.setSortOrder(request.sortOrder());
        banner.setStatus(normalizeStatus(request.status(), banner.getStatus()));
    }

    private String normalizeStatus(String status, String fallback) {
        String result = defaultIfBlank(status, fallback == null ? "ACTIVE" : fallback).toUpperCase();
        if (!result.equals("ACTIVE") && !result.equals("INACTIVE") && !result.equals("SCHEDULED")) {
            throw new IllegalArgumentException("Banner status must be ACTIVE, INACTIVE, or SCHEDULED");
        }
        return result;
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private BannerResponse mapToResponse(Banner b) {
        return BannerResponse.builder()
                .id(b.getId()).title(b.getTitle()).label(b.getLabel()).subtitle(b.getSubtitle())
                .image(b.getImageUrl()).linkUrl(b.getLinkUrl()).position(b.getPosition())
                .bgColor(b.getBgColor()).textColor(b.getTextColor()).sortOrder(b.getSortOrder())
                .status(b.getStatus()).build();
    }
}
