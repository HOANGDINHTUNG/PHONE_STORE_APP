package com.re.ecommerce.common.audit.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.common.audit.service.AuditLogger;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Records successful and failed mutations made by administrators which are not
 * already logged by the catalogue services.  Request bodies are intentionally
 * not persisted here because administrative forms can contain personal or
 * secret values; specialised services can still write a richer, safe diff.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AdminMutationAuditAspect {

    private final AuditLogger auditLogger;
    private final ObjectMapper objectMapper;

    @Around("execution(public * com.re.ecommerce.modules..controller..*(..))")
    public Object auditAdminMutation(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = currentRequest();
        if (!shouldAudit(request, joinPoint.getTarget().getClass().getName())) {
            return joinPoint.proceed();
        }

        String actionCode = actionCode(request, joinPoint.getTarget().getClass().getSimpleName());
        String entityType = joinPoint.getTarget().getClass().getSimpleName().replace("Controller", "");
        String entityId = entityId(request);
        Map<String, Object> context = safeContext(request);

        try {
            Object result = joinPoint.proceed();
            String outcome = result instanceof ResponseEntity<?> response && !response.getStatusCode().is2xxSuccessful()
                    ? "FAILURE" : "SUCCESS";
            auditLogger.log(actionCode, entityType, entityId, null, context, outcome);
            return result;
        } catch (Throwable error) {
            context.put("error", error.getClass().getSimpleName());
            auditLogger.log(actionCode, entityType, entityId, null, context, "FAILURE");
            throw error;
        }
    }

    private boolean shouldAudit(HttpServletRequest request, String targetClassName) {
        if (request == null || !isMutation(request.getMethod()) || !isAdministrator()) {
            return false;
        }

        String path = request.getRequestURI();
        if (!path.startsWith("/api/v1/") || path.startsWith("/api/v1/admin/audit-logs")) {
            return false;
        }

        // Product, variant, brand and category services already persist detailed
        // old/new snapshots.  Skipping them prevents duplicate audit records.
        return !targetClassName.contains(".modules.catalog.controller.");
    }

    private boolean isMutation(String method) {
        return "POST".equals(method) || "PUT".equals(method)
                || "PATCH".equals(method) || "DELETE".equals(method);
    }

    private boolean isAdministrator() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated()
                && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private HttpServletRequest currentRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes == null ? null : attributes.getRequest();
    }

    private String actionCode(HttpServletRequest request, String controllerName) {
        String verb = switch (request.getMethod()) {
            case "POST" -> "CREATE_OR_EXECUTE";
            case "PUT", "PATCH" -> "UPDATE";
            case "DELETE" -> "DELETE";
            default -> "CHANGE";
        };
        return verb + "_" + controllerName.replace("Controller", "").replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase();
    }

    private String entityId(HttpServletRequest request) {
        String[] segments = request.getRequestURI().split("/");
        for (int index = segments.length - 1; index >= 0; index--) {
            String segment = segments[index];
            if (segment.matches("[0-9a-fA-F-]{8,}")) {
                return segment;
            }
        }
        return null;
    }

    private Map<String, Object> safeContext(HttpServletRequest request) {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("method", request.getMethod());
        context.put("path", request.getRequestURI());
        if (!request.getParameterMap().isEmpty()) {
            context.put("parameters", request.getParameterMap());
        }
        try {
            context.put("request", objectMapper.readTree("{}"));
        } catch (Exception ignored) {
            // The map is still serialisable without this optional marker.
        }
        return context;
    }
}
