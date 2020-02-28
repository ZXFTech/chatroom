// import io from 'socket.io-client';

var cUser;

function Send(form) {
    addMessage(myself, form.value, true);
    // setTimeout(function(){addMessage(conan, "Hello,world,again!", false);}, 1000);
}

function addMessage(messageChunk, isend) {
    var messageCBox = document.getElementsByClassName("messageCBox")[0];
    var newDivMessageTest = document.createElement("div");
    var addclass = isend ? "message-test isend" : "message-test";
    newDivMessageTest.setAttribute("class", addclass);
    // newDivMessageTest.setAttribute("class","isend");

    var newUserIcon = document.createElement("img");
    newUserIcon.setAttribute("class", "user-icon");
    newUserIcon.setAttribute("src", messageChunk.user.icon);
    newUserIcon.setAttribute("alt", "usericon");
    newDivMessageTest.appendChild(newUserIcon);

    var newUserMessage = document.createElement("div");
    newUserMessage.setAttribute("class", "user-message");

    var newUserLevel = document.createElement("div");
    newUserLevel.setAttribute("class", "user-level");
    var level = document.createTextNode("LV." + messageChunk.user.level);
    newUserLevel.appendChild(level);
    newUserMessage.appendChild(newUserLevel);

    var newUserName = document.createElement("div");
    newUserName.setAttribute("class", "user-name");
    var newName = document.createTextNode(messageChunk.user.username);
    newUserName.appendChild(newName);
    newUserMessage.appendChild(newUserName);

    var newUserChattime = document.createElement("div");
    newUserChattime.setAttribute("class", "user-chattime");
    var newChattime = document.createTextNode(messageChunk.time);
    newUserChattime.appendChild(newChattime);
    newUserMessage.appendChild(newUserChattime);

    var newUserContent = document.createElement("div");
    newUserContent.setAttribute("class", "user-content");
    var userContent = document.createTextNode(messageChunk.content);
    newUserContent.appendChild(userContent);
    newUserMessage.appendChild(newUserContent);

    newDivMessageTest.appendChild(newUserMessage);
    messageCBox.appendChild(newDivMessageTest);

    var scrollElement = document.getElementsByClassName("message-test");

    messageCBox.scrollTop += 9999;
}



// function sendMessage() {
//     socket.on()
// }

function formatZero(num, length) {
    return (Array(length).join(0) + num).slice(-length);
};

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

function checkUsername() {
    var userName = document.getElementById("userName");
    if (userName && userName.value.length > 20) {
        var error = document.getElementById("userNameError");
        error.innerHTML = "用户名长度最多为20位";
    }
}

function checkPassword() {

}

function tryLogReg(logOrReg) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    socket.emit(logOrReg,{
        'username':username,
        'password':password
    });
}

function openLogRegWindow() {
    document.getElementsByClassName('logWindow')[0].classList.remove('hidden');
};

document.getElementsByClassName('logRegWindow')[0].addEventListener('click',function(e) {
    if (e.target.className=="logWindow") {
        e.target.classList.add('hidden');
    }
})

var socket = io();

socket.on('recentRecords',function(recentRecords) {
    if (recentRecords == null) {
        console.log(recentRecords);
        console.log('Got the records but there is nothing.');
    }
    else {
        for (var i = recentRecords.length-1; i >0; i--) {
            console.log(recentRecords[i].user);
            addMessage(recentRecords[i],recentRecords[i].user.username == cUser.username);
            console.log("Added");
        }
    }
});

socket.on('message', function(user,msg) {
    console.log(msg);
    addMessage(user, msg, false);
});

socket.on('logOrRegSuccessfully',function(user){
    cUser = new User(user);
    document.getElementsByClassName('inputArea')[0].classList.remove('hidden');
    document.getElementsByClassName('logRegTip')[0].classList.add('hidden');
    document.getElementsByClassName('logRegWindow')[0].classList.add('hidden');
});

socket.on('regFailed',function(errmsg){
    document.getElementById('usernameError').innerHTML = errmsg;
});

socket.on('logFailed',function(errmsg) {
    document.getElementById('usernameError').innerHTML = errmsg;
})

function send() {
    var userInput = document.getElementsByClassName('inputText')[0];
    var content = userInput.value;
    if (content == "") {
        alert("消息不能为空！");
        return;
    }
    var messageChunk = {
        user:cUser,
        time:formatZero(new Date().getHours(), 2) + ":" + formatZero(new Date().getMinutes(), 2) + ":" + formatZero(new Date().getSeconds(), 2),
        content:content
    }
    addMessage(messageChunk, true);
    socket.emit('message',messageChunk);
    userInput.value = "";
};
