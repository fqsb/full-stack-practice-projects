const AccessControl = require('accesscontrol');
const ac = new AccessControl();

ac.grant('student')
  .readAny('activity')
  .readOwn('user')
  .updateOwn('user')
  .createOwn('registration')
  .readOwn('registration')
  .deleteOwn('registration');

ac.grant('teacher')
  .extend('student')
  .createOwn('activity')
  .updateOwn('activity')
  .deleteOwn('activity')
  .readAny('registration')
  .updateAny('registration');

ac.grant('admin')
  .extend('teacher')
  .createAny('activity')
  .updateAny('activity')
  .deleteAny('activity')
  .createAny('activityType')
  .updateAny('activityType')
  .deleteAny('activityType')
  .readAny(`user`)
  .updateAny('user')
  .deleteAny('user')
  .createAny('notification')
  .updateAny('notification')
  .deleteAny('notification')
  .readAny('approval')
  .updateAny('approval');

const roles = ac;
module.exports = { roles };