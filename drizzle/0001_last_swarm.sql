CREATE TABLE `users_provider_idx` (
	`provider` text,
	`provider_id` text
);
--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "password" TO "password" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `provider` text;--> statement-breakpoint
ALTER TABLE `users` ADD `provider_id` text;