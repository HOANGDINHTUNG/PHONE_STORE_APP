package com.re.ecommerce.modules.content.service;

import com.re.ecommerce.modules.content.dto.response.NewsResponse;
import com.re.ecommerce.modules.content.entity.News;
import com.re.ecommerce.modules.content.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Transactional(readOnly = true)
    public List<NewsResponse> getPublicNews() {
        List<News> newsList = newsRepository.findByStatusOrderByPublishedAtDesc("PUBLISHED");
        return newsList.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private NewsResponse mapToResponse(News n) {
        String formattedDate = n.getPublishedAt() != null ? n.getPublishedAt().format(DATE_FORMATTER) : "";
        return NewsResponse.builder()
                .id(n.getId())
                .tag(n.getTag())
                .title(n.getTitle())
                .description(n.getDescription())
                .content(n.getContent())
                .date(formattedDate)
                .image(n.getImageUrl())
                .viewsCount(n.getViewsCount())
                .build();
    }
}
