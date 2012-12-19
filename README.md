Mudportal
=========

Mudding in a browser. 
<br/>
Demo: http://haskins.it/eotl


This repo has two main things in it:
- a front end interface to quickly create an HTML5 faux terminal for playing a MUD
- a node.js server that can setup the plumbing to make said connection happen using socket.io


What's this project do?
=======================

Essentially, it does 2 things:

(the node server)
- server.js is given an address by the front end sockets.js file.
- server.js opens a connection to the address
- server.js pipes data back and forth between the telnet session, and the web browser using socket.io

(the web browser)
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


Demo: http://haskins.it/eotl

How to use it:

Easymode:
- Put the contents of the web/ folder on your server.
- Open the js/sockets.js file in an editor and update this line:
     var mud    = {address: 'eotl.org', port: 2010}
  with your MUD's address and port information.

  Load index.html in your browser. It will use the default connection nodejitsu server i've got running.

Self hosted mode:
- Using your own instance of node.js on a server, take the files from /server and copy
  them to a directory.
- do 'npm install', it will install all the dependencies found in the package.json file.
- upload the web/ files (or server them in express or something)
- update the web/js/sockets.js file to point to your own node.js server instead of mudportal.nodejitsu.com

Notes about rendering ansi:

- The default ansi rendering (found in js/ansi_render.js) is setup for the
  EOTL mud.  Your mud may use similar ansi encoding, so it may just work.  It may require tweaks
  so have fun hacking on that file.


I really need some help working on the ansi_render.js file.  Pretty much I'm hacking away on regex to try
and match URL's to replace URL's with their appropriate tags.

I have a crummy implimentaiton of inline hyperlinking working.. the problem is I have yet to figure out
how to match URL's decently over 2 lines.  These telnet connections send long strings over 2 lines.  Kinda
tricky.  The render file does have (commented out at the moment) hyperlink matching, image matching, and youtube
video matching.  It looks pretty amazing to get a hyperlink from a friend on a MUD and have it just render
and image or video on the spot, in the 'terminal' ('cept when you get trolled).  Sepaking of that, I'd like to add
some simple features to enable/disable/click-confirm the auto replacement of said media elements.


<img src="https://twitter.com/nhaskins/status/281218074823254016/photo/1"/>
