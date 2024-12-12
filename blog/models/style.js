import mongoose from "mongoose";

const Style = mongoose.model('Style', {
    context: {
        type: String
    },
    idAuthor: {
        type: String
    },
    date: {
        type: String
    },
    image: {
        type: String
    }
});

export default Style;