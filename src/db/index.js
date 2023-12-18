const mongoose = require("mongoose");
require("dotenv").config();




async function connectToMongo(tries) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
    } catch (error) {
        console.error({ error, tries });
        if (tries.retries < 5) {
            // Retry with an increased retry count
            ++tries.retries;
            await connectToMongo(tries);
        } else {
            console.error('Max retries reached. Unable to connect to MongoDB.');
        }
    }
}

(async function(){

    const tries = {retries:0} 
    try {
        await connectToMongo(tries)        
    } catch (error) {
        console.error({error, message: `failed to connect to MONGODB, retried ${tries.retries} times`})
    }

})()