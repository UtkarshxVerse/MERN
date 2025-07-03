const express = require('express');             //1
const mongoose = require('mongoose');          //2
const server = express();                    //3            
const cors = require('cors');

server.use(express.json()) // Middleware to parse JSON bodies
server.use(cors())  // will accept every domain 

const userSchema = new mongoose.Schema({                    //6
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const userModel = mongoose.model("User", userSchema);               //7

//5
server.post("/user/create", (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.contact) {
            return res.send(
                {
                    msg: "Please fill all the fields",
                    flag: 0
                }
            )
        }

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact
        })

        user.save().then(
            () => {
                res.send({
                    msg: "User created successfully",
                    flag: 1
                })
            }
        ).catch(
            () => {
                res.send({
                    msg: "User creation failed",
                    flag: 0
                })
            }
        )

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
})

server.get("/user/get-data", async (req, res) => {
    try {
        const user = await userModel.find()
        res.send({
            msg: "User data fetched",
            flag: 1,
            users: user
        })
    } catch (error) {
        res.send({
            msg: "Internal server error",
            flag: 0
        })
    }
})

server.delete("/user/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            userModel.deleteOne({
                _id: id
            }).then(
                () => {
                    res.send({
                        msg: "User deleted successfully :)",
                        flag: 1
                    })
                }
            ).catch(
                (error) => {
                    res.send({
                        msg: "User not found !",
                        flag: 0
                    })
                }
            )
        }

    } catch (error) {
        res.send({
            msg: "Internal server error !",
            flag: 0
        })

    }
})

// patch updates specific field and keep rest of the data untouched
server.patch("/user/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            userModel.updateOne(
                {
                    _id: id
                },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        status: !user.status
                    }
                }
            ).then(
                () => {
                    res.send({
                        msg: "User status updated successfully :)",
                        flag: 1
                    })
                }
            ).catch(
                (error) => {
                    res.send({
                        msg: "User not found !",
                        flag: 0
                    })
                }
            )
        } else {
            res.send({
                msg: "User not found !",
                flag: 0
            })
        }

    } catch (error) {
        res.send({
            msg: "Internal server error",
            flag: 0
        })

    }
})

server.put("/user/update/:id", (req, res) => {
    try {
        const id = req.params.id;
        userModel.findOneAndUpdate(
            {
                _id: id
            },
            {
                // // instead of writing these name, email, contact
                // // we can use req.body directly but it will update all the fields BY ...req.body command
                // // so we are using findOneAndUpdate to update only the fields we want to update
                name: req.body.name, 
                email: req.body.email,
                contact: req.body.contact
            }
        ).then(
            () => {
                res.send({
                    msg: "User updated successfully :)",
                    flag: 1
                })
            }
        ).catch(
            (error) => {
                res.send({
                    msg: "User unable to update!",
                    flag: 0
                })
            }
        )

    } catch (error) {
        res.json({
            msg: "Internal Server Error"
        });

    }
})

//4
mongoose.connect("mongodb://localhost:27017/", { dbname: "New" }).then(
    () => {
        server.listen(5000, () => {
            console.log("Server is running on port 5000");
        })
        console.log("Connected to mongoDB");
    }
).catch(
    (error) => {
        console.log("Database connection error:", error);
    }
)