"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var db = require('../models/index');

var _require = require('sequelize'),
    Op = _require.Op;

var MarkdownIt = require('markdown-it');

var markdown = new MarkdownIt();
var pnum = 10;

function check(req, res) {
  if (req.session.login == null) {
    req.session.back = '/md';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

router.get('/', function (req, res, next) {
  if (check(req, res)) {
    return;
  }

  ;
  db.Markdata.findAll({
    where: {
      userId: req.session.login.id
    },
    limit: pnum,
    order: [['createAt', 'DESC']]
  }).then(function (mds) {
    var data = {
      title: 'Markdown Search',
      login: req.session.login,
      message: '※最近の投稿データ',
      form: {
        find: ''
      },
      content: mds
    };
    res.render('md/index', data);
  });
});
router.post('/', function (req, res, next) {
  if (check(req, res)) {
    return;
  }

  ;
  db.Markdata.findAll({
    where: {
      userId: req.session.login.id,
      content: _defineProperty({}, Op.like, '%' + req.body.find + '%')
    },
    order: [['createAt', 'DESC']]
  }).then(function (mds) {
    var data = {
      title: 'Markdown Search',
      login: req.session.login,
      message: '※"' + req.body.find + '"で検索されたデータ',
      form: req.body,
      content: mds
    };
    res.render('md/index', index);
  });
});
router.get('/add');