import { Router } from "express";
import Style from "../models/style.js";
import multer, { diskStorage } from "multer";

const router = Router();

let filename = "";
const myStorage = diskStorage({
  destination: "../../uploads/",
  filename: (req, file, redirect) => {
    let date = Date.now();

    let f1 = date + "." + file.mimetype.split("/")[1];

    redirect(null, f1);
    filename = f1;
  },
});

const upload = multer({ storage: myStorage });

router.post("/blog", upload.any("image"), (req, res) => {
  let data = req.body;
  let style = new Style(data);
  style.date = new Date();

  style
    .save()
    .then((saved) => {
      res.status(200).send(saved);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/all", (req, res) => {
  Style.find({})
    .then((styles) => {
      res.status(200).send(styles);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/getbyid/:id", (req, res) => {
  let id = req.params.id;

  Style.findOne({ _id: id })
    .then((styles) => {
      res.status(200).send(styles);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/getbyidauthor/:id", (req, res) => {
  let id = req.params.id;

  Style.find({ idAuthor: id })
    .then((styles) => {
      res.status(200).send(styles);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;

  Style.findByIdAndDelete({ _id: id })
    .then((style) => {
      res.status(200).send("The style has been deleted");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.put("/update/:id", upload.any("image"), (req, res) => {
  let id = req.params.id;
  let data = req.body;
  if (filename.length > 0) {
    data.image = filename;
  }

  Style.findByIdAndUpdate({ _id: id }, data)
    .then((style) => {
      filename = "";
      res.status(200).send(style);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default router;
