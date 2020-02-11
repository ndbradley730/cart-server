### To get this running:

```
docker build -t cart-server .
docker run -p 8080:8080 cart-server
```

Note that several shortcuts were taken here:

- No support for multiple users
- Writing the current shopping cart to a file instead of a DB
- No use of React/Angular/etc - all jQuery
- Hardcoding items in items.json
- One big .js file for the client - should be split up
