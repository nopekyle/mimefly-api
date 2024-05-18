const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controller = require('./controller');

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/timeline/:uid', async (req, res) => {
    return controller.getTimeline(req, res);
});

app.get('/moreTimeline/:uid', async (req, res) => {
    return controller.getMoreTimeline(req, res);
});

app.get('/inbox/:uid', async (req, res) => {
    return controller.getInbox(req, res);
});

app.get('/moreInbox/:uid', async (req, res) => {
    return controller.getMoreInbox(req, res);
});

app.get('/admin/secretroutechangethis/ban/:uid', async (req, res) => {
    return controller.banUser(req, res);
});

app.get('/admin/secretroutechangethis/deleteComment/:id', async (req, res) => {
    return controller.deleteComment(req, res);
});

app.get('/admin/secretroutechangethis/deleteAnswer/:id', async (req, res) => {
    return controller.deleteAnswer(req, res);
});

app.get('/admin/secretroutechangethis/deleteQuestion/:id', async (req, res) => {
    return controller.deleteQuestion(req, res);
});

exports.app = functions.https.onRequest(app);
