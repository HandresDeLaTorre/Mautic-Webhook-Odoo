const checkOrigin = (req, res, next) => {
    try {
        const token = req.headers['x-origin-base-url']
        if (token === 'https://hola.hermosamujer.com.co') {
            next()
        } else {
            res.status(409)
            res.send({ error: 'El servidor no encontro al usuario' })
        }

    } catch (e) {
        next()
    }

}

module.exports = checkOrigin