import mongoose from "mongoose";

const Article = mongoose.model('Article', {
    title: {
        type: String
    },
    idAuthor: {
        type: String
    },
    date: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
});

export default Article;