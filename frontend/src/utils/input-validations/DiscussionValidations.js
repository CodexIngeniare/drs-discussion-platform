export function validateTitle(title, maxLength=200){
    let isValid = true;
    let errorMessage = "";

    if (!title || title.trim() === "") {
        isValid = false;
        errorMessage = "Title is required.";
    } else if(title.length >= maxLength){
        isValid = false;
        errorMessage = "Title length exceeded.";
    }

    return { isValid, errorMessage };
};
export function validateContent(content){
    let isValid = true;
    let errorMessage = "";

    if (!content || content.trim() === "") {
        isValid = false;
        errorMessage = "Content is required.";
    }

    return { isValid, errorMessage };
};