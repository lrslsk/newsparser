$(document).ready(function() {
    $("#submiturlbutton").click(function() {

        let decodedArticleText = "";

        $("#loader").show();
        

        $.ajax({
            headers: { "Accept": "application/json"},
            type: 'POST',
            url: '/getarticle',
            data: {
              articleurl: $('#articleurl').val()
            },
            success: function(data, textStatus, request){ 

              $("#loader").hide();

              var parser = new DOMParser();
              var htmlDoc = parser.parseFromString(data, 'text/html');

              // Add title and subtitle of article
              decodedArticleText += "<span style='font-weight: bold; font-size: 25px; text-decoration: underline;'>" + htmlDoc.getElementsByTagName('title')[0].innerHTML + "<br><br>" + "</span>";
              decodedArticleText += "<span style='font-weight: bold; font-size: 18px;'>" + htmlDoc.getElementsByClassName('article__header__intro__text')[0].innerHTML + "<br><br><br>" + "</span>";
              
              var obfuscated = htmlDoc.getElementsByClassName('article__paragraph');

              
              for(var i = 0; i < obfuscated.length; i++){
                // Shift the obfuscated text by -1
                decodedArticleText += caesarShift(obfuscated[i].innerHTML, -1) + "<br><br>";
              }


              // Clear content in case user loads another url
              $("#resulttext").html("");
              $("#resulttext").addClass("border");
              $("#resulttext").append(decodedArticleText);
              $("#resulttext").show();
              $('#articleurl').val("");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
              $("#loader").hide(); 
            }
        })
      });
});

function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

 function caesarShift(str, amount) {
  // Wrap the amount
  if (amount < 0) {
    return caesarShift(str, amount + 26);
  }

  // Make an output variable
  var output = "";

  // Go through each character
  for (var i = 0; i < str.length; i++) {
    // Get the character we'll be appending
    var c = str[i];

    // If it's a letter...
    if (c.match(/[a-z]/i)) {
      // Get its code
      var code = str.charCodeAt(i);

      // Uppercase letters
      if (code >= 65 && code <= 90) {
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      }

      // Lowercase letters
      else if (code >= 97 && code <= 122) {
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }

    // If it's a number...
    else if (c.match(/[0-9]/i)) {
      // Get its code
      var code = str.charCodeAt(i);

      // Numbers
      if (code >= 48 && code <= 57) {
        c = String.fromCharCode(((code - 48 + amount) % 26) + 48);
      }
    }

    // If it's a special sign...
    else if (str.charCodeAt(i) >= 33 && str.charCodeAt(i) <= 47) {
      // Get its code
      var code = str.charCodeAt(i);

      // special signs
      c = String.fromCharCode(((code - 33 + amount) % 26) + 33);
    }

    // More special signs...
    else if (str.charCodeAt(i) >= 58 && str.charCodeAt(i) <= 63) {
      // Get its code
      var code = str.charCodeAt(i);

      // special signs
      c = String.fromCharCode(((code - 58 + amount) % 26) + 58);
    }

    // Append
    output += c;
  }

  // Make pretty
  output = output.replace(/=strong?/g, "")
  output = output.replace(/=strong 9?/g, "")
  output = output.replace(/=9strong?/g, "")
  output = output.replace(/=9a?/g, "")

  output = output.replace(/\{/g, "z")
  output = output.replace(/\[/g, "Z")
  output = output.replace(/\÷/g, "ö")
  output = output.replace(/\ý/g, "ü")
  output = output.replace(/\Ý/g, "Ü")

  output = output.replace(/\à/g, "ß")
  output = output.replace(/\å/g, "ä")

  output = output.replace(/\@/g, "?")
  // output = output.replace(/\)/g, "(")
  // output = output.replace(/\*/g, ")")

  // output = output.replace(/\-/g, "~§")
  // output = output.replace(/\,/g, "-")
  // output = output.replace(/\~\§/g, ",")

  // output = output.replace(/\@/g, "?")
  // output = output.replace(/\./g, "-")
  // output = output.replace(/\//g, ".")
  // output = output.replace(/\:/g, "9")
  // output = output.replace(/\;/g, ":")
  // output = output.replace(/=/g, "<")
  // output = output.replace(/a\?/g, ">")

  // All done!
  return output;
};