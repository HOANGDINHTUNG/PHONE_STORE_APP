package com.re.ecommerce.modules.system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowCallbackHandler;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminSettingsSupportController {
    private final JdbcTemplate jdbc;

    @GetMapping("/settings")
    @PreAuthorize("hasAuthority('SETTINGS_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> settings() {
        Map<String, String> result = new LinkedHashMap<>();
        jdbc.query("SELECT setting_key, setting_value FROM admin_settings ORDER BY setting_key",
                (RowCallbackHandler) rs -> result.put(rs.getString(1), rs.getString(2)));
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/settings")
    @PreAuthorize("hasAuthority('SETTINGS_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> updateSettings(@RequestBody Map<String, String> values) {
        if (values != null) {
            values.forEach((key, value) -> {
                if (key != null && key.matches("[a-zA-Z0-9_]{1,100}")) {
                    jdbc.update("INSERT INTO admin_settings(setting_key, setting_value, updated_by) VALUES (?, ?, 'admin') "
                                    + "ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = 'admin'",
                            key, value);
                }
            });
        }
        Map<String, String> updated = settings().getBody();
        return ResponseEntity.ok(updated == null ? Map.of() : updated);
    }

    @GetMapping("/support/articles")
    @PreAuthorize("hasAnyAuthority('SUPPORT_VIEW', 'SUPPORT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> articles() {
        return ResponseEntity.ok(jdbc.queryForList("SELECT BIN_TO_UUID(id) id, slug, category, title, summary, views "
                + "FROM support_articles WHERE published = TRUE ORDER BY category, title"));
    }

    @GetMapping("/support/articles/{slug}")
    @PreAuthorize("hasAnyAuthority('SUPPORT_VIEW', 'SUPPORT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> article(@PathVariable String slug) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT BIN_TO_UUID(id) id, slug, category, title, summary, content, views "
                + "FROM support_articles WHERE slug = ? AND published = TRUE", slug);
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support article not found");
        jdbc.update("UPDATE support_articles SET views = views + 1 WHERE slug = ?", slug);
        Map<String, Object> result = new LinkedHashMap<>(rows.get(0));
        result.put("views", ((Number) result.getOrDefault("views", 0)).intValue() + 1);
        return ResponseEntity.ok(result);
    }

    public record TicketRequest(String subject, String description, String priority, String requester) {}

    @PostMapping("/support/tickets")
    @PreAuthorize("hasAnyAuthority('SUPPORT_VIEW', 'SUPPORT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createTicket(@RequestBody TicketRequest request) {
        if (request == null || request.subject() == null || request.subject().isBlank()
                || request.description() == null || request.description().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject and description are required");
        }
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO support_tickets(id, subject, description, priority, requester) "
                        + "VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)", id.toString(), request.subject().trim(),
                request.description().trim(), normalizePriority(request.priority()),
                request.requester() == null || request.requester().isBlank() ? "admin" : request.requester().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", id, "status", "OPEN"));
    }

    private String normalizePriority(String priority) {
        return switch (priority == null ? "" : priority.toUpperCase()) {
            case "LOW", "HIGH", "URGENT" -> priority.toUpperCase();
            default -> "MEDIUM";
        };
    }
}
