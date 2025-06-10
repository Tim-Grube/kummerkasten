# Generating Process from Zero
```
go mod init github.com/Plebysnacc/kummerkasten
go mod tidy
go get github.com/99designs/gqlgen@v0.17.24
gqlgen init
gqlgen generate
go run github.com/99designs/gqlgen init
go run ./server.go
```

# Running the Server 
In the server folder:

```
go mod tidy
gqlgen generate
make migrate-down
make migrate-up
go run ./server.go
```

# Current Backend implemented
- Basic Database Structure included

## Database
```
cp env env.local
```
Edit the `env.local` to custom Postgres Initials

### Setup Local Postgres Instance
```

```


## Queries
### User
Only possible query currently:

```
query {
  user(id: "1") {
    id
    mail
    firstname
    lastname
    role
    createdAt
    lastModified
  }
}
```

```
query {
  users {
        firstname
  }
}
```

```
query {
  addUser(user: {firstname:"miau", lastname:"mreow", mail: "miau@mathphys.info", role:"user"}){
    firstname
  }
}
```

With dummy User currently