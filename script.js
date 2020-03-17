let commentStorage = [];
const body = document.querySelector("body");

window.onload = function() {
  /*No transitions on load*/
  body.classList.remove("preload");

  /*Clear Comment Input Values*/
  userInput.value = "";
  commentInput.value = "";

  /*On Document Load, pull existing comments from Local Storage
  Paste them to the Comment Storage Array*/
  if (localStorage.commentsArray) {
    let existingComments = JSON.parse(localStorage.commentsArray);

    /*Comment Storage is built in reverse because
    the Comment Section is newest to oldest (reversed)*/
    let i = existingComments.length -1;
    for (; i >= 0; i--) {
      commentStorage.unshift(existingComments[i]);
      createComment(existingComments[i].userName, existingComments[i].comment);
    }
  }
}

//Clicking elsewhwere on window closes dropdown
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
  userName = userInput.value;
  comment = commentInput.value;

  if (userName && comment) {
    createComment(userName, comment);
    saveComment(userName, comment);

    userInput.value = "";
    commentInput.value = "";

    buttonEnableDisable();
  }
});

function setLocalStorage() {
  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(commentStorage));
}

const commentSection = document.querySelector("#commentSection");
function queryCommentItem(commentItem) {
  return {
    userPostDate: commentItem.querySelector(".userPostDate"),
    userName: commentItem.querySelector(".userName"),
    postDate: commentItem.querySelector(".commentDate"),
    dropdown: commentItem.querySelector(".dropdown"),
    comment: commentItem.querySelector(".newComment")
  }
}

function saveComment(userName, comment) {
  let newComment = {userName: userName, comment: comment};
  commentStorage.unshift(newComment);

  setLocalStorage();
}

function editComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  let commentQuery = queryCommentItem(commentItem);

  let userInput = document.createElement("input");
  let commentInput = document.createElement("textarea");
  let buttonInputs = document.createElement("div");
  let saveEdit = document.createElement("button");
  let cancelEdit = document.createElement("button");

  userInput.setAttribute("class", "editUsername");
  commentInput.setAttribute("class", "editComment");
  commentInput.setAttribute("rows", "3");
  buttonInputs.setAttribute("class", "buttonInputs");
  saveEdit.setAttribute("class", "saveEdit");
  cancelEdit.setAttribute("class", "saveEdit cancelEdit");

  userInput.value = commentQuery.userName.textContent;
  commentInput.value = commentQuery.comment.textContent;

  saveEdit.textContent = "Save";
  saveEdit.addEventListener("click", () => {
    commentEdit(userInput.value, commentQuery.userName.textContent,
             commentInput.value, commentQuery.comment.textContent,
             commentItem.id);
  });

  cancelEdit.textContent = "Cancel";
  cancelEdit.addEventListener("click", () => exitEdit(commentItem.id));

  commentQuery.userName.remove();
  commentQuery.comment.remove();
  commentQuery.dropdown.remove();
  commentQuery.userPostDate.insertBefore(userInput, commentQuery.postDate);
  buttonInputs.append(saveEdit);
  buttonInputs.append(cancelEdit);
  commentItem.append(commentInput);
  commentItem.append(buttonInputs);
}

function commentEdit(userNameNew, userNameOriginal, commentNew, commentOriginal, id) {
  if (userNameNew != userNameOriginal || commentNew != commentOriginal) {
    commentStorage[id].userName = userNameNew;
    commentStorage[id].comment = commentNew;

    setLocalStorage();
  }
  exitEdit(id);
}
function exitEdit(id) {
  let commentItem = commentSection.querySelectorAll(".commentItem")[id];
  let commentQuery = queryCommentItem(commentItem);

  let userInput = commentItem.querySelector(".editUsername");
  let commentInput = commentItem.querySelector(".editComment");
  let saveEdit = commentItem.querySelector(".saveEdit");
  let cancelEdit = commentItem.querySelector(".cancelEdit");

  userInput.remove();
  commentInput.remove();
  saveEdit.remove();
  cancelEdit.remove();

  createUserComment(commentItem, userInput.value, commentInput.value);
  createDropdown(commentItem);
}

/*Delete posted comment*/
function deleteComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  let removeComment = commentStorage.indexOf(commentStorage[commentItem.id]);

  commentStorage.splice(removeComment, 1);
  commentItem.previousSibling.remove();
  commentItem.remove();

  setLocalStorage();
  commentSectionID();
}

//Number comment items with ID's
function commentSectionID() {
  let commentSection = document.querySelector("#commentSection");
  let dropdown = commentSection.querySelector(".dropdown");
  let id = 0;
  for (i = 0; i < commentSection.children.length; i++) {
    if (commentSection.children[i].classList.contains("commentItem")){
      commentSection.children[i].setAttribute("id", id++);
    }
  }
}

function createUserComment(commentItem, userName, comment) {
  let commentQuery = queryCommentItem(commentItem);

  let userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("class", "userName");
  userNameLabel.textContent = userName;

  let newComment = document.createElement("pre");
  newComment.setAttribute("class", "newComment");
  newComment.textContent = comment;

  commentQuery.userPostDate.insertBefore(userNameLabel, commentQuery.postDate);
  commentItem.appendChild(newComment);
}

function createDropdown(commentItem) {
  let dropdown = document.createElement("div");
  let editDelete = document.createElement("button");
  let dropdownContent = document.createElement("div");
  let editButton = document.createElement("p");
  let deleteButton = document.createElement("p");
  let userProfile = commentItem.querySelector(".userProfile");

  dropdown.setAttribute("class", "dropdown");

  editDelete.addEventListener("click", () => toggleDropdown(dropdownContent));
  editDelete.setAttribute("class", "dropdownButton");

  dropdownContent.setAttribute("class", "dropdownContent");

  editButton.textContent = "edit";
  editButton.addEventListener("click", editComment);

  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", deleteComment);

  dropdownContent.appendChild(editButton);
  dropdownContent.appendChild(deleteButton);

  dropdown.appendChild(editDelete);
  dropdown.appendChild(dropdownContent);

  userProfile.append(dropdown);
}

function toggleDropdown(dropdownContent) {
  let dropdowns = document.querySelectorAll(".show");
  if (dropdowns) {
    for (i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("show");
    }
  }
  dropdownContent.classList.toggle("show");
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
  commentDate.textContent = `${months[today.getMonth()]} ${today.getDay()}, ${today.getFullYear()}`;

  userPostDate.appendChild(commentDate);

  userProfile.appendChild(userImage);
  userProfile.appendChild(userPostDate);

  commentItem.appendChild(userProfile);

  commentSection.insertBefore(commentItem, commentSection.firstChild);
  commentSection.insertBefore(commentSeperator, commentSection.firstChild);

  body.appendChild(commentSection);

  createUserComment(commentItem, userName, comment);
  createDropdown(commentItem);
  commentSectionID();
}
