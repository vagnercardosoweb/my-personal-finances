CREATE TABLE forgot_passwords
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    validated_in TIMESTAMPTZ NULL,
    expired_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE forgot_passwords
    DROP CONSTRAINT IF EXISTS forgot_passwords_id_pk,
    ADD CONSTRAINT forgot_passwords_id_pk
        PRIMARY KEY (id);

ALTER TABLE forgot_passwords
    DROP CONSTRAINT IF EXISTS forgot_passwords_user_id_token_uuid_ukey,
    ADD CONSTRAINT forgot_passwords_user_id_token_uuid_ukey
        UNIQUE (user_id, token_uuid);

CREATE INDEX IF NOT EXISTS forgot_passwords_id_idx ON forgot_passwords USING btree (id);
CREATE INDEX IF NOT EXISTS forgot_passwords_user_id_idx ON forgot_passwords USING btree (user_id);
CREATE INDEX IF NOT EXISTS forgot_passwords_token_uuid_idx ON forgot_passwords USING btree (token_uuid);
CREATE INDEX IF NOT EXISTS forgot_passwords_expired_at_idx ON forgot_passwords USING btree (expired_at);

ALTER TABLE forgot_passwords
    DROP CONSTRAINT IF EXISTS forgot_passwords_user_id_fkey,
    ADD CONSTRAINT forgot_passwords_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES users (id) ON
            DELETE CASCADE
            ON UPDATE CASCADE;
