function Send(form) {
    console.log(432);
    addMessage(myself, form.value, true);
    // setTimeout(function(){addMessage(conan, "Hello,world,again!", false);}, 1000);
}

function addMessage(user, message, isend) {
    var messageCBox = document.getElementsByClassName("messageCBox")[0];
    var newDivMessageTest = document.createElement("div");
    var addclass = isend ? "message-test isend":"message-test" ;
    newDivMessageTest.setAttribute("class", addclass);
    // newDivMessageTest.setAttribute("class","isend");

    var newUserIcon = document.createElement("img");
    newUserIcon.setAttribute("class", "user-icon");
    newUserIcon.setAttribute("src", user.icon);
    newUserIcon.setAttribute("alt", "usericon");
    newDivMessageTest.appendChild(newUserIcon);

    var newUserMessage = document.createElement("div");
    newUserMessage.setAttribute("class", "user-message");

    var newUserLevel = document.createElement("div");
    newUserLevel.setAttribute("class", "user-level");
    var level = document.createTextNode("LV." + user.level);
    newUserLevel.appendChild(level);
    newUserMessage.appendChild(newUserLevel);

    var newUserName = document.createElement("div");
    newUserName.setAttribute("class", "user-name");
    var newName = document.createTextNode(user.name);
    newUserName.appendChild(newName);
    newUserMessage.appendChild(newUserName);

    var newUserChattime = document.createElement("div");
    newUserChattime.setAttribute("class", "user-chattime");
    var newChattime = document.createTextNode(formatZero(new Date().getHours(), 2) + ":" + formatZero(new Date().getMinutes(), 2) + ":" + formatZero(new Date().getSeconds(), 2));
    newUserChattime.appendChild(newChattime);
    newUserMessage.appendChild(newUserChattime);

    var newUserContent = document.createElement("div");
    newUserContent.setAttribute("class", "user-content");
    var userContent = document.createTextNode(message);
    newUserContent.appendChild(userContent);
    newUserMessage.appendChild(newUserContent);

    newDivMessageTest.appendChild(newUserMessage);
    messageCBox.appendChild(newDivMessageTest);

    var scrollElement = document.getElementsByClassName("message-test");

    messageCBox.scrollTop += 100;
}


function formatZero(num, length) {
    return (Array(length).join(0) + num).slice(-length);
}

var myself = {
    name: "Naruto",
    level: 1,
    icon: "./images/usericons/naruto.jpg"
}

var conan = {
    name: "Conan",
    level: 2,
    icon: "./images/usericons/conan.jpg"
}
