const express =require("express");
const app =express();
const mongoose =require("mongoose")
const Listing = require("./models/listings.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then( () => {
    console.log("connected to DB")
}).catch(err => {
    console.log(err);
});
async function main() {
   await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




app.get("/",(req,res) => {
    res.send("Root is working fine");
});

// Index Route
app.get("/listings",async (req,res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{ allListings });
});


//New Route
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs")
})


//Show route
app.get("/listings/:id", async (req,res) => {
let {id}= req.params;
const listing = await Listing.findById(id);
res.render("listings/show.ejs",{ listing });
})

// Create Route
app.post("/listings", wrapAsync(async(req, res, next) => {
        let { title, description, image, price, country, location } = req.body;
        const newListing = new Listing({
            title,
            description,
            image,
            price,
            country,
            location
        });

        await newListing.save();
        res.redirect("/listings");

    
}));


//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing })
}))

// Update Route
app.put("/listings/:id", wrapAsync (async(req,res) => {
      let {id}= req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing})
      res.redirect(`/listings/${id}`);
}))

//delete Route
app.delete("/listings/:id",wrapAsync( async(req,res) => {
    let {id}= req.params;
    let deletedListings =await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
}))




// app.get("/testListing",async(req,res) => {
//     let sampleListing =new Listing({
//         title:"My New Villa",
//         description: "By the Beach",
//         price : 1200,
//         location: "Calangute ,Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful Testing");c
// });

app.all("*", (req, res, next) => {
next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});


app.listen(8080,() => {
    console.log("app is listening on 8080");
})