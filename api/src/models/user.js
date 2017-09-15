import bcrypt from 'bcrypt';
import mongoose, {Schema} from 'mongoose';

const schema = new Schema({
	username: String,
	password_hash: String,
})

class UserClass {
	static register_new ({username, password}) {
		return this
			.findOne({username})
			.then(result => {
				if (result) {
					throw {
						message: 'username already exists',
						status: 409,
					};
				}
			})
			.then(() => new Promise(resolve => {
				bcrypt.genSalt(10, function(err, salt) {
					if (err) {
						throw err;
					}
					bcrypt.hash(password, salt, function(err, hash) {
						if (err) {
							throw err;
						}
						resolve(hash)
					});
				});
			}))
			.then(password_hash => {
				return this.create({username, password_hash});
			});
	}
}

schema.loadClass(UserClass);

export default mongoose.model('User', schema);
