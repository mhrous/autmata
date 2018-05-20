$(document).ready(function() {
  let nameDfa = [];
  const automata = new Automata();

  const getNameDfaFromServer = async () => {
    const response = await Api.get("dfaName");
    const status = response.status;
    if (status === 200) {
      const json = await response.json();
      console.log(json);
      nameDfa = json;
    }
    str = "";
    for (let i = 0; i < nameDfa.length; i++) {
      str += `  <li class="list-group-item" data-id="${nameDfa[i].id}">${
        nameDfa[i].name
      }</li>

        `;
    }
    $(".one ul").append(str);
  };
  const getDfaFromServer = async id => {
    const response = await Api.get(`dfa/${id}`);
    const status = response.status;
    if (status === 200) {
      const json = await response.json();
      automata.reset();
      automata.buildFromJson(json);
      automata.draw();
      $("button").removeClass("disabled");
    }
  };
  getNameDfaFromServer();
  $(".one ul").on("click", "li", function() {
    const self = $(this);
    const id = self.data("id");
    $(".active-dfa").removeClass("active-dfa");
    self.addClass("active-dfa");
    getDfaFromServer(id);
  });

  $("button").on("click", async function() {
    $(this).addClass("disabled");
    automata.resetColor();
    const valueForTest = $("input").val();
    if (valueForTest === "") {
      $(this).removeClass("disabled");
      return;
    }
    console.log(valueForTest);
    const array = automata.alphabet;
    for (let i = 0; i < valueForTest.length; i++) {
      if (array.indexOf(valueForTest[i]) == -1) {
        sweetAlert(
          "String is Invalid!",
          'String "' +
            valueForTest +
            '" has characters that are not present in DFA alphabet!',
          "error"
        );
        $(this).removeClass("disabled");
        return;
      }
    }
    await automata.getEnd(valueForTest);
    $(this).removeClass("disabled");
  });
});
