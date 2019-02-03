function addSecurity(security, callback) {
    console.log('Adding security');
    console.log(security);

    // Here there is a few things we need to do
    // * category: convert to categoryid
    // * markets: convert to al list of marketids
    // * and then insert into table
    //
    // we might want to create convenience methods in configservice to handle
    // the conversion to ids

    callback({
        status: 404,
        reason: 'Function not implemented -- in server/securityservice.js'
    });
}

module.exports = {
    addSecurity
};