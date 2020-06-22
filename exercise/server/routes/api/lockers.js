const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

//Get Lockers
router.get('/', async (req, res)=> {
    const lockers = await loadLockersCollection()
    res.send(await lockers.find({}).toArray())
    
})
//Post Locking
router.post('/', async (req, res)=> {
    const lockers = await loadLockersCollection()
    await lockers.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
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
