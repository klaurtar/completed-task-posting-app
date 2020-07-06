const analytics = (function(){
    const $analyticsElement = document.createElement('div');
    $analyticsElement.className = "flex";

    const analyticsMetrics = {
        numberOfPosts: 0, 
        numberOfAuthors: 0, 
        mostFrequentAuthor: ""
    };
    

    function countAuthors(arr) {
        const prevVal = [];

        for(i = 0; i < arr.length; i++) {
            if(i === 0){
                prevVal.push(arr[0].author);
            } else if(!prevVal.includes(arr[i].author)) {
                    prevVal.push(arr[i].author);
                }
        }

        return prevVal.length;
    }

    // o(n)
    function getMostPopularAuthor(arr) {
        let popularAuthor = '';
        let popularAuthorScore = 0;
        const authorMap = {};

        arr.forEach((post) => {
            if(authorMap[post.author]){
                authorMap[post.author]++;
            }else{
                authorMap[post.author] = 1;
            }
        });
       
        Object.keys(authorMap).forEach(author => {
            if(authorMap[author] >= popularAuthorScore){
                popularAuthorScore = authorMap[author];
                popularAuthor = author;
            }
        })
        return popularAuthor;
    }

    const update = (arr) => {
           
        if(arr.length !== 0){
            
            const numberOfAuthors = countAuthors(arr);
            
            const mostFrequentAuthor = getMostPopularAuthor(arr);

            analyticsMetrics.numberOfPosts = arr.length;
            analyticsMetrics.numberOfAuthors = numberOfAuthors;
            analyticsMetrics.mostFrequentAuthor = mostFrequentAuthor;
            
            $analyticsElement.innerHTML = ejs.render(analyticsTemplate, analyticsMetrics);


            document.body.insertAdjacentElement("afterbegin", $analyticsElement);
        }else{
            removeHTML();
        }
    
    }

    const removeHTML = () => {
        $analyticsElement.remove();
    }

    EventManager.subscribe('onPostsChanged', (postCollection) => {
        // update
        update(postCollection);
    });
})();