import mongoose, { connect } from 'mongoose';

connect('mongodb://0.0.0.0:27017/myblog').then(
    ()=> {
        console.log('connected');
    }
).catch(
    (err) => {
        console.log(err);
    }
)

export default mongoose;