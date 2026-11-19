USE colleg_baptiste_gacuba;

ALTER TABLE admissions
  MODIFY email VARCHAR(150) NULL,
  ADD COLUMN village VARCHAR(100) NULL AFTER phone,
  ADD COLUMN district VARCHAR(100) NULL AFTER village,
  ADD COLUMN sector VARCHAR(100) NULL AFTER district,
  ADD COLUMN province VARCHAR(100) NULL AFTER sector,
  ADD COLUMN parent_names VARCHAR(200) NULL AFTER province,
  ADD COLUMN parent_phone VARCHAR(30) NULL AFTER parent_names,
  ADD COLUMN registration_fee INT UNSIGNED NOT NULL DEFAULT 0 AFTER parent_phone,
  ADD COLUMN payment_status ENUM('unpaid', 'confirmed') NOT NULL DEFAULT 'unpaid' AFTER registration_fee;
