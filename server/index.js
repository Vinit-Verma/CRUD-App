const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const FoodModel = require("./models/Food");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/food", {})
  .then(() => {
    console.log("Connection Established");
  })
  .catch(() => {
    console.log("Connection not established");
  });

app.post("/insert", async (req, res) => {
  const foodName = req.body.foodName;
  const weight = req.body.weight;
  const food = new FoodModel({ foodName: foodName, weight: weight });
  try {
    await food.save();
    res.send("Data inserted");
  } catch (error) {
    console.log(error, "from here");
  }
});

app.get("/read", async (req, res) => {
  // FoodModel.find({ $where: { foodName: "apple" } }); //If we wish to access some specific entries.
  FoodModel.find({}, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send(result);
  });
});

app.put("/update", async (req, res) => {
  const newFoodName = req.body.newFoodName;
  // const newWeight = req.body.newWeight;
  const id = req.body.id;

  try {
    await FoodModel.findById(id, (error, updatedFood) => {
      updatedFood.foodName = newFoodName;
      // updatedFood.weight = newWeight;
      updatedFood.save();
      res.send("Updated");
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await FoodModel.findByIdAndRemove(id).exec();
  res.send("Item deleted");
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
