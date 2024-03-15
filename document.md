# KOMANG SHOP

This documentation provides an overview of the key functionalities and endpoints of the E-Commerce application API.

## Register

***Request***

`POST /register/v1`

Body
```
{
    "first_name": "string",
    "last_name": "string",
    "phone": "string",
    "email": "string",
    "password": "string",
    "address": "string",
    "city": "string",
    "postal_code": "string",
    "country_code": "string"
}
```

Header
```
{
    Not Need
}
```

***Response (200 - OK)***

```
{
    "success": true,
    "message": "Cek Your Email For Verify!!",
    "status_code": 200,
    "data": {
        "name": "karmini",
        "email": "karmininengah6@gmail.com"
    }
}
```

***Response (400 - BAD REQUEST)***

```
{
    "success": false,
    "message": "Input Email & Password",
    "status_code": 400,
    "data": null
}
```

***Response (409 - CONFLICT)***

```
{
    "success": false,
    "message": "Email Already Exist!",
    "status_code": 409,
    "data": null
}
```

***Response (400 - BAD REQUEST)***

```
{
    "success": false,
    "message": "Input Email & Password",
    "status_code": 400,
    "data": null
}
```

## Login

***Request***

`POST /login/v1`

Body
```
{
    "email": "string",
    "password": "string"
}
```

Header
```
{
    Not Need
}
```

***Response (200 - OK)***

```
{
    "success": true,
    "message": "Login Succcess! 👏",
    "status_code": 200,
    "data": {
        "token": "string"
    }
}
```
***Response (404 - NOT FOUND)***
Your Email Not Found At System

```
{
    "success": false,
    "message": "Email Not Found!",
    "status_code": 404,
    "data": null
}
```

***Response (400 - BAD REQUEST)***
You Must Verify Your Email And Login Again

```
{
    "success": false,
    "message": "Please Verify Your Email!",
    "status_code": 400,
    "data": null
}
```

***Response (401 - Unauthorized)***
Your Password Wrong

```
{
    "success": false,
    "message": "Incorrect Password! 👎",
    "status_code": 401,
    "data": null
}
```

## Create Order

***Request***

`POST /order/v1/:user_id`

Params
```
{
    "user_id": number
}
```

Body
```
{
    "item_id": number,
    "quantity": number
}
```

Header
```
{
    Authorization : token
}
```

***Response (201 - Created)***

```
{
    "success": true,
    "message": "Order created successfully",
    "status_code": 201,
    "data": {
        "id": "string",
        "user_id": number,
        "total_order_price": "string",
        "status_order": "string",
        "date_order_placed": "2024-02-02 22:18:13",
        "date_order_paid": null,
        "items": [
            {
                "id": number,
                "item_name": "string",
                "item_image": "string",
                "item_description": "string",
                "item_stock": number,
                "item_price": "string",
                "order_items": {
                    "quantity": number,
                    "total_amount": "string"
                }
            }
        ]
    }
}
```

***Response (404 - Not Found)***

```
{
    "success": false,
    "message": "Item Not Found",
    "status_code": 404,
    "data": null
}
```

## Insert Item

***Request***

`POST /create/item/v1`

Params
```
{
    Not Need
}
```

Body
```
{
    "item_name": "string",
    "item_image": "string",
    "item_description": "string",
    "item_stock": number,
    "item_price": number
}
```

Header
```
{
    Not Need
}
```

***Response (201 - Created)***

```
{
    "success": true,
    "message": "CREATE ITEM SUCCESS!",
    "status_code": 201,
    "data": {
        "id": 5,
        "item_name": "string",
        "item_price": "string",
        "item_image": "string",
        "item_stock": number,
        "item_description": "string",
        "created_at": "2024-02-02 22:32:9",
        "updated_at": "2024-02-02 22:32:9"
    }
}
```



















