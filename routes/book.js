const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//               ----ApI----

// add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if(user.role !== "Admin")
        {
            return res
            .status(403)
            .json({ message: "Access denied. Admins only." });
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,    
            price: req.body.price,
            description: req.body.description,
            language: req.body.language,
        });
        await book.save();
        return res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
});

// update book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description,
            language: req.body.language
        });

        return res.status(200).json({ 
            message: "Book updated successfully!", 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
});
 
// delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ 
            message: "Book deleted successfully!", 
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
});

//get all books --public
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
    });

//get recently added books limit 4 --public
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4); 
        return res.json({ 
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
});

//get book by id --public
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({ 
            status: "success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
