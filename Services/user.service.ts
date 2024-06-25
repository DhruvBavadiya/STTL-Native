import { loginUserType, registerUserType, usertypes } from '@/Types/user';
import * as SQLite from 'expo-sqlite';

export const registerUser = async (db:SQLite.SQLiteDatabase , user:registerUserType )=>{
    console.log(user);
    try {
      // Check if the user already exists
      const checkUserQuery = `SELECT id FROM Users WHERE name = ?`;
      const existingUser = await db.getAllAsync(checkUserQuery, [user.name]);
  
      if (existingUser.length > 0) {
      return {message:'User with this username already exists' , stat:false}
      }
  
      // If the user doesn't exist, insert the new user
      const insertUserQuery = `INSERT INTO Users (name, password, image,phone_number) VALUES (?, ?, ?,?)`;
      await db.runAsync(insertUserQuery, [user.name, user.password, user.image,user.phone_number]);
  
      console.log('User registered successfully:', user.name);
      return {message:'User registered successfully' , stat:true}
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; 
    }
}

export const loginUser = async (db: SQLite.SQLiteDatabase, user: loginUserType) => {
    try {
        // Query to get user ID based on the provided name
        const query = `SELECT id FROM Users WHERE name = ?`;
        const data = await db.getAllAsync(query, [user.name]) as Array<{ id: number }>;;

        // If no user found, return null or an appropriate response
        if (!data || data.length === 0) {
            return null; // User not found
        }

        const id: number = data[0].id as number;

        // Query to get password based on the user ID
        const passwordQuery = `SELECT password FROM Users WHERE id = ?`;
        const passwordData = await db.getAllAsync(passwordQuery, [id]) as Array<{ password: string }>;

        // If no password found (which is unlikely in this case), return null or an appropriate response
        if (!passwordData || passwordData.length === 0) {
            return null; // Password not found
        }

        const storedPassword: string = passwordData[0].password as string;

        // Compare the provided password with the stored password
        if (storedPassword === user.password) {
            return id; // Return user ID if passwords match
        } else {
            return null; // Passwords do not match
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error; // Optionally, rethrow the error to be handled by the caller
    }
};


export const getAllUsers = async (db: SQLite.SQLiteDatabase): Promise<usertypes[]> => {
    try {
        const query = 'SELECT * FROM Users';
        const users: usertypes[] = await db.getAllAsync(query, []);
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}

export const getUser = async(db: SQLite.SQLiteDatabase , id:number) : Promise<usertypes[]>=>{
    try {
        const query = `select * from Users where id = ${id}`
        const user:usertypes[] = await db.getAllAsync(query) as Array<usertypes>
        return user
    } catch (error) {
        console.error('Error retrieving user:', error);
        return []
    }
}


export const UpdateUser = async (db: SQLite.SQLiteDatabase, user: usertypes) => {
    try {
      // First, check if the new username is already taken by another user
      const checkQuery = `SELECT id FROM Users WHERE name = ? AND id != ?`;
      const checkResult = await db.getAllAsync(checkQuery, [user.name, user.id]);
  
      if (checkResult.length > 0) {
        return {message:'User with this username already exists' , stat:false}
      }
  
      // If username is unique, proceed with the update
      const updateQuery = `
        UPDATE Users
        SET name = ?, image = ?, phone_number = ?
        WHERE id = ?
      `;
  
      await db.runAsync(updateQuery, [user.name, user.image, user.phone_number, user.id]);
      return {message:'user Updated successfully' , stat:true}
    } catch (error) {
        return {message:`Error while updating user:${error}` , stat:false}
    //   console.error("", );
    //   throw error; // Propagate the error for handling at a higher level
    }
  };
  

export const DeleteUser = async(db:SQLite.SQLiteDatabase , user_id:string)=>{
    try {
        const query = `DELETE FROM Users Where id = ${user_id}`;
        await db.runAsync(query)
        console.log("User Deleted successfully.")
    } catch (error) {
        console.log("error while updating user",error)
    }
}