class Comment {
  constructor(userName, comment, commentDate = todaysDate) {
    this.commentSection = document.querySelector("#commentSection");
    this.commentSeperator = document.createElement("hr");
    this.commentItem = document.createElement("section");
    this.userProfile = document.createElement("div");
    this.userImage = document.createElement("img");
    this.userNameLabel = document.createElement("h4");
    this.userPostDate = document.createElement("div");
    this.postDate = document.createElement("span");
    this.newComment = document.createElement("pre");

    this.userName = userName;
    this.commentDate = commentDate;
    this.comment = comment
    this.userNameLabel.textContent = this.userName;
    this.postDate.textContent = this.commentDate;
    this.newComment.textContent = this.comment;

    this.dropdown = document.createElement("div");
    this.dropdownButton = document.createElement("button");
    this.dropdownContent = document.createElement("div");
    this.editImage = document.createElement("img");
    this.editButton = document.createElement("p");
    this.editSelect = document.createElement("div");
    this.deleteImage = document.createElement("img");
    this.deleteButton = document.createElement("p");
    this.deleteSelect = document.createElement("div");
    this.selectArea = document.createElement("div");

    this.createComment();
    this.createDropdown();
  }

  createComment() {
    this.commentSeperator.setAttribute("class", "commentSeperator");
    this.commentItem.setAttribute("class", "commentItem");
    this.userProfile.setAttribute("class", "userProfile");
    this.userPostDate.setAttribute("class", "userPostDate");
    this.userImage.setAttribute("src", "images/user.png");
    this.userImage.setAttribute("alt", "User image");
    this.userImage.setAttribute("class", "userImage");
    this.userNameLabel.setAttribute("class", "userName");
    this.postDate.setAttribute("class", "commentDate")
    this.newComment.setAttribute("class", "newComment");

    this.userPostDate.append(this.userNameLabel)
    this.userPostDate.append(this.postDate);
    this.userProfile.appendChild(this.userImage);
    this.userProfile.appendChild(this.userPostDate);
    this.commentItem.appendChild(this.userProfile);
    this.commentItem.appendChild(this.newComment);

    this.commentSection.insertBefore(this.commentItem, this.commentSection.firstChild);
    this.commentSection.insertBefore(this.commentSeperator, this.commentSection.firstChild);
  }

  createDropdown() {
    this.dropdown.setAttribute("class", "dropdown");

    this.dropdownButton.addEventListener("click", () => this.toggleDropdown(this));
    this.dropdownButton.setAttribute("class", "dropdownButton");

    this.dropdownContent.setAttribute("class", "dropdownContent");

    this.editButton.textContent = "edit";
    this.editButton.setAttribute("class", "editButton");

    this.deleteButton.textContent = "delete";
    this.deleteButton.setAttribute("class", "deleteButton");

    this.editImage.setAttribute("src", "images/edit.png");
    this.editImage.setAttribute("alt", "Dropdown edit");
    this.editImage.setAttribute("class", "dropdownImages");
    this.editImage.classList.add("editImage");

    this.deleteImage.setAttribute("src", "images/delete.png");
    this.deleteImage.setAttribute("alt", "Dropdown delete");
    this.deleteImage.setAttribute("class", "dropdownImages");
    this.deleteImage.classList.add("deleteImage");

    this.editSelect.appendChild(this.editImage);
    this.editSelect.appendChild(this.editButton);
    this.editSelect.setAttribute("class", "editSelect");
    this.editSelect.addEventListener("click", () => this.editComment());

    this.deleteSelect.appendChild(this.deleteImage);
    this.deleteSelect.appendChild(this.deleteButton);
    this.deleteSelect.setAttribute("class", "deleteSelect");
    this.deleteSelect.addEventListener("click", () => this.deleteComment());

    this.dropdownContent.appendChild(this.editSelect);
    this.dropdownContent.appendChild(this.deleteSelect);

    this.dropdown.appendChild(this.dropdownButton);
    this.dropdown.appendChild(this.dropdownContent);

    this.userProfile.append(this.dropdown);
  }

  toggleDropdown() {
    this.allDropdowns = document.querySelectorAll(".show");

    //Only one dropdown can open at a time
    for (let i = 0; i < this.allDropdowns.length; i++) {
      if (this.allDropdowns[i] != this.dropdownContent) {
        this.allDropdowns[i].classList.remove("show");
      }
    }
    this.dropdownContent.classList.toggle("show");
  }

  dropdownsEnableDisable() {
    this.dropdownButtons = [...document.querySelectorAll(".dropdownButton")];
    this.editMode = document.querySelector(".editComment");

    if (this.editMode) {
      this.dropdownButtons.map(button => {
        button.classList.add("disabled");
        button.disabled = true;
      });
    }
    else {
      this.dropdownButtons.map(button => {
        button.classList.remove("disabled");
        button.disabled = false;
      });
    }
  }

  saveComment() {
    this.commentData = {userName: this.userName, postDate: this.commentDate, comment: this.comment};
    existingComments.unshift(this.commentData);

    setLocalStorage();
  }

  editComment() {
    this.id = Array.prototype.indexOf.call(this.commentSection.childNodes, this.commentItem); //Find item in Local Storage
    this.userInput = document.createElement("input");
    this.commentInput = document.createElement("textarea");
    this.buttonInputs = document.createElement("div");
    this.saveEdit = document.createElement("button");
    this.cancelEdit = document.createElement("button");

    this.userInput.setAttribute("class", "editUsername");
    this.commentInput.setAttribute("class", "editComment");
    this.commentInput.setAttribute("rows", "3");
    this.buttonInputs.setAttribute("class", "buttonInputs");
    this.saveEdit.setAttribute("class", "saveEdit");
    this.cancelEdit.setAttribute("class", "saveEdit cancelEdit");

    this.userInput.value = this.userName;
    this.commentInput.value = this.comment;

    this.saveEdit.textContent = "Save";
    this.saveEdit.addEventListener("click", () => this.saveCommentEdit());

    this.cancelEdit.textContent = "Cancel";
    this.cancelEdit.addEventListener("click", () => this.exitEdit());

    this.userNameLabel.remove();
    this.postDate.remove();
    this.newComment.remove();
    this.dropdown.remove();

    this.userPostDate.append(this.userInput);
    this.commentItem.append(this.commentInput);
    this.buttonInputs.append(this.saveEdit);
    this.buttonInputs.append(this.cancelEdit);
    this.commentItem.append(this.buttonInputs);

    this.commentItem.scrollIntoView();
    this.dropdownsEnableDisable();
  }

  saveCommentEdit() {
    //if changes have been made
    if (this.userInput.value != this.userName || this.commentInput.value != this.comment) {
      this.deleteComment();
      this.userName = this.userInput.value
      this.comment = this.commentInput.value
      this.commentDate = todaysDate;
      this.saveComment();
      document.querySelector("#mainSeperator").scrollIntoView();
    }
    this.exitEdit();
  }

  exitEdit() {
    this.userInput.remove();
    this.commentInput.remove();
    this.buttonInputs.remove();

    this.userNameLabel.textContent = this.userName;
    this.newComment.textContent = this.comment;
    this.postDate.textContent = this.commentDate;

    this.createComment()
    this.createDropdown()
    this.dropdownsEnableDisable();
  }

  deleteComment() {
    console.log(existingComments);
    console.log(this.commentData);
    // existingComments.splice(this.id, 1);
    // this.commentSeperator.remove();
    // this.commentItem.remove();
    //
    // setLocalStorage();
  }
}

let existingComments = []
if (localStorage.commentsArray) existingComments = JSON.parse(localStorage.commentsArray);

const body = document.querySelector("body");
const userInput = document.querySelector("#userInput");
const commentInput = document.querySelector("#commentInput");
const submitButton = document.querySelector("#submitButton");

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November",
                "December"];
const today = new Date();
const todaysDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

window.onload = function() {
  /*No transitions on load*/
  body.classList.remove("preload");

  userInput.value = "";
  commentInput.value = "";

  if (existingComments) {
    /*Comment Section is newest to oldest (reversed)*/
    let i = existingComments.length -1;
    for (; i >= 0; i--) {
      new Comment(existingComments[i].userName, existingComments[i].comment, existingComments[i].postDate);
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

userInput.addEventListener("input", buttonEnableDisable);
commentInput.addEventListener("input", buttonEnableDisable);
submitButton.addEventListener("click", () => {
  new Comment(userInput.value, commentInput.value).saveComment();

  userInput.value = "";
  commentInput.value = "";

  buttonEnableDisable();

  document.querySelector("#mainSeperator").scrollIntoView();
});

function buttonEnableDisable() {
  if (userInput.value && commentInput.value) {
    submitButton.classList.remove("disabled");
  }
  else {
    submitButton.classList.add("disabled");
  }
}

function setLocalStorage() {
  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(existingComments));
}
