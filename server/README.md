# Generating Process from Zero
- go mod init github.com/Plebysnacc/kummerkasten
- go mod tidy
- go get github.com/99designs/gqlgen@v0.17.24
- gqlgen init
- gqlgen generate
- go run github.com/99designs/gqlgen init
- go run ./server.go

# Running the Server 
In the server folder:

gqlgen generate
go run ./server.go

# Current Backend implemented
- Basic Database Structure included

## Queries
### User
Only possible query currently:

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

With dummy User currently