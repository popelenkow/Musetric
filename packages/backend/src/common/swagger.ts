import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import axios from 'axios';
import { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { envs } from '../envs';

export const registerSwagger = async (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Musetric API',
        description: 'API documentation for Musetric',
        version: envs.version,
      },
    },
    transform: jsonSchemaTransform,
  });

  const response = await axios.get<string>(
    'https://popelenkow.github.io/SwaggerDark/SwaggerDark.css',
  );

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    theme: {
      css: [
        {
          filename: 'swagger-dark.css',
          content: response.data,
        },
      ],
    },
  });
};
