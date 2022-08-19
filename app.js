const {  ObjectId } = require("mongodb");
const express = require("express");
const { getDb, connectToDb } = require("./db");
const app = express();
app.use(express.json());


let db;
connectToDb((err) => {
  if (!err) {
    app.listen(5000, () => {
      console.log("listening on port 5000");
    })
    db = getDb();
  }
});

app.get("/empData", (req, res) => {

  // //* pagination
  const pages = req.query.pages || 0;
  const empPerpage = 2

  let data = [];
  db.collection('empData').find() //toArray() forEach use krty
  .sort({name: 1})
  // //* pagination
  .skip(pages * empPerpage)
  .limit(empPerpage)
  .forEach(emp => data.push(emp))
  .then(() => {
    res.status(200).json({data});
  })
  .catch(() => {
    res.status(500).json({error:"error"})
  })
  
});


app.get('/empData/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

    db.collection('empData')
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({ error: 'Could not fetch the document' })
      })

  } else {
    res.status(500).json({ error: 'Could not fetch the document' })
  }

})

app.post('/empData', (req, res) => {
  const emp = req.body

  db.collection('empData')
    .insertOne(emp)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({ errot: 'Could not create new document' })
    })
})

app.delete('/empData/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

    db.collection('empData')
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({ error: 'Could not delete document' })
      })

  } else {
    res.status(500).json({ error: 'Could not delete document' })
  }
})

// //* patch used to update the particular field in document.
app.patch('/empData/:id',(req,res) => {
  const updated = req.body
  if (ObjectId.isValid(req.params.id)) {

    db.collection('empData')
      .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updated})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({ error: 'Could not update document' })
      })

  } else {
    res.status(500).json({ error: 'Could not update document' })
  }
})

// //* to create indexes
// db.empData.createIndex({class: "10"})