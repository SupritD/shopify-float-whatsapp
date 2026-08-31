-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NULL DEFAULT false,
    `emailVerified` BOOLEAN NULL DEFAULT false,
    `refreshToken` VARCHAR(191) NULL,
    `refreshTokenExpires` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatsAppConfig` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `selectedCountryIso` VARCHAR(191) NOT NULL DEFAULT 'IN',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '91',
    `message` VARCHAR(191) NOT NULL DEFAULT '',
    `displayStyle` VARCHAR(191) NOT NULL DEFAULT 'icon_only',
    `buttonText` VARCHAR(191) NOT NULL DEFAULT 'Chat with us',
    `animation` VARCHAR(191) NOT NULL DEFAULT 'pulse',
    `useCustomLink` BOOLEAN NOT NULL DEFAULT false,
    `customUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `iconWidth` VARCHAR(191) NOT NULL DEFAULT '28',
    `iconHeight` VARCHAR(191) NOT NULL DEFAULT '28',
    `transparentBg` BOOLEAN NOT NULL DEFAULT false,
    `bgColor` VARCHAR(191) NOT NULL DEFAULT '#25D366',
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `buttonSize` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `horizontalPos` VARCHAR(191) NOT NULL DEFAULT 'right',
    `verticalPos` VARCHAR(191) NOT NULL DEFAULT 'bottom',
    `rightOffset` INTEGER NOT NULL DEFAULT 20,
    `bottomOffset` INTEGER NOT NULL DEFAULT 20,
    `visibility` VARCHAR(191) NOT NULL DEFAULT 'always',
    `displayDelay` VARCHAR(191) NOT NULL DEFAULT '0',
    `pageVisibilityRule` VARCHAR(191) NOT NULL DEFAULT 'all',
    `targetPages` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WhatsAppConfig_shop_key`(`shop`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
