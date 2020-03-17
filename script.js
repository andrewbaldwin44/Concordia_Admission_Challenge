/*On Document Load, pull existing comments from Local Storage
Paste them to the Comment Storage Array*/
let commentStorage = [];
const body = document.querySelector("body");
window.onload = function() {
  /*No transitions on load*/
  body.classList.remove("preload");

  /*Clear Comment Input Values*/
  userInput.value = "";
  commentInput.value = "";

  /*Load pre-existing comments if there are any*/
  if (localStorage.commentsArray) {
    let existingComments = JSON.parse(localStorage.commentsArray);

    /*Comment Storage is built in reverse because
    the Comment Section is newest to oldest (reversed)*/
    let i = existingComments.length -1;
    for (; i >= 0; i--) {
      commentStorage.push(existingComments[i]);
      createComment(existingComments[i].userName, existingComments[i].comment);
    }
  }
}

/*Clicking on window or another edit / delete dropdown
closes dropdwon*/
window.onclick = () => {
  if (!event.target.matches(".dropdownButton")) {
    let dropdownContent = document.querySelectorAll(".dropdownContent");

    for (i = 0; i < dropdownContent.length; i++) {
      if (dropdownContent[i].classList.contains("show")) {
        dropdownContent[i].classList.remove("show");
      }
    }
  }
}

/*Enable / Disable submit button*/
const userInput = document.querySelector("#userInput");
const commentInput = document.querySelector("#commentInput");

userInput.addEventListener("input", buttonEnableDisable);
commentInput.addEventListener("input", buttonEnableDisable);

function buttonEnableDisable() {
  if (userInput.value && commentInput.value) {
    submitButton.classList.remove("disabled");
  }
  else {
    submitButton.classList.add("disabled");
  }
}

/*Action for comment submit button*/
const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", () => {
  userName = document.querySelector("#userInput").value;
  comment = document.querySelector("#commentInput").value;

  if (userName && comment) {
    submitButton.classList.remove("disabled");
    createComment(userName, comment);

    /*Scroll Window to Added Comment*/
    window.scrollTo(0, document.body.scrollHeight);

    /*Save comment to Local Storage*/
    saveComment(userInput.value, commentInput.value);

    /*Clear Inputs*/
    userInput.value = "";
    commentInput.value = "";

    /*Disable Button*/
    submitButton.classList.add("disabled");
  }
});

/*Save new comments posted*/
function saveComment(userName, comment) {
  let newComment = {userName: userName, comment: comment};
  commentStorage.unshift(newComment);

  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(commentStorage));
}

/*Edit posted comment*/
function editComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  let userProfile = commentItem.children[0];
  let userPostDate = userProfile.children[1];
  let userName = userPostDate.children[0];
  let postDate = userPostDate.children[1];
  let dropdown = userProfile.children[2];
  let comment = commentItem.children[1];

  let userInput = document.createElement("input");
  let commentInput = document.createElement("textarea");
  let saveEdit = document.createElement("button");
  let cancelEdit = document.createElement("button");

  userInput.setAttribute("class", "editUsername");
  commentInput.setAttribute("class", "editComment");
  commentInput.setAttribute("rows", "3");
  saveEdit.setAttribute("class", "saveEdit");
  cancelEdit.setAttribute("class", "cancelEdit");

  userInput.value = userName.textContent;
  commentInput.value = comment.textContent;
  saveEdit.textContent = "Save";
  saveEdit.addEventListener("click", () => {
    commentEdit(userInput.value, userName.textContent,
             commentInput.value, comment.textContent,
             commentItem.id);
  });
  cancelEdit.textContent = "Cancel";
  cancelEdit.addEventListener("click", () => cancelEdit(commentItem.id));

  userName.remove();
  comment.remove();
  dropdown.remove();
  userPostDate.insertBefore(userInput, postDate);
  commentItem.append(commentInput);
  commentItem.append(saveEdit);
}

