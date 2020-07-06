class Post{
    constructor(id){
        this.$postElement = document.createElement('div');
        this.$postElement.className = "post";
        
        this.id = id;
        this.getId = () => this.id;

        this.$postElement.insertAdjacentHTML("afterbegin", ejs.render(individualPostOptionsTemplate, {id: this.getId().toString()}));
    
        this.$deleteButton = this.$postElement.querySelector('.delete-icon');
        this.$editButton = this.$postElement.querySelector('.edit-icon');

        this.onDeleteButtonHandler = false;
        this.onEditButtonHandler = false;

        this.setUpListeners();
    }


    getPostElement(){
        return this.$postElement;
    }

    onDeleteButtonClick(handler){
        this.onDeleteButtonHandler = handler;
    }

    onEditButtonClick(handler){
        this.onEditButtonHandler = handler;
    }

    remove(){
        this.$postElement.remove();
    }

    setContent($content){
        if(typeof $content == "string"){ 
            this.$postElement.insertAdjacentHTML("beforeend", $content);
        }else{ 
        
            this.$postElement.appendChild($content);
        }
    }

    setUpListeners(){
        this.$editButton.addEventListener("click", () => {
            this.onEditButtonHandler && this.onEditButtonHandler();
        });
        this.$deleteButton.addEventListener("click", () => {
            this.onDeleteButtonHandler && this.onDeleteButtonHandler();
        })
    }
}

