const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const { v4: uuid } = require('uuid')

const lessons = []

// Get all lessons
router.get('/', (req, res) => {
    res.render('lessons', {
        title: 'All lessons',
        isLesson: true,
        lessons
    })
})

// Get add lesson
router.get('/add', (req, res) => {
    res.render('addLesson', {
        title: 'Add lesson',
        isAdd: true
    })
})

// Get single lesson with name
router.get('/lesson', (req, res) => {
    // console.log(req.query);
    const lesson = lessons.find(les => les.name === req.query.name)
    res.status(200).send(lesson)
})

// Get single lesson with id
router.get('/:id', (req, res) => {
    // console.log(req.params); // bitta object
    const lesson = lessons.find(les => les.id === req.params.id)
    if (!lesson) {
        return res.status(404).send('404 not found')
    }
    res.render("lesson", {
        title: lesson.name,
        lesson
    })
})

// Delete single lesson with id
router.get('/delete/:id', authMiddleware, (req, res) => {
    const idx = lessons.findIndex(les => les.id === req.params.id)

    // Validator
    if (idx === -1) {
        return res.status(404).send('404 not found. Id is not exist')
    }

    lessons.splice(idx, 1)
    res.redirect('/api/lessons')
})

// Post add lesson
router.post('/add', authMiddleware, (req, res) => {
    const schema = Joi.object({
        name: Joi.string().
            min(3).
            required(),
        author: Joi.string()
            .required(),
        price: Joi.string()
            .required(),
        year: Joi.number(),
        img: Joi.string()
            .required()
    })

    const value = schema.validate(req.body)

    if (value.error) {
        res.status(404).send(value.error.message)
        return
    }

    const lesson = {
        name: req.body.name,
        id: uuid(),
        img: req.body.img,
        year: req.body.year || new Date(),
        author: req.body.author,
        price: req.body.price
    }

    lessons.push(lesson)
    res.redirect('/api/lessons')
})

// Put lesson with id
router.put('/update/:id', authMiddleware, (req, res) => {
    const idx = lessons.findIndex(les => les.id === +req.params.id)

    // Validator
    if (idx === -1) {
        return res.status(404).send('404 not found. Id is not exist')
    }

    let lesson = {
        name: req.body.name,
        id: req.params.id
    }

    lessons[idx] = lesson

    res.redirect('/add')
})
router.get('/update/:id', (req, res) => {
    res.render('addLesson', {
        title: 'updateLesson'
    })
})

module.exports = router