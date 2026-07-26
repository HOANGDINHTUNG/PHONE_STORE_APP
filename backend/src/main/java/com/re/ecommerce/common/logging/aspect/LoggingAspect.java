package com.re.ecommerce.common.logging.aspect;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoggingAspect {

    private final ObjectMapper objectMapper;

    // Only intercept specific generic repository or methods marked with LogExecutionTime
    @Pointcut("@annotation(com.re.ecommerce.common.logging.annotation.LogExecutionTime) || @within(com.re.ecommerce.common.logging.annotation.LogExecutionTime)")
    public void loggablePointcut() {}

    @Around("loggablePointcut()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();

        if (log.isDebugEnabled()) {
            log.debug("Enter: {} with arguments = {}", methodName, Arrays.toString(args));
        } else {
            log.info("Enter: {}", methodName);
        }

        long startTime = System.currentTimeMillis();
        Object result;
        try {
            result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - startTime;
            
            if (log.isDebugEnabled()) {
                log.debug("Exit: {} with result = {}, Execution Time: {} ms", methodName, sanitizeResult(result), elapsedTime);
            } else {
                log.info("Exit: {} executed in {} ms", methodName, elapsedTime);
            }
            return result;
        } catch (IllegalArgumentException e) {
            log.error("IllegalArgumentException in {}: {}", methodName, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Exception in {}: {}", methodName, e.getMessage());
            throw e;
        }
    }

    private String sanitizeResult(Object result) {
        if (result == null) return "null";
        try {
            return objectMapper.writeValueAsString(result);
        } catch (JsonProcessingException e) {
            return result.toString();
        }
    }
}
