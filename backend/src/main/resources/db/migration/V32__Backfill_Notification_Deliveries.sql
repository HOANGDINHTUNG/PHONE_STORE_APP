INSERT INTO notification_deliveries (
    id, notification_id, channel, status, destination, attempt_count, last_attempt_at, created_at
)
SELECT
    UNHEX(REPLACE(UUID(), '-', '')),
    notification.id,
    'IN_APP',
    'SENT',
    user.email,
    1,
    notification.created_at,
    notification.created_at
FROM notifications notification
JOIN users user ON user.id = notification.user_id
WHERE NOT EXISTS (
    SELECT 1
    FROM notification_deliveries delivery
    WHERE delivery.notification_id = notification.id
      AND delivery.channel = 'IN_APP'
);
