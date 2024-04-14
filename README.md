# Steps to run this project

1. Make sure your Docker is up and running.
2. `docker-compose up -d`
3. Run `npm i` command
4. Clone the `.env.example` file into .env and fill the environment variables
5. Run `npm run dev:start` command
6. I am using Postgres as database so make sure you have it installed and running or you can use the docker-compose file to run the database

### db url = postgresql://questionpro:questionpro@123@localhost:5432/questionpro?schema=public

# Endpoints to test

# Deployed API =https://qp-assessment-uo7r.onrender.com

1. Health check endpoint
    - Method: GET
    - URL: /health-check
    - Description: This endpoint is used to check the health of the application
    - Example: http://localhost:4040/api/v1/health-check
    - Example: https://questionpro-f833.onrender.com/health-check

- Register a User
    - Route : `http://localhost:4040/api/v1/users/signup`
    - Method : `POST`
    - Body : 
      ```json
      {
       "name": "Vishal Kumar",
	   "email": "vishal@gamil.com",
	   "password": "1234",
      }
      ```

  - Login a User
    - Route : `http://localhost:4040/api/v1/users/login`
    - Method : `POST`
    - Body : 
      ```json
      {
	   "email": "vishal@gamil.com",
	   "password": "1234",
      }
      ```

  ## All the routes below are admin authenticated routes
  ## creds to be used for admin on deployed link 
    ```json
    {
      "email": "vishal@gamil.com",
      "password": "1234"
    }  
    ```
    

  - Get all groceries for admin
    - Route : `http://localhost:4040/api/v1/groceries/all`
    - Method : `GET`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - This will return all the groceries

  - Add a groceries
    - Route : `http://localhost:4040/api/v1/groceries/add`
    - Method : `POST`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - Body : 
      ```json
      {
        "name": "Tomato",
        "quantity": 4,
        "price": 20
      }
      ```
    - This will create a gricery to inventory user needs to authenticated and his role should be admin.


 ## This same api can be used by Admin to manage inventory as well as update the items
  - Update a groceries
    - Route : `http://localhost:4040/api/v2/update/:groceryId`
    - Method : `PATCH`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - This will update the gricery based on the id and return the updated grocery

  - Delete a groceries
    - Route : `http://localhost:4040/api/v2/remove/:groceryId`
    - Method : `DELETE`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - This will delete the grocery based on the id.
  

    
 
 ## All the routes below are for normal user but if you are an admin you can access these as well
 - Get available groceries
    - Route : `http://localhost:4040/api/v1/groceries/available`
    - Method : `GET`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - This will return all the available groceries with quantity greater than 0

- Book one or multiple groceries
    - Route : `http://localhost:4040/api/v1/groceries/book`
    - Method : `POST`
    - Header : `Authorization: Bearer <token>`
    - token : The token received after login
    - Body : 
      ```json
      {
        "groceries": [
            {
                "groceryId": 1,
                "quantity": 1
            },
            {
                "groceryId": 3,
                "quantity": 4
            }
        ]
      }
      ```
    - This will do the following
        - Check if the groceries are available
        - Check if the quantity requested is available
        - If all the above conditions are met, then the groceries will be booked and the quantity will be reduced
        - All the available groceries will be booked and the quantity will be reduced
        - For the groceries which are not available, the response will contain the list of groceries which are not available