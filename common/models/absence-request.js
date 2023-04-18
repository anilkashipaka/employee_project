/* eslint-disable no-undef */
/* eslint-disable max-len */
'use strict';

module.exports = function(Absencerequest) {
  Absencerequest.leaves = (managerId, userId, sickLeaves, vacationLeaves, next) => {
    Absencerequest.app.models.myUser.findOne({where: {userID: userId}}, (err, result) => {
      if (err) return next(err);
      else if (result != null) {
        console.log(result);
        if (sickLeaves <= result.noofSickleaves || vacationLeaves <= result.noofVacation) {
          Absencerequest.create({
            userID: result.userID,
            noofSickleaves: result.noofSickleaves,
            noofVacation: result.noofVacation,
            managerID: result.managerID,
          }, (err, createdInstance) => {
            if (err) return next(err);
            return next(null, {response: 'Leave request created successfully', instance: createdInstance});
          });
        }  else {
          const err = {
            message: 'no leaves available',
          };
          return next(err);
        }
      }
    });
  };

  Absencerequest.remoteMethod('leaves', {
    accepts: [
    {arg: 'managerId', type: 'string'},
    {arg: 'userId', type: 'string'},
    {arg: 'sickLeaves', type: 'integer'},
    {arg: 'vacationLeaves', type: 'integer'},
    ],
    returns: {args: Absencerequest, type: 'object'},
    http: {verb: 'post', path: '/requestLeaves'},
  });

     // accepting the request
  Absencerequest.accept = (userID, next) => {
    Absencerequest.findOne({where: {userID: userID}}, (err, result) => {
      if (err) return next(err);
      else if (result != null) {
        result.status = 'accepted';
        result.save();
        Absencerequest.app.models.myUser.findOne({where: {userID: result.userID}}, (err, data) =>{
          if (err)          {
            return next(err);
          } else {
            const sl = data.noofSickleaves - result.noofSickleaves;
            const vl = data.noofVacation -  result.noofVacation;
            result.noofSickleaves = sl;
            result.noofVacation = vl;
            data.save();
            Absencerequest.app.models.myUser.updateAll({userID: result.userID}, {noofSickleaves: sl, noofVacation: vl}, (err, res) =>{
              if (err) return next(err);
              console.log(res);
            });
          }

          // return next(err);
        });

        return next(null, {response: 'Request accepted successfully', instance: result});
      } else {
        return next(err);
      }
    });
  };

  Absencerequest.remoteMethod('accept', {
    accepts: [
    {arg: 'userID', type: 'string'},
    ],
    returns: {args: Absencerequest, type: 'object'},
    http: {verb: 'post', path: '/acceptRequest'},
  });

    // rejecting the request
  Absencerequest.reject = (userID, next) => {
    Absencerequest.findOne({where: {userID: userID}}, (err, result) => {
      if (err) return next(err);
      else if (result != null) {
        result.status = 'rejected';
        result.save();
        return next(null, {response: 'Request rejected successfully', instance: result});
      }
      return next(err);
    });
  };
  Absencerequest.remoteMethod('reject', {
    accepts: [
    {arg: 'userID', type: 'string'},
    ],
    returns: {args: Absencerequest, type: 'object'},
    http: {verb: 'post', path: '/rejectRequest'},
  });

  // get all the employees absenceRequest objects under the same managerID
  Absencerequest.getAbsenceRequests = (managerID, next) => {
    Absencerequest.app.models.myUser.findOne({where: {managerID: managerID}}, (err, result) => {
      if (err) return next(err);
      else if (result != null) {
        Absencerequest.find({where: {managerID: managerID}}, (err, result) => {
          if (err) return next(err);
          else if (result != null) {
            console.log(result);
            return next(null, result);
          }
        });
      } else {
        return next(err);
      }
    });
  };

  Absencerequest.remoteMethod('getAbsenceRequests', {
    accepts: [
        {args: 'managerID', type: 'Number'},
    ],
    returns: {args: Absencerequest, type: 'object'},
    http: {verb: 'get', path: '/getAbsenceRequest'},
  });
};

