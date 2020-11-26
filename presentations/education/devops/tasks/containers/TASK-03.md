# TASK #03 - Building a container

## Description

Now we will build our own container based on the same web server, but add something nice to it!

## Creating a Dockerfile

Create a Dockerfile: (note: name it `Dockerfile` in your current directory)

```Dockerfile
FROM nginx:1.19 as runtime
RUN echo "Advanced configuration started."
RUN echo "<!DOCTYPE html><html><head><title>ezy pezy</title></head><body><h1>This is too easy!</h1></body></html>" > /usr/share/nginx/html/index.html
RUN echo "Configuration completed."
```

## Building the container image

Build the container image:

```shell
docker build -t my-container-web-server:latest .
```

## Starting the new container image

We will start it the same way we did in the first task:

```shell
docker run --name web-server -p 8080:80 -d my-container-web-server:latest
```

Open your browser and verify that you can see the new beautiful webpage when going to [http://localhost:8080](http://localhost:8080).

## Cleanup

Stop the web server:

```shell
docker stop web-server
docker rm web-server
```

Remove the image you built:

```shell
docker image rm my-container-web-server:latest
```

# Next Task

This was the last task. Want to try something with Kubernetes? Go [here](https://www.katacoda.com/courses/kubernetes/guestbook) (login required, but free).

# Go back

Click [here](../README.md) to go back to task overview.
