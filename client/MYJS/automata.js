const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",

  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z", //51

  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9", //61

  "*",
  "/",
  "-",
  "+",
  ".",
  "$"
];

const optEdeges = array => {
  let res = [];
  for (let i = 0; i < array.length; i++) {
    const edge = array[i];
    let found = -1;

    for (let j = 0; j < res.length; j++) {
      if (edge.to == res[j].to && edge.from == res[j].from) {
        found = j;
        break;
      }
    }
    if (found !== -1) {
      res[found].label += "-" + edge.label;
    } else {
      res.push(edge);
    }
  }
  return res;
};
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
const getEndState = array => {
  let res = [];
  let obj = array._data;

  for (let e in obj) {
    if (obj[e].end) {
      res.push(obj[e]);
    }
  }
  return res;
};

class Node {
  constructor(label, start = false, end = false, massege = "") {
    this.label = label;
    this.id = label;
    this.edges = {};
    this.start = start;
    this.end = end;
    this.massege = massege;
    this.level = "";
  }
  addEdge(state, to) {
    this.edges[state] = to;
  }

  getPossition(state) {
    return this.edges[state];
  }
}

class Automata {
  constructor() {
    this.nodes = [];
    this.deathNode = new Node("deathstate");
    this.start = null;
    this.alphabet = [];
    this.network = {};
  }
  reset() {
    this.nodes = [];
    this.start = null;
    this.alphabet = [];
  }
  addNode(nodes) {
    this.nodes = [...nodes];
  }
  resetColor() {
    let obj = this.nodes._data;
    for (let e in obj) {
      obj[e].color = "#000";
      this.nodes.update(obj[e]);
    }

    //change color for end
    const end = getEndState(this.nodes);
    end.map(e => {
      e.borderWidth = 5;
      e.color = { border: "#2B7CE9", background: "#000" };
      this.nodes.update(e);
    });
    this.start.color = {
      background: "#53d86a"
    };
    this.nodes.update(this.start);
  }

  draw() {
    let nodesArray = [];
    let edgesArray = [];
    let edges;

    for (let i = 0; i < this.nodes.length; i++) {
      let id = this.nodes[i].id;
      let obj = {
        id: id,
        end: this.nodes[i].end,

        label: this.nodes[i].label,
        borderWidth: 0,
        borderWidthSelected: 0,
        font: {
          color: "#fff",
          size: 20 // px
        },
        color: "#000"
      };
      nodesArray.push(obj);
      const edges = this.nodes[i].edges;
      for (let key in edges) {
        let n = edges[key];
        edgesArray.push({
          from: id,
          to: n.id,
          label: key,
          arrows: "to",
          color: { opacity: 0.2, color: "#000" }
        });
      }
    }
    this.nodes = new vis.DataSet(nodesArray);
    edges = new vis.DataSet(optEdeges(edgesArray));
    var data = {
      nodes: this.nodes,
      edges: edges
    };
    var options = {
      edges: {
        smooth: {
          type: "horizontal"
        }
      },
      physics: false,
      interaction: {
        dragNodes: false,
        dragView: false,

        hoverConnectedEdges: true,

        selectable: false
      }
    };
    //change color for start
    this.resetColor();

    const containar = document.getElementById("drow");
    this.network = new vis.Network(containar, data, options);
  }
  // احمر fd3f39
  // اصفر ffcb2f
  // 53d86a

  trueString(array) {
    array.map(e => {
      e.color = "#53d86a";
      this.nodes.update(e);
    });
  }
  falseString(array) {
    array.map(e => {
      e.color = "#fd3f39";
      this.nodes.update(e);
    });
  }

