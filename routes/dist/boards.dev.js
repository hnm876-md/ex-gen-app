"use strict";

var express = require('express');

var router = express.Router();

var db = require('../models/index');

var _require = require("sequelize"),
    Op = _require.Op;

var pnum = 10; // ログインのチェック

function check(req, res) {
  if (req.session.login == null) {
    req.session.back = '/boards';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
} // トップページ


router.get('/', function (req, res, next) {
  res.redirect('/boards/0');
}); // トップページにページ番号をつけてアクセス

router.get('/:page', function (req, res, next) {
  if (check(req, res)) {
    return;
  }

  ;
  var pg = req.params.page * 1;
  db.Board.findAll({
    offset: pg * pnum,
    limit: pnum,
    order: [['createdAt', 'DESC']],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(function (brds) {
    var data = {
      title: 'Boards',
      login: req.session.login,
      content: brds,
      page: pg
    };
    res.render('boards/index', data);
  });
}); // メッセージフォームの送信処理

router.post('/add', function (req, res, next) {
  if (check(req, res)) {
    return;
  }

  ;
  db.sequelize.sync().then(function () {
    return db.Board.create({
      userId: req.session.login.id,
      message: req.body.msg
    }).then(function (brd) {
      res.redirect('/boards');
    })["catch"](function (err) {
      res.redirect('/boards');
    });
  });
}); // 利用者のホーム

router.get('/home/:user/:id/:page', function (req, res, next) {
  if (check(req, res)) {
    return;
  }

  ;
  var id = req.params.id * 1;
  var pg = req.params.page * 1;
  db.Board.findAll({
    where: {
      userId: id
    },
    offset: pg * pnum,
    limit: pnum,
    order: [['createdAt', 'DESC']],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(function (brds) {
    var data = {
      title: 'Boards',
      login: req.session.login,
      userId: id,
      userName: req.params.user,
      content: brds,
      page: pg
    };
    res.render('boards/home', data);
  });
});
module.exports = router;