import {Client, Account} from 'appwrite';

const client = new Client();

client
  .setEndpoint('') // Your Appwrite Endpoint
  .setProject(''); // Your Appwrite Project

const account = new Account(client);

// Your project ID

export default account;
