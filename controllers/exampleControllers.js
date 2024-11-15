// const Example = require('../models/exampleModel')

// exports.getAllExamples = (req, res) => {
//   Example.getAll((err, results) => {
//     if (err) {
//       res.status(500).json({ error: err })
//     } else {
//       res.status(200).json(results)
//     }
//   })
// }

// exports.getExampleById = (req, res) => {
//   const id = req.params.id
//   Example.getById(id, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err })
//     } else {
//       res.status(200).json(results)
//     }
//   })
// }

// exports.createExample = (req, res) => {
//   const exampleData = req.body
//   Example.create(exampleData, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err })
//     } else {
//       res
//         .status(201)
//         .json({ message: 'Example created successfully', id: results.insertId })
//     }
//   })
// }

// exports.updateExample = (req, res) => {
//   const id = req.params.id
//   const exampleData = req.body
//   Example.update(id, exampleData, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err })
//     } else {
//       res.status(200).json({ message: 'Example updated successfully' })
//     }
//   })
// }

// exports.deleteExample = (req, res) => {
//   const id = req.params.id
//   Example.delete(id, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err })
//     } else {
//       res.status(200).json({ message: 'Example deleted successfully' })
//     }
//   })
// }
