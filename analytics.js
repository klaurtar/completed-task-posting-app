const analytics = (function(){
    const $analyticsElement = document.createElement('div');
    $analyticsElement.className = "flex";

    let analyticsMetrics = {
        numberOfPosts: 0, 
        numberOfAuthors: 0, 
        mostFrequentAuthor: ""
    };
    

    // function declaration
    function authorCounter(arr) {
        let counter = 0;
        let authorValues = [];
        let counts = {};

        for(i = 0; i < arr.length; i++) {
            if(i === 0) {
                authorValues.push(arr[i].author);
                counter++;
            } else {
                if(!authorValues.includes(arr[i].author)){
                    authorValues.push(arr[i].author);
                    counter++;
                } else {
                    authorValues.push(arr[i].author);
                }
            }
        }

        authorValues.forEach(function(x) {
            counts[x] = (counts[x] || 0)+1;
        })

        analyticsMetrics.numberOfAuthors = counter;
        
        // analyticsMetrics.mostFrequentAuthor = Object.keys(counts).reduce(function(a, b){ return counts[a] > counts[b] ? a : b });
        // analyticsMetrics.mostFrequentAuthor = 

    }
    // o(n)
    function getMostPopularAuthor(arr) {
        let popularAuthor = '';
        let popularAuthorScore = 0;
        let authorMap = {};

        arr.forEach((post) => {
            if(authorMap[post.author]){
                authorMap[post.author]++;
            }else{
                authorMap[post.author] = 1;
            }
        });

        for(let k in authorMap){
            if(authorMap[k] >= popularAuthorScore){
                popularAuthorScore = authorMap[k];
                popularAuthor = k;
            }
        }

        // why Onject.keys is better
        // Object.keys
        // debugger;
        return popularAuthor;

    }

    function sum(x, y){
        // connect with Database;
        return x = y;
    }
    

    return {
        updateAnalytics: (arr) => {
           
                if(arr.length !== 0){
                    

                    
                    // authorCounter(arr);
                    let mostFrequentAuthor = getMostPopularAuthor(arr);

                    analyticsMetrics.numberOfPosts = arr.length;
                    analyticsMetrics.mostFrequentAuthor = mostFrequentAuthor
                    
                    $analyticsElement.innerHTML = ejs.render(analyticsTemplate, analyticsMetrics);


                    document.body.insertAdjacentElement("afterbegin", $analyticsElement);
                }
            
        },
        removeHTML: () => {
            $analyticsElement.remove();

        }
    }
})();