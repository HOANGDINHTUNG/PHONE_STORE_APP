package com.re.ecommerce.modules.cart.dto.response;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
public record CartResponse(
    UUID id,
    List<CartItemResponse> items,
    BigDecimal grandTotal,
    List<String> warnings
) {}
