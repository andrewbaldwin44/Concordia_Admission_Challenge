let commentStorage = [];
const body = document.querySelector("body");

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November",
                "December"];
let today = new Date();
let todaysDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

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
      createComment();
      createUserComment(0, existingComments[i].userName, existingComments[i].comment, existingComments[i].postDate);
    }
    commentSectionID();
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
    createComment();
    createUserComment(0, userName, comment);
    commentSectionID();
    saveComment(userName, comment);

    userInput.value = "";
    commentInput.value = "";

    buttonEnableDisable();
  }

  document.querySelector("#mainSeperator").scrollIntoView();
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

function saveComment(userName, comment, commentDate = todaysDate) {
  let newComment = {userName: userName, postDate: commentDate, comment: comment};
  commentStorage.unshift(newComment);

  setLocalStorage();
}

function dropdownsEnableDisable() {
  let dropdownButtons = [...document.querySelectorAll(".dropdownButton")];
  let editMode = document.querySelector(".editComment");

  if (editMode) {
    dropdownButtons.map(button => {
      button.classList.add("disabled");
      button.disabled = true;
    });
  }
  else {
    dropdownButtons.map(button => {
      button.classList.remove("disabled");
      button.disabled = false;
    });
  }
}

function editComment(e) {
  let id = e.target.id.replace(/\D/g,'');
  let commentItem = commentSection.querySelector(`#item${id}`);
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
                id);
  });

  cancelEdit.textContent = "Cancel";
  cancelEdit.addEventListener("click", () => exitEdit(id));

  commentQuery.userName.remove();
  commentQuery.postDate.remove();
  commentQuery.comment.remove();
  commentQuery.dropdown.remove();
  commentQuery.userPostDate.append(userInput);

  buttonInputs.append(saveEdit);
  buttonInputs.append(cancelEdit);
  commentItem.append(commentInput);
  commentItem.append(buttonInputs);

  document.querySelector(`#item${id}`).scrollIntoView();
  dropdownsEnableDisable();
}
function commentEdit(userNameNew, userNameOriginal, commentNew, commentOriginal, id) {
  if (userNameNew != userNameOriginal || commentNew != commentOriginal) {
    commentStorage[id].userName = userNameNew;
    commentStorage[id].postDate = todaysDate;
    commentStorage[id].comment = commentNew;

    setLocalStorage();
  }
  exitEdit(id);
}
function exitEdit(id) {
  let commentItem = commentSection.querySelector(`#item${id}`);

  let userInput = commentItem.querySelector(".editUsername");
  let commentInput = commentItem.querySelector(".editComment");
  let buttonInputs = commentItem.querySelector(".buttonInputs");

  userInput.remove();
  commentInput.remove();
  buttonInputs.remove();

  createUserComment(id, commentStorage[id].userName, commentStorage[id].comment, commentStorage[id].postDate);
  commentSectionID();

  let editButton = commentItem.querySelector(".editButton");
  let deleteButton = commentItem.querySelector(".deleteButton");

  editButton.setAttribute("id", `edit${id}`);
  deleteButton.setAttribute("id", `delete${id}`);

  dropdownsEnableDisable();
}

/*Delete posted comment*/
function deleteComment(e) {
  let id = e.target.id.replace(/\D/g,'');
  let commentItem = commentSection.querySelector(`#item${id}`);
  let removeComment = commentStorage.indexOf(commentStorage[id]);

  commentStorage.splice(removeComment, 1);
  commentItem.previousSibling.remove();
  commentItem.remove();

  setLocalStorage();
  commentSectionID();
}

