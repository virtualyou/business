# business 

This project is a NodeJS/Express REST API that utilizes a relational database
MariaDB for its data and persistence. The endpoints are protected using JWT and
ROLE authorization for use with the VirtualYou Web application.

### Endpoints
#### Admin Only (ROLE_ADMIN + JWT Auth)
- /business/v1/members POST 

#### No Auth
- /api-docs Swagger API Specification

**NOTE**: There will probably be more resources and endpoints however, this is the
current list of endpoints prior to hosting and feature iterations. (Jan 9 2023)

### Prerequisites

Node and NPM are required on your system prior to building or running this
application locally. You can however, download NodeJS and with that installation
you get of Node Package Manager (NPM).

If you do not have NodeJS, you can get it here: https://nodejs.org/en/download/

### Build

A NodeJS/Express application has NPM dependencies but this software repository
is not the venue to host them. This project however, has a `package.json` file
that specifies these dependencies and the NPM utility can be used to populate
your `personal` code base with the dependencies it needs.

```shell
npm install
```

This command when run at the parent directory Node Package Manager (NPM) will
download and install all the application's dependencies locally in a folder
or directory called `node-modules`. Once everything is in place, you need to
verify a database for the application is in place. Database configuration is 
discussed below.

Assign the following ENV variables for our localhost testing.

```shell
export DB_HOST='localhost'
export DB_USERNAME='root'
export DB_PASSWORD='mariadbAdmin123'
export DB_SCHEMA='virtualyou'
```

With our exports in place and the Node dependencies downloaded, we can now start
the `personal` API application on localhost.

```shell
npm start
```

You should see output like so:

```shell
> node index.ts

Server is running on port 3008.
```

# business
