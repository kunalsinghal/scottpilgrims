import { Router } from 'express';
import User from '../../models/user'

const routes = Router();

routes.post('/api/user/register', (req, res, next) => {
  const {username, password} = req.body;
  User.register_new({username, password})
    .then(({username}) => {
      res.send({username});
    })
    .catch(next);
});

export default {controllers: {register: routes}}
