USE colleg_baptiste_gacuba;

ALTER TABLE admissions
  ADD COLUMN sport VARCHAR(30) NULL AFTER study_level,
  ADD COLUMN father_names VARCHAR(150) NULL AFTER province,
  ADD COLUMN father_phone VARCHAR(30) NULL AFTER father_names,
  ADD COLUMN mother_names VARCHAR(150) NULL AFTER father_phone,
  ADD COLUMN mother_phone VARCHAR(30) NULL AFTER mother_names,
  ADD COLUMN insurance VARCHAR(30) NULL AFTER mother_phone;
