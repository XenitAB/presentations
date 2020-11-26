# TASK #01 - Running a container

## Pre-requisites

- [Internet](https://en.wikipedia.org/wiki/Internet)
- [Docker](https://docs.docker.com/get-docker/)
- [Shell](<https://en.wikipedia.org/wiki/Shell_(computing)>) (we recommend [Z shell](https://en.wikipedia.org/wiki/Z_shell) for Linux/Mac)

## Description

Running containers is quite easy. We'll show you how to start a web server (`nginx`) locally on your computer and browse to it.

## How to run a container

### Starting Docker

There are multiple different ways of running a container. We'll be using Docker in this case. Make sure you have started it.

### Downloading container

To be able to run the container, you will first need to download it:

```shell
docker pull nginx:1.18
```

Verify that the container has been downloaded: (you should get some text about the contents of the image)

```shell
docker image inspect nginx:1.18
```

Example output:

```json
[
  {
    "Id": "sha256:2562b6bef9769b637d47ec31284ac0f1a7facef498ab97753623b13c502cddce",
    "RepoTags": ["nginx:1.18"],
    "RepoDigests": [
      "nginx@sha256:f35b49b1d18e083235015fd4bbeeabf6a49d9dc1d3a1f84b7df3794798b70c13"
    ],
    "Parent": "",
    "Comment": "",
    "Created": "2020-11-25T00:31:39.310179775Z",
    "Container": "cdb116adb8bb18d83fe86a49b91cefe6975514f6d53c1b63f6854ecd61840e55",
    "ContainerConfig": {
      "Hostname": "cdb116adb8bb",
      "Domainname": "",
      "User": "",
      "AttachStdin": false,
      "AttachStdout": false,
      "AttachStderr": false,
      "ExposedPorts": {
        "80/tcp": {}
      },
      "Tty": false,
      "OpenStdin": false,
      "StdinOnce": false,
      "Env": [
        "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "NGINX_VERSION=1.18.0",
        "NJS_VERSION=0.4.4",
        "PKG_RELEASE=2~buster"
      ],
      "Cmd": [
        "/bin/sh",
        "-c",
        "#(nop) ",
        "CMD [\"nginx\" \"-g\" \"daemon off;\"]"
      ],
      "Image": "sha256:7bc36a838f48068195d84d38c3cfaa6286336dbec74e99a7bfde9b916462657e",
      "Volumes": null,
      "WorkingDir": "",
      "Entrypoint": ["/docker-entrypoint.sh"],
      "OnBuild": null,
      "Labels": {
        "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
      },
      "StopSignal": "SIGQUIT"
    },
    "DockerVersion": "19.03.12",
    "Author": "",
    "Config": {
      "Hostname": "",
      "Domainname": "",
      "User": "",
      "AttachStdin": false,
      "AttachStdout": false,
      "AttachStderr": false,
      "ExposedPorts": {
        "80/tcp": {}
      },
      "Tty": false,
      "OpenStdin": false,
      "StdinOnce": false,
      "Env": [
        "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "NGINX_VERSION=1.18.0",
        "NJS_VERSION=0.4.4",
        "PKG_RELEASE=2~buster"
      ],
      "Cmd": ["nginx", "-g", "daemon off;"],
      "Image": "sha256:7bc36a838f48068195d84d38c3cfaa6286336dbec74e99a7bfde9b916462657e",
      "Volumes": null,
      "WorkingDir": "",
      "Entrypoint": ["/docker-entrypoint.sh"],
      "OnBuild": null,
      "Labels": {
        "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
      },
      "StopSignal": "SIGQUIT"
    },
    "Architecture": "amd64",
    "Os": "linux",
    "Size": 132842580,
    "VirtualSize": 132842580,
    "GraphDriver": {
      "Data": {
        "LowerDir": "/var/lib/docker/overlay2/909c7846f7b7310431aa1b64f19e9a0c9dab605904942ec32e0b32aabb84571b/diff:/var/lib/docker/overlay2/5cec52f56f2f93e6c67d9d888b1c4df2caeee927f3ef9f0c7b16e7be0cb5cf2d/diff:/var/lib/docker/overlay2/1de0ad1b1adb833211a39df5ef1bdda618a8122feb4d3d7c3a1968c0bc8b0979/diff:/var/lib/docker/overlay2/441204d3abf580478bb771aca6d7e4ca61b0ad3889940133ee039012f7ed6bc1/diff",
        "MergedDir": "/var/lib/docker/overlay2/d73e08ada4ba00831c2c65b6e2e42c1a76f843af4b755a50315961dfa77f2bb2/merged",
        "UpperDir": "/var/lib/docker/overlay2/d73e08ada4ba00831c2c65b6e2e42c1a76f843af4b755a50315961dfa77f2bb2/diff",
        "WorkDir": "/var/lib/docker/overlay2/d73e08ada4ba00831c2c65b6e2e42c1a76f843af4b755a50315961dfa77f2bb2/work"
      },
      "Name": "overlay2"
    },
    "RootFS": {
      "Type": "layers",
      "Layers": [
        "sha256:f5600c6330da7bb112776ba067a32a9c20842d6ecc8ee3289f1a713b644092f8",
        "sha256:546ff42febcb6104992d84b2d95beaa699f2952ede6bc4bdb996f02dda30f680",
        "sha256:cf91f5e8589e08c68094796ab970a77ec5f49235dce040d706f2c3f492609961",
        "sha256:4f5295ed788f7de301eb3e25bf72fcdcb5b731dab528495cfab6898bcdda3673",
        "sha256:b56dcfc4eee5dc5435639d9603fbbf40474d282bec27edbb2796820039208dde"
      ]
    },
    "Metadata": {
      "LastTagTime": "0001-01-01T00:00:00Z"
    }
  }
]
```

You can also view how the image was built using the following command:

```shell
docker image history nginx:1.18
```

You will see an output like the below: (adding `--no-trunc` to the command will show everything, but clutter up the shell)

```shell
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
2562b6bef976        38 hours ago        /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B
<missing>           38 hours ago        /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B
<missing>           38 hours ago        /bin/sh -c #(nop)  EXPOSE 80                    0B
<missing>           38 hours ago        /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B
<missing>           38 hours ago        /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB
<missing>           38 hours ago        /bin/sh -c #(nop) COPY file:08ae525f517706a5…   1.95kB
<missing>           38 hours ago        /bin/sh -c #(nop) COPY file:e7e183879c35719c…   1.2kB
<missing>           38 hours ago        /bin/sh -c set -x     && addgroup --system -…   63.6MB
<missing>           38 hours ago        /bin/sh -c #(nop)  ENV PKG_RELEASE=2~buster     0B
<missing>           8 days ago          /bin/sh -c #(nop)  ENV NJS_VERSION=0.4.4        0B
<missing>           8 days ago          /bin/sh -c #(nop)  ENV NGINX_VERSION=1.18.0     0B
<missing>           8 days ago          /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B
<missing>           8 days ago          /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>           8 days ago          /bin/sh -c #(nop) ADD file:d2abb0e4e7ac17737…   69.2MB
```

### Starting the container

Now when we downloaded the web server we can start it using the following command:

```shell
docker run --name web-server -d nginx:1.18
```

Validate that the web server is running:

```shell
docker ps
```

Stop and remove the container:

```shell
docker kill web-server
docker rm web-server
```

### Accessing the web server inside the container

We need to start the container again, but this time exposing a port that we can access using a web browser:

```shell
docker run --name web-server -p 8080:80 -d nginx:1.18
```

Open your browser and verify that you can see `Welcome to nginx!` when going to [http://localhost:8080](http://localhost:8080). Go to [http://localhost:8080/non-existant-page](http://localhost:8080/non-existant-page) and look at the version in the error. (It should say `1.18` something.)

Stop and remove the container:

```shell
docker kill web-server
docker rm web-server
```

### Upgrading your web server

Now, we'll use another version of the web server:

```shell
docker pull nginx:1.19
docker run --name web-server -p 8080:80 -d nginx:1.19
```

Open your browser and verify that you can see `Welcome to nginx!` when going to [http://localhost:8080](http://localhost:8080). Go to [http://localhost:8080/non-existant-page](http://localhost:8080/non-existant-page) and look at the version in the error. (It should say `1.19` something.)

Stop and remove the container:

```shell
docker kill web-server
docker rm web-server
```

You have now successfully started a web server and upgraded it using Docker. Congratulations! 🥳

# Next Task

Click [here](TASK-02.md) to go to the next task.

# Go back

Click [here](../README.md) to go back to task overview.
