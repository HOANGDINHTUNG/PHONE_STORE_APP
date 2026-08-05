package com.re.ecommerce.common.audit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.common.audit.entity.AuditLog;
import com.re.ecommerce.common.audit.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogger {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public void log(String actionCode, String entityType, String entityId, Object oldData, Object newData, String result) {
        try {
            String actorUsername = "system";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                actorUsername = auth.getName();
            }

            String ipAddress = null;
            String userAgent = null;
            String correlationId = null;

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getRemoteAddr();
                userAgent = request.getHeader("User-Agent");
                correlationId = request.getHeader("X-Correlation-Id");
            }

            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }

            String oldDataStr = oldData != null ? objectMapper.writeValueAsString(oldData) : null;
            String newDataStr = newData != null ? objectMapper.writeValueAsString(newData) : null;

            AuditLog auditLog = AuditLog.builder()
                    .actorUsername(actorUsername)
                    .actionCode(actionCode)
                    .entityType(entityType)
                    .entityId(entityId)
                    .oldData(oldDataStr)
                    .newData(newDataStr)
                    .result(result)
                    .correlationId(correlationId)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to write audit log for action: " + actionCode, e);
        }
    }
}
