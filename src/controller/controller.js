export class Controller {
    constructor() {}

    homePage(req, res) {
        res.render('index');
    }

    getTime(req, res) {
        res.status(200).send({
            date: new Date().toLocaleDateString('id-ID'),
            time: new Date().toLocaleTimeString('id-ID', { hour12: false })
        })
    }
}