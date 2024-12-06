const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const roomRouter = require("./routes/RoomRouter");
const authRouter = require("./routes/authRouter");
const aiRouter = require("./routes/aiRouter");
const chatRouter = require("./routes/chatRouter");

const filesRouter = require("./routes/FilesRoute");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/room", roomRouter);
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  console.log(process.env.DB_URL);

  res.send("ok");
});

app.listen(3000, () => {
  console.log("server started at http://localhost:3000");
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

// routes
app.use("/api/files", filesRouter);
app.use("/api/room", roomRouter);

app.get("/", (req, res) => {
  console.log(process.env.DB_URL);

  res.send("it is ok");
});

app.listen(PORT, () => {
  console.log("server started at port : ", PORT);
});

// const uri = "mongodb+srv://nazmussakibapurbo:IJcCEdKtlV5zlDj7@cluster0.wznn11w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const complaintSchema = new mongoose.Schema({
  location: String,
  area: String,
  city: String,
  country: String,
  lat: Number,
  lon: Number,
  date: { type: Date, default: Date.now },
  complaintType: String,
  complaintDescription: String,
  comments: [
    {
      name: String,
      email: String,
      comment: String,
    },
  ], // Added comments field
});

const Complaint = mongoose.model("Complaint", complaintSchema);

app.post('/api/complaint/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, comment } = req.body;
    console.log(id)
    console.log(req.body);

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $push: { comments: { name, email, comment } } },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).send('Complaint not found');
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).send('Error adding comment: ' + error.message);
  }
});


const validateCrimeSchema = new mongoose.Schema({
  location: String,
  area: String,
  city: String,
  country: String,
  lat: Number,
  lon: Number,
  date: Date,
  complaintType: String,
  complaintDescription: String,
  status: { type: String, default: "validate" },
  comments: [
    {
      name: String,
      email: String,
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const ValidateCrime = mongoose.model("ValidateCrime", validateCrimeSchema);


app.post("/api/validate-crime", async (req, res) => {
  console.log("Request Body:", req.body);  // Log the incoming request body
  
  try {
    // Create a new ValidateCrime instance with the request body
    const validatedCrime = new ValidateCrime(req.body);
    
    // Log the validatedCrime to ensure it looks correct
    console.log("Validated Crime Data:", validatedCrime);
    
    // Save the new validated crime data
    await validatedCrime.save();
    
    // Send a success response
    res.status(201).json({ message: "Crime data successfully validated and saved" });
  } catch (err) {
    // Log the error to get more details
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/validatedcrimes', async (req, res) => {
  try {
    
    const validatedCrimes = await ValidateCrime.find({ status: "validate" });
    res.status(200).json(validatedCrimes);
  } catch (error) {
    console.error('Error fetching validated crimes:', error);
    res.status(500).json({ error: 'Failed to fetch validated crimes' });
  }
});

// Route to handle complaint submission
app.post("/api/complaint", async (req, res) => {
  try {
    console.log(req.body);
    const { location, area, city, country, lat, lon, complaintType, complaintDescription } = req.body;

    // Create a new complaint with the additional fields
    const newComplaint = new Complaint({
      location,
      area,
      city,
      country,
      lat,
      lon,
      complaintType, // Add the complaint type
      complaintDescription, // Add the complaint description
    });

    // Save the complaint to the database
    await newComplaint.save();
    res.status(201).send("Complaint reported successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reporting complaint.");
  }
});

app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).send("Error fetching complaints.");
  }
});



app.get("/api/complaint/:id", async (req, res) => {
  try {
    const complaintId = req.params.id;
    console.log(complaintId);

  
    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      return res.status(404).send("Complaint not found");
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching complaint details");
  }
});


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const crimecollection = client.db("test").collection("complaints");
    const allcrimecollection = client.db("test").collection("validatecrimes");

    console.log("Connected to MongoDB and collection initialized!");
   
    // Define the POST route here
    app.post("/api/generate-content", async (req, res) => {
      const { prompt } = req.body;
     console.log(prompt);
      try {
        const crimeData = await allcrimecollection.find().toArray();
        console.log(crimeData);
        const combinedPrompt = `
          Analyze the following crime data and respond to the user's prompt and if user asked any other question beside crime analysis answer that you are only trained for crime analysis and predict crime and how to resolve this and also provide solution from the law and rules:
          crime Data: ${JSON.stringify(crimeData)}
          User Prompt: ${prompt}
        `;

        // Get the generative model and generate content
        const model = await genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        const result = await model.generateContent(combinedPrompt);

        res.json({ content: result.response });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate content" });
      }
    });
    app.post("/api/analyze-crime/:id", async (req, res) => {
      const { id } = req.params; 
      console.log("Analyzing crime with ID:", id);
      try {
        const crimeData = await Complaint.findById(id);
        const allcrimeData = await allcrimecollection.find().toArray();
        console.log(crimeData);
        if (!crimeData) {
          return res.status(404).json({ error: "Crime not found" });
        }
        console.log(crimeData);
    const combinedPrompt = `
      Analyze the following crime data:
      Single Crime Data: ${JSON.stringify(crimeData)}
      All Crime Data: ${JSON.stringify(allcrimeData)}
      
      Determine how validated the single crime data is compared to all historical data.
      Provide a validation score between 40 and 100.
      Only respond with the score as a numeric value.
    `;

        // Get the generative model and generate content
        const model = await genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        const result = await model.generateContent(combinedPrompt);

        res.json({ content: result.response });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate content" });
      }
    });

   

    app.post("/Gemini/api", async (req, res) => {
      try {
        const { name, type } = req.body;
        console.log(req.body);

        const fileManager = new GoogleAIFileManager(process.env.API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        // Upload the file to your file manager
        const uploadResult = await fileManager.uploadFile(
          `E:\\iiec hackathon\\install-git\\backend\\${name}`,
         
          {
            mimeType: type,
            displayName: "Home",
          }
        );

        const fileUri = uploadResult.file.uri;

        // Generate content using the Google Generative AI model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          "Write about the image in 4 lines",
          {
            fileData: {
              fileUri: fileUri,
              mimeType: type,
            },
          },
        ]);

        // Extract the text from the result
        const analysisText = result.response.text(); // Make sure this method correctly extracts the text

        console.log("Analysis Result:", analysisText);

        // Send the analysis text back to the frontend
        res.status(200).json({ analysis: analysisText });
      } catch (error) {
        console.error("Error analyzing image:", error);
        res
          .status(500)
          .json({ error: "Failed to analyze image", details: error.message });
      }
    });

    // Validate Crime Schema and Model



    app.get("/room/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await basacollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Payment not found" });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to retrieve payment details" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the function to connect to MongoDB and start the server
run().catch(console.dir);
