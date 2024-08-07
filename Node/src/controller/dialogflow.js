const { SessionsClient } = require('@google-cloud/dialogflow');
const dialogflowCreds = {
    type: process.env.DIALOGFLOW_ACCOUNT_TYPE,
    project_id: process.env.DIALOGFLOW_PROJECT_ID,
    private_key_id: process.env.DIALOGFLOW_PRIVATE_KEY_ID,
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    client_id: process.env.DIALOGFLOW_CLIENT_ID,
    auth_uri: process.env.DIALOGFLOW_AUTH_URI,
    token_uri: process.env.DIALOGFLOW_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.DIALOGFLOW_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.DIALOGFLOW_CLIENT_X509_CERT_URL,
    universe_domain: process.env.DIALOGFLOW_UNIVERSE_DOMAIN
}

const sessionClient = new SessionsClient({
    credentials: dialogflowCreds
});

const sendMessage = async (req, res) => {
    const { message, sessionId } = req.body;
    const sessionPath = sessionClient.projectAgentSessionPath(dialogflowCreds.project_id, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US'
            }
        }
    };

    try {
        const [response] = await sessionClient.detectIntent(request);
        const result = response.queryResult;
        res.status(200).json({ status: "success", message: result.fulfillmentText });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", error: 'Internal server error' });
    }
}

module.exports = { sendMessage }