import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/watchstore').then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }]
  }));
  const user = await User.findOne();
  console.log("Found user:", user?.username);
  if (user) {
    console.log("User favorites:", user.favorites);
  }
  process.exit(0);
});
