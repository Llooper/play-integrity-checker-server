import { google } from "googleapis";
const playintegrity = google.playintegrity('v1');


const packageName = process.env.PACKAGE_NAME
const client_email = process.env.CLIENT_EMAIL
const private_key = process.env.PRIVATE_KEY

async function getTokenResponse(token) {

    let jwtClient = new google.auth.JWT(
        client_email,
        null,
        private_key,
        ['https://www.googleapis.com/auth/playintegrity']);

    google.options({ auth: jwtClient });

    const res = await playintegrity.v1.decodeIntegrityToken(
        {
            packageName: packageName,
            requestBody:{
                "integrityToken": token
            }
        }

    );


    console.log(res.data.tokenPayloadExternal);

    return res.data.tokenPayloadExternal
}

module.exports = async (req, res) => {

    const { token = 'none' } = req.query

    if (token == 'none') {
        res.status(400).send({ 'error': 'No token provided' })
        return
    }

    getTokenResponse(token)
        .then(data => {
            res.status(200).send(data)
            return
        })
        .catch(e => {
            console.log(e)
            res.status(200).send({ 'error': 'Google API error.\n' + e.message })
            return
        });
}
