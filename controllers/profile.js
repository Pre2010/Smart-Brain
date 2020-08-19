const handleProfileGet = (request, response, db) => {
    const {id} = request.params;

    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            response.json(user[0]);
        } else {
            response.status(404).json('user not found')
        }
    })
    .catch(error => response.status(404).json('Error getting user'));
};

module.exports = {
    handleProfileGet: handleProfileGet
};