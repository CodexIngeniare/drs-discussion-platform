export function calcDateTimeSincePosted(postOnDate){
    const postDate = new Date(postOnDate);
    const currentDate = new Date();

    const differenceInSeconds = Math.floor((currentDate - postDate) / 1000) - (2 * 60 * 60);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    let date = postDate.toISOString().split("T")[0];
    if(differenceInDays < 10){
        date = `${differenceInDays} days ago`;
    }
    if(differenceInHours < 24){
        const minutesAgo = differenceInMinutes % 60;
        date = `${differenceInHours}h and ${minutesAgo}min ago`;
    }
    if(differenceInMinutes < 60){
        date = `${differenceInMinutes}min ago`;
    }
    if(differenceInSeconds < 60){
        date = `${differenceInSeconds}s ago`;
    }
    return date;
};