  async getEnd(str) {
    let node = this.start;
    const state = document.getElementById("state");
    const char = document.getElementById("char");
    const index = document.getElementById("index");
    let arrayOfStateNode = [node];

    for (let i = 0; i < str.length; i++) {
      node = node.getPossition(str[i]);
      arrayOfStateNode.push(node);
      node.color = {
        background: "#ffcb2f"
      };
      this.nodes.update(node);
      state.innerHTML = node.label;
      char.innerHTML = str[i];
      index.innerHTML = i;
      if (!node) {
        break;
      }
      await timeout(300);
    }
    if (node.end) {
      this.trueString(arrayOfStateNode);
    } else {
      this.falseString(arrayOfStateNode);
    }
    return node ? node : this.deathNode;
  }
  buildFromJson(json) {
    this.alphabet = json.alphabetObj;
    let fileNode = json.nodes;
    for (let i = 0; i < fileNode.length; i++) {
      let node = fileNode[i];
      let buildNode = new Node(node.label, node.start, node.end);
      this.nodes.push(buildNode);
      if (node.start == true) {
        this.start = buildNode;
      }
    }
    let filledge = json.edges;

    for (let i = 0; i < filledge.length; i++) {
      let fromEdge = null;
      let toEdge = null;
      for (let j = 0; j < this.nodes.length; j++) {
        if (this.nodes[j].label == filledge[i].from) {
          fromEdge = this.nodes[j];
        }
        if (this.nodes[j].label == filledge[i].to) {
          toEdge = this.nodes[j];
        }
      }

      fromEdge.addEdge(filledge[i].state, toEdge);
    }
  }
}

class PHP {
  constructor() {
    this.deathNode = new Node("T");
    this.start = null;
    this.network = {};
    this.nodes = [];
    this.bulid();
  }

  bulid() {
    this.start = new Node("S", true);
    this.start.level = 0;

    let v1 = new Node("V1");
    v1.level = 1;

    let v2 = new Node("V2", false, true, "variable");
    v2.level = 2;

    let n1 = new Node("N1");
    n1.level = 1;
    let n2 = new Node("N2", false, true, "Integer");
    n2.level = 2;
    let n3 = new Node("N3");
    n3.level = 3;
    let n4 = new Node("N4", false, true, "Floot");
    n4.level = 4;

    let w1 = new Node("W1");
    w1.level = 1;
    let w2 = new Node("W2", false, true, "Reserved word");
    w2.level = 2;
    let w3 = new Node("W3");
    w3.level = 1;
    let w4 = new Node("W4");
    w4.level = 2;
    let w5 = new Node("W5", false, true, "Reserved word");
    w5.level = 3;

    //while
    let w6 = new Node("W6");
    w6.level = 1;
    this.start.addEdge("w", w6);

    let w7 = new Node("W7");
    w7.level = 2;
    w6.addEdge("h", w7);

    let w8 = new Node("W8");
    w8.level = 3;
    w7.addEdge("i", w8);

    let w9 = new Node("W9");
    w9.level = 4;
    w8.addEdge("l", w9);

    let w10 = new Node("W10", false, true, "Reserved word");
    w10.level = 5;
    w9.addEdge("e", w10);

    //case
    let w11 = new Node("W11");
    w11.level = 1;
    this.start.addEdge("c", w11);

    let w12 = new Node("W12");
    w12.level = 2;
    w11.addEdge("a", w12);

    let w13 = new Node("W13");
    w13.level = 3;
    w12.addEdge("s", w13);

    let w14 = new Node("W14", false, true, "Reserved word");
    w14.level = 4;
    w13.addEdge("e", w14);

    //class
    let w15 = new Node("W15");
    w15.level = 2;
    w11.addEdge("l", w15);

    let w16 = new Node("W16");
    w16.level = 3;
    w15.addEdge("a", w16);

    let w17 = new Node("W17");
    w17.level = 4;
    w16.addEdge("s", w17);

    let w18 = new Node("W18", false, true, "Reserved word");
    w18.level = 5;
    w17.addEdge("s", w18);

    // static
    let w19 = new Node("W19");
    w19.level = 1;
    this.start.addEdge("s", w19);

    let w20 = new Node("W20");
    w20.level = 2;
    w19.addEdge("t", w20);

    let w21 = new Node("W21");
    w21.level = 3;
    w20.addEdge("a", w21);

    let w22 = new Node("W22");
    w22.level = 4;
    w21.addEdge("t", w22);

    let w23 = new Node("W23");
    w23.level = 5;
    w22.addEdge("i", w23);

    let w24 = new Node("W24", false, true, "Reserved word");
    w24.level = 6;
    w23.addEdge("c", w24);

    let c1 = new Node("C1");
    c1.level = 1;
    this.start.addEdge("/", c1);
    let c2 = new Node("C2");
    c2.level = 2;
    c1.addEdge("*", c2);
    let c3 = new Node("C3");
    c3.level = 3;
    c2.addEdge("*", c3);
    let c4 = new Node("C4", false, true, "comment");
    c4.level = 4;
    c3.addEdge("/", c4);

    this.start.addEdge("$", v1);
    this.start.addEdge("-", n1);
    this.start.addEdge("+", n1);
    this.start.addEdge("i", w1);
    this.start.addEdge("f", w3);
    n2.addEdge(".", n3);
    w1.addEdge("f", w2);
    w3.addEdge("o", w4);
    w4.addEdge("r", w5);
    for (let i = 0; i < 52; i++) {
      v1.addEdge(alphabet[i], v2);
      v2.addEdge(alphabet[i], v2);
      c2.addEdge(alphabet[i], c2);
      c3.addEdge(alphabet[i], c2);
    }
    for (let i = 52; i < 62; i++) {
      v2.addEdge(alphabet[i], v2);
      this.start.addEdge(alphabet[i], n2);
      n1.addEdge(alphabet[i], n2);
      n2.addEdge(alphabet[i], n2);
      n3.addEdge(alphabet[i], n4);
      n4.addEdge(alphabet[i], n4);
      c2.addEdge(alphabet[i], c2);
      c3.addEdge(alphabet[i], c2);
    }

    c3.addEdge("*", c3);
    c2.addEdge("/", c2);

    this.addNode([
      this.start,
      v1,
      v2,
      n1,
      n2,
      n3,
      n4,
      w1,
      w2,
      w3,
      w4,
      w5,
      w6,
      w7,
      w8,
      w9,
      w10,
      w11,
      w12,
      w13,
      w14,
      w15,
      w16,
      w17,
      w18,
      w19,
      w20,
      w21,
      w22,
      w23,
      w24,
      c1,
      c2,
      c3,
      c4
    ]);
  }

