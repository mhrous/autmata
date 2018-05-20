$(document).ready(function() {
  const php = new PHP();
  php.draw();
  $("button").on("click", async function() {
    php.resetColor()
    const val = $("input").val();
    if (val == "") return;
    for (let i = 0; i < val.length; i++) {
      if (alphabet.indexOf(val[i]) === -1) {
        sweetAlert(
          "String is Invalid!",
          'String "' +
            val +
            '" has characters that are not present in DFA alphabet!',
          "error"
        );
        return;
      }
    }
    $(this).addClass("disabled");

    const node = await php.getEnd(val);
    if (node.end) {
      sweetAlert(
        "String Accepted!",
        'String "' + val + '" it is a"' + node.massege,
        "success"
      );
    } else {
      sweetAlert(
        "String Rejected!",
        'String "' + val + '" Rejected by the DFA!',
        "error"
      );
    }

    $(this).removeClass("disabled");
  });
});
