package com.re.ecommerce.common.logging.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods or classes whose execution time and details should be logged by the LoggingAspect.
 * Target can be a specific method or entire class (e.g., custom Repository).
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}
