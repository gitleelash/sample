			//Correspondence of english and russian characters
			var en_letters="qwertyuiop[]asdfghjkl;'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:"+'"'+"ZXCVBNM<>?`~";
			var ru_letters='йцукенгшщзхъфывапролджэячсмитьбю.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,ёЁ';
			//Consonants of both languages
			var en_consonants='qwrtp[]sdfghjkl;'+"'"+'zxcvbnm,./QWRTP{}SDFGHJKL:"ZXCVBNM<>?`~';
			var ru_consonants='йцкнгшщзхъфвпрлджчсмтьб.ЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ,';
			//Vowels of both languages
			var en_vowels='eyuioaEYUIOA';
			var ru_vowels='уеыаоэяиюУЕЫАОЭЯИЮёЁ';				
			//Stop symbols for detecting end of the word
			var stop_symbols=' ?.,!()<#$%^&*';
			//Words, that don't much the rule of transcription
			var ru_notwords=new Array('yf','r','yj','f','e;t','b','yt','jyb','Jyb','E;t','nbsp;','тиызж');
			var ru_words=new Array('на','к','но','а','уже','и','не','они','Они','Уже','nbsp;','nbsp;');
			var en_notwords=new Array('руддщ','Руддщ','nbp;','тиызж');
			var en_words=new Array('hello','Hello','nbp;','nbsp;');