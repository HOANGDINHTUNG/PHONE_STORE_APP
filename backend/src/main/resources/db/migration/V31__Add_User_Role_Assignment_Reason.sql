ALTER TABLE user_roles
    ADD COLUMN assignment_reason VARCHAR(255) NULL AFTER assigned_by;