function commentEdit(userNameNew, userNameOriginal, commentNew, commentOriginal, id) {
  if (userNameNew != userNameOriginal || commentNew != commentOriginal) {
    let commentsArray = JSON.parse(localStorage.commentsArray);
    commentsArray[id].userName = userNameNew;
    commentsArray[id].comment = commentNew;
    console.log(commentsArray);

    localStorage.clear();
    localStorage.setItem("commentsArray", JSON.stringify(commentsArray));
  }
  exitEdit(id);
}
function exitEdit(id) {
  let commentSection = document.querySelector("#commentSection")
  let commentItem = commentSection.querySelectorAll(".commentItem")[id];

  let userPostDate = commentItem.querySelector(".userPostDate");
  let commentDate = commentItem.querySelector(".commentDate");
  let userInput = commentItem.querySelector(".editUsername");

  let commentInput = commentItem.querySelector(".editComment");
  let saveEdit = commentItem.querySelector(".saveEdit");

  let userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("class", "userName");
  userNameLabel.textContent = userInput.value;

  let newComment = document.createElement("pre");
  newComment.setAttribute("class", "newComment");
  newComment.textContent = commentInput.value;

  userInput.remove();
  userPostDate.insertBefore(userNameLabel, commentDate);

  commentInput.remove();
  commentItem.appendChild(newComment);

  saveEdit.remove();
}

/*Delete posted comment*/
function deleteComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  let commentsArray = JSON.parse(localStorage.commentsArray);
  let removeComment = commentsArray.indexOf(commentsArray[commentItem.id]);

  commentsArray.splice(removeComment, 1);

  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(commentsArray));
  commentItem.previousSibling.remove();
  commentItem.remove();

  commentSectionID();
}

//Number comment items with ID's
function commentSectionID() {
  let commentSection = document.querySelector("#commentSection");
  let id = 0;
  for (i = 0; i < commentSection.children.length; i++) {
    if (commentSection.children[i].classList.contains("commentItem")){
      commentSection.children[i].setAttribute("id", id++);
    }
  }
}

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November",
                "December"];
let today = new Date();
function createComment(userName, comment) {
  let commentSeperator = document.createElement("hr");
  commentSeperator.setAttribute("class", "commentSeperator");

  let commentItem = document.createElement("section");
  commentItem.setAttribute("class", "commentItem");

  let userProfile = document.createElement("div");
  userProfile.setAttribute("class", "userProfile");
  let userPostDate = document.createElement("div");
  userPostDate.setAttribute("class", "userPostDate");

  let userImage = document.createElement("img");
  userImage.setAttribute("src", "images/user.png");
  userImage.setAttribute("alt", "User image");
  userImage.setAttribute("class", "userImage");

  let commentDate = document.createElement("span");
  commentDate.setAttribute("class", "commentDate")
  commentDate.textContent = `${months[today.getMonth()]} ${today.getFullYear()}`;

  let userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("class", "userName");
  userNameLabel.textContent = userName;

  let newComment = document.createElement("pre");
  newComment.setAttribute("class", "newComment");
  newComment.textContent = comment;

  let dropdown = document.createElement("div");
  let editDelete = document.createElement("button");
  let dropdownContent = document.createElement("div");
  let editButton = document.createElement("p");
  let deleteButton = document.createElement("p");
  dropdown.setAttribute("class", "dropdown");
  editDelete.addEventListener("click", () => dropdownContent.classList.toggle("show"));
  editDelete.setAttribute("class", "dropdownButton");
  dropdownContent.setAttribute("class", "dropdownContent");
  editButton.textContent = "edit";
  editButton.addEventListener("click", editComment)
  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", deleteComment)
  dropdownContent.appendChild(editButton);
  dropdownContent.appendChild(deleteButton);
  dropdown.appendChild(editDelete);
  dropdown.appendChild(dropdownContent);


  userPostDate.appendChild(userNameLabel);
  userPostDate.appendChild(commentDate);

  userProfile.appendChild(userImage);
  userProfile.appendChild(userPostDate);
  userProfile.appendChild(dropdown);

  commentItem.appendChild(userProfile);
  commentItem.appendChild(newComment);

  commentSection.insertBefore(commentItem, commentSection.firstChild);
  commentSection.insertBefore(commentSeperator, commentSection.firstChild);

  body.appendChild(commentSection);

  commentSectionID();
}
