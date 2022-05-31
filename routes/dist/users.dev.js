"use strict";

var express = require('express');

var router = express.Router();

var db = require('../models/index');

var _require = require("sequelize"),
    Op = _require.Op;
/* GET users listing. */


router.get('/', function (req, res, next) {
  var nm = req.query.name;
  var ml = req.query.mail;
  db.User.findAll().then(function (usrs) {
    var data = {
      title: 'Users/Index',
      content: usrs
    };
    res.render('users/index', data);
  });
});
router.get('/add', function (req, res, next) {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err: null
  };
  res.render('users/add', data);
});
router.post('/add', function (req, res, next) {
  var form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  };
  db.sequelize.sync().then(function () {
    return db.User.create(form).then(function (usr) {
      res.redirect('/users');
    })["catch"](function (err) {
      var data = {
        title: 'Users/Add',
        form: form,
        err: err
      };
      res.render('users/add', data);
    });
  });
});
router.get('/edit', function (req, res, next) {
  db.User.findByPk(req.query.id).then(function (usr) {
    var data = {
      title: 'Users/Edit',
      form: usr
    };
    res.render('users/edit', data);
  });
});
router.post('/edit', function (req, res, next) {
  db.sequelize.sync().then(function () {
    return db.User.update({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    }, {
      where: {
        id: req.body.id
      }
    });
  }).then(function (usr) {
    res.redirect('/users');
  });
});
router.get('/delete', function (req, res, next) {
  db.User.findByPk(req.query.id).then(function (usr) {
    var data = {
      title: 'Users/Delete',
      form: usr
    };
    res.render('users/delete', data);
  });
});
router.post('/delete', function (req, res, next) {
  db.sequelize.sync().then(function () {
    return db.User.destroy({
      where: {
        id: req.body.id
      }
    });
  }).then(function (user) {
    res.redirect('/users');
  });
});
router.get('/login', function (req, res, next) {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力してください。'
  };
  res.render('users/login', data);
});
router.post('/login', function (req, res, next) {
  db.User.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass
    }
  }).then(function (usr) {
    if (usr != null) {
      req.session.login = usr;
      var back = req.session.back;

      if (back == null) {
        back = '/';
      }

      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力ください。'
      };
      res.render('users/login', data);
    }
  });
});
module.exports = router;