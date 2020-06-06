const PostManager = (function() {
    const $postContainer = document.createElement('div');
    $postContainer.id = "post-container";
    

    function init(){
        document.body.appendChild($postContainer);
    }
    init();

    return {
        createPost: (id, title, body, author, date) => {
            const post = new Post(id, title, body, author, date);
            const $postElement = post.getPostElement();
            $postContainer.appendChild($postElement);
            return post;
        }, 
        removeHTML: () => $postContainer.innerHTML = ""
    }
})();