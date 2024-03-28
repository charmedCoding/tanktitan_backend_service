# <img src="https://nodejs.dev/static/images/logos/nodejs-new-pantone-white.svg" height="40px"/> ✖ <img src="https://google.github.io/sqlcommenter/images/knex-logo.png" height="40px"/> Template

**Description:** This is a Node.js template based on TypeScript that includes a basic structure for a backend service.
This repository heavily relies on tsoa, a framework with integrated OpenAPI compiler to build Node.js serve-side
applications using TypeScript. tsoa applications are type-safe by default and handle runtime validation seamlessly. The
Swagger documentation is automatically generated and is provided under /docs. tsoa is based on adding necessary
information using decorators, more detailed information can be found at
[here](https://tsoa-community.github.io/docs/getting-started.html). Also [knex](https://knexjs.org/guide/) is used as a scheme and query builder for different databases. Using this template makes an additional database service redundant.

**📝 To-Do List**

- [ ] Use this awesome template!
- [ ] Customize it to my needs

If there are any questions regarding this module, feel free to contact
[Phillip Tran](mailto:phillip-thanh-vu.tran@t-systems.com).

## 🗃️ Table of Contents

[[_TOC_]]

## 🚀 Quick Start to use this template

This section is a guide that gives a quick overview of how to setup and use this module / template. It also shows how to
deploy the project to App-Agile using the Magenta Trusted Registry and a CI/CD pipeline.

### 🏭 CI/CD Pipeline

#### **Magenta Trusted Registry ([MTR](https://mtr.devops.telekom.de/))**

The Magenta Trusted Registry or MTR is a container registry service based on Quay, which was developed by the company
Red Hat. This service allows container images to be stored and managed and simplifies the use of containers in
development. It provides a user-friendly web interface and API that allows developers to publish, share and manage
container images.

We use this registry to store and manage our custom made docker images. The deployment (in app-agile) can then simply
pull the image from the registry and deploy the service.

To push and pull an image you have to either use your own account on MTR and generate a encrypted password or which is
the better option you use a bot account. Please ask an admin / someone with higher privileges and permissions to give
you the credentials to one of our bot accounts.

#### **App-Agile / OpenShift (Backend)**

App-Agile is an instance of Openshift made and hosted by telekom. The only difference between OpenShift and App-Agile is
the name (and maybe the feature set). OpenShift is a powerful platform-as-a-service that provides a simple and efficient
way to deploy, manage and scale containerized applications in a cloud-native environment with built-in support for many
popular languages and frameworks, additional features to help manage your applications and a web-based user interface,
CLI, and API to interact with it. It is built on top of Kubernetes and leverages many of its core features.

To be able to fully setup the whole project in App-Agile you need the `cluster-admin` role.

**_Deployment_**

A deployment is a way to manage and organize the running instances of your application, also known as pods. The
deployment ensures that a specified number of replicas of your application are running at all times, and it provides
mechanisms for scaling, rolling updates, and rollbacks. The deployment configuration is used to define a deployment, for
example which container image to use, the deployment strategy to use and which selector the pods should have.

To create a deployment config navigate into the `Administrator View` > `Workloads` > `DeploymentConfigs` >
`Create DeploymentConfig` > `YAML view`. Now use the following config to create deployment:

```yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
    name: node-knex-backend-nonprod # name of the deployment
    labels:
        app: node-knex-backend-nonprod # label to group all resources together (optional)
spec:
    replicas: 1 # sets the number of pods this deployment should create. Having more replicas can split the incoming traffic, which can prevent overloading the service
    revisionHistoryLimit: 10
    test: false
    selector:
        app: node-knex-backend-nonprod # used to identify a set of ressources that should be associated with each other (required)
    template:
        metadata:
            creationTimestamp: null
            labels:
                app: node-knex-backend-nonprod # label for pod
        spec:
            containers: # define what containers should run inside of the pod
                - name: container
                  image: mtr.devops.telekom.de/innolab_onsite/node-knex-backend # image that should be used inside of the container. Without a tag the default is 'latest'. The prod-application should use the 'platest'-tag.
                  ports: # which container port should be used
                      - containerPort: 8081
                        protocol: TCP
                  imagePullPolicy: Always
            restartPolicy: Always
            imagePullSecrets:
                - name: mtr-pull-secret # The credentials to pull the image from the MTR
            schedulerName: default-scheduler
```

**INFO**: Comments within the configuration are automatically removed.

**_Service_**

A Service is a way to expose your application to external clients. A service defines a stable endpoint, which allows the
pods running your application to be accessed by clients.

To create a service navigate into the `Administrator View` > `Networking` > `Services` > `Create Service`. Now use the
following config to create a service:

```yaml
kind: Service
apiVersion: v1
metadata:
    name: node-knex-backend-nonprod-service # name of service
    labels:
        app: node-knex-backend-nonprod # label to group all resources together (optional)
spec:
    ipFamilies:
        - IPv4
    ports:
        - protocol: TCP
          port: 8081 # port that external clients use to access the service
          targetPort: 8081 # the port inside of the pod the traffic should be forwarded to. For example, the backend service listens by default on 8081.
    internalTrafficPolicy: Cluster
    type: ClusterIP
    ipFamilyPolicy: SingleStack
    sessionAffinity: None
    selector:
        app: node-knex-backend-nonprod # used to identify which deployment it should be connected to (required)
```

**_Route_**

A Route is a way to expose a service to external clients, it provides a stable, external URL that clients can use to
access the service. You can also define inside of the route, if tls should be used when calling the service.

To create a route navigate into the `Administrator View` > `Networking` > `Routes` > `Create Route` > `YAML view`. Now
use the following config to create a service:

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
    name: node-knex-backend-nonprod-route # name of route
    labels:
        app: node-knex-backend-nonprod # label to group all resources together (optional)
spec:
    host: node-knex-backend-nonprod.telekom.de # host / url that can be called to access the service
    path: /api # path where the service should be available at. for example localhost:8081/api
    to:
        kind: Service
        name: node-knex-backend-nonprod-service # name of service the route should point at
        weight: 100
    port:
        targetPort: 8081 # Which port the service is avaible at
    tls: # adds encryption (https)
        termination: edge
        insecureEdgeTerminationPolicy: Redirect
    wildcardPolicy: None
```

**_Secrets_**

Secrets are a way to securely store and manage sensitive information like passwords, tokens, or certificates, that your
application need in order to run, these can help to improve security, portability, scalability and ease of management of
your applications.

You can either create a separate secret for each piece of information/topic or create an entire config for that
environment. For example the nonprod environment. In the following there is an example to create a whole configuration
for the nonprod environment.

To create a secret navigate into the `Administrator View` > `Workloads` > `Secrets` > `Create` > `Key/value secret`. Now
you can name your secret as you want. For example `app-config-nonprod`. For each information you create a new key/value
pair by clicking the `Add key/value` button.

Define each environment variable as needed, like the `DATABASE_CONNECTION_STRING`. Maybe you have to set up the database
before, if no external one is used. Be sure to read the documentation below to learn about which environment variables
are needed and what their default value is. The `NODE_ENV` for example is already defined and has the default value
`development`. But in this case we want to set the `NODE_ENV` to the value of `nonprod`.

Another secret apart from the environment variables that must be set is the `mtr-pull-secret` (name can be changed, but
is not recommended). An image pull secret is a special form of a key/value secret. Because of the special form, this
secret can't be added to the `app-config-nonprod`.

To create one choose the `Image pull secret` in the creation context instead of the `Key/value secret`. Type in the name
`mtr-pull-secret`. As `Registry server address` type in the url of the Magenta Trusted Registry
(`mtr.devops.telekom.de`). And lastly, give the credentials for the botuser who has the rights to pull images from the
MTR. The `mtr-pull-secret` is already applied inside of the deployment config.

To apply the other secrets open the deployment config and navigate to the `environment` tab. Then click on the button
`Add from ConfigMap or Secret`, type in the name of the variable and choose the resource (`app-config-nonprod`) and the
key.

Example:

```
Name of value: DATABASE_CONNECTION_STRING
Resource: app-config-nonprod
Key: DATABASE_CONNECTION_STRING
```

#### **App-Agile / OpenShift (Database)**

Here is an example on how to create a deployment for a PostgreSQL Database in App-Agile:

**_Volume Claim_**

A Persistent Volume Claim is a way to request storage resources from the OpenShift cluster. PVCs allow you to request a
specific amount of storage resources, and they are used to provide storage to your pods. Once a PVC is created and bound
to a specific Persistent Volume on the cluster, it provides a way for your pods to access that storage. It can be used
to store data that should survive the pod being deleted, or when the pod is redeployed.

To create a PersistentVolumeClaim navigate into the `Administrator View` > `Storage` > `PersistentVolumeClaims` >
`Create PersistentVolumeClaim` > `Edit YAML`. Now use the following config to create a service:

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
    name: node-knex-data-nonprod # name of volume
    finalizers:
        - kubernetes.io/pvc-protection
spec:
    accessModes:
        - ReadWriteOnce
    resources:
        requests:
            storage: 2Gi # how much storage should be claimed
    storageClassName: gp2
    volumeMode: Filesystem
```

**_Deployment_**

```yaml
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
    name: node-knex-database-nonprod
    labels:
        app: node-knex-database-nonprod
spec:
    replicas: 1
    selector:
        app: node-knex-database-nonprod
    template:
        metadata:
            creationTimestamp: null
            labels:
                app: node-knex-database-nonprod
        spec:
            volumes:
                - name: node-knex-data-nonprod # name of volume
                  persistentVolumeClaim:
                      claimName: node-knex-data-nonprod # name of claimed volume
            containers:
                - resources:
                      limits:
                          memory: 512Mi
                  name: node-knex-database-nonprod
                  livenessProbe: # check if the container is still alive, if not start / restart it
                      exec:
                        command:
                            - /usr/libexec/check-container
                            - "--live"
                        initialDelaySeconds: 120
                        timeoutSeconds: 10
                        periodSeconds: 10
                        successThreshold: 1
                        failureThreshold: 3
                  env:
                      - name: POSTGRESQL_USER
                        valueFrom:
                            secretKeyRef:
                                name: app-config-nonprod
                                key: DATABASE_USER
                      - name: POSTGRESQL_PASSWORD
                        valueFrom:
                            secretKeyRef:
                                name: app-config-nonprod
                                key: DATABASE_PASSWORD
                      - name: POSTGRESQL_DATABASE
                        valueFrom:
                            secretKeyRef:
                                name: app-config-nonprod
                                key: DATABASE_NAME
                  ports:
                      - containerPort: 5432
                        protocol: TCP
                  imagePullPolicy: IfNotPresent
                  volumeMounts: # define volume mounts
                      - name: node-knex-data-nonprod
                        mountPath: /var/lib/pgsql/data
                  image: >-
                      image-registry.openshift-image-registry.svc:5000/openshift/postgresql@sha256:a49b7d567962fae7cb0749a11f81dc8a0c9470a909a56b81da49240f55aea5de
            restartPolicy: Always
            schedulerName: default-scheduler
```

**_Service_**

```yaml
kind: Service
apiVersion: v1
metadata:
    name: node-knex-database-nonprod-service
    labels:
        app: node-knex-database-nonprod
spec:
    ipFamilies:
        - IPv4
    ports:
        - protocol: TCP
          port: 5432
          targetPort: 5432
    internalTrafficPolicy: Cluster
    type: ClusterIP
    ipFamilyPolicy: SingleStack
    sessionAffinity: None
    selector:
        app: node-knex-database-nonprod
```

**_Secrets_**

Define a new secret containing the following key/value pairs. You can either put them inside of the `app-config-nonprod`
or create a new secret for this. These values are needed to create a superuser and the database itself. If you want you
can change the names of each key, but make sure to apply them correctly afterwards.

```
DATABASE_USER: <NAME OF DATABASE_USER>
DATABASE_PASSWORD: <PASSWORD OF DATABASE_USER>
DATABASE_NAME: <NAME OF THE DATABASE CONNECTING TO>
```

Apply the secrets to the deployment, if not already done. Make sure to use the following namings. The PostgreSQL image
that is used has defined these names as default and will look for it, when creating the database:

```
ENVIRONMENT_VARIABLE -> SECRET_KEY

POSTGRESQL_USER -> DATABASE_USER
POSTGRESQL_PASSWORD -> DATABASE_PASSWORD
POSTGRESQL_DATABASE -> DATABASE_NAME
```

If everything is applied and set and you want to connect to the database, change the `DATABASE_CONNECTION_STRING`-secret
to the following value. Keywords inside `{}`-brackets are variables. Replace those with the correct information. Inside
the cluster you can use the service name of the database as host.

```
postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_SERVICE_NAME}:5432/{DATABASE_NAME}
```

**_Rollout_**

To start the database, you have to manually rollout the deployment. To do this navigate into the `Administrator View` >
`Workloads` > `DeploymentConfigs` > _`Click on your Database DeploymentConfig`_ > `Actions` > `Start rollout`

#### **Dockerfile**

The `Dockerfile` is used to create a new custom image based on one or more existing images. In this case two node images
are used as the foundation. One is only used to build the project, the other is the final base image.

In the first stage it installs all dependencies needed, then builds the whole project, compiling all ts-files into
js-files into the `build`-directory.

In the second step there is a clean install of all dependencies and only the output of the build process is copied into
the other image, which is also the final base image. This reduces the size of the image since it does not contain the
`src` folder or other unnecessary files. Starting this image inside of a container triggers the "npm start" command, if
no other command was passed as parameter at startup.

**INFO**: Due to a bug in previous versions there is a permission issue, when using the node-18 version. This bug is
fixed by creating the '`.npm`'-directory and apply the right permissions. This is already implemented inside of the
`Dockerfile`.

#### **GitLab CI/CD**

The `.gitlab-ci.yml`-file is is the configuration for the CI/CD pipeline. It automates the process of building, testing
and deploying software changes. The goal of the pipeline is to catch and resolve issues as early as possible and to
deploy changes to production as quickly and safely as possible.

**_Variables_**

Variables are defined directly within the configuration and are used to make changes to values quickly in one place.
They are often used for values that are used more than once or may change several times. Inside of the
`.gitlab-ci.yml`-file all variables can be found under the `variables` section.

Variables can be called by prefixing them with a `$`-symbol.

**_Secrets_**

Secrets are also variables, but they are not defined inside of the configuration file and have special properties. You
can define secrets within a repository or a whole group of repositories.

To define a secret navigate to your project / group > `Settings` > `CI/CD` > `Variables` > `Expand` > `Add variable`

Secrets can also be called by prefixing them with a `$`-symbol.

The following secrets must be set to make the pipeline working:

-   MTR_PUSH_USER
-   MTR_PUSH_PASSWORD
-   MTR_APPLICATION_TOKEN
-   APP_AGILE_SERVER
-   APP_AGILE_TOKEN

The `MTR_PUSH_USER` is the username of the account at MTR with push privileges / permissions. It is recommended to use a
botaccount!

The `MTR_PUSH_PASSWORD` is the encrypted password of the `MTR_PUSH_USER`

The `MTR_APPLICATION_TOKEN` is an OAuth Token used to authenticate against the MTR REST API. This is needed to modify the expiration date of a tag. This token can only be created if you are an owner of the organization your repository is in. To create one navigate into `REPOSITORIES` > On the right side choose your repository > `Applications` > `Create New Application`. After creating the application click on it and go to the `Generate Token` tab. Tick the box `Read/Write to any accessible repositories` to grant view, push and pull permissions and hit `Generate Access Token`. Click on `Authenticate` and after that the token is shown.

The `APP_AGILE_SERVER` is the AppAgile host / url the pipeline should connect to. It can be found by going to the
AppAgile instance > _`Click on your name`_ > `Copy login command` > _`Authenticate yourself`_ > `Display Token`. There
you can find it at `Log in with this token` behind the `--server` flag. Copy the whole url and use it as
`APP_AGILE_SERVER` value.

The `APP_AGILE_TOKEN` is the authentication token for connecting to the App-Agile server. You can use your personal
token, but it expires within a day. The personal token can be found by following the steps above, such as. how to find
the app agile server.

Another method is to use ServiceAccounts. These tokens don't expire and can be used unlimited times. To create one
navigate into the `Administrator View` > `User Management` > `ServiceAccounts` > `Create ServiceAccount`. Type in the
name and create it. Now navigate into the `Workloads` > `Secrets`-section and search for your newly created
service-account with `token` inside of the name. Go to the Data Section and reveal all values. Copy the `token` and use
it as `APP_AGILE_TOKEN`.

Before you can use the ServiceAccount you have to create a role-binding to this account. To be able to create one you
need the role of a `cluster-admin`. Navigate into the `Administrator View` > `User Management` > `RoleBindings` >
`Create Binding`. Fill in the information as follows:

```
Rolebinding:
    Name: <UNIQUE_IDENTIFIER>
    Namespace: <PROJECT_NAME>

Role:
    Role name: edit

Subject: ServiceAccount
    namespace: <PROJECT_NAME>
    name: <Name of ServiceAccount>
```

**INFO**: Similarly all prod variables must be set. (same names with `_PROD` as suffix)

**_Stages_**

In the example `.gitlab-ci.yml`-file there are three stages. **

_Quality Check Stage_

The quality check stage is split in different jobs / steps. These are processed in parallel and are responsible for
ensuring that the service is fully functional and that there are no security gaps. Firstly, a vulnerability check is
performed and if a vulnerability, with auditlevel critical is encountered, an error message is returned and the pipeline
fails. Secondly ESLint is executed which checks for the code quality and security issues. And lastly the API endpoints are tested. For this purpose a Postgres database service is set up, which is deleted
directly after the execution of this job. This job is executed as follows:

1. Create the database as a service
2. Install all dependencies
3. Generate the API routes and endpoints
4. Apply all migrations and the `DummyData` seed to the database service
5. Run Jest to test all endpoints


_Build Stage_

1. Install cURL to be able to send http requests
2. Login to the docker registry (MTR)
3. Build the custom docker image based on the `Dockerfile`. One tag of this build has the `CI_PIPELINE_ID` attached. This will create a new version of this image, instead of overwriting an exisiting one. This way previous versions can still be retrieved. The other tag that will be created is the `latest` tag which overwrites the current `latest` tag on the MTR Registry.
4. Push image to the registry
5. Send request to the MTR API and change the expiration date of latest to `never`. This is a workaround solution to be able to overwrite the expiration date label of the image and beeing able to build and push only one image to save resources. This way the security scan in MTR is only running once for both tags.

Here is an simplified example to make clear, what is meant with versioning the images. The `CI_PIPELINE_ID` is normally
not just `v1` or `v2`!

```
image:latest == image:v2
image:v2
image:v1
```

Creating a new image with the `v3`- and `latest`-tag will update the versions as follows:

```
image:latest == image:v3
image:v3
image:v2
image:v1
```

As you can see the `image:v3` is added as a new version but not overwriting any other versions. The image with the
`latest`-tag on the other hand got replaced with the newest version. In this case it is the `image:v3` version.

_Deploy Stage_

1. Login to openshift (App-Agile)
2. Select the project
3. Rollout the latest deployment of our service (backend)

### 🌈 Styling and Naming

When you work with large projects, it's important that you remain consistent throughout the codebase and follow the best
practices. To guarantee the quality of your codebase, you need to analyze different levels of the applications code.

#### **Clean Code**

This is the most abstract level of code standardization. It's related to the implementations independent of the
programming language. It will help the readability of your code.

[Clean Code Javascript](https://github.com/ryanmcdermott/clean-code-javascript)

#### **Code Quality with ESLint and Prettier**

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

By using Prettier you don’t have to worry about adding or removing space or moving code to the second line if it does
not fit on one line. Prettier does that job for you. It can be configured accordingly in most IDEs.

**INFO**: We are using the prettier-plugin from ESLint, therefore the configuration of prettier can be found inside of the `.eslintrc.js`-file.

**VS-Code**

1. Install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension for VS Code which formats code written in Javascript, Angular, Vue, React, Typescript and many other languages.
2. Create a `.vscode` folder on root level and inside a `settings.json` file
3. Add the following content to the newly created file:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
}
```

**Execute Linting manually**

To check for problems in your code:
```
npm run lint
```

To let ESLint automatically fix (most) od the problems:
```
npm run lintfix
```

#### **Naming**

For Namings inside of the Node.js project the JavaScript Naming Conventions are used.

[JavaScript Naming Conventions](https://www.30secondsofcode.org/articles/s/javascript-naming-conventions)

However, an exception applies if you are using for example MySQL or PostgreSQL as database, the naming convention there
is `snake_case`. When defining a type or entity for the database make sure to use a consitent naming convention. For
example:

```ts
export interface Example {
	id: number
	title: string
	description?: string
	secret_phrase: string
	weather: "sunny" | "rainy" | "cloudy"
	public: boolean
}
```

Although this type is defined within Node.js, at some point it has to be passed to the database. Therefore, the naming
must be consistent both in the database and inside the node application. This allows the backend to pass the data
submitted by the user to the database without further transformation.

**INFO:** Everything below this section can stay in your project as documentation.

## 💻 Project Setup

To run this service locally on your computer, you need to perform the following steps:

**0. Set environment variables**

This step has to be done only once for all setups (project, development and test setup)

Create a `.env`-file inside of the project and define the following environment variables: :

```
NODE_ENV="development"
DATABASE_CONNECTION_STRING="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/"
DATABASE="<DATABASE>"
FRONTEND_ORIGIN="http://localhost:8080"
PORT=8081
```

**INFO:** There is already a `.env.template` inside of this project. You can copy this file and rename it to `.env`. Do not just rename the template! Keywords inside `<>`-brackets are variables. Replace those with the correct information.

**1. Setup Database**

If you haven't setup the Database already, then first follow the instructions in the [Database Setup](#-database) section.

**2. Install dependencies**

```
npm install
```

**3. Build project**

```
npm run build
```

**4. Run service locally**

This command will implicitly check for the current migration state of the database and updates automatically, if there
is a new version.

```
npm start
```

**5. Use of service**

If you haven't changed the default settings like the path of the documentation and the port, then you are able to access
the service via this URL:

```
localhost:8081/api/docs
```

## 🔨 Development

### ⚙ Setup for Development

To further develop this service, you have to follow the instructions mentioned here:

**1. Setup Database**

If you haven't setup the Database already, then first follow the instructions in the [Database Setup](#-database) section.

**2. Install dependencies**

```
npm install
```

**3. Run service on development**

This will start the service on development. It checks for changes inside of the `src`-folder, rebuilds the tsoa-files on
change and restarts the service automatically:

```
npm run dev
```

**4. Use of service**

Open the following url, to use the service and get a documentation of all existing endpoints:

```
localhost:8081/api/docs
```

### 🗄️ Project Structure

This project structure is really basic and will grow based on the needs of your project. Don't see this as a strict
structure, more like a rough orientation on how the structure could look like.

```sh
tests                   # contains all tests made for this project
|
src
|
+-- controllers         # controllers define an endpoint and contain high level functionalities
|
+-- database            # knex migrations and seeds
|
+-- services            # services extract low functionality like database queries
|
+-- types               # base types used accross the application
|
+-- utils               # predefined functions and constants
|
+-- index.ts            # defines and contains the whole service
|
+-- knexfile.ts         # knex connection configuration
|
+-- server.ts           # main file that is run when the service is started
```

## 💾 Database

### ⚙ Setup

**1. Download & Install PostgreSQL**

[DOWNLOAD LINK](https://postgresql.org/download/)

Remember you password for the superuser (postgres). Also use the default port (:5432), otherwise you have to adjust it
everywhere.

**2. Add `bin` and `lib` folder of PostgreSQL to `PATH`**

The paths to those directories can look like this for example:

```
C:\Program Files\PostgreSQL\14\bin
C:\Program Files\PostgreSQL\14\lib
```

**3. Create Database**

1. Open pgAdmin4
2. Type in your password for the superuser
3. Doubleclick `servers` on the left sidebar
4. Rightclick `Databases` > `Create` > `Database...`
5. Type in the name: `<DATABASE>` and save it
6. Apply latest migrations with knex. Check the knex section to do so.

### 👷🏽 Knex

Knex is used as a scheme builder and query builder. It creates the whole database scheme and is responsible for all
transactions.

To use any knex commands navigate inside of the `src`-folder. We are using npx to execute commands without requiring to
install knex globally. 

**INFO**: Make sure that all dependencies have been installed before executing any knex commands. Also keep in mind that knex also uses environment variables to perform any actions.

#### **Migrations**

Migrations are used to define transactions / schemes that are applied only once to the database. Knex checks if
migrations are already applied to given database and skips them. If there are new Migrations, for example updates of the
scheme, they will be applied.

_Create Migration_

```
npx knex migrate:make <NAME>
```

_Apply latest version_

This command will implicitly executed when starting the local server. If you are in development, you have to execute
this command manually.

```
npx knex migrate:latest
```

_Apply next version_

```
npx knex migrate:up
```

Rollbacks aren't defined yet.

#### **Seeds**

Seeds are used to define transactions that can be applied more than once. It is used to fill the database for example.
Seeds run in alphabetical order.

_Create Seed_

```
npx knex seed:make <NAME>
```

_Run ALL Seed files_

```
npx knex seed:run
```

_Run specific Seed file_

```
knex seed:run --specific=<NAME>.ts --specific=<ANOTHER_NAME>.ts
```

## 💬 Logging

All requests sent to the API will be logged into the console. This is achieved with the help of the `log4js` module and
the integrated `connectLogger` function. This function is used as a middleware and can therefore be easily implemented.

Currently the logging-message looks as follows:

```
{"logCategory":"http request", "logLevel":"INFO", "body":{"httpMethod":"GET", "url":"/api/examples", "statusCode":200, "processTimeMS":42}}
```

The reason it's in the form of a JSON string is because we use GrayLog to provide analytics on traffic and other
metrics. GrayLog can use extractors to take this JSON string and extract the properties of it. This can then be used to
filter out which endpoint was accessed, whether it was successful, and how long it took.

## 🧪 Testing

We are using `ts-jest` and `supertest` to test all our api-endpoints. To avoid complications the "normal" database is
not changed, but the default database `postgres` is used. There, the migrations are first loaded and then the
`DummyData`-seed is applied. Then all tests are executed and afterwards the whole database is cleaned up.

The pipeline itself runs all the tests, when pushing to the `main` or `production`-branch. Anyway to avoid any problems
run all test locally first, before pushing to the remote repository.

To run the tests follow the instructions:

**1. Build the project**

```
npm run build
```

**2. Execute the tests**

```
npm run localtest
```
