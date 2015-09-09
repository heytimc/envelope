/* jsmin.c
   2013-03-29
Copyright (c) 2002 Douglas Crockford  (www.crockford.com)
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
The Software shall be used for Good, not Evil.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
#include "util_jsmin.h"

static char *str_global_output;
static char *str_global_input;
static int   int_global_i;
static int   theA;
static int   theB;
static int   theLookahead = EOF;
static int   theX = EOF;
static int   theY = EOF;

/*
static void
error(char* s)
{
    fputs("JSMIN Error: ", stderr);
    fputs(s, stderr);
    fputc('\n', stderr);
    exit(1);
}
*/

/* isAlphanum -- return true if the character is a letter, digit, underscore,
        dollar sign, or non-ASCII character.
*/

static int isAlphanum(int c) {
    return ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ||
        (c >= 'A' && c <= 'Z') || c == '_' || c == '$' || c == '\\' ||
        c > 126);
}


/* get -- return the next character from stdin. Watch out for lookahead. If
        the character is a control character, translate it to a space or
        linefeed.
*/

static int get() {
    int c = theLookahead;
    theLookahead = EOF;
    if (c == EOF) {
		c = str_global_input[int_global_i];
		int_global_i++;
		if (c == '\0') {
			c = EOF;
		}
        //c = getc(stdin);
    }
    if (c >= ' ' || c == '\n' || c == EOF) {
        return c;
    }
    if (c == '\r') {
        return '\n';
    }
    return ' ';
}


/* peek -- get the next character without getting it.
*/

static int peek() {
    theLookahead = get();
    return theLookahead;
}


/* next -- get the next character, excluding comments. peek() is used to see
        if a '/' is followed by a '/' or '*'.
*/

static int next() {
	int c;
	char *ptr_end_of_comment;
//HARK YE ONLOOKER: This is Joseph, yes I used a goto statement,
//but the code was already messed up in the first place. So there.
begin:
    c = get();
    if  (c == '/') {
        switch (peek()) {
        case '/':
            for (;;) {
                c = get();
                if (c <= '\n') {
                    break;
                }
            }
            break;
        case '*':
			DEBUG("str_global_output>%s<", str_global_output);
			DEBUG("theLookahead: %c theA: %c theB: %c theX: %c theY: %c", theLookahead, theA, theB, theX, theY);
			ERROR_CAT_CHAR_APPEND(str_global_output, theA);
			theA = ' ';
			theLookahead = EOF;
			ERROR_CAT_CHAR_APPEND(str_global_output, '/');
			ERROR_CAT_CHAR_APPEND(str_global_output, '*');
			ptr_end_of_comment = strstr(str_global_input + int_global_i, "*/") + 2;
			ERROR_CHECK(ptr_end_of_comment != NULL, "Unterminated comment.");
			int int_length = ptr_end_of_comment - (str_global_input + int_global_i);
			int int_output_length = strlen(str_global_output);
			DEBUG("test 5>%d|%d<", int_global_i, int_length);
			
			DEBUG("to add>%s<", str_global_input + int_global_i);
			
			DEBUG("str_global_output>%s<", str_global_output);
			
			ERROR_SREALLOC(str_global_output, int_output_length + int_length + 1);
			memcpy(str_global_output + int_output_length, str_global_input + int_global_i, int_length);
			
			str_global_output[int_output_length + int_length] = '\0';
			int_global_i = int_global_i + int_length;
			DEBUG("str_global_output>%s<", str_global_output);
			DEBUG("rest>%s<", str_global_input + int_global_i);
			
			if (strlen(str_global_input) <= (unsigned long)int_global_i) {
				c = EOF;
			} else {
				goto begin;
//				c = get();
			}
            break;
		/*
        case '*':
            get();
            while (c != ' ') {
                switch (get()) {
                case '*':
                    if (peek() == '/') {
                        get();
                        c = ' ';
                    }
                    break;
                case EOF:
					DEBUG("test1");
					ERROR("Unterminated comment.");
                    //error("Unterminated comment.");
                }
            }
            break;
		*/
        }
    }
    theY = theX;
    theX = c;
	DEBUG("test2>%d|%c<", c, c);
    return c;
error:
	DEBUG("test3");
	return -2;
}


/* action -- do something! What you do is determined by the argument:
        1   Output A. Copy B to A. Get the next B.
        2   Copy B to A. Get the next B. (Delete A).
        3   Get the next B. (Delete B).
   action treats a string as a single character. Wow!
   action recognizes a regular expression if it is preceded by ( or , or =.
*/

static bool action(int d) {
    switch (d) {
    case 1:
		ERROR_CAT_CHAR_APPEND(str_global_output, theA);
        //putc(theA, stdout);
        if (
            (theY == '\n' || theY == ' ') &&
            (theA == '+' || theA == '-' || theA == '*' || theA == '/') &&
            (theB == '+' || theB == '-' || theB == '*' || theB == '/')
        ) {
			ERROR_CAT_CHAR_APPEND(str_global_output, theY);
            //putc(theY, stdout);
        }
    case 2:
        theA = theB;
        if (theA == '\'' || theA == '"' || theA == '`') {
            for (;;) {
				ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                //putc(theA, stdout);
                theA = get();
                if (theA == theB) {
                    break;
                }
                if (theA == '\\') {
					ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                    //putc(theA, stdout);
                    theA = get();
                }
				ERROR_CHECK(theA != EOF, "Unterminated string literal.");
				/*
                if (theA == EOF) {
                    error("Unterminated string literal.");
                }
				*/
            }
        }
    case 3:
        theB = next();
		ERROR_CHECK(theB != -2, "next failed");
        if (theB == '/' && (
            theA == '(' || theA == ',' || theA == '=' || theA == ':' ||
            theA == '[' || theA == '!' || theA == '&' || theA == '|' ||
            theA == '?' || theA == '+' || theA == '-' || theA == '~' ||
            theA == '*' || theA == '/' || theA == '{' || theA == '\n'
        )) {
			ERROR_CAT_CHAR_APPEND(str_global_output, theA);
            //putc(theA, stdout);
            if (theA == '/' || theA == '*') {
				ERROR_CAT_CHAR_APPEND(str_global_output, ' ');
                //putc(' ', stdout);
            }
			ERROR_CAT_CHAR_APPEND(str_global_output, theB);
            //putc(theB, stdout);
            for (;;) {
                theA = get();
                if (theA == '[') {
                    for (;;) {
						ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                        //putc(theA, stdout);
                        theA = get();
                        if (theA == ']') {
                            break;
                        }
                        if (theA == '\\') {
							ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                            //putc(theA, stdout);
                            theA = get();
                        }
						ERROR_CHECK(theA != EOF, "Unterminated set in Regular Expression literal.");
						/*
                        if (theA == EOF) {
                            error("Unterminated set in Regular Expression literal.");
                        }
						*/
                    }
                } else if (theA == '/') {
                    switch (peek()) {
                    case '/':
                    case '*':
						ERROR("Unterminated set in Regular Expression literal.");
                        //error("Unterminated set in Regular Expression literal.");
                    }
                    break;
                } else if (theA == '\\') {
					ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                    //putc(theA, stdout);
                    theA = get();
                }
				ERROR_CHECK(theA != EOF, "Unterminated Regular Expression literal.");
				/*
                if (theA == EOF) {
                    error("Unterminated Regular Expression literal.");
                }
				*/
				ERROR_CAT_CHAR_APPEND(str_global_output, theA);
                //putc(theA, stdout);
            }
            theB = next();
			ERROR_CHECK(theB != -2, "next failed");
        }
    }
	return true;
error:
	return false;
}


/* jsmin -- Copy the input to the output, deleting the characters which are
        insignificant to JavaScript. Comments will be removed. Tabs will be
        replaced with spaces. Carriage returns will be replaced with linefeeds.
        Most spaces and linefeeds will be removed.
*/

char *jsmin(char *str_input) {
	ERROR_CAT_CSTR(str_global_output, "");
	str_global_input = str_input;
	int_global_i = 0;
	
    if (peek() == 0xEF) {
        get();
        get();
        get();
    }
    theA = '\n';
    action(3);
    while (theA != EOF) {
        switch (theA) {
        case ' ':
            ERROR_CHECK(action(isAlphanum(theB) ? 1 : 2), "action failed");
            break;
        case '\n':
            switch (theB) {
            case '{':
            case '[':
            case '(':
            case '+':
            case '-':
            case '!':
            case '~':
                ERROR_CHECK(action(1), "action failed");
                break;
            case ' ':
                ERROR_CHECK(action(3), "action failed");
                break;
            default:
                ERROR_CHECK(action(isAlphanum(theB) ? 1 : 2), "action failed");
            }
            break;
        default:
            switch (theB) {
            case ' ':
                ERROR_CHECK(action(isAlphanum(theA) ? 1 : 3), "action failed");
                break;
            case '\n':
                switch (theA) {
                case '}':
                case ']':
                case ')':
                case '+':
                case '-':
                case '"':
                case '\'':
                case '`':
                    ERROR_CHECK(action(1), "action failed");
                    break;
                default:
                    ERROR_CHECK(action(isAlphanum(theA) ? 1 : 3), "action failed");
                }
                break;
            default:
                ERROR_CHECK(action(1), "action failed");
                break;
            }
        }
    }
	return str_global_output;
error:
	VAR("str_global_input + int_global_i - 25 (for 50 chars): %50.50s", str_global_input + int_global_i - 25);
	VAR("int_global_i: %d", int_global_i);
	VAR("theA: %c", theA);
	VAR("theB: %c", theB);
	VAR("theLookahead: %c", theLookahead);
	VAR("theX: %c", theX);
	VAR("theY: %c", theY);
	VAR("str_global_output: %s", str_global_output);
	SFREE(str_global_output);
	return NULL;
}
