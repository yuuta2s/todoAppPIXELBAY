import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGO_URI;

const client = new MongoClient(url);

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json()); // Middleware pour parser le JSON
// Servir les fichiers statiques de l'application React build
app.use(express.static("dist"));

async function connectToMongo() {
    try {
      await client.connect();
      console.log("Connecté à MongoDB");
    } catch (err) {
      console.error(err);
    }
  }




app.get("/api/tasks", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); // Sélection de la collection 'tasks'
      const tasks = await collection.find({}).toArray(); // Récupération de toutes les tâches sous forme de tableau
      res.json(tasks); // Envoi des tâches au client sous forme de JSON
    } catch (err) {
      res.status(500).json({ error: err.message }); // Envoi d'une réponse d'erreur en cas de problème
    }
  });
  
  
  app.post("/api/tasks", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); // Sélection de la collection 'tasks'
      const task = req.body; // Récupération de la nouvelle tâche envoyée dans le corps de la requête
      await collection.insertOne(task); // Insertion de la nouvelle tâche dans la collection
      res.status(201).json(task); // Envoi de la nouvelle tâche ajoutée au client
    } catch (err) {
      res.status(500).json({ error: err.message }); // Envoi d'une réponse d'erreur en cas de problème
    }
  });
  
  
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); // Sélection de la collection 'tasks'
      const { id } = req.params; // Récupération de l'identifiant de la tâche à mettre à jour
      const task = req.body; // Récupération des nouvelles données de la tâche
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: task }); // Mise à jour de la tâche dans la collection
      res.json(task); // Envoi de la tâche mise à jour au client
    } catch (err) {
      res.status(500).json({ error: err.message }); // Envoi d'une réponse d'erreur en cas de problème
    }
  });
  
 
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); // Sélection de la collection 'tasks'
      const { id } = req.params; // Récupération de l'identifiant de la tâche à supprimer
      await collection.deleteOne({ _id: new ObjectId(id) }); // Suppression de la tâche de la collection
      res.status(204).send(); // Envoi d'une réponse vide avec le statut 204 (No Content)
    } catch (err) {
      res.status(500).json({ error: err.message }); // Envoi d'une réponse d'erreur en cas de problème
    }
  });

  
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
    connectToMongo();
  });
