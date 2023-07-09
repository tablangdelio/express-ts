import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from "express";
import {Server} from 'http'
import createHttpError from "http-errors";
import {config} from 'dotenv'
import bodyParser from 'body-parser';
config()


const app: Application = express();
app.use(bodyParser.json());
const PORT: Number = Number(process.env.PORT) || 3000

app.get('/', (req: Request, res:Response, next: NextFunction) => {

   const serverStatus = {
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    running: true,
    currentTime: new Date().toISOString(),
    buildNumber: process.env.CI_PIPELINE_IID || 'unknown',
  };
const endpoints: { path: string; methods: string[]; requestBody?: any }[] = [];

  // Iterate over the router's stack
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Extract path and HTTP methods from each route
      const { path } = middleware.route;
      const methods = Object.keys(middleware.route.methods);

      // Check if the route is a POST endpoint
      const isPostEndpoint = methods.includes('post');

      // Extract request body parameters for POST endpoints
      let requestBody;
      if (isPostEndpoint) {
        const { stack } = middleware.route;
        stack.forEach((layer: any) => {
          if (layer.handle && layer.handle.name === 'jsonParser') {
            requestBody = Object.keys(layer.handle.bodySchema.properties);
          }
        });
      }

      // Add endpoint information to the endpoints array
      endpoints.push({ path, methods, requestBody });
    }
  });

  // Return the list of endpoints
  res.json(endpoints);
})

app.post('/users', (req: Request, res: Response) => {
  // Endpoint for creating a new user
  const { name, email } = req.body;
  res.json({ message: `Create new user with name: ${name}, email: ${email}` });
});

// Define your API routes
app.get('/users', (req: Request, res: Response) => {
  // Endpoint for retrieving users
  res.json({ message: 'Get all users' });
});

app.get('/users/:id', (req: Request, res: Response) => {
  // Endpoint for retrieving a specific user
  const userId = req.params.id;
  res.json({ message: `Get user with ID ${userId}` });
});


app.use((req: Request, res:Response, next: NextFunction) => {
    next(new createHttpError.NotFound())
})

const errorHandler:ErrorRequestHandler = (err, req, res, next) => {

    res.status(err.status || 500)
    res.send({
        status: err.status || 500,
        message: err.message
    })

}



app.use(errorHandler)

const server: Server = app.listen(PORT, () => console.log(`running on port ${PORT}`))