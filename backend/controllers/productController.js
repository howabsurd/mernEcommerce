const Product = require("../model/productModel")
const ErrorHander = require("../utils/errorHander")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


exports.createProduct = catchAsyncErrors(async (req, res, next)=>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({success : true, product});
})



// admin route
exports.getAllProducts =catchAsyncErrors(async (req,res, next)=>{
    const resultPerPage=8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({success : true, products, productsCount, resultPerPage});
})

// Get produtc deteails

exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",400))
    }
    res.status(200).json({
        success : true,
        product
    })
})


// admin route 
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({success : `False`, message:`Product not found`})
    }
    await Product.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators : true, useFindAndModify:false});
    res.status(200).json({
        success : true,
        product
    })
})

// ADIMIN

exports.deleteProduct = catchAsyncErrors(async (req,res ,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({success : false, message: `Product not found`});
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success : true,
        message : `Product deleted successfullt`
    })
})


// Create new Review or update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    console.log(rating , comment, productId)
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    // Find the product by productId
    const product = await Product.findById(productId);
  
    // Handle case where product is not found
    if (!product) {
      return next(new ErrorHander(`Product not found with ID: ${productId}`, 404));
    }
  
    // Check if the user has already reviewed the product
    const isReviewed = product.reviews?.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    // Update existing review or add new review
    if (isReviewed) {
      product.reviews?.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews?.length;
    }
  
    // Calculate average rating
    let avg = 0;
    product.reviews?.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / (product.reviews?.length || 1); // Prevent division by zero
  
    // Save the updated product
    await product.save({ validateBeforeSave: false });
  
    // Respond with success
    res.status(200).json({
      success: true,
    });
  });
  
  // get product reviews
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });