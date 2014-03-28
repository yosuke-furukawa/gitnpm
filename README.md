gitnpm
======================

npm wrapper for not npm modules

npm could install library from some git repositories.
but npm user should set the library like this.

```shell
$ npm install git+ssh://git@github.com:yosuke-furukawa/gitnpm.git#master
```

this is so long....

*`gitnpm`* could make the command shorter.

```shell
$ gitnpm install yosuke-furukawa/gitnpm
// npm install git+ssh://git@github.com:yosuke-furukawa/gitnpm.git#master
```

```shell
$ gitnpm install yosuke-furukawa/gitnpm v0.1.0
// npm install git+ssh://git@github.com:yosuke-furukawa/gitnpm.git#v0.1.0
```

Install
======================

```shell
$ npm install gitnpm -g
```
