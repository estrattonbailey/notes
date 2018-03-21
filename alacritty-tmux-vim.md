# Goodbye Terminal, Hello Alacritty
I've been having some real issues with my dev environment recently. Slow performance, sketchy autocomplete, and key bindings that used to work and now don't (High Sierra for the win).

So I googled "lightweight terminal for mac" and found Alacritty. It's written in Rust, is incredibly bare-bones (the app only weights 5.9MB compiled!), and is *super* fast. It's self-described as "the fastest terminal emulator in existence." in its README, and let me tell ya: *it feels so good*.

It doesn't have tabs or multiple windows, instead relying on the user to implement tmux (or similar multiplexers). I hadn't seen a need for tmux in the past since I was able to create tabs and windows in terminal just fine, but I already love it. Everyone who's told me to "just learn tmux, I won't regret it": you were right, lol. Thank you.

Learning vim has without a doubt made me a more productive developer, and with tmux and Alacritty, even more so. I don't know if it will be the same for people reading this, but perhaps it helps in some way! I especialy want to make this little tutorial accessible to newcomers, since getting all this set up can be kind of intimidating.

## Prerequisites
I'm going to assume some level of familiarity with git, bash, etc. For all config files, I'd also recommend creating your own dotfiles repo and placing config files there. Then you can either manually copy and paste updates, or [symlink](https://www.placona.co.uk/1224/linux/managing-your-dotfiles-the-right-way/) the files together.

For my setup, all that's really needed are:
- `alacrity.yml`
- `.vimrc`
- `.tmux.conf`

## Installing Alacritty
First, you'll need Rust. You can find instructions [here](https://www.rustup.rs/) or – at the time of this writing – copy and paste the folling into your Terminal:
```bash
curl https://sh.rustup.rs -sSf | sh
```
Then install Alacritty by cloning the git repo. I put it in my user root like this:
```bash
git clone https://github.com/jwilm/alacritty.git ~/alacritty
```
Then head into that directory and build the application:
```bash
cd alacritty
rustup override set stable
rustup update stable
cargo build --release
```
This will build the app to `~/alacritty/target/release`. To make it callable in spotlight and appear in your Applications folder run the following:
```
# package
make app
# copy to applications folder
cp -r target/release/osx/Alacritty.app /Applications/
```

## Configuring Alacritty
Alacritty looks in a [few places](https://github.com/jwilm/alacritty#configuration) for config files. By default, it places its own default config is `~/.config/alacrity/alacritty.yml`.  The only settings you'll definitely want to change out of the gate are `tabspaces` on line 34, and the default shell program. I use the preinstalled `bash`, so all I needed to do is uncomment the following lines (line 258):
```yml
# Shell
#
# You can set shell.program to the path of your favorite shell, e.g. /bin/fish.
# Entries in shell.args are passed unmodified as arguments to the shell.
shell:
  program: /bin/bash
  args:
    - --login
```

With any luck, you should be able to launch Alacritty like any other application!

## Installing Vim and Tmux
Both vim and tmux are pretty bare-bones out of the box, so you'll want to create a configuration files. There are also many many existing setups that people have open sourced. Here are just a few:
- https://github.com/estrattonbailey/.dotfiles (mine)
- https://github.com/skwp/dotfiles
- https://github.com/mutewinter/dot_vim
- https://github.com/colepeters/dotfiles
- https://github.com/mxstbr/dotfiles

You can use these and follow their docs, or create your own. **Honestly,** I recommend keeping things simple to start and using the bare minimum. Build up from there as you go!

### Vim
Vim should already exist on your system, but I've found it much easier to install and update through [Homebrew](https://brew.sh/).

As always, ensure `brew` is up to date:
```bash
brew update
```
Then install vim:
```bash
brew install vim
```
And you're all set! If you're entirely new to vim, go through the built-in tutorial by typing `vimtutor` in Alacritty and hitting enter. If you decided to try my `vimrc`, I have a handy [cheatsheet](https://github.com/estrattonbailey/.dotfiles#usage) to help you get started.

#### Configuring Vim
Vim's config usually lives at `~/.vimrc`, but you'll probably need to create the file (or symlink it to your own repo). Add settings there as needed.

I recommend [Vim Plug](https://github.com/junegunn/vim-plug) to manage your vim plugins. Install Vim Plug with the following:
```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```
Now, you can define plugins like autocompletion, themes and more in your
`~/.vimrc` like this:
```vimscript
call plug#begin('~/.dotfiles/vim/plugged')
Plug 'arcticicestudio/nord-vim'
call plug#end()
```
The first line calls Vim Plug and tells it where to install the plugins. Change this path to point to your dotfiles repo, or somewhere else on your computer.  Plugins can usually be installed directly from the repo by following the `<user>/<package>` convention. So google away! There's probably a plugin for it.

### Tmux
Tmux is a terminal multiplexer. There are people smarter than me that can explain what that means. Basically, it allows you to create virtual windows (called *sessions*), tabs (*windows*), and splits (*panes*), all within the same GUI window of your terminal. You then navigate between sessions using the keyboard.

Once again, install tmux using `brew`:
```bash
brew install tmux
```

The default tmux config file is `~/.tmux.conf`. There is as many configuration options for tmux as their are for vim, but so far, [this](https://github.com/estrattonbailey/.dotfiles/blob/master/tmux.conf) is what I've found to be useful.

## My Workflow
> If you've created your own dotfiles or used someone else's, of course this will
be different.

I generally like to have three "windows" for each project:
- `bash` - for any housekeeping I need to do like git, installing deps, etc
- `bash` - for running dev tasks/servers
- `vim` - my project's codebase

Using tmux, I create new *named* sessions for each project I'm working on. Sessions are not, by default, named.

To create a new session run:
```bash
tmux new -s <name>
```
This will drop you back into your shell in the same directory as you ran the command, but now you're running your shell through tmux.

> By default, tmux uses `C-b` as it's *prefix* binding. I like `C-a` because I can do it with one hand. So the above would translate to "press a while pressing ctrl, then press c". Tmux also usually opens windows from the directory that you started the session.  I've added some configs to ensure that wherever I am, it opens windows from wherever you are when you run the command! Very helpful.

I have my commands set up so that there's some parity with vim. Here are a few of the most helpful commands I've learned so far.

From outside tmux:
- `tmux new -s <name>` - create a new session with name, via `-s` flag
- `tmux ls` - list all open sessions
- `tmux a -t <name>` - open an already running session `<name>`
- `tmux kill-session <name>` - close the session named `<name>`

From within tmux:
- `C-a s` - view open sessions
- `C-a w` - view open windows across all sessions
- `C-a c` - create a new window within a session
- `C-a n` - go to next window *within* session
- `C-a p` - go to previous window *within* session
- `C-a %` - create a vertical split pane within a window
- `C-a "` - create a horizontal split pane within a window
- `C-a h` - move to pane, left
- `C-a j` - move to pane, down
- `C-a k` - move to pane, up
- `C-a l` - move to pane, right
- `C-a d` - *detach* from tmux and back into your shell
- `exit` - close whatever you're "in" i.e. close a pane, close a window, close a
  session
- `C-a : <ENTER>` - opens command interface. From here, you can run commands as if you're outside tmux i.e. `C-a : <ENTER> new -s demo` opens a new session named `demo`.

## Wrapping Up
I recommend checking out my dotfiles, but *not* because they're that great. They def aren't. They're just much more basic than a lot of the others you'll find, and they might be an easier place to start.

I'll probably add some more resources here as I find them.

### Alacritty resources:
- https://arslan.io/2018/02/05/gpu-accelerated-terminal-alacritty/
- http://www.bytesizedworkbench.com/blog/2017/10/24/the-joy-of-alacritty/

### Tmux:
- https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340
- https://gist.github.com/MohamedAlaa/2961058

### Vim
- https://vim.rtorr.com/
- http://designbytyping.com/

Also, I recommend the [Nord](https://github.com/arcticicestudio/nord) color pallete, which has ports for just about everything.

Happy editing!

> If you have questions, comments, or additions, please say hi on [Twitter](https://twitter.com/estrattonbailey)!
