import { MongoClient, ServerApiVersion } from "mongodb";

// Hardcoded URI for debugging purposes
const uri = "mongodb+srv://aviasnani2004:Mongo%402025@cluster04.vptlceg.mongodb.net/?retryWrites=true&w=majority&appName=cluster04";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("employees");

export default db;