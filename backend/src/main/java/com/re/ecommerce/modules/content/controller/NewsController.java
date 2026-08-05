package com.re.ecommerce.modules.content.controller;

import com.re.ecommerce.modules.content.dto.request.NewsRequest;
import com.re.ecommerce.modules.content.dto.response.NewsResponse;
import com.re.ecommerce.modules.content.service.NewsService;
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
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/news")
    public ResponseEntity<List<NewsResponse>> getPublicNews() {
        return ResponseEntity.ok(newsService.getPublicNews());
    }

    @GetMapping("/admin/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NewsResponse>> getAdminNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(newsService.getAdminNews(keyword, status));
    }

    @PostMapping("/admin/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> createNews(@Valid @RequestBody NewsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(request));
    }

    @PatchMapping("/admin/news/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> updateNews(@PathVariable UUID id, @Valid @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.updateNews(id, request));
    }

    @PatchMapping("/admin/news/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> changeStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(newsService.changeStatus(id, status));
    }
}
