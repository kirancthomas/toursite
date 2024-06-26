const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controller/handlerFactory');
const AppError = require('../utils/appError');


exports.getChechoutSession = catchAsync( async (req, res, next) => {
    
    // 1) get the currenty booked tour
    const tour = await Tour.findById(req.params.tourId);
    
    // 2) Create a chechout session
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
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
                        images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`], //images only get when the app or wedsite is live
                    },
                    unit_amount: tour.price * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
    });

    // console.log(session)
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session,
    });
    
});

// exports.createBookingCheckout =catchAsync(async (req, res, next) => {
//     //this is just temprory. because it's unsecure , everyone can make booking without paying
//     const { tour, user, price } = req.query;

//     if(!tour && !user && !price) return next();
//     await Booking.create({ tour, user, price})
    
//     res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({email: session.customer_email})).id;
    const price = session.amount_total / 100;

    await Booking.create({ tour, user, price})

};


exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try{

         event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOKS_SECRET);
    }catch(err) {
        return res.status(400).send(`webhook error: ${err.message}`)
    }

    if(event.type === 'checkout.session.completed')
        createBookingCheckout(event.data.object);

    res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
