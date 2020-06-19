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
    let searchTerm = '';
    let sortBy = 'date'; // date|author|title|body

    
    
    

    function addPostClicked(e){
      e.preventDefault();
        validatePost(title.value, body.value, author.value, errorArr);
        
        if(errorArr.length > 0){
            renderErrors($errorMessage, errorArr);
        } else {
            clearErrors($errorMessage);
            createNewPost();
            savePosts();
            refreshFields();
        }
    }


    
    function clearErrors($domElement) {
        if ($domElement.innerText !== "") {
          $domElement.innerText = "";
        }
      } 

    function createNewPost(){
        const idCreated = idCreator();
        
        const currentPost = {id: idCreated, title: title.value, date: dateCreator(), body: body.value, author: author.value};

        postCollection.push(currentPost);
        renderPost(currentPost);
        deleteButtonDisabledOrNot();

        analytics.update(postCollection);
    }


    function deleteAllPosts() {
        const dialog = DialogManager.createDialog({color: "red", doneButtonText: "Delete", padding: "50px"});
        dialog.open();
        dialog.setContent("<h1>Are you sure you want to delete all posts?</h1>");
        dialog.onSave(() => {
          window.localStorage.clear();
          postCollection = [];
           PostManager.removeHTML();
           deleteButtonDisabledOrNot();

           analytics.removeHTML();
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


    // function renderAllPosts(arrOfPosts) {
    //   PostManager.removeHTML();
    //   analytics.update(arrOfPosts);
    //   arrOfPosts.forEach(currentPost => {
    //       renderPost(currentPost);
    //   })

    //   deleteButtonDisabledOrNot();
    // }
    function renderAllPosts() {
      PostManager.removeHTML();
      analytics.update(postCollection);
      searchTerm = $searchBar.value;

      console.log(searchTerm, "Search Term");

      console.log("post collection", postCollection);
      let postsWillBeRendered;
      if(searchTerm !== ''){
        postsWillBeRendered = postCollection.filter(post =>
            post.title.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.body.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.author.toUpperCase().includes(searchTerm.toUpperCase()));

        //console.log("filter Posts", filteredPosts, searchTerm, postCollection);

        // filteredPosts.forEach(post => {
        //   renderPost(post);
        // });
      }else{
        postsWillBeRendered = postCollection;
      }
      
      postsWillBeRendered.forEach(post => {
        renderPost(post);
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

                let editErrors = [];

                validatePost(titleEdit.value, bodyEdit.value, authorEdit.value, editErrors);

                if(editErrors.length !== 0){
                  renderErrors(dialog.$head, editErrors);
                  return false;
                } else {
                  clearErrors(dialog.$head);

                  postObject.title = titleEdit.value;
                  postObject.body = bodyEdit.value;
                  postObject.author = authorEdit.value;
                  postObject.date = dateCreator();
                  savePosts();
                  renderAllPosts(postCollection);
                  analytics.update(postCollection);
  
                  return true;
                }

                
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

    function renderErrors($domElement, arr) {
        $domElement.innerHTML = "";
    
        arr.forEach((e, index) => {
          $domElement.innerHTML += e;
          if (index < arr.length - 1) {
            $domElement.innerHTML += ", ";
          } else {
            $domElement.innerHTML += ".";
          }
        });
    
        arr = [];
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
        $searchBar.addEventListener("keyup", renderAllPosts);
        // $dropdownFilter.addEventListener("change", searchAndFilter);
    }

    const validatePost = (title, body, author, arr) => {
        if (!title) arr.push("Title required");
        if (!body) arr.push("Body required");
        if (!author) arr.push("Author required");
      };

      // const searchPosts = () => {
      //   const searchBarValue = $searchBar.value;
      //   PostManager.removeHTML();

      //   const searchResults = postCollection.filter(
      //     post =>
      //       post.title.toUpperCase().includes(searchBarValue.toUpperCase()) ||
      //       post.body.toUpperCase().includes(searchBarValue.toUpperCase()) ||
      //       post.author.toUpperCase().includes(searchBarValue.toUpperCase())
      //   );

      //   renderAllPosts(searchResults);
      //   return searchResults;
      // };
    
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
    
      

    function init(){
        setUpListeners();


        retrievePosts();


        renderAllPosts(postCollection);
    }
    init();
})();