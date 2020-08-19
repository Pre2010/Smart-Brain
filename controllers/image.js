const Clarifai = require('clarifai');

// will need to get your own API key from the Clarifai website
const appClarifai = new Clarifai.App({
    apiKey: '145e281b24044a5fb7f5606f13a03981'
});

const handleApiCall = (request, response) => {
    appClarifai.models
        .predict(Clarifai.FACE_DETECT_MODEL,
            request.body.input)
            .then(data => {
                response.json(data);
            })
            .catch(error => response.status(400).json('Unable to work with API'));
}

const handleImage = (request, response, db) => {

    const {id} = request.body;
    
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        response.json(entries[0]);
    })
    .catch(error => response.status(400).json('Unable to retrieve entries'));
};

module.exports = {
    handleImage,
    handleApiCall
};