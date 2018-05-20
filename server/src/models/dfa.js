const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { generate } = require("shortid");

class DFA {
  constructor() {
    const adapter = new FileSync("../data/dfa.json");
    const db = low(adapter);
    db.defaults({ names: [] }).write();
  }
  addDFA(obj) {
    const id = generate();
    const { dfa, name } = obj;

    const adapter = new FileSync(`../data/dfa/${id}.json`);
    const db = low(adapter);
    db.defaults({ dfa }).write();

    const adapterName = new FileSync("../data/dfa.json");
    const dbName = low(adapterName);
    const objName = { name, id };
    console.log(objName);
    dbName
      .get("names")
      .push(objName)
      .write();

    return id;
  }

  getDFA(id) {
    const adapter = new FileSync(`../data/dfa/${id}.json`);
    const db = low(adapter);
    return db
      .get("dfa")
      .cloneDeep()

      .value();
  }

  getAllName() {
    const adapter = new FileSync("../data/dfa.json");
    const db = low(adapter);
    return db
      .get("names")
      .cloneDeep()

      .value();
  }
}

const dfaDB = new DFA();

module.exports = dfaDB;
