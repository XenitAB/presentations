# TASK #02 - Using shell in a container

## Description

We will start a web server in the background and then start another container in the foreground and using the container shell, access the web server.

## Creating a shared network for the containers

Create a shared network for the containers:

```
docker network create --driver bridge ARPANET
```

## Starting a web server

Same procedure as last time, but without exposing the port:

```shell
docker pull nginx:1.19
docker run --network ARPANET --name web-server -d nginx:1.19
```

## Starting a plain Debian container in interactive mode

We need to download the latest Debian image:

```shell
docker pull debian:buster
```

Now start the Debian container in interactive mode:

```shell
docker run --network ARPANET --rm --name web-client -it debian:buster /bin/bash
```

From the shell in the container, download `curl`:

```shell
apt-get update
apt-get install -y curl
```

Validate that you are able to access the web server from the shell:

```shell
curl -v http://web-server
curl -v http://web-server/non-existant-page
```

Exit the container shell:

```shell
exit
```

### Cleanup

Cleanup the things you created:

```shell
docker stop web-server
docker rm web-server
docker network remove ARPANET
```

Validate that no containers are running:

```shell
docker ps
```

You've now used two containers at the same time and accessed resources between them with their hostnames. Good job! 🙌

# Next Task

Click [here](TASK-03.md) to go to the next task.

# Go back

Click [here](../README.md) to go back to task overview.
