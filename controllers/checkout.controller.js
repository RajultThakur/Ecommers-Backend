const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "T-shirt"
                    },
                    unit_amount: 100,
                },
                quantity: 10
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_END_POINT}/order/success`,
        cancel_url: `${process.env.FRONTEND_END_POINT}/cart`,
    });

    // return res.json({
    //     statue303, session.url);

    return res.status(303).json({
        success: true,
        url: session.url
    })
};

module.exports = { makePayment }