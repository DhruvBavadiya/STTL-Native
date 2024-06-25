import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { createQuestion, createUser, reportList, userList, logo } from '@/constants/links'; // Import logo
import { AppContext } from '@/Context/AppContext';
import { getdbConnection } from '@/DB';
const backgroundImg = require('../assets/images/bg.jpeg'); // Replace with your image path


const windowWidth = Dimensions.get('window').width;

const Admin = ({ navigation }: { navigation: any }) => {
  const { flag, setFlag } = useContext(AppContext);

  const handlePress = async (sectionName: string) => {
    const db = await getdbConnection();
    // Implement navigation or action based on the section pressed
    switch (sectionName) {
      case 'See Users':
        setFlag(false)
        navigation.navigate('UserList');
        break;
      case 'Create User':
        navigation.navigate('Register');
        break;
      case 'Add Question':
        navigation.navigate('Question');
        break;
      case 'See Report':
        setFlag(true)
        navigation.navigate('UserList'); // Add navigation for 'See Report'
        break;
      default:
        break;
    }
    console.log(`Pressed ${sectionName}`);
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftview}>
          <Image source={{ uri: logo }} style={styles.userimage} />
          <Text style={styles.welcomeText}>Welcome, Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.section} onPress={() => handlePress('Create User')}>
        <Image source={{ uri: createUser }} style={styles.image} />
        <Text style={styles.heading}>Create User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => handlePress('Add Question')}>
        <Image source={{ uri: createQuestion }} style={styles.image} />
        <Text style={[styles.heading, { fontFamily: 'CourierPrime-Bold' }]}>Add Question</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => handlePress('See Users')}>
        <Image source={{ uri: userList }} style={styles.image} />
        <Text style={[styles.heading, { fontFamily: 'CourierPrime-Bold' }]}>See Users</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => handlePress('See Report')}>
        <Image source={{ uri: reportList }} style={styles.image} />
        <Text style={[styles.heading, { fontFamily: 'CourierPrime-Bold' }]}>See Report</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    width: windowWidth - 40,
    paddingHorizontal: 0,
  },
  leftview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  welcomeText: {
    fontSize: 26,
    // fontWeight: '900',
    color: '#333',
    fontFamily: 'CourierPrime-Bold',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    // fontWeight:'500',
    fontFamily: 'CourierPrime-Regular',
  },
  section: {
    width: windowWidth - 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  userimage: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  heading: {
    fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'CourierPrime-Bold'
  },
});

export default Admin;
