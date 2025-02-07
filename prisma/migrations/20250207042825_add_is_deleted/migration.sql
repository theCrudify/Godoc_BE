-- CreateTable
CREATE TABLE `mst_product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL,
    `category` VARCHAR(50) NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `product_name`(`product_name`),
    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mst_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NULL,
    `phone_number` VARCHAR(15) NULL,
    `role` ENUM('admin', 'seller', 'customer') NULL DEFAULT 'customer',
    `status` ENUM('active', 'inactive', 'banned') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone_number`(`phone_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mst_product` ADD CONSTRAINT `mst_product_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `mst_user`(`user_id`) ON DELETE SET NULL ON UPDATE NO ACTION;
