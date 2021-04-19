# CRUD_WITH_AUTHENTICATION
SIMPLE CRUD API USING AUTHENTICATION TO CREATE, UPDATE ,DELETE AND READ THE USER WITH NAME, EMAIL, PASSWORD

## use Postman to to test it . 
## clone the project and Run Npm start to start the project

header: content-type , value: application/json
## TO REGISTER A USER (PUBLIC ROUTE)
post request= 
http://localhost:8000/api/auth/register : public for register which sends the jwt token back

## DELETE THE USER (AUTHORIZED USER CAN ONLY DO THAT)
delete request = http://localhost:8000/api/auth/delete/:id
when send with proper token will be deleted,
if not then not deleted

## LOGIN THE USER (AUTHORIZED USER CAN ONLY DO THAT)
get request = http://localhost:8000/api/auth/user : private route, no access without jwt token send during registration or login

## READ THE USER (AUTHORIZED USER CAN ONLY DO THAT)
get request = http://localhost:8000/api/auth/user: private
when sended a get request with token as 
header: key: x-auth-token ,value: secret-token 
it will return the user information(password is not included here) ,
if token entered is wrong , it will send message saying "token is invalid"

## UPDATE THE USER(AUTHORIZED USER CAN ONLY DO THAT)
update request=
http://localhost:8000/api/auth/update/:id
when sended with proper token will be updated or else no update.
