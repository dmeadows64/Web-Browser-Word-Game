//-----------------------------Variables-----------------------------//

// Used to store the player's input
let playerEntry = "";

// Used to determine which of four lists to put used words into.
// This will later be used to cycle between 1, 2, 3, and 4.
let listIndex = 1;

// This array holds the list of words used for the game.
// It will be copied into another array for actual gameplay to prevent repeat words.
let textArray = new Array();
$.get("textIn.txt", function(response){
    textArray = response.split("\n");
});

// This variable will be used to hold words that the user has not already used.
// Words will gradually be removed from this array as the game goes on.
let availableWords = new Array();

// This variable is used to hold the end time for the timer later.
let timerEnd = new Date();

// Stores the player's score during gameplay
let score = 0;

// Stores the high score.
let highScore = 0;

//-----------------------------Functions-----------------------------//

// This function creates a single random consonant.
// It is called 3 times every time the randomize button is clicked. Probably could've done this more efficiently.
function createRandomLetter(){
    // Create a string containing every non-vowel letter of the alphabet.
    const alphabet="BCDFGHJKLMNPQRSTVWXYZ";

    // Returns a single letter from the alphabet using a random number.
    return alphabet[Math.floor(Math.random()*alphabet.length)];
}

// This function creates a single random vowel.
// It is called 2 times every time the randomize button is clicked. Probably could've done this more efficiently.
function createRandomVowel(){
    // Create a string containing all vowels
    const vowels ="AEIOU"

    // Return a single vowel using a random number.
    return vowels[Math.floor(Math.random()*vowels.length)];
}

// This function makes all the buttons available again by removing the "disabled" attribute.
function resetButtons(){
    $("#button1").removeAttr("disabled")
    $("#button2").removeAttr("disabled");
    $("#button3").removeAttr("disabled");
    $("#button4").removeAttr("disabled");
    $("#button5").removeAttr("disabled");
}

// This function assigns letters to each button.
function assignButtons(){
    // Assign a letter to each of the buttons.
    $("#button1").text(createRandomVowel());
    $("#button2").text(createRandomLetter());
    $("#button3").text(createRandomLetter());
    $("#button4").text(createRandomLetter());
    $("#button5").text(createRandomVowel());

    // Make all the buttons available if need be.
    resetButtons();

    // Clear text that the user has entered from the storage variable and the visible area.
    playerEntry = "";
    $("#wordEntry").text("");
}

// This function puts a letter into the text input and disables the button that was clicked.
function passLetter(numberButton){
    // Create a variable that has the name of a button
    let buttonName = "button"+numberButton;

    // Disable the clicked button
    $("#"+buttonName).attr("disabled","true");

    // Add the button's letter to the variable holding the player's text entry.
    playerEntry = playerEntry.concat($("#"+buttonName).text());

    // Make the variable lowercase for the sake of comparison later.
    // Probably could do something to combine this with the above statement, but it was pretty complex as it is.
    playerEntry = playerEntry.toLowerCase();

    // Show the new letter to the player in uppercase to match the buttons.
    $("#wordEntry").text(playerEntry.toUpperCase());
}

function timerHandle(){
    // Gets the current time.
    let currentTime = new Date()
    
    // Temporarily set the timer's endpoint to the current time.
    // For some reason this fixed a bug that caused the timer to not reset properly if the Quit button was used.
    // No idea why this fixed it.
    timerEnd = currentTime;

    // Sets the endpoint of the timer equal to two minutes later.
    timerEnd.setMinutes(currentTime.getMinutes()+2);

    // At every 1 second interval update the timer.
    timeRemaining = setInterval(function(){
        // Get the current time
        let now = new Date().getTime();

        // Get the distance between the end of the timer and the current time
        let distance = timerEnd - now;

        //Get the number of minutes remaining
        let minutes = Math.floor((distance%(1000*60*60))/(1000*60));

        // Get the number of seconds remaining.
        let seconds = Math.floor((distance %(1000*60))/1000);

        // Display this information to the user.
        if(seconds < 10){
            // If there are less than 10 seconds left in the current minute then a 0 is added to fix the formatting.
            $("#clock").text(minutes+":0"+seconds);
        }
        else{
            $("#clock").text(minutes+":"+seconds);
        }

        if(distance <= 0){
            gameEnd();        
        }
    }, 1000);
    
}

