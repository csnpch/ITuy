CREATE TABLE "bill_dict"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "status" SMALLINT NOT NULL,
    "status_name" VARCHAR(40) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "bill_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "bill_dict" ADD CONSTRAINT "bill_dict_status_unique" UNIQUE("status");
CREATE TABLE "section_dict"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "sec" SMALLINT NOT NULL,
    "sec_name" VARCHAR(8) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "section_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "section_dict" ADD CONSTRAINT "section_dict_sec_unique" UNIQUE("sec");
CREATE TABLE "bill"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "target" VARCHAR(14) NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "deadline" VARCHAR(20) NOT NULL,
    "status" SMALLINT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "bill" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "bill"."target" IS 'should array varchar(40)[]';
CREATE TABLE "payment_method"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "client_id" UUID NOT NULL,
    "target" VARCHAR(14) NULL,
    "method_identity" VARCHAR(200) NOT NULL,
    "reserve_identity" VARCHAR(200) NULL,
    "promptpay" VARCHAR(20) NOT NULL,
    "status" SMALLINT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "payment_method" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "payment_method"."target" IS 'should array varchar(40)[]';
CREATE TABLE "transaction_dict"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "status" SMALLINT NOT NULL,
    "status_name" VARCHAR(40) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "transaction_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "transaction_dict" ADD CONSTRAINT "transaction_dict_status_unique" UNIQUE("status");
CREATE TABLE "client"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "email" VARCHAR(80) NULL,
    "nickname" VARCHAR(20) NULL,
    "fullname" VARCHAR(120) NULL,
    "branch" VARCHAR(8) NULL,
    "role" SMALLINT NULL,
    "section" SMALLINT NULL,
    "description" VARCHAR(40) NULL,
    "username" VARCHAR(40) NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "client" ADD PRIMARY KEY("id");
CREATE TABLE "role_dict"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "role" SMALLINT NOT NULL,
    "role_name" VARCHAR(20) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "role_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "role_dict" ADD CONSTRAINT "role_dict_role_unique" UNIQUE("role");
CREATE TABLE "transaction"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "client_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "vote_id" UUID NULL,
    "status" SMALLINT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "transaction" ADD PRIMARY KEY("id");
CREATE TABLE "payment"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "client_id" UUID NOT NULL,
    "bill_id" UUID NULL,
    "img_evidence" TEXT NOT NULL,
    "relation_key" VARCHAR(80) NULL,
    "status" SMALLINT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "payment" ADD PRIMARY KEY("id");
CREATE TABLE "vote"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "agree" VARCHAR(40) NULL,
    "disagree" VARCHAR(40) NULL,
    "deadline" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "vote" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "vote"."agree" IS 'should array varchar(40)[]';
COMMENT
ON COLUMN
    "vote"."disagree" IS 'should array varchar(40)[]';
CREATE TABLE "payment_dict"(
    "id" UUID NOT NULL DEFAULT 'uuid_generate_v4()',
    "status" SMALLINT NOT NULL,
    "status_name" VARCHAR(40) NOT NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()'
);
ALTER TABLE
    "payment_dict" ADD PRIMARY KEY("id");
ALTER TABLE
    "payment_dict" ADD CONSTRAINT "payment_dict_status_unique" UNIQUE("status");
ALTER TABLE
    "payment" ADD CONSTRAINT "payment_bill_id_foreign" FOREIGN KEY("bill_id") REFERENCES "bill"("id");
ALTER TABLE
    "transaction" ADD CONSTRAINT "transaction_client_id_foreign" FOREIGN KEY("client_id") REFERENCES "client"("id");
ALTER TABLE
    "payment_method" ADD CONSTRAINT "payment_method_client_id_foreign" FOREIGN KEY("client_id") REFERENCES "client"("id");
ALTER TABLE
    "transaction" ADD CONSTRAINT "transaction_vote_id_foreign" FOREIGN KEY("vote_id") REFERENCES "vote"("id");
ALTER TABLE
    "payment" ADD CONSTRAINT "payment_client_id_foreign" FOREIGN KEY("client_id") REFERENCES "client"("id");