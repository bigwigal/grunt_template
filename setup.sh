#!/bin/sh

echo "########## Init git #########"

cur_dir=$(PWD)

remote_dir=${PWD##*/}

rdir=$remote_dir".git"

echo "local repo:" $cur_dir
echo "remote repo:"  $rdir

echo " "

echo ">>> Create remote repo"

cd "/s/git-repos/"
mkdir $rdir
cd $rdir
git init --bare

echo " "
cd $cur_dir
echo ">>> Create local repo"
git init
echo "add remote repo"
git remote add origin "/s/git-repos/"$rdir

echo "set up grunt"
grunt-init grunt_template

echo "do npm install now"
npm install

echo "Done."
#end of file




