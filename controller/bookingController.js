const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controller/handlerFactory');
const AppError = require('../utils/appError');


exports.getChechoutSession = catchAsync( async (req, res, next) => {
    
    // 1) get the currenty booked tour
    const tour = await Tour.findById(req.params.tourId);
    
    // 2) Create a chechout session
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
                    },
                    unit_amount: tour.price * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
    });

    console.log(session)
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session,
    });
});