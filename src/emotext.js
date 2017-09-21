;
var Emotext = (function() {
  var $input;
  var $log;

  var baseimgUrl = "https://assets-cdn.github.com/images/icons/emoji/unicode/";
  var emojiReg = /:-?\)|\<3/g;
  var emojiMap = {
    ":)": '1f604.png?v6',
    ":-)": '1f604.png?v6',
    "<3": '1f60d.png?v6'
  }
  var template = `<div class="emotext-input-box" contenteditable="true"></div>
                  <ul class="emotext-text-log"></ul>`;

  // Callback for debounce
  var onKeyPress = debounce(function(ev) {
    var innerTxt = ev.target.innerText;
    var matched = innerTxt.match(emojiReg);
    if (matched) {
      var sel = window.getSelection().getRangeAt(0);
      var fNode = window.getSelection().focusNode;
      sel.setStart(fNode, sel.endOffset - matched[0].length);
      insertEmojiNode(`<img class="emotext-img" src="${baseimgUrl + emojiMap[matched[0]]}"/>`, sel);
    }
  }, 100);

  // Emotext constructor
  function Emotext(el) {
    el.innerHTML = template;
    $input = document.querySelector(".emotext-input-box");
    $log = document.querySelector(".emotext-text-log");
    registerEvents();
    $input.focus()
  }



  // Register the DOM events
  function registerEvents() {
    $input.addEventListener("keypress", function(ev) {
      if (ev.code == 'Enter') {
        var li = document.createElement("li");
        if ($input.innerText != "") {
          li.innerHTML = $input.innerHTML;
          $log.appendChild(li);
          setTimeout(function() {
            li.classList.add("animate");
          }, 0);
          $input.innerHTML = "";
        }
        ev.preventDefault();
      }
      onKeyPress.call(this, ev);
    });
  }

  // Insert Emoji Node at cursor position
  function insertEmojiNode(html, range) {
    var el = document.createElement("div");
    range.deleteContents();
    el.innerHTML = html;
    range.insertNode(el.childNodes[0]);
    range.collapse();
  }

  // Delay processing od keystrokes
  function debounce(callback, delay) {
    let ctx, timer, args;
    ctx = this;
    return function() {
      args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        callback.apply(ctx, args);
      }, delay);
    }
  }

  return Emotext;
})();