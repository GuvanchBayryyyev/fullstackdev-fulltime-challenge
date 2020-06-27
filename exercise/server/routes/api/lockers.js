const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

//Get Lockers
router.get('/', async (req, res)=> {
    const lockers = await loadLockersCollection()
    res.send(await lockers.find({}).toArray())
    
})
//Get by id
router.get('/:id', async (req, res)=> {
    const lockers = await loadLockersCollection()
    res.send(await lockers.findOne({_id:new mongodb.ObjectID(req.params.id) }))
})
//Post Locking
router.post('/', async (req, res)=> {
    const lockers = await loadLockersCollection()
    await lockers.insertOne({
        unit: req.body.unit,
        size: req.body.size,
        firstprice: req.body.firstprice,
        nextprice: req.body.nextprice,
        status: req.body.status,
        payment: req.body.payment,
        password: null,
        lockedAt: null
    });
    res.status(201).send();
})
//Update Locking
router.put('/:id', async (req, res) => {
    const lockers = await loadLockersCollection()
    await lockers.save({ 
        _id: new mongodb.ObjectID(req.params.id),
        unit: req.body.unit,
        size: req.body.size,
        firstprice: req.body.firstprice,
        nextprice: req.body.nextprice,
        status: req.body.status,
        payment: req.body.payment,
        password: req.body.password,
        lockedDate: new Date()
     });
    res.status(200).send();
})
//Delete Locking
router.delete('/:id', async (req, res) => {
    const lockers = await loadLockersCollection()
    await lockers.deleteOne({_id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
})

async function loadLockersCollection(){
    const client = await mongodb.MongoClient.connect
    ('mongodb+srv://thomkhan:thomkhan@cluster0-hjgav.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return client.db('test').collection('lockers')
}

module.exports = router
