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

export const getItems = async (req, res) => {
  try {
    const itemsCollection = collection(db, "items");
    const snapshot = await getDocs(itemsCollection);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getItem = async (req, res) => {
  try {
    const itemDoc = doc(db, "items", req.params.id);
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

    const itemsCollection = collection(db, "items");
    const docRef = await addDoc(itemsCollection, newItem);

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
    const itemDoc = doc(db, "items", req.params.id);
    await deleteDoc(itemDoc);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateItems = async (req, res) => {
  try {
    const { id, name, price } = req.body;

    const itemDoc = doc(db, "items", id);
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
