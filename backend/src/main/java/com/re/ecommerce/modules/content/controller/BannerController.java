package com.re.ecommerce.modules.content.controller;

import com.re.ecommerce.modules.content.dto.request.BannerRequest;
import com.re.ecommerce.modules.content.dto.response.BannerResponse;
import com.re.ecommerce.modules.content.service.BannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "14. Content Management")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/banners")
    public ResponseEntity<List<BannerResponse>> getPublicBanners() {
        return ResponseEntity.ok(bannerService.getPublicBanners());
    }

    @GetMapping("/admin/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BannerResponse>> getAdminBanners(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(bannerService.getAdminBanners(keyword, status));
    }

    @PostMapping("/admin/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> createBanner(@Valid @RequestBody BannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.createBanner(request));
    }

    @PatchMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> updateBanner(@PathVariable UUID id, @Valid @RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.updateBanner(id, request));
    }

    @PatchMapping("/admin/banners/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> changeStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(bannerService.changeStatus(id, status));
    }
}
