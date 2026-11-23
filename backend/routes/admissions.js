const express = require('express');
const { getDatabase } = require('../config/database');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const courses = ['O-Level', 'Software Development', 'Accounting'];
const genders = ['Male', 'Female', 'Other'];
const studyLevels = {
  'O-Level': ['S1', 'S2', 'S3'],
  'Software Development': ['L3', 'L4', 'L5'],
  Accounting: ['S4', 'S5', 'S6']
};

router.post('/', requireAuth, async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const applicantName = typeof body.applicantName === 'string'
    ? body.applicantName.trim()
    : '';
  const gender = typeof body.gender === 'string'
    ? body.gender
    : '';
  const course = typeof body.course === 'string'
    ? body.course
    : '';
  const studyLevel = typeof body.studyLevel === 'string'
    ? body.studyLevel
    : '';
  const religion = typeof body.religion === 'string'
    ? body.religion.trim()
    : '';
  const village = typeof body.village === 'string'
    ? body.village.trim()
    : '';
  const district = typeof body.district === 'string'
    ? body.district.trim()
    : '';
  const sector = typeof body.sector === 'string'
    ? body.sector.trim()
    : '';
  const province = typeof body.province === 'string'
    ? body.province.trim()
    : '';
  const parentNames = typeof body.parentNames === 'string'
    ? body.parentNames.trim()
    : '';
  const parentPhone = typeof body.parentPhone === 'string'
    ? body.parentPhone.trim()
    : '';
  const sport = typeof body.sport === 'string' ? body.sport : '';
  const fatherNames = typeof body.fatherNames === 'string'
    ? body.fatherNames.trim()
    : '';
  const fatherPhone = typeof body.fatherPhone === 'string'
    ? body.fatherPhone.trim()
    : '';
  const motherNames = typeof body.motherNames === 'string'
    ? body.motherNames.trim()
    : '';
  const motherPhone = typeof body.motherPhone === 'string'
    ? body.motherPhone.trim()
    : '';
  const insurance = typeof body.insurance === 'string'
    ? body.insurance
    : '';
  const phone = fatherPhone || parentPhone;
  const email = typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';

  if (
    !applicantName ||
    !phone ||
    !genders.includes(gender) ||
    !courses.includes(course) ||
    !studyLevels[course].includes(studyLevel) ||
    !religion ||
    !village ||
    !district ||
    !sector ||
    !province ||
    !sport ||
    !fatherNames ||
    !fatherPhone ||
    !motherNames ||
    !motherPhone ||
    !insurance ||
    !['Football', 'Basketball', 'Volleyball', 'Athletics', 'None'].includes(sport) ||
    !['RSSB', 'Private', 'None'].includes(insurance)
  ) {
    return res.status(400).json({
      message: 'Uzuza amakuru yose asabwa, uhitemo isomo n’igitsina.'
    });
  }

  if (
    applicantName.length > 150 ||
    religion.length > 100 ||
    phone.length > 30 ||
    fatherNames.length > 150 ||
    fatherPhone.length > 30 ||
    motherNames.length > 150 ||
    motherPhone.length > 30 ||
    sport.length > 30 ||
    insurance.length > 30 ||
    village.length > 100 ||
    district.length > 100 ||
    sector.length > 100 ||
    province.length > 100 ||
    parentNames.length > 200 ||
    parentPhone.length > 30 ||
    email.length > 150 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    return res.status(400).json({
      message: 'Hari amakuru arenze umubare wemerewe cyangwa imeyili si yo.'
    });
  }

  try {
    const result = await getDatabase().collection('admissions').insertOne({
      applicant_name: applicantName,
      email: email || null,
      phone,
      gender,
      religion,
      course,
      study_level: studyLevel,
      sport,
      village,
      district,
      sector,
      province,
      father_names: fatherNames,
      father_phone: fatherPhone,
      mother_names: motherNames,
      mother_phone: motherPhone,
      insurance,
      parent_names: fatherNames,
      parent_phone: fatherPhone,
      registration_fee: 3000,
      payment_status: 'unpaid',
      status: 'pending',
      application_date: new Date()
    });

    return res.status(201).json({
      message: 'Ubusabe bwo kwiga bwakiriwe.',
      applicationId: result.insertedId.toString(),
      registrationFee: 3000,
      paymentNumber: '0795083641',
      paymentStatus: 'unpaid'
    });
  } catch (error) {
    console.error('Admission application error:', error);
    return res.status(500).json({
      message: 'Ubusabe ntibwabitswe. Reba ko database ivuguruye, wongere ugerageze.'
    });
  }
});

module.exports = router;
