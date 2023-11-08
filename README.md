# Back-end for Midterm Web Advanced Course

## Author
* Name: Nguyen Van Hai
* GH: [nvhai248](https://github.com/nvhai248)

## Structure of User
```
User: {
    _id: mongo generated,
    full_name: String,
    username: String,
    password: String,
    created_at: String,
    updated_at: String,
    email: String,
    phone_number: String,
    birthday: String,
    social_id: String,
    address: String
}
```

## s

* `POST /user/login`: Sign in to the application.
    
    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
        "token": "..."
    }
    ```

* `POST /user/register`: Sign up to the application

    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
    }
    ```
* `DELETE /user/logout`: Log out from the application

    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
    }
    ```

    If user is logged out, the token will be deleted from the database.

* `GET /user/profile`:  Get the user's profile.

    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
        "data" : {
            ...
            //user profile data
        }
    }
    ```
   
* `PATCH /user/profile`:  Update the user's profile.

    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
        "data" : {
            ...
            //Updated user profile data
        }
    }

* `POST /upload/image`:  Upload the image with key `file`.

    Failure:

    ```
    {
        "statusCode": 400 - 500,
        "message": "...",
    }
    ```

    Success:

    ```
    {
        "statusCode": 200 - 300,
        "message": "...",
        "data" : {
            ...
            //Data image
        }
    }