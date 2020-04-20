import { Router } from 'express';

const routes = Router();

routes.post('/users', (request, response) => {
  const { name, email } = request.body;

  const user = {
    name,
    email
  };

  response.json({ message: 'Hello Jeff!' });
});

export default routes;
