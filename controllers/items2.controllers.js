import { db } from "../utils/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Using "items2" collection to distinguish from the other items collection
export const getItems = async (req, res) => {
  try {
    const items2Collection = collection(db, "items2");
    const snapshot = await getDocs(items2Collection);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getItem = async (req, res) => {
  try {
    const itemDoc = doc(db, "items2", req.params.id);
    const itemSnapshot = await getDoc(itemDoc);

    if (!itemSnapshot.exists()) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ id: itemSnapshot.id, ...itemSnapshot.data() });
  } catch (error) {
    console.error("Error getting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createItems = async (req, res) => {
  try {
    const { name, price } = req.body;

    const newItem = {
      name,
      price: Number(price),
      createdAt: new Date(),
    };

    const items2Collection = collection(db, "items2");
    const docRef = await addDoc(items2Collection, newItem);

    res.status(201).json({
      id: docRef.id,
      ...newItem,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteItems = async (req, res) => {
  try {
    const itemDoc = doc(db, "items2", req.body.id);
    await deleteDoc(itemDoc);

    res.status(200).json({ msg: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateItems = async (req, res) => {
  try {
    const { id, name, price } = req.body;

    const itemDoc = doc(db, "items2", id);
    const itemSnapshot = await getDoc(itemDoc);

    if (!itemSnapshot.exists()) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedItem = {
      name,
      price: Number(price),
      updatedAt: new Date(),
    };

    await updateDoc(itemDoc, updatedItem);

    res.json({
      id,
      ...updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
