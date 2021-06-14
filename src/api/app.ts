import express = require('express');
import * as session from 'express-session';
import 'reflect-metadata';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as Multer from 'multer';
import { InversifyExpressServer } from 'inversify-express-utils';

import { ApiContainer } from './apiConfig';
import { ConstantValues } from './constantValues';
//
import './controllers/index';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg'
];

let server = new InversifyExpressServer(ApiContainer, null, {
  rootPath: ConstantValues.api
});
let multer = Multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

server.setConfig((app): void => {
  app.use(allowCrossDomain);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '250mb' }));
  app.use(multer.array('files'));
  app.use(cookieParser());
  app.use(
    session({
      key: 'usr_id',
      secret: 'a82qu3s3f1l3upl0ad3r',
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000
      }
    })
  );
  app.use(express.static('src/public'));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/public/index.html'));
  });
  app.get('*', (req, res, next) => {
    if (req.url.split('/')[1] === 'api') {
      return next();
    }
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve(`src/public/${req.url}`));
    }
    res.sendFile(path.resolve('src/public/index.html'));
  });
});

function allowCrossDomain(req, res, next): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, authorization, Content-Length, X-Requested-With'
  );
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}

export default server.build();
