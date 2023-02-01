---
title: Command Snippets
tags:
  - note
  - snippets
  - active
---

:::info
Migrated from old blog
:::

<!--truncate-->

## 代理切换

```bash
export PROXY_URI=127.0.0.1:7890
alias proxy-on='export http_proxy=${PROXY_URI} https_proxy=${PROXY_URI}'
alias proxy-off='export http_proxy= https_proxy='
```

## 简单的命令行选项

```bash
while [[ "${@}" != 0 ]]; do
    case "$1" in
        -h | --help) # flag option
            echo $usage
            ;;
        --install) # feature option
            mode="install"
            ;;
        --uninstall)
            mode="uninstall"
            ;;
        -p | --param) # option with parameter
            shift
            param="$1"
            ;;
    esac
    shift
done
```

## Confirm

```bash
confirm() {
    if [[ "$2" == "y" ]]; then
        hint="[Y|n]"
    elif [[ "$2" == "n" ]]; then
        hint="[y|N]"
    fi
    while true; do
        echo -n "❯ $1 ${hint:="[y|n]"} "
        read -r input
        case ${input:="$2"} in
            [Yy][Ee][Ss]|[Yy])
                return 0
                ;;
            [Nn][Oo]|[Nn])
                return 1
                ;;
        esac
    done
}
# confirm "delete all logs?" n && rm *.log
```

## 文件前后写

```bash
cat file | {
    echo "append as header"; cat; echo "append as footer"
} > file
```

## 换 apt 源

```bash
src="http://mirrors.tuna.tsinghua.edu.cn/ubuntu/"
code=$(lsb_release -c | cut -f2)

cp /etc/apt/sources.list /etc/apt/sources.list.bak
cat << EOF > /etc/apt/sources.list
deb ${src} ${code} main restricted universe multiverse
deb ${src} ${code}-security main restricted universe multiverse
deb ${src} ${code}-updates main restricted universe multiverse
# deb ${src} ${code}-proposed main restricted universe multiverse
# deb ${src} ${code}-backports main restricted universe multiverse
EOF
```

- 原始源 http://archive.ubuntu.com/ubuntu/
- 阿里源 http://mirrors.aliyun.com/ubuntu/
- 中科大源 https://mirrors.ustc.edu.cn/ubuntu/
- 163 源 http://mirrors.163.com/ubuntu/

## Aliases

```bash
exists() {
    type "$1" &>> /dev/null
}

if exists htop; then
    alias top=htop
fi

if exists thefuck; then
  eval $(thefuck --alias)
fi

if exists exa; then
    alias ls='exa --group --git --header'
else
    alias ls='ls -h --color=auto'
fi
alias ll='ls -l --time-style=iso'
alias la='ls -a'
alias lla='ll -a'

alias du='du -h'
alias df='df -h'
alias vi=vim
alias cls=clear
alias .=source
alias ..='cd ..'
alias ...='cd ../..'
```

## 终端颜色

```bash
declare -rA fg=( [black]="\e[30m" [red]="\e[31m" [green]="\e[32m" [yellow]="\e[33m" [blue]="\e[34m" [magenta]="\e[35m" [cyan]="\e[36m" [white]="\e[37m" [gray]="\e[90m" )
declare -r bold="\e[01m"
declare -r reset="\e[00;39;49m"

echo -e "${fg[cyan]}colorful${reset}"
```

## Prompt

```bash
# bash 与 zsh 可通用
# 若用于 bash，需要上一部分定义的变量的支持
_sprompt () {
  ret=$?; code=; venv=; point="❯"
  [[ $ret != 0 ]] && code="[${bold}${fg[yellow]}$ret${reset}] "
  [[ -n "${VIRTUAL_ENV}" ]] && venv="${fg[gray]}$(basename ${VIRTUAL_ENV})${reset} "
  [[ $SHLVL == 2 ]] && point+="❯"
  [[ $SHLVL == 3 ]] && point+="❯❯"
  [[ $SHLVL > 3 ]] && point+="${SHLVL}❯"
  echo -e "${venv}${code}${point}"
}

if [[ ! -z "$ZSH_VERSION" ]]; then
  setopt promptsubst
  PROMPT="
%B%(#.%F{red}.%F{cyan})%n%F{white}@%F{blue}%m%b %F{green}%~%f
\$(_sprompt) "
elif [[ ! -z "$BASH_VERSION" ]]; then
  alias where='which -a'
  PS1="
${bold}${fg[cyan]}\u${fg[white]}@${fg[blue]}\h${reset} ${fg[green]}\w${reset}
\$(_sprompt) "
fi
```

## Are You In China?

```bash
curl -fsS "https://www.ip.cn/ip/$(curl -fsS ipv4.ip.sb).html" | grep "中国" &>> /dev/null
# `[[ $? -eq 0 ]]` if in china
# `[[ $? -eq 1 ]]` if not
```
