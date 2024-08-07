const cors = require("cors");

const corsMiddleware = (req, res, next) => {
  const options = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
    exposedHeaders: ["accessToken"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
    allowedHeaders: "Content-Type, Authorization, accesstoken, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
    maxAge: 3600
  };

  cors(options)(req, res, (err) => {
    if (err) {
      console.error('CORS Error:', err);
      return res.status(400)
        .json({ error: "Oops! Faced Cors Error :(" });
    }
    next();
  });
};

module.exports = corsMiddleware;
