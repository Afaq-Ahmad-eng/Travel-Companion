// External modules
import words from "word-list-json";
//Yup is library which we use for the validation 
import * as yup from 'yup';

//library for names in any languages
import XRegExp from 'xregexp';

//Regular Expression for title input field
const RegExpForValidation = XRegExp("^(?!.*\\d)[\\p{L}]+(?:[ '-][\\p{L}]+)*$", "u");


// Convert this store file to Set for faster lookup

const wordSet = new Set(words);

// Debouncing function for optimization 
function debounce(callback,delay){
    let timeout;
    return function(...argus){
        return new Promise((res,rej) => {
           clearTimeout(timeout);
           timeout = setTimeout(() => {
            callback(...argus)
            .then(res)
            .catch(rej)
           },delay)
        });
    };
}

//function which check that the words which user provide is exist in real-world or not 
async function isValidWords(name) {
    
    let words = name.split(/\s+/);
    
    for(let word of words){
        if(!wordSet.has(word.toLowerCase())){
        console.log(`${word} is not found`);
        return false;
    }
}
    return true;
}

const debounceValidation = debounce(isValidWords,1000)
export const validSchema = yup.object({
    title: yup.string()
           .required("You must provide a Title!")
           .matches(RegExpForValidation,'Enter A Valid Title')
           .test(
             "title",
             "Title must contain only valid English words (case-insensitive), e.g., 'Trip with Friends' or 'Family Trip'",
             async function (title) {
                try{
                    const valid = await debounceValidation(title);
                    if(!valid){
                        return this.createError({message: `Title contains invalid words`})
                    }
                    return true;
                }catch(e){
                    console.log(`Error : ${e}`);
                    return this.createError({message: `Validation failed due to an API error.`});
                }
             }
        ),
    description: yup.string()
                 .required("Description field is required.")
                 .matches(RegExpForValidation,
                         "Invalid input: only letters are allowed; numbers and special characters are not permitted.")
                 .test(
                    "description",
                    "Invalid Description",
                    async function(description) {
                        const wordsCount = description.trim().split(/\s+/).length;
                        if(wordsCount < 10){
                            console.log(`word count is ${wordsCount}`);
                            return this.createError({message: `Description is too short. Minimum 10 words (currently ${wordsCount} words)`});
                        }
                        if(wordsCount > 100){
                            return this.createError({message: `You have exceeded the allowed word limit.`})
                        }
                        try{
                            const valid = await debounceValidation(description);
                            if(!valid){
                                return this.createError({message: `Description contains invalid words`})
                            }
                            return true;
                        }catch(e){
                            console.log(`Error in API Call and this from Description field ${e}`);
                            return this.createError({message:`Validation failed due to an API error.`})
                        }
                    }
                 ),
    // blog: yup.string()
    //       .required('Blog field is required.')
    //       .matches(RegExpForValidation,"Invalid input: only letters are allowed; numbers and special characters are not permitted.")
    //       .test(
    //         "blog",
    //         "Blog description must be in English (case-insensitive) and 50–200 words long.",
    //         async function(blog){
    //             const blogWordsCount = blog.trim().split(/\s+/).length;
    //             if(blogWordsCount < 50 || blogWordsCount > 200){
    //                 console.log(`Blog Words Count is ${blogWordsCount}`);
    //                 return false;
    //             }
    //             try{
    //                 return await debounceValidation(blog);
    //             }catch(e){
    //                 console.log(`Error occur in API call from Blog field ${e}`);
    //             }
    //         }

    //       ),
    images: yup.array()
    .min(1, "At least 1 image is required")
    .max(20, "No more than 20 images allowed")
    .required("Images are required")
    .test(
      "fileType",
      "Only image files are allowed",
      (files) =>
        files &&
        files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
        )
    ),
    rating: yup.number()
           .required('Rating is required to help us improve our services!')
           .min(1,"Please give at least one star!")
           .max(5,"You can give maximum five stars!")
});