// Ends the game.
// Made a function because I had it in two different places.
function gameEnd(){
    // Stop the timer
    clearInterval(timeRemaining);

    // Reset the timer's display to 2:00
    $("#clock").text("2:00")

    // Clear the text entry.
    playerEntry = "";
    $("#wordEntry").text("");

    // Sets the high score if the current score is higher.
    if(highScore < score){
        highScore = score;
        $("#highScoreStorage").text(score);
    }

    // Reset the score to 0.
    score = 0;

    // Reset the list index to 1
    listIndex = 1;

    // Hide the game.
    $("#gameStorage").hide();

    // Clear the list of used words.
    $("#usedWords1").empty();
    $("#usedWords2").empty();
    $("#usedWords3").empty();
    $("#usedWords4").empty();


    // Show the help text and other starting information.
    $("#gameStart").show();


}

//-----------------------------On document load-----------------------------//

//When the page is loaded do the following
$(document).ready(function(){   
    // When the page loads the game container should be hidden.
    // Did this because I wasn't quite sure how doing a grid layout in CSS but also setting the default display to None would work.
    $("#gameStorage").hide();


    // Event listener for the Start button being clicked
    $("#start").click(function(){
        // Hide the help text and other starting information.
        $("#gameStart").hide();

        // Show the game.
        $("#gameStorage").show();

        // Prep the list of available words.
        availableWords = Array.from(textArray);

        // Prep the buttons
        assignButtons();

        // Prep the timer.
        timerHandle();

        console.log(availableWords[20].length);
    });

    // Event listener for the Quit button being clicked
    $("#quit").click(function(){
        gameEnd();
    });

    // Event listener for the Randomize button being clicked
    $("#randomize").click(function(){
        // Reassign the button values.
        assignButtons();
    });

    // Event listener for the first letter button being clicked.
    $("#button1").click(function(){
        passLetter("1");
    });

    // Event listener for the second letter button being clicked.
    $("#button2").click(function(){
        passLetter("2");
    });

    // Event listener for the third letter button being clicked.
    $("#button3").click(function(){
        passLetter("3")
    });

    // Event listener for the fourth letter button being clicked.
    $("#button4").click(function(){
        passLetter("4")
    });

    // Event listener for the fifth letter button being clicked.
    $("#button5").click(function(){
        passLetter("5")
    });

    // Event listener for the submit button being clicked.
    $("#submit").click(function(){
        // Code should not run unless the user has put some amount of text in.
        if(playerEntry !== ""){
            // Boolean variable used to determine whether or not a matching word was found.
            let wordFound = false;

            // Iterate through the full availableWords array
            for(let i = 0; i < availableWords.length; i++){

                // If the player's entry is the same as one of the words in the array then continue
                // NONFUNCTIONAL. For some reason the program does not seem to think that any input other than a direct reference to one of the array's items is in the array.
                if(availableWords[i] == playerEntry){

                    console.log(playerEntry+" is equal to "+availableWords[i]);
                    // Set the test variable to true
                    wordFound = true;

                    // Remove the word from the availableWords array so it cannot be entered again.
                    availableWords[i] = "";
                }

            // If the player found a valid word then continue
            }

            if(wordFound == true){
                // Add to score based on the word's length
                score += playerEntry.length;

                // Display the updated score to the player.
                // Conditional used to maintain formatting.
                if(score < 10){
                    $("#scoreNumber").text("0"+score);
                }else{
                    $("#scoreNumber").text(score);
                }

                // Determine which of the four lists the used word should be added to.
                let listToAdd = "#usedWords"+listIndex;

                // Add the word to the list of used words.
                $(listToAdd).append('<li>'+playerEntry.toUpperCase()+'</li>');


                if(listIndex == 4){
                    // If the list index is 4 then it resets to 1
                    listIndex = 1;
                }else{
                    // Otherwise increase it by 1.
                    listIndex++;
                }
        }
        
            // Reset the buttons for later text entry
            resetButtons();

            // Reset the text field for later use.
            playerEntry = "";
            $("#wordEntry").text("");
    }
    });
});