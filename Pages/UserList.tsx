import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { usertypes } from '@/Types/user';
import { DeleteUser, UpdateUser, getAllUsers } from '@/Services/user.service';
import { getdbConnection } from '@/DB';
import UserCard from '@/components/UserCard';
import EditModal from '@/components/EditModal';
// import CustomAlert from '@/components/CustomAlert';
import { AppContext } from '@/Context/AppContext';
import CustomAlert from '@/components/CustomeAlert';

const UserList = ({navigation}:{navigation:any}) => {
  const [users, setUsers] = useState<usertypes[]>([]);
  const [selectedUser, setSelectedUser] = useState<usertypes | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<usertypes | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const db = await getdbConnection();
      const res: usertypes[] = await getAllUsers(db);
      setUsers(res);
    };
    fetchUser();
  }, [users]);

  const handleUserPress = (user: usertypes) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleUserSave = async (user: usertypes) => {
    const db = await getdbConnection();
    await UpdateUser(db, user);
  };

  const handleDeletePress = (user: usertypes) => {
    setUserToDelete(user);
    setAlertVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await DeleteUser(await getdbConnection(), userToDelete.id);
      setAlertVisible(false);
      setUserToDelete(null);
    }
  };

  const handleReportClick = (user_id: string) => {
    navigation.navigate('Report', { user_id: user_id });
  };

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onPress={() => handleUserPress(user)}
          seeReport={() => handleReportClick(user.id)}
          onPressDelete={() => handleDeletePress(user)}
        />
      ))}
      <EditModal
        visible={modalVisible}
        onClose={closeModal}
        user={selectedUser}
        onSave={handleUserSave}
      />
      <CustomAlert
        visible={alertVisible}
        title="Are You Sure?"
        message="Do you want to delete this user?"
        onClose={() => setAlertVisible(false)}
      />
      <CustomAlert
        visible={alertVisible}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        onClose={() => setAlertVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default UserList;
