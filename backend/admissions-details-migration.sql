USE colleg_baptiste_gacuba;

ALTER TABLE admissions
  ADD COLUMN religion VARCHAR(100) NULL AFTER gender,
  ADD COLUMN study_level VARCHAR(10) NULL AFTER course;
