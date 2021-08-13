/* eslint-disable space-before-function-paren */
const { Command } = require('commander');
const program = new Command();
//* or const {program} = require('commander');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts.js');

//* options its commands ('short, full <type> if not boolean', command name)
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

//* add array of commands from command line
program.parse(process.argv);

//* create obj with keys for example --action get --id 5 = {action: 'get', id: '5'}
const argv = program.opts();
console.log(argv);

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      listContacts();
      break;

    case 'get':
      getContactById(id);
      break;

    case 'add':
      addContact(name, email, phone);
      break;

    case 'remove':
      removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
