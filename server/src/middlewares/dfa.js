const dfaDB = require("../models/dfa.js");

const addDfa = async (req, res, next) => {
  try {
    const { name, dfa } = req.body;
    console.log(req.body);
    const id = await dfaDB.addDFA({ name, dfa });
    res.status(200).json({ id });

    next();
  } catch (e) {
    next(e);
  }
};
const getDfa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await dfaDB.getDFA(id);
    res.status(200).json(response);
    next();
  } catch (e) {
    next(e);
  }
};

const getName = async (req, res, next) => {
  try {
    console.log(5);
    const response = await dfaDB.getAllName();
    res.status(200).json(response);
    next();
  } catch (e) {
    next(e);
  }
};
module.exports = { addDfa, getDfa, getName };
