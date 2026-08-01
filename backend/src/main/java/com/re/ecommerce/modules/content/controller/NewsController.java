package com.re.ecommerce.modules.content.controller;

import com.re.ecommerce.modules.content.dto.response.NewsResponse;
import com.re.ecommerce.modules.content.service.NewsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "14. Content Management")
@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsResponse>> getPublicNews() {
        return ResponseEntity.ok(newsService.getPublicNews());
    }
}
