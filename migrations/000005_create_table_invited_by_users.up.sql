CREATE TABLE invited_by_users
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE invited_by_users
    DROP CONSTRAINT IF EXISTS invited_by_users_id_pk,
    ADD CONSTRAINT invited_by_users_id_pk
        PRIMARY KEY (id);

ALTER TABLE invited_by_users
    DROP CONSTRAINT IF EXISTS invited_by_users_user_id_guest_id_ukey,
    ADD CONSTRAINT invited_by_users_user_id_guest_id_ukey
        UNIQUE (user_id, guest_id);

CREATE INDEX IF NOT EXISTS invited_by_users_id_idx ON invited_by_users USING btree (id);
CREATE INDEX IF NOT EXISTS invited_by_users_user_id_idx ON invited_by_users USING btree (user_id);
CREATE INDEX IF NOT EXISTS invited_by_users_guest_id_idx ON invited_by_users USING btree (guest_id);

ALTER TABLE invited_by_users
    DROP CONSTRAINT IF EXISTS invited_by_users_user_id_fk,
    ADD CONSTRAINT invited_by_users_user_id_fk
        FOREIGN KEY (user_id)
            REFERENCES users (id) ON
            DELETE CASCADE
            ON UPDATE CASCADE;

ALTER TABLE invited_by_users
    DROP CONSTRAINT IF EXISTS invited_by_users_guest_id_fk,
    ADD CONSTRAINT invited_by_users_guest_id_fk
        FOREIGN KEY (guest_id)
            REFERENCES users (id) ON
            DELETE CASCADE
            ON UPDATE CASCADE;
