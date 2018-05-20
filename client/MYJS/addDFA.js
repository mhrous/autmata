$(document).ready(function() {
  $("input").val("");

  let alphabetNumber = 1;
  let alphabetObj = {};
  let nameDFA = "";
  let edges = [];

  let stateNumber = 1;
  let StateObj = { 0: { start: true } };

  const sendToServer = async () => {
    $(".container").addClass("hide");
    $(".loader").removeClass("hide");
    let obj = {};
    obj.name = nameDFA;
    obj.dfa = {};
    obj.dfa.nodes = StateObj;
    obj.dfa.edges = edges;
    console.log(edges);
    obj.dfa.alphabetObj = alphabetObj;
    const response = await Api.post("dfa", obj);
    const status = response.status;
    if (status === 200) {
      const json = await response.json();
      if (json.id) {
        window.location.replace("./showDFA.html");
      }
    }
  };

  const bulidEdgeObj = () => {
    const to = StateObj[0].label;
    for (let i = 0; i < StateObj.length; i++) {
      const from = StateObj[i].label;
      for (let j = 0; j < alphabetObj.length; j++) {
        const state = alphabetObj[j];
        edges.push({ to, from, state });
      }
    }
  };

  $(".add-name-dfa .name-of-dfa").on("change", function() {
    nameDFA = $(this).val();
  });
  $(".add-name-dfa .add-input").on("click", function() {
    $(
      ".add-name-dfa .input-countener"
    ).append(` <div class="row " data-id="${alphabetNumber}">
          <div class="col-md-2">
         <h4>Character:</h4>
          </div>
          <div class="col-md-8">
          <input type="text" class="form-control" placeholder="add " data-id="${alphabetNumber}" maxlength="1">
          </div>
          <div class="col-md-2">
            <i class="fa fa-minus-circle pc remove-input"></i>
          </div>
          </div>`);
    alphabetNumber++;
  });

  $(".add-name-dfa .input-countener").on("click", ".remove-input", function() {
    if ($(".add-name-dfa .input-countener .row").length === 1) return;
    const row = $(this).parents(".row");
    id = row.data("id");
    delete alphabetObj[id];
    row.remove();
  });

  $(".add-name-dfa .input-countener").on("change", "input", function() {
    const self = $(this);
    const id = self.data("id");
    const val = self.val();
    if (val === "") delete alphabetObj[id];
    else alphabetObj[id] = val;
  });

  $(".add-name-dfa .for-state-model").on("click", function() {
    const length = $(".add-name-dfa .input-countener .row").length;
    const keys = Object.keys(alphabetObj);
    const data = keys.map(e => alphabetObj[e]);
    // check for duplicates
    const sorted_arr = data.slice().sort();
    let has_duplicates = false;
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        has_duplicates = true;
      }
    }

    // check for empty fields
    let has_empty = false;
    if (length > data.length) {
      has_empty = true;
    }

    if (has_empty) {
      sweetAlert(
        "Something is Wrong!",
        "Empty fields are not allowed!",
        "error"
      );
    } else if (has_duplicates) {
      sweetAlert(
        "Something is Wrong!",
        "Duplicated characters are not allowed!",
        "error"
      );
    } else if (nameDFA.length === 0) {
      sweetAlert("Something is Wrong!", "Please enter a name", "error");
    } else {
      alphabetObj = sorted_arr;
      $(".add-name-dfa").addClass("hide");
      $(".add-state-dfa").removeClass("hide");
    }
  });

  $(".add-state-dfa .add-input").on("click", function() {
    $(
      ".add-state-dfa .input-countener"
    ).append(`           <div class="row" data-id="${stateNumber}">
    <div class="col-md-2">
      <h4>State Name:</h4>
    </div>
    <div class="col-md-4">
      <input type="text" class="form-control" data-id="${stateNumber}" />
    </div>
    <div class="col-md-2 m-t-12">
      <input type="checkbox" class="check-end" data-id="${stateNumber}" /> &nbsp;Is a Final State
    </div>
    <div class="col-md-2 m-t-12 ">
      <input type="checkbox" class="check-start"  data-id="${stateNumber}" /> &nbsp;Is the Initial State
    </div>
    <div class="col-md-2">

      <i class="fa fa-minus-circle remove-input"></i>

    </div>

  </div>`);
    stateNumber++;
  });

  $(".add-state-dfa .input-countener").on("click", ".remove-input", function() {
    if ($(".add-state-dfa .input-countener .row").length === 1) return;
    const row = $(this).parents(".row");
    id = row.data("id");
    delete StateObj[id];
    row.remove();
  });

  $(".add-state-dfa .input-countener").on(
    "change",
    ".form-control",
    function() {
      const self = $(this);
      const id = self.data("id");
      const val = self.val();
      if (!StateObj[id]) StateObj[id] = {};
      if (val === "") delete StateObj[id]["label"];
      else StateObj[id]["label"] = val;
    }
  );

  $(".add-state-dfa .input-countener").on("change", ".check-end", function() {
    const self = $(this);
    const id = self.data("id");
    const val = self.prop("checked");
    if (!StateObj[id]) StateObj[id] = {};
    StateObj[id]["end"] = val;
  });
  $(".add-state-dfa .input-countener").on("change", ".check-start", function() {
    const self = $(this);
    const id = self.data("id");
    const val = self.prop("checked");
    if (!StateObj[id]) StateObj[id] = {};
    StateObj[id]["start"] = val;
  });

  $(".add-state-dfa .for-transitions-model").on("click", function() {
    const length = $(".add-state-dfa .input-countener .row").length;
    const keys = Object.keys(StateObj);
    const data = keys.map(e => StateObj[e]);
    // check for duplicates
    const sorted_arr = data.slice().sort(e => e.label);
    let has_duplicates = false;
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (
        sorted_arr[i + 1]["label"] &&
        sorted_arr[i]["label"] &&
        sorted_arr[i + 1]["label"] == sorted_arr[i]["label"]
      ) {
        has_duplicates = true;
      }
    }

    // check for empty fields
    let NumberState = 0;
    for (let i = 0; i < sorted_arr.length; i++) {
      if (sorted_arr[i]["label"] && sorted_arr[i]["label"] != "") NumberState++;
    }

    let has_empty = false;
    if (length > NumberState) {
      has_empty = true;
    }
    //check for more from one start state
    let numberStartState = 0;

    for (let i = 0; i < sorted_arr.length; i++) {
      if (sorted_arr[i]["start"]) numberStartState++;
    }

    if (has_empty) {
      sweetAlert(
        "Something is Wrong!",
        "Empty fields are not allowed!",
        "error"
      );
    } else if (has_duplicates) {
      sweetAlert(
        "Something is Wrong!",
        "Duplicated characters are not allowed!",
        "error"
      );
    } else if (numberStartState !== 1) {
      sweetAlert(
        "Something is Wrong!",
        "you should select just one start state",
        "error"
      );
    } else {
      StateObj = sorted_arr;
      bulidEdgeObj();
      $(".add-state-dfa").addClass("hide");
      $(".add-transitions-dfa").removeClass("hide");
      let ThreeView = "";
      for (let i = 0; i < StateObj.length; i++) {
        let str1 = `<div class="row">
        <div class="col-md-11">
          <div class="panel panel-success">
            <div class="panel-heading">
              <h3 class="panel-title">State '${StateObj[i]["label"]}':</h3>
            </div>
            <div class="panel-body">`;
        let str2 = "";
        for (let j = 0; j < alphabetObj.length; j++) {
          str2 += `                  <div class="row">
              <div class="col-md-3">
                Transition with Character '${alphabetObj[j]}':
              </div>
              <div class="col-md-9">
                <select class="form-control" data-from="${
                  StateObj[i]["label"]
                }" data-state="${alphabetObj[j]}">`;
          str3 = "";
          for (let k = 0; k < StateObj.length; k++) {
            str3 += ` <option value="${StateObj[k]["label"]}">${
              StateObj[k]["label"]
            }</option>`;
          }
          str2 += str3;
          str2 += ` </select> </div></div>`;
        }
        str2 += "</div></div></div></div>";
        str1 += str2;
        ThreeView += str1;
        str1 = "";
      }
      $(".add-transitions-dfa .input-countener").append(ThreeView);
    }
  });

  $(".add-transitions-dfa").on("change", "select", function() {
    const self = $(this);
    const from = self.data("from");
    const state = self.data("state");
    const to = self.val();
    for (let i = 0; i < edges.length; i++) {
      if (edges[i].from == from && edges[i].state == state) {
        edges[i].to = to;
        break;
      }
    }
  });
  $(".add-transitions-dfa").on("click", ".to-server", function() {
    sendToServer();
  });
});
