# GoofySeRA

[![Deploy in production](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_prod.yml/badge.svg?branch=prod)](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_prod.yml) [![Deploy develop branch](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_develop.yml/badge.svg?branch=develop)](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_develop.yml) [![CodeQL](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/github-code-scanning/codeql/badge.svg?branch=develop)](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/github-code-scanning/codeql)

Webapp for managing online music course production in the case of Saline Royale Academy requirements.

---

> :warning: **About git commits**: An interactive rebase has been executed at some point in the development process, so it's best to rely on the _commits authors_ before the commits executors.

---

## Demo environment

You can access the web app with the following urls:

| Environnement | URL                                                                  | Cursus Director email    | Cursus Director password | STATUS                                                                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------- | ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Develop       | [https://develop-sera.stroyco.eu/](https://develop-sera.stroyco.eu/) | cursus_director@sera.com | password                 | [![Deploy develop branch](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_develop.yml/badge.svg)](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_develop.yml)      |
| Production    | [https://sera.stroyco.eu/](https://sera.stroyco.eu/)                 | admin@sera.com           | password                 | [![Deploy in production](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_prod.yml/badge.svg?branch=prod)](https://github.com/GoofyComponent/GoofySeRA/actions/workflows/deploy_prod.yml) |

> **Notes**: For the develop environment, you can also use the following credentials with password - `password`:
>
> - `cursus_director@sera.com` for the _Cursus Director_ role
> - `project_manager@sera.com` for the _Project Manager_ role
> - `professor@sera.com` for the _Professor_ role
> - `video_team@sera.com` for the _Video Team_ role
> - `video_editor@sera.com` for the _Video Editor_ role
> - `transcription_team@sera.com` for the _Transcription Team_ role
> - `traduction_team@sera.com` for the _Traduction Team_ role
> - `editorial_team@sera.com` for the _Editorial Team_ role

---

## Deploys

### Deploy on localhost

_Launch with seeders and default .env file_

#### Windows based OS

**Make sure you have [Docker](https://www.docker.com/), [WSL2](https://learn.microsoft.com/windows/wsl/install) (Ubuntu distro) installed.**

1. Start a WSL2 Ubuntu terminal and run the following commands:

```bash
sh dev.sh
```

#### linux based OS

**Make sure you have [Docker](https://www.docker.com/) installed.**

1. Run the following commands:

```bash
sh dev.sh
```

---

## Contributors

- [@DestroyCom](https://github.com/DestroyCom)
- [@ADR1811](https://github.com/ADR1811)
- [@lucag322](https://github.com/ADR1811)
- [@ThomAzgo](https://github.com/ThomAzgo)
- [@Hiteazel](https://github.com/Hiteazel)

:wink: :wink:
