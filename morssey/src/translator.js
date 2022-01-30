export function morseToEng(morse) {
    var morseDict = { 
      '.-':'A',
      '-...':'B',
      '-.-.':'C',
      '-..': 'D',
      '.':'E',
      '..-.':'F',
      '--.':'G',
      '....':'H',
      '..':'I',
      '.---':'J',
      '-.-':'K',
      '.-..':'L',
      '--':'M',
      '-.':'N',
      '---':'O',
      '.--.':'P',
      '--.-':'Q',
      '.-.':'R',
      '...':'S',
      '-':'T',
      '..-':'U',
      '...-':'V',
      '.--':'W',
      '-..-':'X',
      '-.--':'Y',
      '--..':'Z',
      '.----':'1',
      '..---':'2',
      '...--':'3',
      '....-':'4',
      '.....':'5',
      '-....':'6',
      '--...':'7',
      '---..':'8',
      '----.':'9',
      '-----':'0',

      '.-.-.-':'.',
      '--..--':',',
      '..--..':'?',
      '.---.':'\'',
      '-.-.--':'!',
      '-..-.':'/',
      '-.--.':'(',
      '-.--.-':')',
      '.-...':'&',
      '---...':':',
      '-.-.-.':';',
      '-...-':'=',
      '.-.-.':'+',
      '-...-':'-',
      '..--.-':'_',
      '.-..-.':'"',
      '...-..-':'$',
      '.--.-.':'@',
    };
    morse+=" ";
    var splitString = morse.split(" ");
    //console.log(splitString);
    var plainText = "";
    for(var a in splitString) {
        console.log(a);
        var b = splitString[a];

        if (b in morseDict) {
            plainText+=morseDict[b];
        } else {
            plainText+=" ";
        }
        
    }
    console.log(plainText);
    return plainText;
  }

 export function engToMorse(english) {

    var engDict = { 
      'A':'.-',
      'B':'-...',
      'C':'-.-.',
      'D':'-..',
      'E':'.',
      'F':'..-.',
      'G':'--.',
      'H':'....',
      'I':'..',
      'J':'.---',
      'K':'-.-',
      'L':'.-..',
      'M':'--',
      'N':'-.',
      'O':'---',
      'P':'.--.',
      'Q':'--.-',
      'R':'.-.',
      'S':'...',
      'T':'-',
      'U':'..-',
      'V':'...-',
      'W':'.--',
      'X':'-..-',
      'Y':'-.--',
      'Z':'--..',
      '1':'.----',
      '2':'..---',
      '3':'...--',
      '4':'....-',
      '5':'.....',
      '6':'-....',
      '7':'--...',
      '8':'---..',
      '9':'----.',
      '0':'-----',
      '.':'.-.-.-',
      ',':'--..--',
      '?':'..--..',
      '\'':'.---.',
      '!':'-.-.--',
      '/':'-..-.',
      '(':'-.--.',
      ')':'-.--.-',
      '&':'.-...',
      ':':'---...',
      ';':'-.-.-.',
      '=':'-...-',
      '+':'.-.-.',
      '-':'-...-',
      '_':'..--.-',
      '"':'.-..-.',
      '$':'...-..-',
      '@':'.--.-.',
        

    };
    //console.log(splitString);
    var plainText = "";
    english = english.toUpperCase();
    console.log(english);
    for(var a in english) {
      
        var b = english[a];

        //console.log(b);
        if (b in engDict) {

            plainText+=engDict[b]+" ";
            //console.log(engDict[b]);
        } else {
            plainText+=" ";
        }
        
    }
    console.log(plainText);
    return plainText;
  }
  // ADD A SPACE IN BETWEEN EACH NEW WORD
  //var decoded = morseToEng(".-- --- .-. -.. .-- --- .-. -..");
  //console.log(decoded);
  //var test = engToMorse("I like big buts");
  //console.log(test);