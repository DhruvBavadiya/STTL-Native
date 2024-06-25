import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { usertypes } from '@/Types/user';
import { AppContext } from '@/Context/AppContext';
import { logo } from '@/constants/links';

interface UserCardProps {
  user: usertypes;
  onPress: () => void;
  seeReport: () => void;
  onPressDelete:()=>void
}

const UserCard = ({ user, onPress, seeReport  , onPressDelete}: UserCardProps) => {
  const { flag } = useContext(AppContext);

  const cardContent = (
    <View style={styles.card}>
      <Image source={{ uri: user.image?user.image:logo }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.id}>ID: {user.id}</Text>
        {flag ? (
          <TouchableOpacity style={[styles.button , {backgroundColor: '#ff3b30'}]} onPress={seeReport}>
            <Text style={styles.buttonText}>See Report</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.btngroup}>
            <TouchableOpacity style={[styles.button , {backgroundColor: 'blue'}]} onPress={onPress}>
              <Text style={styles.buttonText}>Edit User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button , {backgroundColor: '#ff3b30'}]} onPress={onPressDelete}>
              <Text style={styles.buttonText}>Delete User</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return !flag ? (
    <TouchableOpacity onPress={onPress}>
      {cardContent}
    </TouchableOpacity>
  ) : (
    <View>
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily:'CourierPrime-Bold'

  },
  id: {
    fontSize: 14,
    color: 'gray',
    // fontWeight: 'bold',

    fontFamily:'CourierPrime-Bold'

  },
  btngroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily:'CourierPrime-Bold'
  },
});

export default UserCard;
