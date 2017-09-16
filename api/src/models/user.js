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

	static login_user ({username, password}) {
		return this.
			findOne({username})
			.then(user => {
				if (!user) {
					throw {
						message: 'username not found',
						status: 404,
					}
				}
				return new Promise(resolve => {
					bcrypt.compare(password, user.password_hash, function(err, result) {
						if (err) {
							throw err;
						}
						if (!result) {
							throw {
								message: 'wrong password',
								status: 500,
							};
						}
						resolve(user);
					});
				});
			})
	}
}

schema.loadClass(UserClass);

export default mongoose.model('User', schema);
