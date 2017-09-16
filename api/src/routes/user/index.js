import register from './register';
import login from './login'

export default {
  controllers: Object.assign({},
    register.controllers,
    login.controllers,
  ),
}
