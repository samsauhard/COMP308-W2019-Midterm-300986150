//Name:Sauhard
//StudentId: 300986150

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      console.log(books);
      res.render('books/index',
       {
        title: 'Books',
        books: books
        
      
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      console.log(books);
      res.render('books/details',
       {
        title: 'Add Books',
        //Return nothing just the title as we are using same page for adding and editing.  
        books: books
        
      
      });
    }
  });

});


// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

//create a newbook object with all the values from frontend
    let newBook = book({
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
  });

  //add data to the mongo database
  book.create(newBook, (err, book) => {
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
        //redirect back to the books page
        res.redirect('/books');
      }
  });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    //get id from the parameter and find by id in mongo database and populate the textboxes
    let booksid = req.params.id;
    book.findById(booksid, (err, bookObject) => {
      if (err) {
        console.log(err);
        res.end(err);
      }
      else {
        res.render('books/details', {
          title: 'Edit Book',
          books: bookObject
        });
      }
    });

});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
//once we hit the submit buton we fetch all the data from frontend or ejs and update it to database
    let bookid = req.params.id;

    let updatedBook = book({
      "_id": bookid,
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
  });
  book.update({_id: bookid}, updatedBook, (err) => {
    if(err) {
        console.log(err);
        res.end(err);
    }
    else {
        res.redirect('/books');
    }
});
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
//delete the user by id from mongodb

    let bookid = req.params.id;
    book.remove({_id: bookid}, (err) => {
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
          res.redirect('/books');
      }
  });
});


module.exports = router;
