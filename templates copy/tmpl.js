const postTemplate = 
`
    <div class="headerPosted">
        <div class="titlePosted">
        <%- title %>
        </div>
        <div class="datePosted">
        <%- date %>
        </div>
    </div>
    <div class="bodyPosted">
    <%- body %>
    </div>
    <div class="authorPosted">
        -"<%- author %>"
    </div>
    `;

const dialogTemplate = `
    <div class="dialog">
        <div class="overlay"></div>
        <div class="p-2 dialog-box">
            <div class="close-icon"><span class="x-icon">X</span></div>
            <div class="head"></div>
            <div class="body"></div>
            <hr>
            <div id="button-container" class="d-flex justify-content-end mt-3">
                <button class="done-button btn btn-primary"></button>
                <button class="cancel-button btn btn-danger ml-3">Cancel</button>
            </div>
        </div>
    </div> 
`;

const individualPostOptionsTemplate = `
    <div class="deleteButton">
        <button class="edit-icon"><i class="fas fa-edit edit-icon"></i></button>
        <button class="delete-icon"><i class="fas fa-trash delete-icon"></i></button>
    </div>
`;

const dialogFormTemplate = `
        <form action="#">
            <label for="title">Title</label>
            <input class="form-control mb-3" type="text" name="title" id="titleEdit" value="<%- title %>">

            <label for="body">Body</label>
            <textarea class="form-control mb-3" name="body" id="bodyEdit" cols="30" rows="5"><%- body %></textarea>
            <label for="author">Author</label>
            <input class="form-control mb-3" type="text" name="author" id="authorEdit" value="<%- author %>">
        </form>
        <hr>
`;

const analyticsTemplate = `
        <div id="analytics-container">
            <p id="analytics-header">Analytics</p>
            <div id="analytics-metrics">
                <div class="">
                    <p>Number of Posts: <span><%- numberOfPosts %></span></p>
                </div>
                <div class="">
                    <p>Number of Authors: <span><%- numberOfAuthors %></span></p>
                </div>
                <div class="">
                    <p>Most Frequent Author: <span><%- mostFrequentAuthor %></span></p>
                </div>
            </div>
        </div>
        `;