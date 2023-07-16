import settings from "../config";
const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: `Project API documentation`,
        version: 'v1',
        license: {
            name: 'MIT',
            url: 'respo'
        }
    },
    servers: [
        {
            url: `http://localhost:${settings.PORT}/v1`
        }
    ]
};

export default swaggerDef;