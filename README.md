# PseudoHuman

Multiplayer online game where there is a prompt given, and there are multiple answers all generated by ai. However, there is an imposter among the people who is actually a human, who will also answer the prompts in real time. The person guessing chooses the answer that they think the person made. This repeats with the roles swapped probably around 3 times. Whoever got picked the least loses.

Kind of inspired by the [Human Or Not](https://www.humanornot.ai) game.

Frontend NEXTjs hosted on [vercel](https://pseudohuman-project.vercel.app/home/login) and using a postgres database also on vercel for logging in. Backend websocket server hosted on [render](https://pseudobeing-server.onrender.com).

# todo:
- [ ] find a free or cheap ai api to use
    - **https://chatling.ai**
    - https://www.botlibre.com
- [x] find a free server host
    - **https://render.com**
    - https://www.koyeb.com
    - https://www.fl0.com
    - https://adaptable.io
- [x] frontend hosting
    - vercel
- [ ] handle when user disconnects
- [ ] stop copy paste ai answer as own answer

## Frontend
- [x] create ui for login
- [x] create ui for home screen
- [x] create ui for the start of game
- [x] create ui for playing the game
- [x] create ui for end of game

## Backend
- [x] create login system
- [x] create matchmaking system
    - [x] start a game when 2 people are available
- [x] create text prompts
- [x] get ai answers to question
- [x] get first players own answer to question, and then display ai and players answers to player 2
- [x] get player 2s answer and see if they were right or wrong
- [x] add the scores to a total
- [x] repeat this process multiple times
- [x] end the game after a player reaches 3 points, awarding that player a win
- [ ] add ability to create custom rooms for 2 people to join and play many times
- [ ] allow for multiple games to run at once
- [ ] add anon accounts

# Changelog
## 6/1
- fixed being able to navigate to pages you are not meant to go to
- fixed question not being displayed properly

## 4/1
- changed login again to be run on nextjs servers instead of websockets
- changed the storage of users and passwords to be in a database instead of a file
    - database is hosted in vercel, which is also where the app is deployed

## 3/1
- finish gameplay loop
    - added infinite rounds until a player reaches 3 points
    - added a result screen every point
    - added game ending screen
    - when player reaches 3 points it ends the game
    - navbar now displays the points and players properly
- changed the login functions to be http requests rather than websockets

## 2/1
- seperated game functions into its own file for organisation
- made the passwords hashed and salted using a simple library, and limited usernames to 10 chars

## 1/1
- got the main gameplay to work except the resetting of rounds and points.

## 31/12
- added start game page and countdown to starting the game

## 30/12
- fixed many login system bugs, 
- made it more responsive by refactoring lots of client side components form server side components
- made matchmaking work

## 21/12
- made login system work on server and frontend

## 20/12
- able to get websockets working with an external server (hopefully will find a host for server soon)

## 19/12
- finished a mock ui for all the gameplay pages
    - made a prompt screen
    - selection screen
    - waiting screen
    - start and finish screen

## 18/12
- continue making mock ui to build backend on
    - made a login page
    - made a main menu

## 17/12
- Start work by creating initial nextjs files and getting main idea down

## ~5/12
- Have initial idea for sdd game project
