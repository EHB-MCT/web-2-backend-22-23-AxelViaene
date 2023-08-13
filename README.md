# PukeiDex
web-2-backend-22-23-AxelViaene - August retake

Frontend: https://axelviaene.github.io/

Backend: https://web2-course-project.onrender.com

## Improvements
This is all new as I didn't have a backend set up in the first sememester.


## API Endpoints
- GET / = root page (this page)

### USERS
- GET Get all users /users
- GET Get one user /user?userid=<id>
- POST Register user /saveusers
- POST Login user /loginuser


### WEAPONS
- GET Get all weapons /weapons
- GET Get one weapon /weapon?weaponid=<id>


### MONSTERS
- GET Get all monsters /monsters
- GET Get one monster /monster?monsterid=<id>
- POST Save one monster /savemonster


### LINKED TABLES
- GET Get all hunts /hunts
- POST save one hunt /save_hunt
- GET Get all user_greatswords /user_greatswords
- POST Save one user_greatsword /save_user_greatsword
- DELETE Delete one user_greatswords /delete_user_greatsword?usergreatswordid=<id>
- DELETE Delete one user_greatswords if no user_greatsword_id available /delete_user_greatsword?UserId=<id>&GreatswordId=<id>
