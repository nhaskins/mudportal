Mudportal
=========

Mudding in a browser.

Demo:  http://haskins.it/eotl<br/>
Image: https://twitter.com/nhaskins/status/281218074823254016/photo/1<br/>

This repo has two main things in it:
- a front end interface to quickly create an HTML5 faux terminal for playing a MUD
- a node.js server that can setup the plumbing to make said connection happen using socket.io


How does Mudportal work?
=======================

<strong>The Mudportal Server:</strong><br/>
<em>Middle mans the data between a MUD and a faux terminal</em>

- server.js is given an address by the front end sockets.js file.
- server.js opens a connection to the address
- server.js pipes data back and forth between the telnet session, and the web browser using socket.io

<strong>The faux terminal:</strong><br/>
<em>The interface to the MUD from your web browser</em>

- index.html has a bunch of styles and stuff that make it looks like a terminal
- the socket.js file kicks in, and tells the server to open up a connection to le MUD
  -socket.js needs to be given a telnet address.
  -socket.js needs to be given a server.js locations (defaults to a nodejitsu instance of server.js, demo use)
- the raw ascii text will stream in from the server
- ansi_up.js takes a crack at the incoming data, and filters it.
  - Filtering involves converting escape sequences into color
  - it also does things like converts hyperlinks and img tags into actual anchor and image tags (buggy)
- Once ansi_up.js filters the incoming telnet data, it is displayed into the 'terminal' on the browser page.
- The user can respond back with the handy prompt at the bottom of the page.  Input is piped back to the telnet
  session via sockets.js -> server.js -> telnet ... the whole thing keeps repeating.

How to use Mudportal:
=========

<strong>Easymode (just a faux terminal):</strong>
- Put the contents of the web/ folder on your server.
- Open the js/sockets.js file in an editor and update this line:<br/><br/>
  <strong>   var mud    = {address: 'eotl.org', port: 2010}</strong><br/><br/>
  with your MUD's address and port information.<br/>
<br/>
- Load index.html in your browser. It will use the mudportal.nodejitsu.com server to automagically<br/>
  being the faux terminal featuring your MUD.
  

<strong>Self hosted Mudportal:</strong>
- Using your own instance of node.js on a server, take the files from /server and copy
  them to a directory.
- do 'npm install', it will install all the dependencies found in the package.json file.
- upload the web/ files (or server them in express or something)
- update the web/js/sockets.js file to point to your own node.js server instead of mudportal.nodejitsu.com

Notes about rendering ansi:
=========
- The default ansi rendering (found in js/ansi_render.js) is setup for the
  EOTL mud.  
- Your MUD may use similar ansi encoding, so it may 'just work'.  
- More likley, you may have to adjust a few things to get it rendering just right.


Short term goals:
=========
<strong>Faux terminal hyperlink rendering:</strong><br/>
I could use some help working on the ansi_render.js file.  
<br/>
Pretty much I'm hacking away on regex to try and match URL's to replace URL's with their appropriate tags.
<br/>
I have a crummy implimentaiton of inline hyperlinking working.. the problem is I have yet to figure out
how to match URL's decently over 2 lines.  These telnet connections send long strings over 2 lines.  Kinda
tricky.  The render file does have (commented out at the moment) hyperlink matching, image matching, and youtube
video matching.  It looks pretty amazing to get a hyperlink from a friend on a MUD and have it  render
as an image or video on the spot, in the 'terminal' ('cept when you get trolled).  Sepaking of that, I'd like to add
some simple features to enable/disable/click-confirm the auto replacement of said media elements.



