$(document).ready(function(){


var questionBank=new Array;
var wordArray=new Array;
var previousGuesses=new Array;
var currentWord;
var currentClue;
var wrongAnswerCount;

$.getJSON('quizbank.json', function(data) {

	for (i=0; i<data.wordlist.length; i++) {
		questionBank[i]=new Array;
		questionBank[i][0]=data.wordlist[i].word;
		questionBank[i][1] = data.wordlist[i].clue;
	}
	titleScreen();

});

function titleScreen() {

	$('#gameContent').append('<div id="gameTitle">Todemanija</div><div id="startButton" class="button">Počni</div>');
	$('#startButton').on("click",function (){
		gameScreen();
	});

} // we are adding content

function gameScreen() {

	$('#gameContent').empty();
	$('#gameContent').append('<div id="pixHolder"><img id="hangman" src="images/todemanija.png"></div>');
	$('#gameContent').append('<div id="wordHolder"></div>');
	$('#gameContent').append('<div id="clueHolder"></div>');
	$('#gameContent').append('<div id="guesses">Prethodni pokušaji:</div>');
	$('#gameContent').append('<div id="feedback"></div>');

	getWord();
	var numberOfTiles=currentWord.length;
	wrongAnswerCount=0;
	previousGuesses=[];

	for(i=0;i<numberOfTiles;i++) {
		$('#wordHolder').append('<div class="tile" id=t'+i+'></div>');
	}

	$('#clueHolder').append("Nagoveštaj: "+currentClue);

	$(document).on("keyup",handleKeyUp);


	// with this function we add virtual keyboard for mobile users and we do not affect desktop gameplay
	$(document).on("click",function() {
		$('#dummy').focus();
	});
	$('#dummy').focus();

} // we are making our screen

function getWord() {

	var rnd=Math.floor(Math.random()*questionBank.length);
	currentWord=questionBank[rnd][0];
	currentClue=questionBank[rnd][1];
	questionBank.splice(rnd,1);
	wordArray=currentWord.split("");

} // We make random number > we set current word and clue > 
  // then we use splice to remove word and clue that was choosen from array so it can't repeat >
  // then we form an array containing the letters of the current word by splitting it

function handleKeyUp(event) {
	
	if(event.keyCode==229) {
		event.keyCode=$('#dummy').val().slice($('#dummy').val().length-1,$('#dummy').val().length).toUpperCase().charCodeAt(0);
	}
	
	if(event.keyCode>64 && event.keyCode<91) {

		var found=false; // found will help us determine if the submitted letter is found in the word
		var previouslyEntered=false; // previouslyEntered will help us determine if the letter has been previously submitted
		var input = String.fromCharCode (event.keyCode).toLowerCase(); // converts the code to a letter and ensures that it is lower case


		// for loop checks whether the letter has been entered before
		for(i=0;i<previousGuesses.length;i++) {
			if(input==previousGuesses[i]) {
				previouslyEntered=true;
			}
		}

		if(!previouslyEntered) { // function should only be carried out if the letter has not already been input > if the user enters a letter twice, the second entry will simply be ignored
			
			previousGuesses.push(input); // adds the current letter to the list of previosuly entered letters

			for(i=0;i<wordArray.length;i++) { // check whether the letter appears in the word. If so, the letter is added to the appropriate tile
				if(input==wordArray[i]) {
					found=true;
					$('#t'+i).append(input);
				}
			}

			if(found) { // checkAnswer() - this will check whether the entire word has been solved
				checkAnswer();
			} else { // specifies that if the letter was not found in the word, we should call a function wrongAnswer() and send it the variable 'input'
				wrongAnswer(input);
			}

		}
	}
}

function checkAnswer() {


	// store the user input so far by adding to it the text from each of our answer tiles
	var currentAnswer="";
	for(i=0;i<currentWord.length;i++) {
		currentAnswer+=($('#t'+i).text()); 
	}

	// if the current answer is the same as the current word from our database > victoryMessage
	if(currentAnswer==currentWord) {
		victoryMessage();
	}

}

function wrongAnswer(a) {

	wrongAnswerCount++;
	var pos=(wrongAnswerCount*-75) +"px";  //we use the number of wrong answers to recalculate the position of our hanged man image
	$('#guesses').append(" "+a); // we display the incorrect guess on the screen > added space so they are not side by side
	$('#hangman').css("left",pos); // this where we use pos number to add css and change position of image

	if(wrongAnswerCount==6) {
		defeatMessage();
	}

}

function victoryMessage() {

	$(document).off("keyup", handleKeyUp); // we remove the key handler that we instituted
	$('#feedback').append("Bravo!<br><br><div id='replay' class='button'>Nastavi</div>");


	// This code will check whether we have any questions left in the databank
	// and if so will restart the game if not the final page will be displayed
	$('#replay').on("click",function () {
		if(questionBank.length>0) {
			gameScreen();
		}
		else {
			finalPage();
		}
	});

}

function defeatMessage() {


	// basically same as Victory message
	$(document).off("keyup", handleKeyUp);
	$('#feedback').append("A ne možež tako!<br>(odgovor= "+ currentWord +")<div id='replay' class='button'>Probaj opet</div>");

	$('#replay').on("click",function () {
		if(questionBank.length>0) {
			gameScreen();
		}
	});

}

function finalPage() {

	$('#gameContent').empty();
	$('#gameContent').append('<div id="finalMessage">Svaka čast. Miloš je spašen!</div>');

}



});
