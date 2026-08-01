package com.re.ecommerce.modules.content.controller;

import com.re.ecommerce.modules.content.dto.response.BannerResponse;
import com.re.ecommerce.modules.content.service.BannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "14. Content Management")
@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerResponse>> getPublicBanners() {
        return ResponseEntity.ok(bannerService.getPublicBanners());
    }
}
