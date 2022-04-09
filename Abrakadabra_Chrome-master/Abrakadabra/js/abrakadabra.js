/**
 * @author unixander
 */
			var working = false;
			function abrakadabra(){
				try{
					if(working) return;
					working = true;
					var oldhtml=transcript(new String($(this).html()));
					$(this).html(oldhtml);
					var eventSet = $(document).data("events");
					if(!eventSet.DOMNodeInserted) {
						$(this).live('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified',abrakadabra);
					}
					working = false;
				} catch (e){
					console.log("abrakadabra");
				}
			}
			
			function transcript(text){
				try{
				var current_word="";
				var vowels=0,consonants=0;
				var ch='';
				var result="";
				var flag=false;
				var posl=-1,posg=-1;
				var temp_str="";
				var direction=0;
				for(var i=0;i<text.length;i++){
					ch=text.charAt(i);
					
					if(stop_symbols.indexOf(ch)==-1||ch=="."){
						current_word+=ch;
					} else {
							flag=abra_check_current(current_word)&&abra_check_double(current_word);
							if(en_letters.indexOf(current_word.charAt(0))!=-1) direction=0; else direction=1;
							if(en_notwords.indexOf(current_word)!=-1){
								current_word=en_words[en_notwords.indexOf(current_word)];
								flag=false;
								}
							else 
								if(ru_notwords.indexOf(current_word)!=-1){
									current_word=ru_words[ru_notwords.indexOf(current_word)];
									flag=false;
							}
							if(flag) current_word=replace(current_word,direction);
							result+=current_word;
							if(ch=="<"){
								var t=text.substring(i);
								posg=t.indexOf(">");
								if(posg>0){
									temp_str=t.substring(0,posg+1);
									result+=temp_str;
									i+=posg;
									current_word="";
									continue;
								} else current_word+=ch;
							}  else {
								result+=ch;
								current_word=""; 
							}
							flag=false;
						
					}
				}
				flag=abra_check_current(current_word)&&abra_check_double(current_word);
						if(en_letters.indexOf(current_word.charAt(0))!=-1) direction=0; else direction=1;
						if(en_notwords.indexOf(current_word)!=-1){
								current_word=en_words[en_notwords.indexOf(current_word)];
								flag=false;
								}
							else 
								if(ru_notwords.indexOf(current_word)!=-1){
									current_word=ru_words[ru_notwords.indexOf(current_word)];
									flag=false;
							}
							if(flag) current_word=replace(current_word,direction);
				result+=current_word;
				return result;
				} catch(e){
				 console.log("transcript");
				}
			}
			function replace(text,direction){
				//0-english to russian
				//1-russian to english
				var result="";
				var ch='';
				var pos=0;
				if(direction==0){
					for(var i=0;i<text.length;i++){
						ch=text.charAt(i);
						pos=en_letters.indexOf(ch);
						if(pos!=-1)result+=ru_letters[pos];
					}
				}else{
					for(var i=0;i<text.length;i++){
						ch=text.charAt(i);
						pos=ru_letters.indexOf(ch);
						if(pos!=-1)result+=en_letters[pos];
					}
				}
				return result;
			}
			function abra_check_current(current_word){
				var consonants=0,vowels=0;
				var ch='';
				var direction=0;
				var flag=false;
				ch=current_word.charAt(0);
				if(en_letters.indexOf(ch)!=-1&&stop_symbols.indexOf(ch)==-1) direction=0; else 
					if(stop_symbols.indexOf(ch)==-1) direction=1;
				//Check quantity of consonants and vowels
				for(var i=0;i<current_word.length;i++){
					ch=current_word.charAt(i);
					if(en_vowels.indexOf(ch)!=-1||ru_vowels.indexOf(ch)!=-1){
							consonants=0;
							vowels++;
						} else if (en_consonants.indexOf(ch)!=-1||ru_consonants.indexOf(ch)!=-1){
							vowels=0;
							consonants++;
						}
						if(consonants>3||vowels>3) flag=true;
				}
				//
				if(flag&&current_word.length!=0){
							flag=true;
						} else if(current_word.length!=0){
							if((current_word.length<=3&&
								((consonants==current_word.length||vowels==current_word.length)&&direction==0)
								)||
								(current_word.length<=3&&current_word.length>1&&
								((consonants==current_word.length||vowels==current_word.length)&&direction==1)
								)
							) flag=true;
						}
				var tag=abra_check_tag(current_word);
				if(tag) flag=false;
				if(current_word.indexOf("http")!=-1) flag=false;
				return flag;
			}
			function abra_check_tag(current_word){
					var posl=-1, posg=-1;
					posl=current_word.indexOf('<');
					posg=current_word.indexOf('>');
					if(posl!=-1&&posg!=-1&&posl<posg) return true;
					else return false;
			}
			function abra_check_double(current_word){
				var first=false, second=false; 
				var temp_word="";
				var direction=0;
				first=abra_check_current(current_word);
				if(en_letters.indexOf(current_word.charAt(0))!=-1) direction=0; else direction=1;
				if(first)  temp_word=replace(current_word,direction);
				second=abra_check_current(temp_word);
				if(first&&second) return false; else return true;
			}
			