  draw() {
    let nodesArray = [];
    let edgesArray = [];
    let edges;

    for (let i = 0; i < this.nodes.length; i++) {
      let id = this.nodes[i].id;
      let obj = {
        id: id,
        end: this.nodes[i].end,

        label: this.nodes[i].label,
        borderWidth: 0,
        borderWidthSelected: 0,
        font: {
          color: "#fff",
          size: 12 // px
        },
        color: "#000",
        level: this.nodes[i].level
      };
      nodesArray.push(obj);
    }
    edgesArray.push(
      {
        from: "S",
        to: "V1",
        label: "$"
      },
      {
        from: "V1",
        to: "V2",
        label: "[A-Za-z]"
      },
      {
        from: "V2",
        to: "V2",
        label: String.fromCharCode(931) + "^[*+-./]"
      },
      {
        from: "S",
        to: "N1",
        label: "[+-]"
      },
      {
        from: "S",
        to: "N2",
        label: "[0-9]"
      },
      {
        from: "N1",
        to: "N2",
        label: "[0-9]"
      },
      {
        from: "N2",
        to: "N2",
        label: "[0-9]"
      },
      {
        from: "N2",
        to: "N3",
        label: ","
      },
      {
        from: "N3",
        to: "N4",
        label: "[0-9]"
      },
      {
        from: "N4",
        to: "N4",
        label: "[0-9]"
      },
      {
        from: "S",
        to: "W1",
        label: "i"
      },
      {
        from: "W1",
        to: "W2",
        label: "f"
      },
      {
        from: "S",
        to: "W3",
        label: "f"
      },
      {
        from: "W3",
        to: "W4",
        label: "o"
      },
      {
        from: "W4",
        to: "W5",
        label: "r"
      },
      {
        from: "S",
        to: "W6",
        label: "w"
      },
      {
        from: "W6",
        to: "W7",
        label: "h"
      },
      {
        from: "W7",
        to: "W8",
        label: "i"
      },
      {
        from: "W8",
        to: "W9",
        label: "l"
      },
      {
        from: "W9",
        to: "W10",
        label: "e"
      },
      {
        from: "S",
        to: "W11",
        label: "c"
      },
      {
        from: "W11",
        to: "W12",
        label: "a"
      },
      {
        from: "W12",
        to: "W13",
        label: "s"
      },
      {
        from: "W13",
        to: "W14",
        label: "e"
      },

      {
        from: "W11",
        to: "W15",
        label: "l"
      },
      {
        from: "W15",
        to: "W16",
        label: "a"
      },
      {
        from: "W16",
        to: "W17",
        label: "s"
      },
      {
        from: "W17",
        to: "W18",
        label: "s"
      },

      {
        from: "S",
        to: "W19",
        label: "s"
      },
      {
        from: "W19",
        to: "W20",
        label: "t"
      },
      {
        from: "W20",
        to: "W21",
        label: "a"
      },
      {
        from: "W21",
        to: "W22",
        label: "t"
      },
      {
        from: "W22",
        to: "W23",
        label: "i"
      },
      {
        from: "W23",
        to: "W24",
        label: "c"
      },

      {
        from: "S",
        to: "C1",
        label: "/"
      },
      {
        from: "C1",
        to: "C2",
        label: "*"
      },
      {
        from: "C2",
        to: "C3",
        label: "*"
      },
      {
        from: "C3",
        to: "C4",
        label: "/"
      },

      {
        from: "C2",
        to: "C2",
        label: String.fromCharCode(931) + " ^[*]"
      },
      {
        from: "C3",
        to: "C2",
        label: String.fromCharCode(931) + " ^[*/]"
      },
      {
        from: "C3",
        to: "C3",
        label: "*"
      }
    );
    for (let e in edgesArray) {
      edgesArray[e].arrows = "to";
      edgesArray[e].color = { opacity: 0.2, color: "#000" };
    }

    this.nodes = new vis.DataSet(nodesArray);
    edges = new vis.DataSet(optEdeges(edgesArray));
    var data = {
      nodes: this.nodes,
      edges: edges
    };
    var options = {
      edges: {
        smooth: {
          type: "horizontal"
        }
      },
      physics: false,
      interaction: {
        dragNodes: false,
        dragView: false,

        hoverConnectedEdges: true,

        selectable: false
      },
      layout: {
        hierarchical: {
          direction: "LR"
        }
      }
    };
    //change color for start
    this.resetColor();

    const containar = document.getElementById("drow");
    this.network = new vis.Network(containar, data, options);
  }
  addNode(nodes) {
    this.nodes = [...nodes];
    console.log(nodes);
  }
  resetColor() {
    let obj = this.nodes._data;
    for (let e in obj) {
      obj[e].color = "#000";
      this.nodes.update(obj[e]);
    }

    //change color for end
    const end = getEndState(this.nodes);
    end.map(e => {
      e.borderWidth = 5;
      e.color = { border: "#2B7CE9", background: "#000" };
      this.nodes.update(e);
    });
    this.start.color = {
      background: "#53d86a"
    };
    this.nodes.update(this.start);
    const deadNode = document.getElementById("dead-node");
    deadNode.style.background = "#262626";
  }

  trueString(array) {
    array.map(e => {
      e.color = "#53d86a";
      this.nodes.update(e);
    });
  }
  falseString(array) {
    array.map(e => {
      e.color = "#fd3f39";
      this.nodes.update(e);
    });
  }

  async getEnd(str) {
    let node = this.start;
    const deadNode = document.getElementById("dead-node");
    const state = document.getElementById("state");
    const char = document.getElementById("char");
    const index = document.getElementById("index");

    let arrayOfStateNode = [node];

    for (let i = 0; i < str.length; i++) {
      node = node.getPossition(str[i]);
      char.innerHTML = str[i];
      index.innerHTML = i;

      if (!node) {
        deadNode.style.background = "#fd3f39";
        state.innerHTML = "Dead Node";
        break;
      }
      state.innerHTML = node.label;
      arrayOfStateNode.push(node);
      node.color = {
        background: "#ffcb2f"
      };
      this.nodes.update(node);

      await timeout(300);
    }
    if (!node || !node.end) {
      this.falseString(arrayOfStateNode);
    } else {
      this.trueString(arrayOfStateNode);
    }
    return node ? node : this.deathNode;
  }
}
