-- CouponStatus is intentionally limited to ACTIVE and INACTIVE in the
-- application.  Expiration is determined from end_time, not a third status.
UPDATE coupons
SET status = 'INACTIVE'
WHERE code = 'ADMINEXPIRED'
  AND status = 'EXPIRED';
