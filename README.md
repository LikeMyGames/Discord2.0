# Discord2.0 / Datcord

## Important
If you want to clone or fork or do anything that requires 

## Summary
This is a personal project for AP Computer Science A. This is supposed to function as a somewhat clone of Discord. Some directions on how to use things are listed below. This project uses many different free services and languages to function. The main languages used to make this project are HTML, CSS, and Javascript. The languages all work together to make the site structure, look, and actions work how I want them to. This project uses vanilla Javascript (no React or other framework) meaning that I had to learn an entirely new scripting language. Most of the things that I needed to know for this project, I already knew due to the AP Comp Sci class, but Javascript-specific things like syntax, semicolon structure, and other built-in browser features I learned using Stack Overflow. Stack Overflow along with MDN and Peer.JS docs were pivotal and vital pieces to the functionality of this project. Without any of those documentations, I wouldn't have been able to do the things I did for this project. Some of the services I used for this project at the moment include but might not be limited to, Peer.JS and Google Material Symbols (Google fonts, but icons). These services allowed me to have both a functional and visually pleasing experience for the user.


## Tech Stuff
### Peer.JS
The communication system in this project uses Peer.JS which is a free and user-friendly wrapper for WebRTC. If Peer.JS didn't exist and I had to try and use WebRTC, this project might not have been completed in time. Peer.JS provides a simple way of connecting from one peer to another (peer-to-peer or p2p). Peer.JS takes an ID, and as long as a person has another peer's ID, they can connect to them. This made it extremely easy to create a connection system. Peer.JS either creates a constructor or it can be provided one (the option used in this project for the most part). Eventually, Peer.JS will provide a way to make audio and video calls possible using this website. These features though, are not yet implemented, but hopefully I can get to it soon.    
&n;
### Google Material Symbols
This system/service/font library is used throughout this entire project. Mostly every icon seen in this project is from the Google Material Symbols library. This library made it very simple and easy to import and use nice-looking icons with many visual options. The import of this library using HTML and CSS was also very easy and the use in those two languages made it extremely easy to edit in JS just by changing the text content or content of an element.



## Website Instruction for Use
### Use Without Account
This is currently the only option on the welcome screen that works. This generates a random ID that gets both alerted to the user and by default, is part of the user name, which by default is "Untitled (ID ${id})".    
&n;
### Use With Account
I FINALLY did it; both this and the create account button should both be working. To use with an account, first, you have to create an account, unless you know the credentials to an already existing account, so go look at the instructions for creating an account. After you have created an account, it should have logged you in by default, but if you want to login after you have logged out, you can hit the 'LOGIN' button on the welcome screen to go the login page. On the login page, input a valid username and password to login into that account. If noone has used the website in about a 15ish minute period of you using it, it will take about a minute for you to be logged in (the same applies to creating an account). Once you are logged in, the website will function exactly the same as using without an account except for the fact that your ID will be saved so that people will always know what your id is. You can find your id under my account in settings. This login system used my custom API, Discord2.0-API.
&n;
### Create Account
This is also FINALLY implemented. To create an account, you must click on the 'CREATE ACCOUNT' button on the welcome screen. This will take you to the Create Account page. You must enter a valid username and password (it will tell you if it isn't valid)(no ! @ # $ % ^ & * ( ) _ + - = . ~  ` ] [ } { | \ < , > ? / only alphanumerical characters). If nobody has used the website in about the 15ish minutes before you, it will take about a minute or more for your account to be created. When your account is created though, you should be automatically logged in and you id should be available to see in settings under 'My Account', this will allow you to connect to other people.
&n;
### Content to Another User
To connect to another user, all you need is their ID. At the top of the bar second from the left in desktop mode, and second from the top in mobile mode, there should be a button with a plus button on it. Click or tap this plus button and a screen with an input labeled id and 2 button should pop up. On desktop, just type the other peer's ID into the input and press enter. On mobile, type the other peer's ID into the input and press the enter button. Both of these actions will end up with the same result, a button either to the right of or below the add button (below on desktop and to the right of on mobile). This button should have the ID of the peer you are trying to connect to. If you click on this button, a connection will be attempted to be opened between the two peers. To connect to another peer make sure that you have their exact ID (letter case does not matter) and that they are still active on the website. If all of these conditions are satisfied, a connection should be achieved. You will know that you have connected because the name on the button will change to the username of the other peer. The main message input will now be enabled, and if you type something into it and press enter (on desktop, return on mobile) the message will be sent to the other person.    
&n;
### Editing Setting
Currently, only the appearance settings are the ones that are semi-built out. You can change the color theme by clicking on one of the two existing options (dark or light [you are evil if you use light]). There is a partially built custom color picker, but it doesn't fully work yet, coming soon.

