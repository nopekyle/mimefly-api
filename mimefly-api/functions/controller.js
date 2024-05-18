const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

module.exports = {
    getTimeline: async function (req, res) {
        let posts = [];
        let uid = req.params.uid;

        if (uid === null) {
            res.status(400).send('uid is null');
        } else {

            let timeline = await db.collection('timeline')
                .where('to_uid', '==', uid)
                .orderBy('dateCreated', 'desc')
                .limit(10)
                .get()
                .catch(e => { });

            if (timeline.docs.length === 0) {
                res.status(404).send('no posts');
            } else {
                /* eslint-disable no-await-in-loop */
                for (let i = 0; i < timeline.size; i++) {
                    // get the answer info
                    let answer = await db.collection('answers')
                        .doc(timeline.docs[i].data().answerId)
                        .get()
                        .catch(e => {

                        });

                    // get the answer user info
                    let answerUser = await db.collection('users')
                        .doc(answer.data().uid)
                        .get()
                        .catch(e => {

                        });

                    // get the question info 
                    let question = await db.collection('questions')
                        .doc(answer.data().questionId)
                        .get()
                        .catch(e => {

                        });

                    // get the question user info
                    let questionUser = await db.collection('users')
                        .doc(question.data().uid)
                        .get()
                        .catch(e => {

                        });

                    posts.push({
                        askerName: questionUser.data().displayName,
                        profilePic: answerUser.data().profilePic,
                        userDisplayName: answerUser.data().displayName,
                        questionText: question.data().questionText,
                        questionImage: question.data().questionImage,
                        dateCreated: answer.data().dateCreated,
                        answerDate: answer.data().dateCreated,
                        answerText: answer.data().answerText,
                        answerImage: answer.data().answerImage,
                        questionId: question.id,
                        answerId: answer.id,
                        uid: answerUser.id,
                        askerId: questionUser.id,
                        answererUsername: answerUser.data().username,
                        askerUsername: questionUser.data().username,
                        askerPic: questionUser.data().profilePic,
                        questionDate: question.data().dateCreated,
                        questionDeleted: question.data().deleted,
                        answerDeleted: answer.data().deleted
                    });

                }
                /* eslint-enable no-await-in-loop */
                res.status(200).send(JSON.stringify(posts));
            }
        }
    },

    getMoreTimeline: async function (req, res) {
        let posts = [];
        let uid = req.params.uid;
        let seconds = parseInt(req.query.seconds);
        let nanoseconds = parseInt(req.query.nanoseconds);
        console.log(uid + '//' + seconds + '//' + nanoseconds);
        if (uid === null || seconds === null || nanoseconds === null || !Number.isInteger(seconds + nanoseconds)) {
            res.status(400).send('bad args');
        } else {
            let timestamp = new admin.firestore.Timestamp(seconds, nanoseconds);

            let timeline = await db.collection('timeline')
                .where('to_uid', '==', uid)
                .orderBy('dateCreated', 'desc')
                .startAfter(timestamp)
                .limit(10)
                .get()
                .catch(e => { });

            if (timeline.docs.length === 0) {
                res.status(404).send('no more posts');
            } else {
                /* eslint-disable no-await-in-loop */
                for (let i = 0; i < timeline.size; i++) {
                    // get the answer info
                    let answer = await db.collection('answers')
                        .doc(timeline.docs[i].data().answerId)
                        .get()
                        .catch(e => {

                        });

                    // get the answer user info
                    let answerUser = await db.collection('users')
                        .doc(answer.data().uid)
                        .get()
                        .catch(e => {

                        });

                    // get the question info 
                    let question = await db.collection('questions')
                        .doc(answer.data().questionId)
                        .get()
                        .catch(e => {

                        });

                    // get the question user info
                    let questionUser = await db.collection('users')
                        .doc(question.data().uid)
                        .get()
                        .catch(e => {

                        });

                    posts.push({
                        askerName: questionUser.data().displayName,
                        profilePic: answerUser.data().profilePic,
                        userDisplayName: answerUser.data().displayName,
                        questionText: question.data().questionText,
                        questionImage: question.data().questionImage,
                        dateCreated: answer.data().dateCreated,
                        answerDate: answer.data().dateCreated,
                        answerText: answer.data().answerText,
                        answerImage: answer.data().answerImage,
                        questionId: question.id,
                        answerId: answer.id,
                        uid: answerUser.id,
                        askerId: questionUser.id,
                        answererUsername: answerUser.data().username,
                        askerUsername: questionUser.data().username,
                        askerPic: questionUser.data().profilePic,
                        questionDate: question.data().dateCreated,
                        questionDeleted: question.data().deleted,
                        answerDeleted: answer.data().deleted
                    });

                }
                /* eslint-enable no-await-in-loop */
                res.status(200).send(JSON.stringify(posts));
            }
        }
    },
    getInbox: async function (req, res) {
        let posts = [];
        let uid = req.params.uid;

        if (uid === null) {
            res.status(400).send('uid is null');
        } else {
            let inbox = await db.collection('inbox')
                .where('uid', '==', uid)
                .orderBy('dateCreated', 'desc')
                .limit(10)
                .get()
                .catch(e => { });

            if (inbox.docs.length === 0) {
                res.status(404).send('no posts');
            } else {
                /* eslint-disable no-await-in-loop */
                for (let i = 0; i < inbox.size; i++) {
                    // get question
                    let question = await db.collection('questions')
                        .doc(inbox.docs[i].data().questionId)
                        .get()
                        .catch(e => {

                        })

                    // get user of question
                    let questionUser = await db.collection('users')
                        .doc(question.data().uid)
                        .get()
                        .catch(e => {

                        });

                    posts.push({
                        uid: questionUser.id,
                        questionId: question.id,
                        profilePic: questionUser.data().profilePic,
                        displayName: questionUser.data().displayName,
                        questionText: question.data().questionText,
                        questionImage: question.data().questionImage,
                        dateCreated: question.data().dateCreated,
                        askerUsername: questionUser.data().username
                    });
                }
                /* eslint-enable no-await-in-loop */
                res.status(200).send(JSON.stringify(posts));
            }
        }
    },
    getMoreInbox: async function (req, res) {
        let posts = [];
        let uid = req.params.uid;
        let seconds = parseInt(req.query.seconds);
        let nanoseconds = parseInt(req.query.nanoseconds);

        if (uid === null || seconds === null || nanoseconds === null || !Number.isInteger(seconds + nanoseconds)) {
            res.status(400).send('bad args');
        } else {
            let timestamp = new admin.firestore.Timestamp(seconds, nanoseconds);

            let inbox = await db.collection('inbox')
                .where('uid', '==', uid)
                .orderBy('dateCreated', 'desc')
                .startAfter(timestamp)
                .limit(10)
                .get()
                .catch(e => {

                });

            if (inbox.docs.length === 0) {
                res.status(404).send('no more posts');
            } else {
                /* eslint-disable no-await-in-loop */
                for (let i = 0; i < inbox.size; i++) {
                    // get question
                    let question = await db.collection('questions')
                        .doc(inbox.docs[i].data().questionId)
                        .get()
                        .catch(e => {

                        })

                    // get user of question
                    let questionUser = await db.collection('users')
                        .doc(question.data().uid)
                        .get()
                        .catch(e => {

                        });

                    posts.push({
                        uid: questionUser.id,
                        questionId: question.id,
                        profilePic: questionUser.data().profilePic,
                        displayName: questionUser.data().displayName,
                        questionText: question.data().questionText,
                        questionImage: question.data().questionImage,
                        dateCreated: question.data().dateCreated,
                        askerUsername: questionUser.data().username
                    });
                }
                /* eslint-enable no-await-in-loop */
                res.status(200).send(JSON.stringify(posts));
            }
        }
    },
    banUser: async function (req, res) {
        const uid = req.params.uid;

        if (!uid) {
            return res.status(403).send('no uid');
        }

        const user = await db.collection('users')
            .doc(uid)
            .update({
                deleted: true
            }).catch(e => { });

        admin.auth().updateUser(uid, {
            disabled: true
        }).catch(e => { });

        admin.auth().revokeRefreshTokens(uid);


        return res.status(200).send();

    },
    deleteComment: async function (req, res) {

        const id = req.params.id;

        db.collection('comments')
            .doc(id)
            .update({
                deleted: true
            }).catch(e => { });

        return res.status(200).send();

    },
    deleteAnswer: async function (req, res) {

        const id = req.params.id;

        db.collection('answers')
            .doc(id)
            .update({
                deleted: true
            }).catch(e => { });

        return res.status(200).send();

    },
    deleteQuestion: async function (req, res) {

        const id = req.params.id;

        db.collection('questions')
            .doc(id)
            .update({
                deleted: true
            }).catch(e => { });

        return res.status(200).send();

    }
};