CREATE TABLE wallets
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(60) NOT NULL,
    sort_order SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL
);

ALTER TABLE wallets
    DROP CONSTRAINT IF EXISTS wallets_id_pk,
    ADD CONSTRAINT wallets_id_pk
        PRIMARY KEY (id);

ALTER TABLE wallets
    DROP CONSTRAINT IF EXISTS wallets_name_ukey,
    ADD CONSTRAINT wallets_name_ukey
        UNIQUE (name);

CREATE INDEX IF NOT EXISTS wallets_id_idx ON wallets USING btree (id);
CREATE INDEX IF NOT EXISTS wallets_name_idx ON wallets USING btree (name);
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON wallets USING btree (user_id);
CREATE INDEX IF NOT EXISTS wallets_sort_order_idx ON wallets USING btree (sort_order);
CREATE INDEX IF NOT EXISTS wallets_created_at_idx ON wallets USING btree (created_at);

ALTER TABLE wallets
    ADD CONSTRAINT wallets_user_id_fk
        FOREIGN KEY (user_id)
            REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE;
