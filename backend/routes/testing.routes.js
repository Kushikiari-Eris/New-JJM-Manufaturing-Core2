import express from 'express'
import { add, get, update} from '../controllers/testing.controller.js'

const router = express.Router()

router.post('/', add)
router.get('/', get)
router.put('/:taskId', update)

export default router