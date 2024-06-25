import { getdbConnection } from '@/DB';
import { getGivenAnswerLength, getId } from '@/Services/AsyncStorage';
import { getAllQuestion } from '@/Services/question.service';
import { getUser } from '@/Services/user.service';
import { usertypes } from '@/Types/user';
import { giveExam, reportList } from '@/constants/links';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';

const User = ({ navigation }: any) => {
  const [user, setUser] = useState<usertypes[]>([]);
  const [title,setTitle] = useState<string>('');
  const [total,setTotal] = useState(0)

  const handlePress = async (screen: string) => {
    console.log(await getGivenAnswerLength() , (await getAllQuestion(await getdbConnection())).length)
    if(screen==='Exam' && await getGivenAnswerLength() === (await getAllQuestion(await getdbConnection())).length ){
      Alert.alert(
        "Quiz Completed",
        "You have answered all the questions.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("User")
          }
        ]
      );
    
    }
    else{
      if(screen === 'Report'){
        console.log("in report" , user[0].id);
      navigation.navigate('Report' ,{user_id:user[0].id});
      }
      else{
      navigation.navigate(screen);
      }
    }
  };

  useEffect(() => {
    const Me = async () => {
      try {
        const id = await getId()
        const data: usertypes[] = await getUser(await getdbConnection(), id);
        if ((await getAllQuestion(await getdbConnection())).length !== await getGivenAnswerLength()) {
          if(await getGivenAnswerLength() !== 0){
            setTitle('Resume')
            
          }
          else{
            setTitle('Start')
          }
        }
        else{
          setTitle('Completed')

        }
        setTotal(await getGivenAnswerLength())
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    Me();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftview}>
          {user.length > 0 && user[0].image ? (
            <Image source={{ uri: user[0].image }} style={styles.userimage} />
          ) : (
            <View style={styles.placeholderImage} />
          )}
          <Text style={styles.welcomeText}>Welcome,<Text style = {{fontFamily:'CourierPrime-Bold' , textAlign:'left',fontSize:26}}> {user.length > 0 ? user[0].name : 'User'} </Text></Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.section} onPress={() => handlePress('Exam')}>
          <Image source={{ uri: giveExam }} style={styles.image} />
          <Text style={styles.heading}>{title} Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handlePress('Report')}>
          <Image source={{ uri: reportList }} style={styles.image} />
          <Text style={styles.heading}>See Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  leftview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    fontFamily:'CourierPrime-Regular'

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 26,
    // fontWeight: 'bold',
    color: '#333',
    fontFamily:'CourierPrime-Bold'

  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    // fontWeight:'bold',
    fontFamily:'CourierPrime-Bold'
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row', // Arrange items in a row
    width: width - 40, // Adjusted width to fit content
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginBottom: 25,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    fontFamily:'CourierPrime-Regular',
    alignItems: 'center', // Center items vertically
    height: 120, // Adjust height as needed
  },
  image: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginRight: 20, // Space between image and text
  },
  userimage: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 40,
  },
  heading: {
    fontSize: 24, // Increased font size for heading
    // fontWeight: 'bold',
    flex: 1, // Allow text to wrap if needed
    fontFamily:'CourierPrime-Bold',
    textAlign:'left'

  },
});

export default User;
