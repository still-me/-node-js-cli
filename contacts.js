/* eslint-disable space-before-function-paren */
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const contactsPath = path.join(__dirname, '/db/contacts.json');

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return console.error(error.message);
  }
}

async function listContacts() {
  try {
    const contacts = await getContacts();
    console.log(chalk.yellow('All contacts bellow'));
    console.table(contacts);
  } catch (error) {
    return console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const allContacts = await getContacts();
    const contact = allContacts.find(
      contact => contact.id === Number(contactId),
    );
    if (!contact) {
      console.log(
        chalk.red.underline(`Contact with id ${contactId} was not found`),
      );
      return;
    }
    console.log(chalk.yellow(`Requested contact with id ${contactId} bellow`));
    console.table([contact]);
    return contact;
  } catch (error) {
    return console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const newContacts = contacts.filter(({ id }) => id !== Number(contactId));
    if (contacts.length === newContacts.length) {
      console.log(
        chalk.red.underline(`contact with id ${contactId} was not found`),
      );
      return;
    }
    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      'utf-8',
    );
    console.log(chalk.yellow(`Contact with id ${contactId} was deleted`));
    console.log(chalk.bgGrey('updated contacts list bellow'));
    console.table(newContacts);
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();
    const existedContact = contacts.find(
      contact =>
        contact.name.toLowerCase() === name.toLowerCase() ||
        contact.email === email ||
        contact.phone === phone,
    );

    if (existedContact) {
      console.log(
        chalk.underline.red(
          `Contact with name ${chalk.green(name)} or email ${chalk.green(
            email,
          )} or phone ${chalk.green(phone)} is exist`,
        ),
      );
      return;
    }

    const newContacts = [
      ...contacts,
      { id: contacts[contacts.length - 1].id + 1, name, email, phone },
    ];

    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      'utf-8',
    );
    console.log(chalk.yellow(`contact ${name} was added`));
    console.log(chalk.bgGrey('updated contacts list bellow'));
    console.table(newContacts);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
