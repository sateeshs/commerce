
const handler = async (event, context, callback) => {
    const email = event?.request?.userAttributes?.email;
    if(email) {
        let climes = {};
        const phoneNumber = '';
        climes.phoneNumber = phoneNumber;
        // Check user exists in Super users table
        climes.isSuperAdmin = true;
    }

    event.response = {
        climesOverrideDetails: {
            claimsToAddOrOverride: climes
        }
    };
}