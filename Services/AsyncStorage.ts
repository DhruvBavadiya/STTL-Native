import { Answer } from "@/Types/answer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StoreId = async (id: number | undefined) => {
  try {
    if (id) {
      await AsyncStorage.setItem("user-id", id.toString());
      console.log("stored successfully");
    }
  } catch (error) {
    console.log("Error storing user id:", error);
  }
};

export const getId = async (): Promise<number> => {
  try {
    const id = await AsyncStorage.getItem("user-id");
    return id ? parseInt(id) : 0;
  } catch (error) {
    console.log("Error getting user id:", error);
    return 0;
  }
};

export const storeAnswer = async (answer: Answer) => {
    try {
    //   Retrieve the existing data
      const getdata: string | null = await AsyncStorage.getItem('user-answers');
  
      // Parse the data or initialize as an empty array
      const final: Answer[] = getdata ? JSON.parse(getdata) : [];
  
      // Add the new answer to the array
      final.push(answer);
  
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('user-answers', JSON.stringify(final));
  
      console.log(await AsyncStorage.getItem('user-answers'));
    } catch (error) {
      console.error("Error while storing answer:", error);
    }
  };
  
  export const getAllAnswers = async(user_id:number):Promise<Answer[]>=>{
    try {
        const getdata: string | null = await AsyncStorage.getItem('user-answers');
  
      // Parse the data or initialize as an empty array
      const final: Answer[] = getdata ? JSON.parse(getdata) : [];
        const newArray:Answer[] = final.filter((answer)=>answer.user_id === user_id);
        console.log("nw",user_id)
        return newArray
    } catch (error) {
        console.log("Error while getting answers" ,error);
        return []
        
    }
}

export const getGivenAnswerLength = async():Promise<number>=>{
    try {
        const getdata: string | null = await AsyncStorage.getItem('user-answers');
  
      // Parse the data or initialize as an empty array
      const final: Answer[] = getdata ? JSON.parse(getdata) : [];
        const user_id = await getId();
        const newArray:Answer[] =final.filter((answer)=>answer.user_id === user_id);
        console.log(newArray)
        return newArray.length
    } catch (error) {
        console.log("Error while getting answers" ,error);
        return 0
        
    }
}


export const removeAnswers =async()=>{
    await AsyncStorage.setItem('user-answers', '');
    console.log("removed succesfully")
}
