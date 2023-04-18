/* eslint-disable comma-spacing */
/* eslint-disable no-undef */
/* eslint-disable max-len */
'use strict';

module.exports = function(Myuser) {
   // adding static leaves

  Myuser.afterRemote('create', (context, data, next) => {
    console.log(data);
    const userID = data.id;
    Myuser.app.models.Role.findOne({where: {name: data.role}}, (err, role) => {
      if (err) console.log(err);
      console.log(role);

      if (role.id != null) {
        Myuser.app.models.RoleMapping.create({
          principalType: Myuser.app.models.RoleMapping.USER,
          principalId: userID,
          roleId: role.id,
        }, (err, result) => {
          if (err) console.log(err);
          console.log('successMAP');
          console.log(result);
        });
      }
    });
    next();
  });

    // implementing the deleteUser method to delete the user from the DB

  Myuser.deleteUser = (username, role, managerId, userId, cb) => {
    Myuser.findOne({where: {username: username, role: role, managerId: managerId, userId: userId}},
        (err, data) => {
          if (err) cb(err);

          // if there is data assigned to that particular information
          else if (data != null) {
            console.log(data);
          // we are gonna destroy that document in the db
          // by destroyById method built in method given by the db
            Myuser.destroyById(data.id, (err) => {
              if (err) console.log(err);
            });

          // and aslo should detroy in the role mapping too
            Myuser.app.models.RoleMapping.findOne({where: {principalId: data.id}}, (err, res) =>{
              if (err) console.log(err);

              Myuser.app.models.RoleMapping.destroyById(res.data.id, (err) => {
                if (err) console.log(err);
              });
            });

            cb(err, {'message': 'successfully deleted'});
          }

        // last else block if there is no user
          else {
            return cb(err, {'message': 'no user is exists'});
          }
        });
  };

    // for deleting the user we define the paramateres for the remote method
  Myuser.remoteMethod('deleteUser',
    {
      accepts: [{arg: 'username', type: 'string'}, {arg: 'role', type: 'string'}, {arg: 'managerId', type: 'string'},
    {arg: 'userId', type: 'string'}],
      returns: {args: Myuser, type: 'object'},
      http: {verb: 'post', path: '/deleteuser'},
    });

  Myuser.getUsers = (managerID, next) => {
    Myuser.find({where: {managerID: managerID}}, (err, result) => {
      if (err) return next(err);
      else if (result != null) {
        console.log(result);
        return next(null, result);
      }
      else {
        return next(null, err);
      }
    });
  };

  Myuser.remoteMethod('getUsers', {
    accepts: [
          {args: 'managerID', type: 'Number'},
    ],
    returns: {args: Myuser, type: 'object'},
    http: {verb: 'get', path: '/getUser'},
  });
};
