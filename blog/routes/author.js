import { Router } from 'express'
import multer, { diskStorage } from 'multer'

const router = Router()

let filename = '';
const myStorage = diskStorage({
    destination: './uploads',
    filename: (req, file, redirect) => {
        let date = Date.now();

        let f1 = date + '.' + file.mimetype.split('/')[1];

        redirect(null, f1);
        filename = f1;
    }
})

const upload = multer({ storage: myStorage })

// router.post('/register', upload.any('image'), (req, res) => {

//     data = req.body
//     stylist = new Stylist(data)
//     // stylist.image = filename
//     // user.image = filename

//     salt = bcrypt.genSaltSync(10)
//     stylist.password = bcrypt.hashSync(data.password, salt)

//     stylist.save().then((savedStylist) => {
//         filename = ''
//         res.status(200).send(savedStylist)
//     }).catch((err) => {
//         res.status(400).send(err)
//     })
// })

// router.post('/register', (req, res) => {

//     data = req.body
//     user = new User(data)
//     // user.image = filename

//     // salt = bcrypt.genSaltSync(10)
//     // user.password = bcrypt.hashSync(data.password, salt)

//     user.save().then((savedUser) => {
//         filename = ''
//         res.status(200).send(savedUser)
//     }).catch((err) => {
//         res.status(400).send(err)
//     })
// })

// router.post('/signin', (req, res) => {
//     let data = req.body;

//     findOne({ email: data.email }).then((stylist) => {
//         let valid = compareSync(data.password, stylist.password);
//         if (!valid) {
//             res.send('email or password invalid');
//         } else {
//             let payload = {
//                 _id: stylist._id,
//                 email: stylist.email,
//                 username: stylist.username
//             };

//             let token = sign(payload, '12345678');

//             res.send({ mytoken: token });
//         }
//     }).catch((err) => {
//         res.send(err);
//     });

//     _findOne({ email: data.email }).then((user) => {
//         let valid = compareSync(data.password, user.password);
//         if (!valid) {
//             res.send('email or password invalid');
//         } else {
//             let payload = {
//                 _id: user._id,
//                 email: user.email,
//                 username: user.username
//             };

//             let token = sign(payload, '12345678');

//             res.send({ mytoken: token });
//         }
//     }).catch((err) => {
//         res.send(err);
//     });
// });

router.get('/all', (req, res) => {
    find({}).then((stylists) => {
        res.status(200).send(stylists)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id

    findOne({ _id: id }).then((stylists) => {
        res.status(200).send(stylists)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id

    findByIdAndDelete({ _id: id }).then((stylist) => {
        res.status(200).send(stylist)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

router.put('/update/:id', (req, res) => {

})



export default router;