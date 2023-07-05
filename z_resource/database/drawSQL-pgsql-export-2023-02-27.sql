CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "bills"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "deadline" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NULL DEFAULT '0',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "bills" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "username" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "fullname" VARCHAR(255) NULL,
    "branch" VARCHAR(255) NULL,
    "role" SMALLINT NULL DEFAULT '1',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "roles"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "role" SMALLINT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "roles" ADD PRIMARY KEY("id");
CREATE TABLE "transactions"(
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "vote_id" UUID NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "transactions" ADD PRIMARY KEY("id");
CREATE TABLE "payments"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "user_id" UUID NOT NULL,
    "bill_id" UUID NULL,
    "img_evidence" VARCHAR(255) NOT NULL,
    "status" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "payments" ADD PRIMARY KEY("id");
CREATE TABLE "votes"(
    "id" UUID NOT NULL,
    "agree" VARCHAR(255) NULL,
    "disagree" VARCHAR(255) NULL,
    "status" BOOLEAN NULL DEFAULT '1',
    "deadline" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "votes" ADD PRIMARY KEY("id");
CREATE TABLE "payment_status"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "status" SMALLINT NOT NULL,
    "status_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "payment_status" ADD PRIMARY KEY("id");
ALTER TABLE
    "payments" ADD CONSTRAINT "payments_bill_id_foreign" FOREIGN KEY("bill_id") REFERENCES "bills"("id");
ALTER TABLE
    "transactions" ADD CONSTRAINT "transactions_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "bills" ADD CONSTRAINT "bills_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "transactions" ADD CONSTRAINT "transactions_vote_id_foreign" FOREIGN KEY("vote_id") REFERENCES "votes"("id");
ALTER TABLE
    "payments" ADD CONSTRAINT "payments_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");