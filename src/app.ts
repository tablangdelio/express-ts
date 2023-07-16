import express, { type Request, type Response, type NextFunction, type Application, type ErrorRequestHandler } from "express";

import createHttpError from "http-errors";
import settings from './config'
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger/swaggerSpec'

const app: Application = express();
app.use(bodyParser.json());


app.get('/users', (req, res) => {
  res.send('wee')
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound())
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    status: err.status || 500,
    message: err.message
  })

}

app.use(errorHandler)

app.listen(settings.PORT, () => console.log(`running on port ${settings.PORT}`))