import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addItem,
  deleteItem,
  editItem,
  toggleStatus,
  startEditing,
  endEditing,
  setNewItem,
  deleteItemList,
} from './redux/store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import dbData from '../../db.json';
import axios from 'axios';

const ShoppingList = props => {
  const dispatch = useDispatch();
  const {items, newItem, editItemId} = useSelector(state => state.shoppingList);
  const [showShareBtn, setShowShareBtn] = useState(false);
  const [userSelfEmail, setUserSelfEmail] = useState('');
  const [sharedItems, setSharedItems] = useState([]);
  const [showSharedList, setShowSharedList] = useState(false);

  const users = dbData?.users;

  const friendsList = users.filter(user => user.email !== userSelfEmail);

  const renderItem = ({item}) => (
    <View style={styles.friendItem}>
      <View>
        <Text>{item.email}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleSharePress(item.id)}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddItem = () => {
    dispatch(addItem(newItem));
  };

  const handleDeleteItem = id => {
    dispatch(deleteItem(id));
  };

  const handleEditItem = (id, newName, index) => {
    dispatch(editItem({id, newName, index}));
  };

  const handleToggleStatus = id => {
    dispatch(toggleStatus(id));
  };

  const handleStartEditing = id => {
    dispatch(startEditing(id));
  };

  const handleBlur = (id, itemName, index) => {
    if (editItemId === id) {
      dispatch(editItem({id, newName: itemName, index}));
      dispatch(endEditing());
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    dispatch(deleteItemList());
    props.navigation.navigate('SignIn');
  };

  const handleShowShareList = () => {
    setShowShareBtn(true);
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      let userName = await AsyncStorage.getItem('email');
      setUserSelfEmail(userName);
    };

    fetchUserEmail();
  }, []);

  const handleSharePress = async id => {
    if (items.length) {
      try {
        const response = await axios.get(`http://localhost:3000/users/${id}`);
        const currentUser = response.data;

        const currentShoppingList = currentUser.shoppingList || [];

        const updatedShoppingList = currentShoppingList.concat(items);

        const result = await axios.put(`http://localhost:3000/users/${id}`, {
          ...currentUser,
          shoppingList: updatedShoppingList,
          shoppingListUserName: userSelfEmail,
        });

        if (result.data) {
          Alert.alert('Share Successfully');
        }
      } catch (error) {
        console.error('Error updating shopping list:', error.message);
      }
    } else {
      Alert.alert('Please add some items in your shopping List');
    }
  };

  const viewSharedList = () => {
    const result = dbData.users.filter(item => item.email == userSelfEmail);
    setSharedItems(result);
    setShowSharedList(!showSharedList);
  };

  

  return (
    <View style={{flex: 1, padding: 16, position: 'relative'}}>
      {showSharedList && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 50,
            right: 0,
            left: 16,
            width: '100%',
            height: '80%',
            zIndex: 1,
            backgroundColor: 'white',
            padding: 10,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
              }}>
              Shared List by
            </Text>
            <Text
              style={{
                fontSize: 18,
                textDecorationColor: 'blue',
                textDecorationLine: 'underline',
              }}>
              {sharedItems[0].shoppingListUserName}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 20,
            }}>
            <FlatList
              data={sharedItems[0].shoppingList}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                    }}>
                    {index + 1} :
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      textDecorationColor: 'blue',
                      textDecorationLine:
                        item.status == 'pending' ? 'line-through' : '',
                    }}>
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      )}
      {!showShareBtn ? (
        <>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              opacity: showSharedList ? 0 : 1,
            }}>
            <View>
              <Text style={{fontSize: 28}}>Shopping List</Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
              <Button
                color="green"
                title="Share"
                onPress={() => handleShowShareList()}
              />
            </View>
            <View style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button title="Logout" onPress={() => handleLogout()} />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 16, marginTop: 16}}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                marginRight: 8,
                paddingHorizontal: 8,
              }}
              placeholder="Add new item"
              value={newItem}
              onChangeText={text => dispatch(setNewItem(text))}
            />
            <Button onPress={handleAddItem} title="Add" color="blue" />
          </View>

          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    borderColor: 'lightblue',
                    borderRadius: 20,
                    borderWidth: 1,
                    marginRight: 8,
                    paddingHorizontal: 8,
                    textDecorationLine:
                      item.status === 'bought' ? 'line-through' : 'none',
                  }}
                  value={item.name}
                  onChangeText={text => handleEditItem(item.id, text, index)}
                  editable={editItemId === item.id}
                  onBlur={() => handleBlur(item.id, item.name, index)}
                />
                <Button
                  onPress={() => handleToggleStatus(item.id)}
                  title={item.status === 'pending' ? 'Bought' : 'Pending'}
                  color={item.status === 'pending' ? 'green' : 'red'}
                />
                <Button
                  onPress={() => handleDeleteItem(item.id)}
                  title="Delete"
                  color="red"
                />
                {editItemId !== item.id && (
                  <Button
                    onPress={() => handleStartEditing(item.id)}
                    title="Edit"
                    color="blue"
                  />
                )}
              </View>
            )}
          />
          <View>
            <Button title="View Shared List" onPress={() => viewSharedList()} />
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginLeft: 20,
              }}>
              <Text style={styles.heading}>Friends List</Text>
            </View>
            <View>
              <Button
                onPress={() => setShowShareBtn(false)}
                title="Close"
                color="red"
              />
            </View>
          </View>
          {friendsList.length === 0 ? (
            <View style={styles.noFriendsContainer}>
              <Text>No friends connected to share the shopping list</Text>
            </View>
          ) : (
            <View style={styles.friendsListContainer}>
              <FlatList
                data={friendsList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noFriendsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsListContainer: {
    flex: 1,
    width: '100%',
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    backgroundColor: 'green',
    padding: 3,
    borderRadius: 10,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: 'green',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShoppingList;