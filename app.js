const app = (function(){
    const LOCALSTORAGE_KEY = "session-3";

    const $addPostButton = document.querySelector('#submitButton');
    const $deleteAllButton = document.querySelector('#delete-all');
    const $errorMessage = document.querySelector('#errorMessage');
    const $searchBar = document.querySelector("#searchBar");
    const $dropdownFilter = document.querySelector('#filterBy');

    const title = document.querySelector('#title');
    const body = document.querySelector('#body');
    const author = document.querySelector('#author');

    let postCollection = [];
    let errorArr = [];

    
    
    

    function addPostClicked(e){
      e.preventDefault();
        validatePost(title.value, body.value, author.value);
        
        if(errorArr.length > 0){
            renderErrors();
        } else {
            clearErrors();
            createNewPost();
            savePosts();
            refreshFields();
        }
    }


    
    function clearErrors() {
        if ($errorMessage.innerText !== "") {
          $errorMessage.innerText = "";
        }
      } 

    function createNewPost(){
        const idCreated = idCreator();
        
        const currentPost = {id: idCreated, title: title.value, date: dateCreator(), body: body.value, author: author.value};

        postCollection.push(currentPost);
        renderPost(currentPost);
        deleteButtonDisabledOrNot();
    }


    function deleteSinglePost() {
        
    }

    function deleteAllPosts() {
        const dialog = DialogManager.createDialog({color: "red", doneButtonText: "Delete", padding: "50px"});
        dialog.open();
        dialog.setContent("<h1>Are you sure you want to delete all posts?</h1>");
        dialog.onSave(() => {
          window.localStorage.clear();
           PostManager.removeHTML();
           deleteButtonDisabledOrNot();
        });
        
        
        
    }


    function deleteButtonDisabledOrNot(){
        if(postCollection.length === 0){
            $deleteAllButton.setAttribute("disabled", true);
        } else {
            $deleteAllButton.removeAttribute("disabled");
        }
    }

    function refreshFields(){
      title.value = "";
      body.value = "";
      author.value = "";
    }


    function renderAllPosts(arrOfPosts) {
      PostManager.removeHTML();
        arrOfPosts.forEach(currentPost => {
            renderPost(currentPost);
        })

        deleteButtonDisabledOrNot();
    }

    function renderPost(postObject) {
      const post = PostManager.createPost(postObject.id);

      post.setContent(ejs.render(postTemplate, postObject));

      post.onEditButtonClick(() => {
        const dialog = DialogManager.createDialog();
          dialog.open();
          dialog.setContent(ejs.render(dialogFormTemplate, {title: postObject.title, body: postObject.body, author: postObject.author}));
          dialog.onSave(() =>{
            const titleEdit = document.querySelector('#titleEdit'),
                bodyEdit = document.querySelector('#bodyEdit'),
                authorEdit = document.querySelector('#authorEdit');

                postObject.title = titleEdit.value;
                postObject.body = bodyEdit.value;
                postObject.author = authorEdit.value;
                postObject.date = dateCreator();
                savePosts();
                renderAllPosts(postCollection);
          })
      })

      post.onDeleteButtonClick(() => {
        const postId = post.getId();

        const dialog = DialogManager.createDialog({color: "red", doneButtonText: "Delete", padding: "50px", width: "75%"});
        dialog.open();
        dialog.setContent(`<h1>Are you sure you want to delete post ${postId}?</h1>`);
        dialog.onSave(() => {
          postCollection = postCollection.filter(post => post.id !== postId);
       
          savePosts();
          post.remove();
        });
      })
    }

    function renderErrors() {
        $errorMessage.innerHTML = "";
    
        errorArr.forEach((e, index) => {
          $errorMessage.innerHTML += e;
          if (index < errorArr.length - 1) {
            $errorMessage.innerHTML += ", ";
          } else {
            $errorMessage.innerHTML += ".";
          }
        });
    
        errorArr = [];
      }

    function retrievePosts() {
        try {
          postCollection = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)) || [];
        } catch (e) {
          console.log("not json value");
        }
    }

    
    function savePosts() {
        window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(postCollection));
    }     


    function setUpListeners(){
        $addPostButton.addEventListener('click', addPostClicked);
        $deleteAllButton.addEventListener('click', deleteAllPosts);
        $searchBar.addEventListener("keyup", searchAndFilter);
        $dropdownFilter.addEventListener("change", searchAndFilter);
    }

    const validatePost = (title, body, author) => {
        if (!title) errorArr.push("Title required");
        if (!body) errorArr.push("Body required");
        if (!author) errorArr.push("Author required");
      };

      const searchPosts = () => {
        const searchBarValue = $searchBar.value;
        PostManager.removeHTML();

        const searchResults = postCollection.filter(
          post =>
            post.title.toUpperCase().includes(searchBarValue.toUpperCase()) ||
            post.body.toUpperCase().includes(searchBarValue.toUpperCase()) ||
            post.author.toUpperCase().includes(searchBarValue.toUpperCase())
        );

        renderAllPosts(searchResults);
        return searchResults;
      };
    
      const filterPostsByDropdown = (arr) => {
        switch ($dropdownFilter.selectedIndex) {
          case 0:
            const dateArr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderAllPosts(dateArr);
            break;
          case 1:
            const titleArr = arr.sort((a, b) => a.title.localeCompare(b.title));
           
            renderAllPosts(titleArr);
            break;
          case 2:
            const bodyArr = arr.sort((a, b) => a.body.localeCompare(b.body));
            
            renderAllPosts(bodyArr);
            break;
          case 3:
            const authorArr = arr.sort((a, b) => a.author.localeCompare(b.author));
            
            renderAllPosts(authorArr);
            break;
          default:
            renderAllPosts(posts); 
        }
      }
    
      function searchAndFilter(){
        filterPostsByDropdown(searchPosts());
      }

    function init(){
        setUpListeners();


        retrievePosts();


        renderAllPosts(postCollection);
    }
    init();
})();