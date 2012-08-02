/* ***********************************************************

  Code below is for desktop testing!

*********************************************************** */
if (!navigator.mozSettings) {
  window.addEventListener('load', function loadWithoutSettings() {
    ThreadUI.init();
    ThreadListUI.init();
  });
}

if (!navigator.mozSms) {
  // We made up a fake database on
  var messagesHack = [];
  (function() {
    var messages = [
      {
        sender: null,
        receiver: '1-977-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 41,
        timestamp: new Date(Date.now() - 44000000)
      },
      {
        sender: null,
        receiver: '1-977-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 42,
        timestamp: new Date(Date.now() - 33000000)
      },
      {
        sender: null,
        receiver: '1-277-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 43,
        timestamp: new Date(Date.now() - 55000000)
      },
      {
        sender: null,
        receiver: '1-177-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 44,
        timestamp: new Date(Date.now() - 66000000)
      },
      {
        sender: null,
        receiver: '1-377-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 45,
        timestamp: new Date(Date.now() - 66000000)
      },
      {
        sender: null,
        receiver: '1-477-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 46,
        timestamp: new Date(Date.now() - 44000000)
      },
      {
        sender: null,
        receiver: '1-677-743-6797',
        body: 'Nothing :)',
        delivery: 'sent',
        id: 47,
        timestamp: new Date(Date.now() - 44000000)
      },
      {
        sender: '1-977-743-6797',
        body: 'Hey! What\s up?',
        delivery: 'received',
        id: 40,
        timestamp: new Date(Date.now() - 50000000)
      }
    ];

    for (var i = 0; i < 40; i++) {
      messages.push({
        sender: '1-488-678-3487',
        body: 'Hello world!',
        delivery: 'received',
        id: 39 - i,
        timestamp: new Date(Date.now() - 60000000)
      });
    }

    messagesHack = messages;
  })();

  var GetMessagesHack = function gmhack(callback, filter, invert, cllbckArgs) {
    function applyFilter(msgs) {
      if (!filter)
        return msgs;

      if (filter.numbers) {
        msgs = msgs.filter(function(element, index, array) {
          var num = filter.numbers;
          return (num && (num.indexOf(element.sender) != -1 ||
                          num.indexOf(element.receiver) != -1));
        });
      }

      return msgs;
    }

    var msg = messagesHack.slice();
    if (invert)
      msg.reverse();
    callback(applyFilter(msg), cllbckArgs);
  };

  MessageManager.getMessages = function(callback, filter, invert, cllbckArgs) {
    GetMessagesHack(callback, filter, invert, cllbckArgs);
    return;
  };

  MessageManager.send = function(number, text, callback) {
    var message = {
      sender: null,
      receiver: number,
      delivery: 'sent',
      body: text,
      id: messagesHack.length,
      timestamp: new Date()
    };

    var simulateFail = /fail/i.test(text);

    window.setTimeout(function sent() {
      if (simulateFail) {
        // simulate failure
        callback(null);
        return;
      }

      // simulate success
      callback(message);

      // the SMS DB is written after the callback
      window.setTimeout(function writeDB() {
        messagesHack.unshift(message);
      }, 90 * Math.random());
    }, 3000 * Math.random());

    if (simulateFail)
      return;

    window.setTimeout(function hiBack() {
      var message = {
        sender: number,
        receiver: null,
        delivery: 'received',
        body: 'Hi back! ' + text,
        id: messagesHack.length,
        timestamp: new Date()
      };

      var evt = {
        type: 'received',
        message: message
      };
      MessageManager.handleEvent.call(MessageManager, evt);
      // the SMS DB is written after the callback
      window.setTimeout(function writeDB() {
        messagesHack.unshift(message);
      }, 90 * Math.random());

    }, 5000 + 3000 * Math.random());
  };
}
