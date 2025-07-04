const axios = require('axios');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.BASE_URL}/api/auth/google/callback`;

exports.getGoogleOAuthURL = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    }
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}


exports.getGoogleUser = async (code) => {
    const rootUrl = 'https://oauth2.googleapis.com/token';
    console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const options = {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    }
    console.log('Authorization code:', code);

    const qs = new URLSearchParams(options);
    const response = await axios.post(`${rootUrl}`, qs.toString());
    const { access_token, id_token } = response.data;
    const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
    const userInfo = userInfoResponse.data;
    return userInfo;
}