(function app() {
  const LOCALSTORAGE_KEY = 'session-3';

  const $addPostButton = document.querySelector('#submitButton');
  const $deleteAllButton = document.querySelector('#delete-all');
  const $errorMessage = document.querySelector('#errorMessage');
  const $searchBar = document.querySelector('#searchBar');
  const $dropdownFilter = document.querySelector('#filterBy');

  const title = document.querySelector('#title');
  const body = document.querySelector('#body');
  const author = document.querySelector('#author');

  const errorArr = [];

  let postCollection = [];
  let searchTerm = '';
  let sortBy = 'date'; // date|author|title|body

  function addPostClicked(e) {
    e.preventDefault();
    validatePost(title.value, body.value, author.value, errorArr);

    if (errorArr.length > 0) {
      renderErrors($errorMessage, errorArr);
    } else {
      clearErrors($errorMessage);
      createNewPost();
      savePosts();
      refreshFields();
    }
  }

  function clearErrors($domElement) {
    const $element = $domElement;
    if ($element.innerText !== '') {
      $element.innerText = '';
    }
  }

  function createNewPost() {
    const idCreated = idCreator();

    const currentPost = {
      id: idCreated,
      title: title.value,
      date: dateCreator(),
      body: body.value,
      author: author.value,
    };

    postCollection.push(currentPost);
    renderAllPosts();
    deleteButtonDisabledOrNot();

    EventManager.publish('onPostsChanged', postCollection);
  }

  function deleteAllPosts() {
    const dialog = DialogManager.createDialog({
      color: 'red',
      doneButtonText: 'Delete',
      padding: '50px',
    });
    dialog.open();
    dialog.setContent('<h1>Are you sure you want to delete all posts?</h1>');
    dialog.onSave(() => {
      window.localStorage.clear();
      postCollection = [];
      PostManager.removeHTML();
      deleteButtonDisabledOrNot();

      EventManager.publish('onPostsChanged', postCollection);
    });
  }

  function deleteButtonDisabledOrNot() {
    if (postCollection.length === 0) {
      $deleteAllButton.setAttribute('disabled', true);
    } else {
      $deleteAllButton.removeAttribute('disabled');
    }
  }

  function refreshFields() {
    title.value = '';
    body.value = '';
    author.value = '';
  }

  function renderAllPosts() {
    PostManager.removeHTML();
    EventManager.publish('onPostsChanged', postCollection);
    searchTerm = $searchBar.value;
    sortBy = $dropdownFilter.value;

    let postsWillBeRendered;
    let postsWillBeFiltered;

    if (searchTerm !== '') {
      postsWillBeRendered = postCollection.filter(
        (post) =>
          post.title.toUpperCase().includes(searchTerm.toUpperCase()) ||
          post.body.toUpperCase().includes(searchTerm.toUpperCase()) ||
          post.author.toUpperCase().includes(searchTerm.toUpperCase())
      );

      postsWillBeFiltered = filterPosts(postsWillBeRendered);

      postsWillBeFiltered.forEach((post) => renderPost(post));
    } else {
      postsWillBeRendered = postCollection;

      postsWillBeFiltered = filterPosts(postsWillBeRendered);

      postsWillBeRendered.forEach((post) => {
        renderPost(post);
      });
    }

    deleteButtonDisabledOrNot();
  }

  function renderPost(postObject) {
    const post = PostManager.createPost(postObject.id);

    post.setContent(ejs.render(postTemplate, postObject));

    post.onEditButtonClick(() => {
      const dialog = DialogManager.createDialog();
      dialog.open();
      dialog.setContent(
        ejs.render(dialogFormTemplate, {
          title: postObject.title,
          body: postObject.body,
          author: postObject.author,
        })
      );
      dialog.onSave(() => {
        const savedContent = postObject;

        const titleEdit = document.querySelector('#titleEdit');
        const bodyEdit = document.querySelector('#bodyEdit');
        const authorEdit = document.querySelector('#authorEdit');

        const editErrors = [];

        validatePost(
          titleEdit.value,
          bodyEdit.value,
          authorEdit.value,
          editErrors
        );

        if (editErrors.length !== 0) {
          renderErrors(dialog.$head, editErrors);
          return false;
        }
        clearErrors(dialog.$head);

        savedContent.title = titleEdit.value;
        savedContent.body = bodyEdit.value;
        savedContent.author = authorEdit.value;
        savedContent.date = dateCreator();
        savePosts();
        renderAllPosts();
        EventManager.publish('onPostsChanged', postCollection);

        return true;
      });
    });

    post.onDeleteButtonClick(() => {
      const postId = post.getId();

      const dialog = DialogManager.createDialog({
        color: 'red',
        doneButtonText: 'Delete',
        padding: '50px',
        width: '75%',
      });
      dialog.open();
      dialog.setContent(
        `<h1>Are you sure you want to delete post ${postId}?</h1>`
      );
      dialog.onSave(() => {
        postCollection = postCollection.filter((post) => post.id !== postId);

        savePosts();
        post.remove();

        EventManager.publish('onPostsChanged', postCollection);
      });
    });
  }

  function renderErrors($domElement, arr) {
    const $element = $domElement;

    let errorsToRender = arr;

    $element.innerHTML = '';

    arr.forEach((e, index) => {
      $element.innerHTML += e;
      if (index < arr.length - 1) {
        $element.innerHTML += ', ';
      } else {
        $element.innerHTML += '.';
      }
    });

    errorsToRender = [];
  }

  function retrievePosts() {
    try {
      postCollection =
        JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)) || [];
    } catch (e) {
      console.log('not json value');
    }
  }

  function savePosts() {
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(postCollection)
    );
  }

  function setUpListeners() {
    $addPostButton.addEventListener('click', addPostClicked);
    $deleteAllButton.addEventListener('click', deleteAllPosts);
    $searchBar.addEventListener('keyup', renderAllPosts);
    $dropdownFilter.addEventListener('change', renderAllPosts);
  }

  const validatePost = (title, body, author, arr) => {
    if (!title) arr.push('Title required');
    if (!body) arr.push('Body required');
    if (!author) arr.push('Author required');
  };

  const filterPosts = (arr) => {
    if (sortBy === 'date') {
      return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sortBy === 'title') {
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'body') {
      return arr.sort((a, b) => a.body.localeCompare(b.body));
    }
    if (sortBy === 'author') {
      return arr.sort((a, b) => a.author.localeCompare(b.author));
    }
  };


  function init() {
    setUpListeners();

    retrievePosts();

    renderAllPosts(postCollection);
  }
  init();
})();
