---
title: Setting up my new computer, vim, and listening to Spotify in the terminal
date: 2022-10-07
tags:
  - spotify
  - ansible
  - vim
  - terminal life
---
# Setting up my new computer, neovim configs, and listening to Spotify in the terminal

I recently got a new laptop, and I decided that this would finally be the time that I don't set it up in a completely ad hoc way.
Previously I would install every program I needed as I needed it, with no real plan of how I would replicate the setup if I needed to move to a different machine, or wipe the current one.
Tellingly, the one thing that I _did_ make an effort to protect was my Vim config, which I've been maintaining for five years at this point (I have been a software developer for 5 years).
I want more things to be like Vim, so, I should decided to setup my computer with Ansible.

As well as having a good name (presumably from Ursula Le Guin's interplanetary communcation macguffin), Ansible is a really cool and useful tool.
It lets you write some yaml that explain things you want doing to a computer. Then it takes this recipe and runs the specified commands.
So for example I have the following command to download the codebase of my personal website, where I wrote this post that you are now reading.

## Ansible
```yaml
- name: Personal Project johncom
  ansible.builtin.git:
    repo: 'git@github.com:Jwhiles/johncom.git'
    bare: false
    dest: "{{ lookup('env', 'HOME') }}/personal/johncom"
  tags:
    - install
    - personal-project
```

This means that I can get a new computer, run ansible and the codebase will be immediately be there, ready for me to write things in it. Nice!

I'm also using Ansible to:
* install all the homebrew packages I want
* store my ssh keys
* set up a cronjob to sync my weird and overly complicated multicomputer note taking system
* ETC

Cool! I love it.

Ansible seems to be the imperative equivalent to something like Nix.
In ansible I'm describing the steps I want it to take to get my computer in order, whereas in Nix I would just describe the computer I wanted and it would hopefully give it to me.
One advantage of ansible is that it's slightly less likely to fill my entire hard drive storing slightly different versions of GHC. So that's nice.

## Stow
As well as setting up a new repo to hold my Ansible config, I've converted my beloved repo 'vimmy' into a more general dotfiles repo.
It's now called [dotfiles-FKA-vimmy](https://github.com/Jwhiles/dotfiles-FKA-vimmy), and alongside my Vim config also contains some other configuration files.

Stow is a CLI tool for managing symlinks, that has allowed me to replace an ugly script I once wrote:
```sh
echo "adding the appropirate nvim init file"
mkdir -p ~/.config/nvim
ln -s ~/.vim/init.lua ~/.config/nvim/init.lua
ln -s ~/.vim/lua ~/.config/nvim/lua

echo "creating symlink to .tmux.conf"
ln -s ~/.vim/.tmux.conf ~/.tmux.conf

echo "done and done 👻 "
```

With a new beautiful script that does basically the same thing but better:

```
pushd $HOME/.dotfiles

echo "stowing nvim"
stow nvim
echo "stowing tmux"
stow tmux
echo "stowing zsh"
stow zsh
```

Stow seems really neat, but it does have a slightly weird behaviour where it places all symlinks in the folder one step up from your working directory.
So try and make sure that you run in it the right place ;)

## Spotifyd and spotify-tui
Like most people in my demographic group, I listen to a lot of music on spotify. But I _hate_ the spotify client. It's really slow and bad, and continually getting worse.
Whilst setting up all this computer stuff, I idly searched something like 'native spotify client', and lo I found two incredible Rust programs.

![IMG](/spotterm.png)

Spotifyd is a daemon that can sit running on your computer, waiting for spotify to send music for it to play. spotify-tui is a terminal application that lets you browse music, and play it on any connected devices.
Using the two together lets me have music controlled and played through the terminal. It's much faster than the normal Spotify client, makes you look like a real hacker, and only shows a few inexplicable errors.

It took me a bit of a struggle to get spotifyd to actually run successfully.
It seems like it will just fail quietly unless you have a valid config, and some of the default config values aren't valid on Osx, I think (I might be wrong about this, but if I'm right it seems like a nice thing to try and fix). Now it works though, and I love it.

## Tmuxinator
Imagine you are a complete maniac and have decided to use some horrible setup where you listen to music in your terminal by using two different command line tools that both need to be running at the same time.
How do you go about actually opening and running these things in less time than it would take to open the normal Spotify client (~30seconds).
Let me introduce you to Tmuxinator. It's nice little tool that lets you write some YAML to describe a tmux session you'd like to start.

For example:
```yaml
# /Users/johnwhiles/.config/tmuxinator/music.yml

name: music
root: ~/

windows:
  - spotify: spt
  - daemon: spotifyd --no-daemon

```

This configures a TMUX session that will open with two panes, one running spotifyd, and the other running spotify-tui.
Now we can start our weird music listening setup by typing `tmuxinator start music`, this is both easy _and_ is exactly the sort of thing I imagined I would be saying to computers in 2022.

## Conclusion
Ansible is cool. You can see [my setup on Github](https://github.com/Jwhiles/ansible). I originally forked it from [this repo](https://github.com/adamchainz/mac-ansible), and also to a look of inspiration from [The Primeagen's setup](https://github.com/ThePrimeagen/ansible).

BYE!

