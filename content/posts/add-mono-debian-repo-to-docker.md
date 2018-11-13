---
title: "Adding the Mono repository to a Docker container"
date: 2018-11-12T20:25:24-05:00
anchor: "Adding the Mono repository to a Docker container"
type: "post"
---

Running Debian 9 and need to install the `mono` repository? You'll find advice for 8 that suggests using the following:

<!--more-->

```
sudo apt install apt-transport-https dirmngr
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb https://download.mono-project.com/repo/debian stable-stretch main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt update
```

When it comes time to `docker build`, you might see the following:

```
Step 6/12 : RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys A6A19B38D3D831EF
 ---> Running in abbbdefb9d15
Executing: /tmp/apt-key-gpghome.GbZgRWnneE/gpg.1.sh --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys A6A19B38D3D831EF
gpg: cannot open '/dev/tty': No such device or address
The command '/bin/sh -c apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys A6A19B38D3D831EF' returned a non-zero code: 2
```

Don't despair! The following command (replacing the `apt-key adv` command) will get you going:

```
RUN curl https://download.mono-project.com/repo/xamarin.gpg | apt-key add -
```