//Number comment items with ID's
function commentSectionID() {
  let commentSection = document.querySelector("#commentSection");

  let id = 0;
  for (i = 0; i < commentSection.children.length; i++) {
    let commentItem = commentSection.children[i];

    if (commentItem.classList.contains("commentItem")){
      let dropdownContent = commentItem.querySelector(".dropdownContent");
      let editButton = commentItem.querySelector(".editButton");
      let editImage = commentItem.querySelector(".editImage");
      let editSelect = commentItem.querySelector(".editSelect");
      let deleteButton = commentItem.querySelector(".deleteButton");
      let deleteImage = commentItem.querySelector(".deleteImage");
      let deleteSelect = commentItem.querySelector(".deleteSelect");

      editButton.setAttribute("id", `editButton${id}`);
      editImage.setAttribute("id", `editImage${id}`);
      editSelect.setAttribute("id", `edit${id}`);
      deleteButton.setAttribute("id", `deleteButton${id}`);
      deleteImage.setAttribute("id", `deleteImage${id}`);
      deleteSelect.setAttribute("id", `delete${id}`);
      commentItem.setAttribute("id", `item${id++}`);
    }
  }
}

function createUserComment(id, userName, comment, commentDate = todaysDate) {
  let commentItem = document.querySelectorAll(".commentItem")[id];
  let commentQuery = queryCommentItem(commentItem);

  let userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("class", "userName");
  userNameLabel.textContent = userName;

  let postDate = document.createElement("span");
  postDate.setAttribute("class", "commentDate")
  postDate.textContent = commentDate;

  let newComment = document.createElement("pre");
  newComment.setAttribute("class", "newComment");
  newComment.textContent = comment;

  commentQuery.userPostDate.append(userNameLabel)
  commentQuery.userPostDate.append(postDate);
  commentItem.appendChild(newComment);

  createDropdown(commentItem);
}

function createDropdown(commentItem) {
  let dropdown = document.createElement("div");
  let editDelete = document.createElement("button");
  let dropdownContent = document.createElement("div");
  let editImage = document.createElement("img");
  let editButton = document.createElement("p");
  let editSelect = document.createElement("div");
  let deleteImage = document.createElement("img");
  let deleteButton = document.createElement("p");
  let deleteSelect = document.createElement("div");
  let selectArea = document.createElement("div");
  let userProfile = commentItem.querySelector(".userProfile");

  dropdown.setAttribute("class", "dropdown");

  editDelete.addEventListener("click", () => toggleDropdown(dropdownContent));
  editDelete.setAttribute("class", "dropdownButton");

  dropdownContent.setAttribute("class", "dropdownContent");

  editButton.textContent = "edit";
  editButton.setAttribute("class", "editButton");

  deleteButton.textContent = "delete";
  deleteButton.setAttribute("class", "deleteButton");

  editImage.setAttribute("src", "images/edit.png");
  editImage.setAttribute("alt", "Dropdown edit");
  editImage.setAttribute("class", "dropdownImages");
  editImage.classList.add("editImage");
  deleteImage.setAttribute("src", "images/delete.png");
  deleteImage.setAttribute("alt", "Dropdown delete");
  deleteImage.setAttribute("class", "dropdownImages");
  deleteImage.classList.add("deleteImage");

  editSelect.appendChild(editImage);
  editSelect.appendChild(editButton);
  editSelect.setAttribute("class", "editSelect");
  editSelect.addEventListener("click", editComment);

  deleteSelect.appendChild(deleteImage);
  deleteSelect.appendChild(deleteButton);
  deleteSelect.setAttribute("class", "deleteSelect");
  deleteSelect.addEventListener("click", deleteComment);

  dropdownContent.appendChild(editSelect);
  dropdownContent.appendChild(deleteSelect);

  dropdown.appendChild(editDelete);
  dropdown.appendChild(dropdownContent);

  userProfile.append(dropdown);
}

function toggleDropdown(dropdownContent) {
  let dropdowns = document.querySelectorAll(".show");

  for (i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i] != dropdownContent) {
      dropdowns[i].classList.remove("show");
    }
  }
  dropdownContent.classList.toggle("show");
}

function createComment() {
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

  userProfile.appendChild(userImage);
  userProfile.appendChild(userPostDate);

  commentItem.appendChild(userProfile);

  commentSection.insertBefore(commentItem, commentSection.firstChild);
  commentSection.insertBefore(commentSeperator, commentSection.firstChild);

  body.appendChild(commentSection);
}
