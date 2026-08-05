package com.re.ecommerce.modules.content.service;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.content.dto.request.NewsRequest;
import com.re.ecommerce.modules.content.dto.response.NewsResponse;
import com.re.ecommerce.modules.content.entity.News;
import com.re.ecommerce.modules.content.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NewsService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final NewsRepository newsRepository;

    @Transactional(readOnly = true)
    public List<NewsResponse> getPublicNews() {
        return newsRepository.findByStatusOrderByPublishedAtDesc("PUBLISHED").stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<NewsResponse> getAdminNews(String keyword, String status) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase();
        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();
        return newsRepository.findAllByOrderByPublishedAtDesc().stream()
                .filter(n -> normalizedKeyword.isBlank() || n.getTitle().toLowerCase().contains(normalizedKeyword)
                        || n.getTag().toLowerCase().contains(normalizedKeyword))
                .filter(n -> normalizedStatus.isBlank() || normalizedStatus.equals(n.getStatus()))
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public NewsResponse createNews(NewsRequest request) {
        News news = new News(
                request.title().trim(), request.tag().trim(), request.description().trim(), trimToNull(request.content()),
                request.imageUrl().trim(), request.publishedAt(), normalizeStatus(request.status(), "DRAFT"));
        return mapToResponse(newsRepository.save(news));
    }

    @Transactional
    public NewsResponse updateNews(UUID id, NewsRequest request) {
        News news = getNews(id);
        applyRequest(news, request);
        return mapToResponse(news);
    }

    @Transactional
    public NewsResponse changeStatus(UUID id, String status) {
        News news = getNews(id);
        news.setStatus(normalizeStatus(status, news.getStatus()));
        return mapToResponse(news);
    }

    private News getNews(UUID id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NEWS_NOT_FOUND", "News not found: " + id));
    }

    private void applyRequest(News news, NewsRequest request) {
        news.setTitle(request.title().trim());
        news.setTag(request.tag().trim());
        news.setDescription(request.description().trim());
        news.setContent(trimToNull(request.content()));
        news.setImageUrl(request.imageUrl().trim());
        news.setPublishedAt(request.publishedAt() == null ? LocalDateTime.now() : request.publishedAt());
        news.setStatus(normalizeStatus(request.status(), news.getStatus()));
    }

    private String normalizeStatus(String status, String fallback) {
        String result = status == null || status.isBlank() ? (fallback == null ? "DRAFT" : fallback) : status.trim().toUpperCase();
        if (!result.equals("DRAFT") && !result.equals("PUBLISHED") && !result.equals("ARCHIVED")) {
            throw new IllegalArgumentException("News status must be DRAFT, PUBLISHED, or ARCHIVED");
        }
        return result;
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private NewsResponse mapToResponse(News n) {
        return NewsResponse.builder()
                .id(n.getId()).tag(n.getTag()).title(n.getTitle()).description(n.getDescription())
                .content(n.getContent()).date(n.getPublishedAt() == null ? "" : n.getPublishedAt().format(DATE_FORMATTER))
                .image(n.getImageUrl()).viewsCount(n.getViewsCount()).status(n.getStatus()).build();
    }
}
