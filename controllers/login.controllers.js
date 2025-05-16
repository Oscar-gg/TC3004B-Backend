// import { getSqlPool } from "../utils/sql.js";
// import sql from "mssql";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { db } from "../utils/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const getUsers = async (req, res) => {
  const userCollection = collection(db, "users");
  const snapshot = await getDocs(userCollection);
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.json(users);
};

export const getUser = async (req, res) => {
  try {
    const userDoc = doc(db, "users", req.params.id);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: userSnapshot.id, ...userSnapshot.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const userCollection = collection(db, "users");
    const q = query(userCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = crypto.randomBytes(24).toString("base64url").slice(0, 24);
    const pepper = process.env.PEPPER;

    const saltedPassword = crypto
      .createHash("sha512")
      .update(password + salt + pepper)
      .digest("hex");

    const userData = {
      name,
      username,
      password: salt + saltedPassword,
      createdAt: new Date(),
    };

    const docRef = await addDoc(userCollection, userData);

    res.status(201).json({
      message: "User created successfully",
      userId: docRef.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDoc = doc(db, "users", req.params.id);

    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteDoc(userDoc);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, name, username, password } = req.body;

    const userDoc = doc(db, "users", id);

    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    // If changing username, check if new username already exists
    if (username && username !== userSnapshot.data().username) {
      const userCollection = collection(db, "users");
      const q = query(userCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    if (password) {
      const salt = crypto.randomBytes(24).toString("base64url").slice(0, 24);
      const pepper = process.env.PEPPER;
      const saltedPassword = crypto
        .createHash("sha512")
        .update(password + salt + pepper)
        .digest("hex");

      updateData.password = salt + saltedPassword;
    }

    await updateDoc(userDoc, updateData);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userCollection = collection(db, "users");
    const q = query(userCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res
        .status(400)
        .json({ isLogin: false, message: "Invalid credentials" });
    }

    const userDoc = querySnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const salt = user.password.slice(0, 24);
    const pepper = process.env.PEPPER;
    const saltedPassword = crypto
      .createHash("sha512")
      .update(password + salt + pepper)
      .digest("hex");

    const isLogin = salt + saltedPassword === user.password;

    if (isLogin) {
      const token = jwt.sign({ sub: user.id }, process.env.JWT, {
        expiresIn: "1h",
      });

      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        isLogin,
        user: userWithoutPassword,
        token,
      });
    } else {
      return res
        .status(400)
        .json({ isLogin: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ isLogin: false, message: "Server error" });
  }
};
