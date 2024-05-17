-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR,
    "avatar" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "avatar" VARCHAR,
    "description" VARCHAR,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_recipients" (
    "chatId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,

    CONSTRAINT "chat_recipients_pkey" PRIMARY KEY ("chatId","userId")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" VARCHAR NOT NULL,
    "chatId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "chat_recipients_chatId_idx" ON "chat_recipients" USING HASH ("chatId");

-- CreateIndex
CREATE INDEX "chat_recipients_userId_idx" ON "chat_recipients" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "messages_chatId_idx" ON "messages" USING HASH ("chatId");

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages" USING HASH ("userId");

-- AddForeignKey
ALTER TABLE "chat_recipients" ADD CONSTRAINT "chat_recipients_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_recipients" ADD CONSTRAINT "chat_recipients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
