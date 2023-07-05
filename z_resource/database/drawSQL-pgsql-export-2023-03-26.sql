CREATE TABLE "bills"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "deadline" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NULL DEFAULT '0',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "bills" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "email" VARCHAR(80) NULL,
    "username" VARCHAR(40) NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "fullname" VARCHAR(120) NULL,
    "branch" VARCHAR(8) NULL,
    "role" SMALLINT NULL,
    "description" VARCHAR(20) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "roles_dict"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "role" SMALLINT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "roles_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "roles_dict" ADD CONSTRAINT "roles_dict_role_unique" UNIQUE("role");
CREATE TABLE "transactions"(
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NULL,
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
    "img_evidence" TEXT NOT NULL,
    "status" SMALLINT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "payments" ADD PRIMARY KEY("id");
CREATE TABLE "votes"(
    "id" UUID NOT NULL,
    "agree" VARCHAR(40) NULL,
    "disagree" VARCHAR(40) NULL,
    "status" BOOLEAN NULL DEFAULT '1',
    "deadline" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "votes" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "votes"."agree" IS 'should array varchar[](40)';
COMMENT
ON COLUMN
    "votes"."disagree" IS 'should array varchar[](40)';
CREATE TABLE "payments_dict"(
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "status" SMALLINT NOT NULL,
    "status_name" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT '(NOW())'
);
ALTER TABLE
    "payments_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "payments_dict" ADD CONSTRAINT "payments_dict_status_unique" UNIQUE("status");
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